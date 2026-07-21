
(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const list = document.getElementById("playlistVisibleList");
  const status = document.getElementById("playlistStatus");
  const player = document.getElementById("playlistPlayer");
  const openButton = document.getElementById("openYoutubePlaylist");

  if (!list) {
    return;
  }

  if (openButton && config.playlistId) {
    openButton.href =
      `https://www.youtube.com/playlist?list=${encodeURIComponent(config.playlistId)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function selectSong(song, button) {
    if (player && song.videoId) {
      const playlist = encodeURIComponent(config.playlistId || "");

      player.src =
        `https://www.youtube.com/embed/${encodeURIComponent(song.videoId)}` +
        `?list=${playlist}&autoplay=1&rel=0`;
    }

    document.querySelectorAll(".song-card").forEach((candidate) => {
      candidate.classList.toggle("active", candidate === button);
    });
  }

  function renderSongs(songs) {
    list.innerHTML = "";

    songs.forEach((song, index) => {
      const button = document.createElement("button");

      button.className = "song-card";
      button.type = "button";

      const thumbnail =
        song.thumbnail ||
        `https://i.ytimg.com/vi/${encodeURIComponent(song.videoId)}/mqdefault.jpg`;

      button.innerHTML = `
        <img
          src="${escapeHtml(thumbnail)}"
          alt=""
          loading="lazy"
          decoding="async">
        <span class="song-position">${String(index + 1).padStart(2, "0")}</span>
        <span class="song-information">
          <strong>${escapeHtml(song.title || `Canción ${index + 1}`)}</strong>
          <small>${escapeHtml(song.channelTitle || "Nuestra playlist")}</small>
        </span>
        <span class="song-play" aria-hidden="true">▶</span>
      `;

      button.addEventListener("click", () => selectSong(song, button));
      list.appendChild(button);
    });

    if (status) {
      status.textContent =
        `${songs.length} ${songs.length === 1 ? "canción" : "canciones"} en nuestra playlist`;
    }
  }

  async function loadStaticSongs() {
    const response = await fetch("assets/data/songs.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`songs.json devolvió ${response.status}`);
    }

    const songs = await response.json();

    return Array.isArray(songs) ? songs : [];
  }

  async function loadSongsFromYoutube() {
    const songs = [];
    let pageToken = "";

    do {
      const parameters = new URLSearchParams({
        part: "snippet,contentDetails",
        playlistId: config.playlistId,
        maxResults: "50"
      });

      if (pageToken) {
        parameters.set("pageToken", pageToken);
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${parameters}`,
        {
          headers: {
            "X-Goog-Api-Key": config.youtubeApiKey
          }
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`YouTube Data API devolvió ${response.status}: ${message}`);
      }

      const data = await response.json();

      (data.items || []).forEach((item) => {
        const snippet = item.snippet || {};
        const videoId =
          item.contentDetails?.videoId ||
          snippet.resourceId?.videoId;

        if (!videoId || snippet.title === "Deleted video") {
          return;
        }

        songs.push({
          videoId,
          title: snippet.title,
          channelTitle: snippet.videoOwnerChannelTitle || snippet.channelTitle,
          thumbnail:
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            "",
          position: snippet.position ?? songs.length
        });
      });

      pageToken = data.nextPageToken || "";
    } while (pageToken);

    return songs.sort((left, right) => left.position - right.position);
  }

  async function initializePlaylist() {
    try {
      let songs = [];

      if (config.youtubeApiKey?.trim()) {
        songs = await loadSongsFromYoutube();
      } else {
        songs = await loadStaticSongs();
      }

      if (songs.length > 0) {
        renderSongs(songs);
        return;
      }

      if (status) {
        status.innerHTML =
          "La playlist completa está cargada en el reproductor. " +
          "Para mostrar aquí cada canción como una tarjeta, configura " +
          "<code>youtubeApiKey</code> o llena <code>assets/data/songs.json</code>.";
      }
    } catch (error) {
      console.error(error);

      if (status) {
        status.textContent =
          "No se pudo generar la lista visible de canciones. El reproductor principal sigue disponible.";
      }
    }
  }

  initializePlaylist();
})();
