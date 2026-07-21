#!/usr/bin/env python3
"""
Genera una galería optimizada para GitHub Pages.

Entrada:
    photos_originales/

Salida:
    assets/img/gallery/generated/
    assets/img/gallery/generated/thumbs/
    assets/data/gallery-generated.json

Fecha de cada imagen:
1. JSON lateral de Google Takeout.
2. EXIF DateTimeOriginal / DateTimeDigitized / DateTime.
3. Fecha YYYY-MM-DD encontrada en el nombre.
4. Sin fecha, para que pueda corregirse manualmente en el JSON.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps, UnidentifiedImageError

try:
    from pillow_heif import register_heif_opener
except ImportError:
    register_heif_opener = None

if register_heif_opener:
    register_heif_opener()

ROOT = Path(__file__).resolve().parents[1]
INPUT_DIR = ROOT / "photos_originales"
OUTPUT_DIR = ROOT / "assets" / "img" / "gallery" / "generated"
THUMB_DIR = OUTPUT_DIR / "thumbs"
MANIFEST_PATH = ROOT / "assets" / "data" / "gallery-generated.json"

SUPPORTED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
    ".heic",
    ".heif",
}

MAX_IMAGE_SIZE = 1800
MAX_THUMB_SIZE = 620
WEBP_QUALITY = 84
THUMB_QUALITY = 78


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value).strip("-").lower()
    return slug or "recuerdo"


def title_from_filename(path: Path) -> str:
    value = re.sub(r"[_-]+", " ", path.stem)
    value = re.sub(r"\b(?:img|dsc|pxl)\s*\d+\b", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+", " ", value).strip()

    if not value:
        return "Un recuerdo de nosotros"

    return value[:1].upper() + value[1:]


def candidate_sidecars(path: Path) -> list[Path]:
    return [
        path.with_name(path.name + ".json"),
        path.with_suffix(".json"),
        path.with_name(path.stem + ".supplemental-metadata.json"),
    ]


def read_takeout_date(path: Path) -> datetime | None:
    for sidecar in candidate_sidecars(path):
        if not sidecar.exists():
            continue

        try:
            data = json.loads(sidecar.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue

        for key in ("photoTakenTime", "creationTime"):
            timestamp = data.get(key, {}).get("timestamp")

            if timestamp is None:
                continue

            try:
                return datetime.fromtimestamp(int(timestamp), tz=timezone.utc)
            except (TypeError, ValueError, OSError):
                continue

    return None


def read_exif_date(image: Image.Image) -> datetime | None:
    try:
        exif = image.getexif()
    except Exception:
        return None

    # EXIF numeric tags:
    # 36867 DateTimeOriginal
    # 36868 DateTimeDigitized
    # 306   DateTime
    for tag in (36867, 36868, 306):
        raw_value = exif.get(tag)

        if not raw_value:
            continue

        try:
            return datetime.strptime(str(raw_value), "%Y:%m:%d %H:%M:%S")
        except ValueError:
            continue

    return None


def read_filename_date(path: Path) -> datetime | None:
    match = re.search(
        r"(?P<year>20\d{2})[-_.]?(?P<month>0[1-9]|1[0-2])[-_.]?(?P<day>0[1-9]|[12]\d|3[01])",
        path.stem,
    )

    if not match:
        return None

    try:
        return datetime(
            int(match.group("year")),
            int(match.group("month")),
            int(match.group("day")),
        )
    except ValueError:
        return None


def get_photo_date(path: Path, image: Image.Image) -> datetime | None:
    return (
        read_takeout_date(path)
        or read_exif_date(image)
        or read_filename_date(path)
    )


def format_spanish_date(value: datetime | None) -> str:
    if value is None:
        return "Recuerdo sin fecha"

    months = (
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    )

    return f"{value.day} de {months[value.month - 1]} de {value.year}"


def stable_name(path: Path) -> str:
    digest = hashlib.sha1(path.name.encode("utf-8")).hexdigest()[:8]
    return f"{slugify(path.stem)}-{digest}"


def optimize_image(
    image: Image.Image,
    destination: Path,
    max_size: int,
    quality: int,
) -> None:
    converted = ImageOps.exif_transpose(image).convert("RGB")
    converted.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    converted.save(destination, "WEBP", quality=quality, method=6)


def process_image(path: Path) -> dict[str, Any] | None:
    try:
        with Image.open(path) as image:
            photo_date = get_photo_date(path, image)
            output_name = stable_name(path) + ".webp"
            output_path = OUTPUT_DIR / output_name
            thumb_path = THUMB_DIR / output_name

            optimize_image(image, output_path, MAX_IMAGE_SIZE, WEBP_QUALITY)
            optimize_image(image, thumb_path, MAX_THUMB_SIZE, THUMB_QUALITY)
    except (UnidentifiedImageError, OSError, ValueError) as error:
        print(f"OMITIDA: {path.name}: {error}")
        return None

    iso_date = photo_date.date().isoformat() if photo_date else None

    return {
        "id": stable_name(path),
        "src": f"assets/img/gallery/generated/{output_name}",
        "thumbnail": f"assets/img/gallery/generated/thumbs/{output_name}",
        "date": iso_date,
        "dateLabel": format_spanish_date(photo_date),
        "title": title_from_filename(path),
        "description": "Un momento de nuestra historia.",
        "type": "foto",
        "category": "recuerdo",
        "originalFilename": path.name,
    }


def main() -> int:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    candidates = sorted(
        path
        for path in INPUT_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not candidates:
        MANIFEST_PATH.write_text("[]\n", encoding="utf-8")
        print(f"No se encontraron imágenes en: {INPUT_DIR}")
        print("Copia ahí las fotografías descargadas de Google Fotos y vuelve a ejecutar.")
        return 0

    records: list[dict[str, Any]] = []

    for path in candidates:
        print(f"Procesando: {path.name}")
        record = process_image(path)

        if record:
            records.append(record)

    records.sort(key=lambda item: item.get("date") or "", reverse=True)

    MANIFEST_PATH.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print()
    print(f"Galería generada: {len(records)} imágenes")
    print(f"Manifest: {MANIFEST_PATH}")
    print(f"Imágenes optimizadas: {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
