
(() => {
  "use strict";

  const MANIFESTS = [
    "assets/data/gallery-manual.json",
    "assets/data/gallery-generated.json"
  ];

  const state = {
    allItems: [],
    visibleItems: [],
    currentIndex: 0,
    filter: "all"
  };

  const byId = (id) => document.getElementById(id);

  async function readJson(url) {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`No se pudo cargar ${url}: ${response.status}`);
    }

    return response.json();
  }

  function getComparableDate(item) {
    if (!item.date) {
      return 0;
    }

    const timestamp = Date.parse(`${item.date}T12:00:00`);

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getTypeLabel(type) {
    return type === "foto" ? "Fotografía" : "Imagen creada con IA";
  }

  function createGalleryCard(item, index) {
    const article = document.createElement("article");

    article.className = "gallery-card";
    article.dataset.galleryIndex = String(index);

    article.innerHTML = `
      <button class="gallery-image-button" type="button"
        aria-label="Abrir ${escapeHtml(item.title)}">
        <img
          src="${escapeHtml(item.thumbnail || item.src)}"
          alt="${escapeHtml(item.title)}"
          loading="lazy"
          decoding="async">
        <span class="gallery-open-icon" aria-hidden="true">↗</span>
      </button>

      <div class="gallery-card-body">
        <div class="gallery-card-meta">
          <time>${escapeHtml(item.dateLabel || "Recuerdo sin fecha")}</time>
          <span>${escapeHtml(getTypeLabel(item.type))}</span>
        </div>

        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
      </div>
    `;

    article.querySelector(".gallery-image-button")
      .addEventListener("click", () => openLightbox(index));

    return article;
  }

  function renderGallery() {
    const grid = byId("galleryGrid");
    const empty = byId("galleryEmpty");
    const count = byId("galleryCount");

    if (!grid) {
      return;
    }

    state.visibleItems = state.filter === "all"
      ? [...state.allItems]
      : state.allItems.filter((item) => item.type === state.filter);

    grid.innerHTML = "";

    state.visibleItems.forEach((item, index) => {
      grid.appendChild(createGalleryCard(item, index));
    });

    if (count) {
      count.textContent = `${state.visibleItems.length} ${
        state.visibleItems.length === 1 ? "recuerdo" : "recuerdos"
      }`;
    }

    if (empty) {
      empty.hidden = state.visibleItems.length > 0;
    }
  }

  function setupFilters() {
    document.querySelectorAll("[data-gallery-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.galleryFilter;

        document.querySelectorAll("[data-gallery-filter]").forEach((candidate) => {
          candidate.classList.toggle("active", candidate === button);
        });

        renderGallery();
      });
    });
  }

  function updateLightbox() {
    const item = state.visibleItems[state.currentIndex];

    if (!item) {
      return;
    }

    const image = byId("lightboxImage");
    const title = byId("lightboxTitle");
    const date = byId("lightboxDate");
    const description = byId("lightboxDescription");
    const counter = byId("lightboxCounter");

    image.src = item.src;
    image.alt = item.title;
    title.textContent = item.title;
    date.textContent = item.dateLabel || "Recuerdo sin fecha";
    description.textContent = item.description || "";

    if (counter) {
      counter.textContent = `${state.currentIndex + 1} / ${state.visibleItems.length}`;
    }
  }

  function openLightbox(index) {
    const lightbox = byId("galleryLightbox");

    if (!lightbox || !state.visibleItems[index]) {
      return;
    }

    state.currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    const lightbox = byId("galleryLightbox");

    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function changeLightbox(step) {
    if (state.visibleItems.length === 0) {
      return;
    }

    state.currentIndex =
      (state.currentIndex + step + state.visibleItems.length) %
      state.visibleItems.length;

    updateLightbox();
  }

  function setupLightbox() {
    const lightbox = byId("galleryLightbox");

    byId("lightboxClose")?.addEventListener("click", closeLightbox);
    byId("lightboxPrevious")?.addEventListener("click", () => changeLightbox(-1));
    byId("lightboxNext")?.addEventListener("click", () => changeLightbox(1));

    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox?.classList.contains("open")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        changeLightbox(-1);
      }

      if (event.key === "ArrowRight") {
        changeLightbox(1);
      }
    });
  }

  function setupAlbumLink() {
    const albumLink = byId("googlePhotosAlbumLink");
    const albumUrl = window.SITE_CONFIG?.googlePhotosAlbumUrl;

    if (albumLink && albumUrl) {
      albumLink.href = albumUrl;
    }
  }

  async function initializeGallery() {
    const status = byId("galleryStatus");

    try {
      const manifests = await Promise.all(
        MANIFESTS.map(async (url) => {
          try {
            const items = await readJson(url);
            return Array.isArray(items) ? items : [];
          } catch (error) {
            console.warn(error);
            return [];
          }
        })
      );

      state.allItems = manifests
        .flat()
        .filter((item) => item?.src && item?.title)
        .sort((left, right) => getComparableDate(right) - getComparableDate(left));

      renderGallery();

      if (status) {
        status.hidden = true;
      }
    } catch (error) {
      console.error(error);

      if (status) {
        status.textContent =
          "No se pudo cargar la galería. Verifica que los archivos JSON estén publicados.";
      }
    }
  }

  setupFilters();
  setupLightbox();
  setupAlbumLink();
  initializeGallery();
})();
