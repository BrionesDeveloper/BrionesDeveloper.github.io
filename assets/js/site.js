
(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const reasons = [
  "Porque aún te amo.",
  "Porque no dejo de pensar en ti.",
  "Porque creo en nosotros.",
  "Porque merecemos otra oportunidad.",
  "Porque lo bueno nunca se olvida.",
  "Porque los errores también enseñan.",
  "Porque quiero cambiar y crecer por nosotros.",
  "Porque aprendí en qué fallé.",
  "Porque sin ti nada se siente igual.",
  "Porque tu ausencia pesa.",
  "Porque quiero enmendar lo que rompí.",
  "Porque cada momento contigo fue real.",
  "Porque te extraño.",
  "Porque el amor que sentí y siento nunca fue mentira.",
  "Porque me importas más de lo que imaginas.",
  "Porque no quiero que lo nuestro termine así.",
  "Porque nos debemos un nuevo comienzo.",
  "Porque tus ojos aún viven en los míos.",
  "Porque, sin buscarte, sigues estando en todo.",
  "Porque hay cosas que solo tú sabes de mí.",
  "Porque nadie me ha mirado como tú.",
  "Porque aún te encuentro en cada canción.",
  "Porque me haces falta, aunque quiera hacerme el fuerte.",
  "Porque lo nuestro es único.",
  "Porque quiero aprender a cuidar lo que amo.",
  "Porque aún hay historia que escribir contigo.",
  "Porque mereces una mejor versión de mí.",
  "Porque no quiero estar sin ti.",
  "Porque los recuerdos pueden ser más fuertes que las heridas.",
  "Porque nadie ocupará tu lugar.",
  "Porque fuiste hogar, no solo una persona.",
  "Porque sigo creyendo en lo que fuimos.",
  "Porque contigo sentí paz.",
  "Porque tu voz me calma.",
  "Porque no quiero rendirme.",
  "Porque amar también es luchar con responsabilidad.",
  "Porque todo de ti aún vive en mí.",
  "Porque no hay momento del día en que no te piense.",
  "Porque quiero demostrártelo, no solo decirlo.",
  "Porque quiero que mis hechos acompañen mis palabras.",
  "Porque siento que no todo está perdido.",
  "Porque donde hay amor todavía puede existir esperanza.",
  "Porque sé que el amor vale más que el orgullo.",
  "Porque contigo fui feliz de verdad.",
  "Porque merecemos escribir una historia mejor.",
  "Porque quiero descubrir qué pasaría si nos elegimos otra vez.",
  "Porque me ilusiona pensar en ti.",
  "Porque el tiempo me hizo entender muchas cosas.",
  "Porque esta vez no quiero soltarte.",
  "Porque tú me inspiras a ser mejor.",
  "Porque contigo aprendí el valor de lo profundo.",
  "Porque no quiero buscar en alguien más lo que ya encontré en ti.",
  "Porque me arrepiento de no haber corregido antes lo que te hacía daño.",
  "Porque nunca quise hacerte daño.",
  "Porque tu ausencia también me duele.",
  "Porque mereces escuchar todo lo que no te dije.",
  "Porque tu risa vive en mi memoria.",
  "Porque tú fuiste mi paz.",
  "Porque no encontraré un «nosotros» igual.",
  "Porque sigo creyendo que podemos.",
  "Porque te pienso incluso cuando intento no hacerlo.",
  "Porque siento que no todo ha terminado.",
  "Porque mereces saber cuánto te valoro.",
  "Porque me haces falta en todos los sentidos.",
  "Porque quiero volver a abrazarte sin culpas.",
  "Porque los buenos amores no se olvidan.",
  "Porque todavía te imagino en mi futuro.",
  "Porque, a pesar de todo, siempre estás presente en mí.",
  "Porque contigo aprendí lo que es amar de verdad.",
  "Porque sin ti mis días pierden color.",
  "Porque aún tengo muchas cosas que decirte.",
  "Porque te sigo eligiendo, a pesar de todo.",
  "Porque merecemos una versión más sana de nuestra historia.",
  "Porque me haces temblar el alma.",
  "Porque sueño contigo.",
  "Porque nuestra historia no fueron solamente problemas.",
  "Porque mi vida se siente incompleta sin ti.",
  "Porque lo bonito también cuenta.",
  "Porque nuestros errores no tienen que definir todo lo que somos.",
  "Porque lo nuestro merece esfuerzo, no resignación.",
  "Porque quiero recuperar lo que se perdió.",
  "Porque me duele el adiós.",
  "Porque prefiero intentarlo con honestidad que quedarme con la duda.",
  "Porque la esperanza aún vive.",
  "Porque fuiste hogar, luz y amor.",
  "Porque sigo queriendo saber de ti.",
  "Porque amo tu forma de ser.",
  "Porque aún hay amor.",
  "Porque quiero pedirte perdón.",
  "Porque te extraño con el alma.",
  "Porque cada día sin ti me recuerda todo lo que vivimos.",
  "Porque quiero sanar y aprender contigo.",
  "Porque vales cada intento sincero.",
  "Porque no quiero más finales nacidos del miedo.",
  "Porque contigo muchas cosas tenían sentido.",
  "Porque el corazón no olvida lo que fue verdadero.",
  "Porque el amor sigue aquí.",
  "Porque creo en ti.",
  "Porque creo en mí.",
  "Porque creo en lo que todavía podríamos construir, con hechos, paciencia, perdón y un amor que aprenda a cuidar."
];

  const byId = (id) => document.getElementById(id);

  function setActiveNavigation() {
    const current = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === current);
    });
  }

  function plural(value, singular, pluralWord) {
    return value === 1 ? singular : pluralWord;
  }

  function getCompletedYears(start, now) {
    let years = now.getFullYear() - start.getFullYear();
    const anniversary = new Date(
      now.getFullYear(),
      start.getMonth(),
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds()
    );
    if (now < anniversary) years -= 1;
    return Math.max(0, years);
  }

  function updateCounter() {
    const start = new Date(config.startDate);
    const now = new Date();
    const difference = Math.max(0, now.getTime() - start.getTime());
    const completedYears = getCompletedYears(start, now);
    const lastAnniversary = new Date(
      start.getFullYear() + completedYears,
      start.getMonth(),
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds()
    );
    const afterAnniversary = Math.max(0, now.getTime() - lastAnniversary.getTime());

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const values = {
      years: completedYears,
      days: Math.floor(afterAnniversary / day),
      hours: Math.floor((afterAnniversary % day) / hour),
      minutes: Math.floor((afterAnniversary % hour) / minute),
      seconds: Math.floor((afterAnniversary % minute) / second),
      totalDays: Math.floor(difference / day)
    };

    Object.entries(values).forEach(([key, value]) => {
      const element = byId(key);
      if (element) element.textContent = Number(value).toLocaleString("es-MX");
    });

    updateNextAnniversary(start, now);
  }

  function updateNextAnniversary(start, now) {
    const element = byId("nextAnniversary");
    if (!element) return;

    let nextYear = now.getFullYear();
    let next = new Date(
      nextYear,
      start.getMonth(),
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds()
    );
    if (next <= now) {
      nextYear += 1;
      next = new Date(
        nextYear,
        start.getMonth(),
        start.getDate(),
        start.getHours(),
        start.getMinutes(),
        start.getSeconds()
      );
    }

    const ms = next.getTime() - now.getTime();
    const day = 86400000;
    const hour = 3600000;
    const minute = 60000;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);

    element.innerHTML =
      `<strong>${days}</strong> ${plural(days, "día", "días")}, ` +
      `<strong>${hours}</strong> h y <strong>${minutes}</strong> min ` +
      `para nuestro próximo aniversario.`;
  }

  function setupLetterModal() {
    const modal = byId("letterModal");
    const openButtons = document.querySelectorAll("[data-open-letter]");
    const closeButtons = document.querySelectorAll("[data-close-letter]");

    if (!modal) return;

    const open = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const dialog = modal.querySelector(".modal-dialog");
      if (dialog) dialog.scrollTop = 0;
    };

    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    openButtons.forEach((button) => button.addEventListener("click", open));
    closeButtons.forEach((button) => button.addEventListener("click", close));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    if (window.location.hash === "#carta") {
      window.setTimeout(open, 250);
    }
  }

  function setupCarousel() {
    const carousel = byId("memoryCarousel");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll(".slide")];
    const dots = [...carousel.querySelectorAll(".dot")];
    const previous = byId("carouselPrevious");
    const next = byId("carouselNext");
    let index = 0;
    let timer;

    const show = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    };

    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(index + 1), 6000);
    };

    previous?.addEventListener("click", () => {
      show(index - 1);
      restart();
    });

    next?.addEventListener("click", () => {
      show(index + 1);
      restart();
    });

    dots.forEach((dot, i) => dot.addEventListener("click", () => {
      show(i);
      restart();
    }));

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });

    show(0);
    restart();
  }

  function setupReasons() {
    const display = byId("reasonDisplay");
    const number = byId("reasonNumber");
    const randomButton = byId("randomReason");
    const showAllButton = byId("showAllReasons");
    const list = byId("allReasons");

    if (!display || !number) return;

    let current = 0;

    const show = (index) => {
      current = Math.max(0, Math.min(reasons.length - 1, index));
      display.textContent = reasons[current];
      number.textContent = current + 1;
    };

    randomButton?.addEventListener("click", () => {
      let next = Math.floor(Math.random() * reasons.length);
      if (next === current) next = (next + 1) % reasons.length;
      show(next);
      createHeartBurst(
        randomButton.getBoundingClientRect().left + randomButton.offsetWidth / 2,
        randomButton.getBoundingClientRect().top + randomButton.offsetHeight / 2,
        16
      );
    });

    if (list) {
      list.innerHTML = reasons.map((reason, index) =>
        `<div class="reason-item"><strong>${index + 1}.</strong> ${reason}</div>`
      ).join("");
    }

    showAllButton?.addEventListener("click", () => {
      const open = list.classList.toggle("open");
      showAllButton.textContent = open ? "Ocultar la lista" : "Ver las 100 razones";
    });

    show(0);
  }

  function createFloatingHeart() {
    const heart = document.createElement("span");
    const symbols = ["❤", "♥", "♡"];
    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${12 + Math.random() * 24}px`;
    heart.style.animationDuration = `${7 + Math.random() * 7}s`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }

  function createHeartBurst(x, y, amount = 10) {
    for (let i = 0; i < amount; i += 1) {
      const heart = document.createElement("span");
      const angle = (Math.PI * 2 * i) / amount;
      const distance = 45 + Math.random() * 90;
      heart.className = "burst-heart";
      heart.textContent = Math.random() > .3 ? "❤" : "♥";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${12 + Math.random() * 18}px`;
      heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      heart.style.setProperty("--r", `${Math.random() * 180 - 90}deg`);
      document.body.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove());
    }
  }

  function setupHearts() {
    window.setInterval(createFloatingHeart, 900);
    document.addEventListener("click", (event) => {
      if (!event.target.closest("button, a")) {
        createHeartBurst(event.clientX, event.clientY, 8);
      }
    });
  }

  function setDynamicText() {
    document.querySelectorAll("[data-partner-name]").forEach((element) => {
      element.textContent = config.partnerName || "Angélica";
    });
    document.querySelectorAll("[data-your-name]").forEach((element) => {
      element.textContent = config.yourName || "Omar";
    });
  }

  setActiveNavigation();
  setDynamicText();
  updateCounter();
  window.setInterval(updateCounter, 1000);
  setupLetterModal();
  setupCarousel();
  setupReasons();
  setupHearts();
})();
