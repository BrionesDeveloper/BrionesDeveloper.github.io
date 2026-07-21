# Sitio de aniversario V2: galería dinámica y playlist visible

Esta versión está preparada para GitHub Pages.

## La decisión técnica

El enlace público de Google Fotos se conserva como acceso al álbum original, pero la página
no intenta leerlo directamente. Google Fotos entrega una página de visualización, no una
carpeta JSON anónima y estable para recorrer desde JavaScript.

La galería usa dos manifiestos:

- `assets/data/gallery-manual.json`: imágenes creadas con IA y recuerdos editados a mano.
- `assets/data/gallery-generated.json`: fotografías procesadas automáticamente.

`assets/js/gallery.js` combina ambos archivos y utiliza `forEach()` para construir las tarjetas.

## Agregar todas las fotos del álbum de Google Fotos

1. Abre el álbum compartido.
2. Descarga todas las fotografías.
3. Descomprime los archivos.
4. Copia las imágenes dentro de `photos_originales/`.
5. Instala Pillow:

```bash
pip install pillow
```

Para HEIC:

```bash
pip install pillow-heif
```

6. Ejecuta:

```bash
python tools/generate_gallery.py
```

7. Revisa:

```text
assets/data/gallery-generated.json
assets/img/gallery/generated/
```

8. Sube los cambios a GitHub.

El generador busca la fecha en este orden:

1. JSON lateral de Google Takeout.
2. EXIF de la fotografía.
3. Fecha con formato `YYYY-MM-DD` en el nombre.
4. Sin fecha, para corregirla manualmente en el JSON.

## Personalizar títulos y descripciones

Abre:

```text
assets/data/gallery-generated.json
```

Cada elemento tiene este formato:

```json
{
  "date": "2026-07-21",
  "dateLabel": "21 de julio de 2026",
  "title": "Nuestro octavo aniversario",
  "description": "Una noche que quiero recordar siempre.",
  "type": "foto",
  "category": "aniversario"
}
```

Puedes editar el título y la descripción sin volver a procesar la imagen.

## Playlist

El `iframe` contiene toda la playlist, aunque YouTube muestra un video a la vez.

Para generar una lista visible de todas las canciones hay dos opciones.

### Opción A: automática con YouTube Data API

1. Crea un proyecto en Google Cloud.
2. Activa `YouTube Data API v3`.
3. Crea una clave para navegador.
4. Restringe el referente HTTP a:

```text
https://brionesdeveloper.github.io/*
```

5. Restringe la clave solamente a `YouTube Data API v3`.
6. Pega la clave en:

```text
assets/js/config.js
```

```javascript
youtubeApiKey: "TU_CLAVE_RESTRINGIDA"
```

`assets/js/playlist.js` recupera páginas de hasta 50 canciones, sigue `nextPageToken`
y utiliza `forEach()` para crear una tarjeta por video.

### Opción B: archivo estático sin clave

Edita:

```text
assets/data/songs.json
```

Ejemplo:

```json
[
  {
    "videoId": "ID_DEL_VIDEO",
    "title": "Nombre de la canción",
    "channelTitle": "Artista"
  }
]
```

Esta alternativa es la más segura cuando la playlist cambia poco.

## Probar localmente

Los `fetch()` de archivos JSON pueden ser bloqueados al abrir el HTML con doble clic.
Prueba el sitio con un servidor local:

```bash
python -m http.server 8080
```

Abre:

```text
http://localhost:8080
```

## Publicar

Sube la carpeta completa al repositorio `brionesdeveloper.github.io`.
GitHub Pages publicará los cambios desde la rama configurada.
