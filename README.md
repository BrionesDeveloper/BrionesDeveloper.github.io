# Sitio de aniversario de Omar y Angélica

Sitio preparado para celebrar 8 años y 96 meses desde el 21 de julio de 2018.

## Contenido

- `index.html`: inicio, contador, personajes kawaii, jardín animado y carta completa.
- `historia.html`: carrusel de imágenes, línea del tiempo y playlist de YouTube.
- `escritos.html`: colección de poemas, 100 razones y enlaces a la carta.
- `assets/css/styles.css`: diseño completo.
- `assets/js/config.js`: nombres, fecha y datos fáciles de personalizar.
- `assets/js/site.js`: contador, corazones, modal, carrusel y razones.
- `assets/img`: imágenes optimizadas para web.

## Probarlo en tu computadora

1. Descomprime el ZIP.
2. Abre `index.html` con Chrome, Edge o Firefox.
3. Navega con los botones de Inicio, Nuestra historia y Cartas y poemas.

## Personalizar nombres y fecha

Abre:

`assets/js/config.js`

Puedes modificar:

```javascript
window.SITE_CONFIG = {
  yourName: "Omar",
  partnerName: "Angélica",
  partnerNickname: "mi koalita preciosa",
  startDate: "2018-07-21T00:00:00",
  playlistId: "PLkGnj4aaE5iHxG51oFT1C1mc2bVsQ7Zz6",
  anniversaryYears: 8,
  anniversaryMonths: 96
};
```

## Agregar fotografías personales al carrusel

1. Descarga las fotos desde Google Fotos.
2. Convierte o guarda las imágenes como JPG, PNG o WebP.
3. Copia los archivos dentro de `assets/img`.
4. Abre `historia.html`.
5. Busca el bloque que empieza con:

```html
<article class="slide">
```

6. Copia uno de los bloques existentes y cambia:

```html
<img src="assets/img/tu-foto.jpg" alt="Descripción de la foto">
```

También debes copiar uno de los botones con clase `dot` para que el indicador tenga la misma cantidad de imágenes.

### Opción más sencilla para fotos

En Google Sites puedes crear la página “Nuestra historia” y usar directamente:

`Insertar → Carrusel de imágenes`

Esa opción permite añadir nuevas fotografías sin editar el código.

## Publicarlo para insertarlo en Google Sites

### Opción recomendada: GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y carpetas, no solamente `index.html`.
3. En el repositorio abre `Settings → Pages`.
4. En “Build and deployment” selecciona la rama principal y la carpeta raíz.
5. Guarda y espera a que GitHub muestre la dirección pública.

Después, en Google Sites:

1. Crea una página nueva.
2. Elige `Inserción de página completa`.
3. Pega la dirección pública de `index.html`.
4. Publica el sitio.

La navegación interna permitirá abrir `historia.html` y `escritos.html`.

### Opción rápida: Netlify Drop

1. Descomprime el ZIP.
2. Arrastra la carpeta completa a Netlify Drop.
3. Copia la dirección que te entrega.
4. Insértala como página completa en Google Sites.

## Insertar solamente código en Google Sites

Google Sites también permite `Insertar → Insertar → Código insertado` y acepta HTML, CSS y JavaScript.

Para este proyecto es más práctico alojar la carpeta completa e insertar la URL, porque las imágenes y las tres páginas necesitan conservar su estructura de archivos.

## Playlist

La playlist ya está integrada con este ID:

`PLkGnj4aaE5iHxG51oFT1C1mc2bVsQ7Zz6`

Los navegadores normalmente bloquean la reproducción automática con sonido, por lo que la persona deberá presionar reproducir.

## Carta

La carta completa está dentro de `index.html` y se abre en una ventana al presionar “Leer mi carta completa”.
