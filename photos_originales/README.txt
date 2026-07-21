COPIA AQUÍ LAS FOTOGRAFÍAS DESCARGADAS DE GOOGLE FOTOS

Después ejecuta desde la raíz del proyecto:

    pip install pillow

Para imágenes HEIC de iPhone también instala:

    pip install pillow-heif

Luego ejecuta:

    python tools/generate_gallery.py

El script:
- Lee fechas desde Google Takeout, EXIF o el nombre del archivo.
- Corrige la orientación.
- Reduce el tamaño para que GitHub Pages cargue rápido.
- Crea miniaturas.
- Genera assets/data/gallery-generated.json.

Después sube a GitHub:
- assets/img/gallery/generated/
- assets/data/gallery-generated.json

No es necesario subir esta carpeta photos_originales.
