document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector("#intro");
  const nav = document.querySelector("[data-nav]");
  const menuButton = document.querySelector("[data-menu]");
  const enterButton = document.querySelector("[data-enter]");
  const projectLoader = document.querySelector("[data-project-loader]");
  const modal = document.querySelector("[data-modal-panel]");
  const modalVisual = document.querySelector("[data-modal-visual]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalBody = document.querySelector("[data-modal-body]");
  const heroLogos = document.querySelectorAll(".hero-logo, .hero-wordmark");
  const progress = document.querySelector("#progress");
  const progressLabel = document.querySelector("[data-progress-label]");
  const spriteCanvas = document.querySelector("[data-sprite-canvas]");
  const spriteSelect = document.querySelector("[data-sprite-select]");
  const spriteFps = document.querySelector("[data-sprite-fps]");
  const spriteFpsLabel = document.querySelector("[data-sprite-fps-label]");
  const spriteFpsControls = document.querySelectorAll("[data-sprite-fps-control]");
  const spriteModeButtons = document.querySelectorAll("[data-sprite-mode]");
  const spriteResetButton = document.querySelector("[data-sprite-reset]");
  const spriteStage = document.querySelector(".sprite-stage");
  const spriteBgControls = document.querySelector("[data-sprite-bg-controls]");
  const spriteBgButtons = document.querySelectorAll("[data-sprite-bg]");
  const spriteHelp = document.querySelector("[data-sprite-help]");
  window.localStorage.removeItem("veil-language");
  window.localStorage.removeItem("veil-theme");

  let currentLang = "fr";
  let currentTheme = "classified";
  let introRunId = 0;

  const textMap = createTextMap();

  resetEntryPreferences();
  setupIntroButton();
  setupStyleSwitch();
  setupLanguageSwitch();
  runIntroSequence();
  setupMenu();
  setupAccordions();
  setupFeatureCards();
  setupServices();
  setupModals();
  setupProgress();
  setupSpriteDemo();
  setupHeroLogoScroll();
  setupSystemNoise();
  setupEntryReset();

  function resetEntryPreferences() {
    window.localStorage.removeItem("veil-language");
    window.localStorage.removeItem("veil-theme");
    currentLang = "fr";
    currentTheme = "classified";
    removeVirusLayer();
    applyTheme(currentTheme);
    applyLanguage(currentLang);
  }

  function setupEntryReset() {
    window.addEventListener("pagehide", resetEntryPreferences);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        resetEntryPreferences();
        setupHeroLogoScroll();
      }
    });
  }

  function setupStyleSwitch() {
    const toggle = document.querySelector("[data-style-toggle]");
    const menu = document.querySelector("[data-style-menu]");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        currentTheme = button.dataset.themeChoice || "classified";
        applyTheme(currentTheme);
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".style-switch")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeChoice === theme);
    });

    if (theme === "virus") {
      createVirusLayer();
    } else {
      removeVirusLayer();
    }
  }

  function createVirusLayer() {
    removeVirusLayer();
    const layer = document.createElement("div");
    layer.className = "virus-layer";

    const bits = ["0101", "VEIL", "UFSSA", "ERR", "TRACE", "ID", "404", "RUN"];
    for (let index = 0; index < 22; index += 1) {
      const bit = document.createElement("span");
      bit.className = "virus-bit";
      bit.textContent = bits[index % bits.length];
      bit.style.left = `${(index * 37) % 100}%`;
      bit.style.animationDelay = `${(index % 9) * -0.7}s`;
      bit.style.animationDuration = `${6 + (index % 5)}s`;
      layer.appendChild(bit);
    }

    document.body.appendChild(layer);
  }

  function removeVirusLayer() {
    document.querySelector(".virus-layer")?.remove();
  }

  function setupLanguageSwitch() {
    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.addEventListener("click", () => {
        currentLang = button.dataset.langButton || "fr";
        applyLanguage(currentLang);
        if (intro && !intro.classList.contains("is-hidden") && !intro.classList.contains("is-ready")) {
          runIntroSequence();
        }
      });
    });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.title = lang === "fr" ? "VEIL | Dossier classifié UFSSA" : "VEIL | UFSSA Classified File";

    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langButton === lang);
    });

    document.querySelectorAll("[data-type-fr]").forEach((line) => {
      line.dataset.typeText = lang === "fr" ? line.dataset.typeFr : line.dataset.typeEn;
      if (!intro || intro.classList.contains("is-hidden") || intro.classList.contains("is-ready")) {
        line.textContent = line.dataset.typeText || "";
      }
    });

    translateStaticText(lang);
    refreshSystemNoise(lang);
    refreshSpriteFpsLabel();
  }

  function refreshSpriteFpsLabel() {
    if (!spriteFps || !spriteFpsLabel) return;
    spriteFpsLabel.textContent = `${spriteFps.value} FPS`;
  }

  function translateStaticText(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const trimmed = node.textContent.trim();
      if (!trimmed) return;

      if (!node._veilI18nKey && textMap[trimmed]) {
        node._veilI18nKey = trimmed;
      }

      const key = node._veilI18nKey;
      if (!key || !textMap[key]) return;

      const before = node.textContent.match(/^\s*/)?.[0] || "";
      const after = node.textContent.match(/\s*$/)?.[0] || "";
      node.textContent = `${before}${textMap[key][lang]}${after}`;
    });
  }

  function setupIntroButton() {
    if (!intro || !enterButton) return;

    enterButton.disabled = false;
    enterButton.addEventListener("click", () => {
      intro.classList.add("is-hidden");
    });
  }

  function setupMenu() {
    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupAccordions() {
    document.querySelectorAll("[data-accordion], [data-accordion='single']").forEach((group) => {
      group.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const item = button.closest(".timeline-item, .faq-item");
        if (!item) return;

        if (group.dataset.accordion === "single") {
          group.querySelectorAll(".is-open").forEach((openItem) => {
            if (openItem !== item) openItem.classList.remove("is-open");
          });
        }

        item.classList.toggle("is-open");
      });
    });
  }

  function setupFeatureCards() {
    document.querySelectorAll("[data-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".feature-card")?.classList.toggle("is-open");
      });
    });
  }

  function setupServices() {
    const servicesButton = document.querySelector("[data-services]");
    const servicesPanel = document.querySelector("[data-services-panel]");
    if (!servicesButton || !servicesPanel) return;

    servicesButton.addEventListener("click", () => {
      servicesPanel.classList.toggle("is-open");
    });
  }

  function setupModals() {
    if (!modal || !modalVisual || !modalTitle || !modalBody) return;

    document.querySelectorAll("[data-modal]").forEach((tile) => {
      tile.addEventListener("click", () => {
        modalTitle.textContent = getModalTitle(tile);
        setModalContent(tile);
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    document.querySelector("[data-modal-close]")?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function setModalContent(tile) {
    if (tile.dataset.sprites === "hero") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid hero-sheet-grid">
          <figure>
            <img src="assets/heros-base.png" alt="Spritesheet du heros en tenue de base">
            <figcaption>${uiText("baseCharacter")}</figcaption>
          </figure>
          <figure>
            <img src="assets/heros-militaire.png" alt="Spritesheet du heros en tenue militaire">
            <figcaption>${uiText("militaryIdentity")}</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `<p>${uiText("heroModalBody")}</p>`;
      return;
    }

    if (tile.dataset.sprites === "civils") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid">
          <img src="assets/pnj-1.png" alt="Spritesheet civil rouge">
          <img src="assets/pnj-2.png" alt="Spritesheet civil bleu">
          <img src="assets/pnj-3.png" alt="Spritesheet civil vert">
        </div>
      `;
      modalBody.innerHTML = `
        <p>${uiText("civilsModalBody")}</p>
        <p class="rights-warning">${uiText("rightsWarning")}</p>
      `;
      return;
    }

    if (tile.dataset.sprites === "identity") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid identity-sheet-grid">
          <figure>
            <img src="assets/pnj-militaire.png" alt="Spritesheet d'un garde militaire">
            <figcaption>${uiText("militaryGuard")}</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `
        <p>${uiText("identityModalBody")}</p>
        <p class="rights-warning">${uiText("rightsWarning")}</p>
      `;
      return;
    }

    if (tile.dataset.gallery === "sprites") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid all-sprites-grid">
          <figure>
            <img src="assets/heros-base.png" alt="Spritesheet du heros en tenue de base">
            <figcaption>${uiText("heroBase")}</figcaption>
          </figure>
          <figure>
            <img src="assets/heros-militaire.png" alt="Spritesheet du heros en tenue militaire">
            <figcaption>${uiText("heroMilitary")}</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-1.png" alt="Spritesheet civil rouge">
            <figcaption>${uiText("redCivilian")}</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-2.png" alt="Spritesheet civil bleu">
            <figcaption>${uiText("blueCivilian")}</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-3.png" alt="Spritesheet civil vert">
            <figcaption>${uiText("greenCivilian")}</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-militaire.png" alt="Spritesheet d'un garde militaire">
            <figcaption>${uiText("militaryGuard")}</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `
        <p class="rights-warning">${uiText("rightsWarning")}</p>
      `;
      return;
    }

    if (tile.dataset.gallery === "logos") {
      modalVisual.innerHTML = `
        <div class="logo-preview">
          <figure>
            <img src="assets/veil-logo.png" alt="Logo principal de VEIL">
            <figcaption>${uiText("mainLogo")}</figcaption>
          </figure>
          <figure>
            <img src="assets/veil-wordmark.png" alt="Logo texte de VEIL">
            <figcaption>${uiText("wordmarkLogo")}</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `<p>${uiText("logoModalBody")}</p>`;
      return;
    }

    if (tile.dataset.gallery === "empty") {
      modalVisual.innerHTML = `
        <div class="empty-gallery-message">
          <p>${uiText("emptyGallery")}</p>
        </div>
      `;
      modalBody.innerHTML = "";
      return;
    }

    modalVisual.innerHTML = "";
    modalBody.innerHTML = `<p>${uiText("placeholder")}</p>`;
  }

  function getModalTitle(tile) {
    const title = tile.dataset.modal || "Piece jointe";
    return textMap[title]?.[currentLang] || title;
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function setupProgress() {
    if (!progress || !progressLabel) return;

    progress.addEventListener("input", () => {
      progressLabel.textContent = `${progress.value}%`;
    });
  }

  function setupSpriteDemo() {
    if (!spriteCanvas || !spriteSelect || !spriteFps || !spriteFpsLabel) return;

    const context = spriteCanvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = false;
    const frameSize = 64;
    const image = new Image();
    let columns = 1;
    let frameCount = 1;
    let lastFrameTime = 0;
    let lastMoveTime = 0;
    let mode = "preview";
    let previewFrame = 0;
    let lastDirection = "down";
    let walkStep = 0;
    let displayFrame = 7;
    let currentBackground = "grid";
    const player = {
      x: (spriteCanvas.width - frameSize) / 2,
      y: (spriteCanvas.height - frameSize) / 2,
      speed: 54,
    };
    const pressedKeys = new Set();
    const frames = {
      up: { idle: 1, walk: [0, 2] },
      right: { idle: 4, walk: [3, 5] },
      down: { idle: 7, walk: [6, 8] },
      left: { idle: 10, walk: [9, 11] },
    };

    const updateFpsLabel = () => {
      spriteFpsLabel.textContent = `${spriteFps.value} FPS`;
    };

    const applySpriteBackground = (background) => {
      currentBackground = background;
      if (spriteStage) {
        spriteStage.dataset.spriteBg = mode === "move" ? currentBackground : "grid";
      }
      spriteBgButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.spriteBg === currentBackground);
      });
    };

    const resetPlayer = () => {
      pressedKeys.clear();
      lastMoveTime = 0;
      lastDirection = "down";
      walkStep = 0;
      displayFrame = frames[lastDirection].idle;
      player.x = (spriteCanvas.width - frameSize) / 2;
      player.y = (spriteCanvas.height - frameSize) / 2;
      drawFrame(displayFrame);
    };

    const updateMode = (nextMode) => {
      mode = nextMode;
      pressedKeys.clear();
      lastFrameTime = 0;
      lastMoveTime = 0;
      previewFrame = 0;
      walkStep = 0;
      displayFrame = mode === "move" ? frames[lastDirection].idle : previewFrame;

      if (mode === "preview") {
        spriteCanvas.width = frameSize;
        spriteCanvas.height = frameSize;
        spriteCanvas.classList.remove("is-move-mode");
      } else {
        spriteCanvas.width = 320;
        spriteCanvas.height = 240;
        spriteCanvas.classList.add("is-move-mode");
        resetPlayer();
        spriteCanvas.focus();
      }

      context.imageSmoothingEnabled = false;
      updateFpsLabel();
      spriteFpsControls.forEach((control) => {
        control.classList.toggle("is-hidden", mode === "move");
      });
      spriteBgControls?.classList.toggle("is-hidden", mode !== "move");
      applySpriteBackground(currentBackground);
      spriteModeButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.spriteMode === mode);
      });
    };

    const getDirection = () => {
      if (pressedKeys.has("ArrowUp") || pressedKeys.has("z") || pressedKeys.has("w")) return "up";
      if (pressedKeys.has("ArrowDown") || pressedKeys.has("s")) return "down";
      if (pressedKeys.has("ArrowLeft") || pressedKeys.has("q") || pressedKeys.has("a")) return "left";
      if (pressedKeys.has("ArrowRight") || pressedKeys.has("d")) return "right";
      return "";
    };

    const drawFrame = (frame) => {
      if (!image.complete || !image.naturalWidth) return;
      const sourceX = (frame % columns) * frameSize;
      const sourceY = Math.floor(frame / columns) * frameSize;

      context.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
      const drawX = mode === "move" ? player.x : 0;
      const drawY = mode === "move" ? player.y : 0;
      context.drawImage(image, sourceX, sourceY, frameSize, frameSize, drawX, drawY, frameSize, frameSize);
    };

    const loadSprite = () => {
      walkStep = 0;
      previewFrame = 0;
      pressedKeys.clear();
      displayFrame = mode === "move" ? frames[lastDirection].idle : previewFrame;
      if (mode === "move") {
        resetPlayer();
      }
      image.src = spriteSelect.value;
    };

    image.addEventListener("load", () => {
      columns = Math.max(1, Math.floor(image.naturalWidth / frameSize));
      const rows = Math.max(1, Math.floor(image.naturalHeight / frameSize));
      frameCount = columns * rows;
      drawFrame(displayFrame);
    });

    const animate = (time) => {
      const previewFps = Number(spriteFps.value) || 8;
      const previewFrameDuration = 1000 / previewFps;
      const walkFrameDuration = 190;
      const direction = mode === "move" ? getDirection() : "";
      const isWalking = Boolean(direction);

      if (mode === "move" && lastMoveTime === 0) {
        lastMoveTime = time;
      }

      if (mode === "move" && isWalking) {
        const elapsed = Math.min(40, time - lastMoveTime);
        lastDirection = direction;
        if (direction === "up") player.y -= (player.speed * elapsed) / 1000;
        if (direction === "down") player.y += (player.speed * elapsed) / 1000;
        if (direction === "left") player.x -= (player.speed * elapsed) / 1000;
        if (direction === "right") player.x += (player.speed * elapsed) / 1000;
      }
      lastMoveTime = time;

      if (time - lastFrameTime >= (mode === "preview" ? previewFrameDuration : walkFrameDuration)) {
        if (mode === "preview") {
          previewFrame = (previewFrame + 1) % frameCount;
          displayFrame = previewFrame;
        } else if (isWalking) {
          const sideWalk = lastDirection === "left" || lastDirection === "right";

          if (sideWalk) {
            const cycleStep = walkStep % 4;
            displayFrame = cycleStep === 1
              ? frames[lastDirection].walk[0]
              : cycleStep === 3
                ? frames[lastDirection].walk[1]
                : frames[lastDirection].idle;
            walkStep = (walkStep + 1) % 4;
          } else {
            walkStep = (walkStep + 1) % frames[lastDirection].walk.length;
            displayFrame = frames[lastDirection].walk[walkStep];
          }
        } else {
          walkStep = 0;
          displayFrame = frames[lastDirection].idle;
        }
        lastFrameTime = time;
      }

      player.x = Math.max(0, Math.min(spriteCanvas.width - frameSize, player.x));
      player.y = Math.max(0, Math.min(spriteCanvas.height - frameSize, player.y));

      drawFrame(displayFrame);
      window.requestAnimationFrame(animate);
    };

    const handleKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const movementKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "z", "q", "s", "d", "w", "a"];
      if (mode !== "move" || !movementKeys.includes(key)) return;
      event.preventDefault();
      pressedKeys.add(key);
    };

    const handleKeyUp = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      pressedKeys.delete(key);
    };

    spriteModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateMode(button.dataset.spriteMode || "preview");
      });
    });
    spriteBgButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applySpriteBackground(button.dataset.spriteBg || "grid");
      });
    });
    spriteSelect.addEventListener("change", loadSprite);
    spriteResetButton?.addEventListener("click", resetPlayer);
    spriteFps.addEventListener("input", updateFpsLabel);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    updateFpsLabel();
    updateMode("preview");
    loadSprite();
    window.requestAnimationFrame(animate);
  }

  async function runIntroSequence() {
    if (!intro || !enterButton || !projectLoader) return;

    const runId = introRunId + 1;
    introRunId = runId;
    intro.classList.remove("is-ready");
    const lines = document.querySelectorAll("[data-type-text]");
    projectLoader.textContent = "";

    for (const line of lines) {
      if (runId !== introRunId) return;
      await typeText(line, line.dataset.typeText || "", 12, runId);
      if (runId !== introRunId) return;
      await wait(70);
    }

    await runProjectLoader(runId);
    if (runId !== introRunId) return;
    intro.classList.add("is-ready");
  }

  async function typeText(element, text, speed, runId) {
    element.textContent = "";

    for (const letter of text) {
      if (runId !== introRunId) return;
      element.textContent += letter;
      await wait(speed);
    }
  }

  async function runProjectLoader(runId) {
    const frames = currentLang === "fr"
      ? ["PROJET_", "PROJET V_", "PROJET VE_", "PROJET VEI_", "PROJET VEIL_"]
      : ["PROJECT_", "PROJECT V_", "PROJECT VE_", "PROJECT VEI_", "PROJECT VEIL_"];

    for (const frame of frames) {
      if (runId !== introRunId) return;
      projectLoader.textContent = frame;
      await wait(120);
    }

    projectLoader.textContent = currentLang === "fr" ? "PROJET VEIL // DOSSIER OUVERT" : "PROJECT VEIL // FILE OPEN";
  }

  function setupHeroLogoScroll() {
    if (!heroLogos.length) return;

    const updateLogo = () => {
      const hero = document.querySelector(".hero");
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      const start = Math.max(620, heroHeight * 0.72);
      const end = start + 360;
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));

      heroLogos.forEach((logo) => {
        logo.classList.remove("is-hidden-by-scroll");
        logo.style.opacity = String(1 - progress);
        logo.style.transform = `translateY(${28 * progress}px) scale(${1 - 0.04 * progress})`;
        logo.style.filter = `blur(${3 * progress}px)`;
        logo.style.pointerEvents = progress > 0.96 ? "none" : "";
      });
    };

    updateLogo();
    window.addEventListener("scroll", updateLogo, { passive: true });
    window.addEventListener("resize", updateLogo);
  }

  function setupSystemNoise() {
    const noiseNodes = document.querySelectorAll(".system-noise");
    if (!noiseNodes.length) return;

    refreshSystemNoise(currentLang);

    window.setInterval(() => {
      const messages = getSystemNoiseMessages(currentLang);
      noiseNodes.forEach((node, index) => {
        const currentIndex = messages.indexOf(node.textContent);
        const nextIndex = (Math.max(currentIndex, 0) + index + 1) % messages.length;
        node.textContent = messages[nextIndex];
      });
    }, 4200);
  }

  function refreshSystemNoise(lang) {
    const messages = getSystemNoiseMessages(lang);
    document.querySelectorAll(".system-noise").forEach((node, index) => {
      node.textContent = messages[index % messages.length];
    });
  }

  function getSystemNoiseMessages(lang) {
    if (lang === "en") {
      return [
        "ERROR - PROJECT VEIL // TRACE LOST // IDENTITY STATUS: UNSTABLE",
        "ERROR - PROJECT VEIL // ACCESS NODE DESYNC",
        "ERROR - PROJECT VEIL // UFSSA SIGNAL JAMMED",
        "ERROR - PROJECT VEIL // AGENT FILE PARTIALLY REDACTED",
        "ERROR - PROJECT VEIL // MEMORY FRAGMENT MISSING",
        "ERROR - PROJECT VEIL // SURVEILLANCE LOOP ACTIVE",
      ];
    }

    return [
      "EROR - PROJECT VEIL // TRACE PERDUE // IDENTITÉ INSTABLE",
      "EROR - PROJECT VEIL // NŒUD D'ACCÈS DÉSYNCHRONISÉ",
      "EROR - PROJECT VEIL // SIGNAL UFSSA BROUILLÉ",
      "EROR - PROJECT VEIL // DOSSIER AGENT PARTIELLEMENT CENSURÉ",
      "EROR - PROJECT VEIL // FRAGMENT MÉMOIRE MANQUANT",
      "EROR - PROJECT VEIL // BOUCLE DE SURVEILLANCE ACTIVE",
    ];
  }

  function uiText(key) {
    const strings = {
      heroModalBody: {
        fr: "La première spritesheet montre le héros dans sa tenue de base. La deuxième montre le héros après usurpation d'identité, ici avec une tenue militaire.",
        en: "The first spritesheet shows the hero in his base outfit. The second shows the hero after identity theft, here wearing a military uniform.",
      },
      civilsModalBody: {
        fr: "Ces spritesheets montrent des civils. Ils servent de personnages neutres dans l'univers du jeu.",
        en: "These spritesheets show civilians. They are neutral characters in the game's universe.",
      },
      identityModalBody: {
        fr: "Ce personnage fait partie des identités récupérables. Le joueur peut l'isoler, neutraliser le garde, puis usurper son identité pour accéder à certaines zones.",
        en: "This character is one of the recoverable identities. The player can isolate him, neutralize the guard, then steal his identity to access certain areas.",
      },
      rightsWarning: {
        fr: "UTILISATION INTERDITE SANS ACCORD. Ces sprites appartiennent au projet VEIL. Il faut demander l'accord avant de les utiliser, les modifier, les republier ou les intégrer dans un autre projet.",
        en: "USE FORBIDDEN WITHOUT PERMISSION. These sprites belong to the VEIL project. Permission is required before using, modifying, reposting, or integrating them into another project.",
      },
      logoModalBody: {
        fr: "Logos utilisés pour présenter l'identité visuelle de VEIL.",
        en: "Logos used to present VEIL's visual identity.",
      },
      mainLogo: {
        fr: "Logo principal",
        en: "Main logo",
      },
      wordmarkLogo: {
        fr: "Logo texte",
        en: "Wordmark logo",
      },
      emptyGallery: {
        fr: "Il n'y a pas encore d'image ici. Revenez plus tard, le site est encore en cours de développement.",
        en: "There is no image here yet. Come back later, the site is still in development.",
      },
      placeholder: {
        fr: "Emplacement prêt à remplacer par une image, un sprite, une capture Godot ou un concept art.",
        en: "Placeholder ready to be replaced by an image, sprite, Godot screenshot, or concept art.",
      },
      baseCharacter: {
        fr: "Personnage de base",
        en: "Base character",
      },
      militaryIdentity: {
        fr: "Identité usurpée : militaire",
        en: "Stolen identity: military",
      },
      militaryGuard: {
        fr: "Garde militaire",
        en: "Military guard",
      },
      heroBase: {
        fr: "Héros - base",
        en: "Hero - base",
      },
      heroMilitary: {
        fr: "Héros - militaire",
        en: "Hero - military",
      },
      redCivilian: {
        fr: "Civil rouge",
        en: "Red civilian",
      },
      blueCivilian: {
        fr: "Civil bleu",
        en: "Blue civilian",
      },
      greenCivilian: {
        fr: "Civil vert",
        en: "Green civilian",
      },
    };

    return strings[key]?.[currentLang] || strings[key]?.fr || "";
  }

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function createTextMap() {
    const entries = [
      ["ACCÉDER AU DOSSIER", "ACCESS FILE"],
      ["ACCEDER AU DOSSIER", "ACCESS FILE"],
      ["Retour a l'accueil", "Back to home"],
      ["Ouvrir le menu", "Open menu"],
      ["STYLE", "STYLE"],
      ["Classifié", "Classified"],
      ["Hacker", "Hacker"],
      ["Blackout", "Blackout"],
      ["Virus", "Virus"],
      ["Glacier", "Glacier"],
      ["Histoire", "Story"],
      ["Couleurs", "Colors"],
      ["Galerie", "Gallery"],
      ["Démo sprite", "Sprite demo"],
      ["Suivre", "Follow"],
      ["Credits", "Credits"],
      ["DOSSIER 07-VEIL // CONFIDENTIEL", "FILE 07-VEIL // CONFIDENTIAL"],
      ["Un jeu d'infiltration 2D ou chaque identite peut devenir une arme", "A 2D stealth game where every identity can become a weapon"],
      ["Découvrir le jeu", "Discover the game"],
      ["Decouvrir le jeu", "Discover the game"],
      ["Voir l'histoire", "View the story"],
      ["Suivre le developpement", "Follow development"],
      ["CRÉATEUR IDENTIFIÉ", "CREATOR IDENTIFIED"],
      ["CREATEUR IDENTIFIE", "CREATOR IDENTIFIED"],
      ["Qui est Lotys ?", "Who is Lotys?"],
      ["Lotys est un joueur passionne qui a toujours aime les jeux d'infiltration, les jeux narratifs et les univers mysterieux. Apres avoir passe beaucoup de temps a jouer, il a decide de creer son propre projet.", "Lotys is a passionate player who has always loved stealth games, narrative games, and mysterious universes. After spending a lot of time playing, he decided to create his own project."],
      ["Son objectif est de construire un jeu original, accessible et rejouable, avec une vraie identite visuelle et un scenario rempli de revelations.", "His goal is to build an original, accessible, and replayable game with a strong visual identity and a story full of revelations."],
      ["Createur", "Creator"],
      ["Créateur", "Creator"],
      ["Genre prefere", "Favorite genre"],
      ["Genre préféré", "Favorite genre"],
      ["Style du jeu", "Game style"],
      ["Moteur", "Engine"],
      ["Creation graphique", "Art creation"],
      ["Création graphique", "Art creation"],
      ["Statut", "Status"],
      ["En developpement", "In development"],
      ["En développement", "In development"],
      ["ARCHIVES NARRATIVES", "NARRATIVE ARCHIVES"],
      ["Chronologie", "Timeline"],
      ["Prologue", "Prologue"],
      ["Avec le gang de ta mafia, vous allez subtiliser une mallette lors d'une soiree privee. Elle contient les plans d'une arme revolutionnaire. Mais en vous echappant, vous allez recevoir une balle qui va vous tracer et vous forcer a travailler pour l'UFSSA.", "With your mafia gang, you steal a briefcase during a private party. It contains the plans for a revolutionary weapon. But while escaping, you are shot with a bullet that tracks you and forces you to work for the UFSSA."],
      ["Le manoir", "The manor"],
      ["Vous allez devoir eliminer le chef de votre mafia dans son manoir aux Philippines. Apres l'avoir tue, vous regardez son ordinateur laisse ouvert sur une page UF Bank.", "You must eliminate the head of your mafia in his manor in the Philippines. After killing him, you look at his computer, left open on a UF Bank page."],
      ["Mubdaï", "Mubdaï"],
      ["Newchorc City", "Newchorc City"],
      ["Le data-center", "The data center"],
      ["Une ile dans les Caraibes", "An island in the Caribbean"],
      ["La nuit a l'UFSSA", "The night at the UFSSA"],
      ["Il n'y a pas encore de description ici. Revenez plus tard, le site est encore en cours de developpement.", "There is no description here yet. Come back later, the site is still in development."],
      ["SYSTÈMES DE JEU", "GAME SYSTEMS"],
      ["SYSTEMES DE JEU", "GAME SYSTEMS"],
      ["En savoir plus", "Learn more"],
      ["Infiltration", "Stealth"],
      ["Observer les rondes, trouver les zones isolees, attirer les gardes, recuperer des uniformes, cacher les corps et eviter les temoins.", "Observe patrols, find isolated areas, lure guards, recover uniforms, hide bodies, and avoid witnesses."],
      ["Deguisements", "Disguises"],
      ["Déguisements", "Disguises"],
      ["Le joueur peut prendre l'identite d'un garde, d'un employe, d'un technicien, d'un cuisinier ou d'un VIP. Chaque tenue donne acces a certaines zones.", "The player can take the identity of a guard, employee, technician, cook, or VIP. Each outfit grants access to certain areas."],
      ["Fuites", "Escapes"],
      ["Certaines missions se terminent par une fuite en vue de cote. Le personnage avance rapidement et doit sauter, glisser, esquiver des obstacles et eviter les tirs.", "Some missions end with a side-view escape. The character moves quickly and must jump, slide, dodge obstacles, and avoid gunfire."],
      ["Argent et blanchiment", "Money and laundering"],
      ["Le joueur gagne de l'argent pendant les missions. Il doit le blanchir pour preparer sa fuite. Plus il blanchit vite, plus le risque de controle augmente.", "The player earns money during missions. He must launder it to prepare his escape. The faster he launders, the higher the risk of inspection."],
      ["Suspicion", "Suspicion"],
      ["La UFSSA surveille le joueur. Une jauge de suspicion peut augmenter selon ses choix. Si elle atteint un niveau eleve, l'agence peut saisir une partie de son argent.", "The UFSSA monitors the player. A suspicion gauge can rise depending on his choices. If it gets too high, the agency can seize part of his money."],
      ["Missions rejouables", "Replayable missions"],
      ["Chaque mission propose plusieurs chemins, plusieurs deguisements, des evenements variables et plusieurs methodes pour atteindre l'objectif.", "Each mission offers several paths, disguises, variable events, and multiple ways to reach the objective."],
      ["Score de mission", "Mission score"],
      ["Le classement depend du nombre d'alertes, de temoins, de corps decouverts, du temps et de la discretion.", "The ranking depends on alerts, witnesses, discovered bodies, time, and stealth."],
      ["Fantome", "Ghost"],
      ["Assassin silencieux", "Silent assassin"],
      ["Professionnel", "Professional"],
      ["Nettoyeur", "Cleaner"],
      ["DIRECTION ARTISTIQUE", "ART DIRECTION"],
      ["Lisible, froide, selective", "Readable, cold, selective"],
      ["Les civils sont entierement blancs et sans visage.", "Civilians are entirely white and faceless."],
      ["Les personnages importants et les cibles ont une peau, des cheveux, un visage et des couleurs.", "Important characters and targets have skin, hair, a face, and colors."],
      ["Le heros a des yeux rouges discrets qui permettent de le reconnaitre.", "The hero has subtle red eyes that make him recognizable."],
      ["Les vetements changent selon les metiers et les deguisements.", "Clothing changes depending on jobs and disguises."],
      ["Les niveaux utilisent une perspective vue de dessus legerement inclinee.", "Levels use a slightly tilted top-down perspective."],
      ["Les couleurs de la UFSSA sont sombres, froides et institutionnelles.", "UFSSA colors are dark, cold, and institutional."],
      ["Le heros", "The hero"],
      ["Les civils", "Civilians"],
      ["Identite recuperable", "Recoverable identity"],
      ["Personnes dont tu peux voler l'identite", "People whose identity you can steal"],
      ["Les cibles", "Targets"],
      ["Les sequences de fuite", "Escape sequences"],
      ["CODE VISUEL", "VISUAL CODE"],
      ["Systeme de couleurs", "Color system"],
      ["Le blanc represente les civils, le jaune les personnages dont on peut usurper l'identite, le rouge les cibles, et le vert le heros. Ces couleurs servent a comprendre rapidement qui est neutre, utile, dangereux ou controle par le joueur.", "White represents civilians, yellow represents characters whose identity can be stolen, red represents targets, and green represents the hero. These colors help quickly understand who is neutral, useful, dangerous, or controlled by the player."],
      ["AGENCE RESPONSABLE", "RESPONSIBLE AGENCY"],
      ["Une agence gouvernementale secrete officiellement chargee de proteger les United Federal States. Elle controle les operations clandestines, les dossiers sensibles, les missions d'infiltration et les menaces internationales. Au fil du jeu, le joueur decouvre que l'agence manipule certaines informations et utilise ses agents comme des outils.", "A secret government agency officially tasked with protecting the United Federal States. It controls clandestine operations, sensitive files, infiltration missions, and international threats. Over the game, the player discovers that the agency manipulates information and uses agents as tools."],
      ["Voir les services de la UFSSA", "View UFSSA services"],
      ["Armurerie", "Armory"],
      ["Salle de briefing", "Briefing room"],
      ["Salle des preuves", "Evidence room"],
      ["Salle informatique", "Computer room"],
      ["Bureau du directeur", "Director's office"],
      ["Laboratoire", "Laboratory"],
      ["Securite interne", "Internal security"],
      ["SUIVI INTERNE", "INTERNAL TRACKING"],
      ["Developpement", "Development"],
      ["Idée du jeu", "Game idea"],
      ["Idee du jeu", "Game idea"],
      ["Creation de l'univers", "World creation"],
      ["Creation de la UFSSA", "UFSSA creation"],
      ["Premiere direction artistique", "First art direction"],
      ["Premiers tilesets", "First tilesets"],
      ["Premiers personnages", "First characters"],
      ["Prototype Godot", "Godot prototype"],
      ["Systeme d'infiltration", "Stealth system"],
      ["Systeme de deguisements", "Disguise system"],
      ["Premiere mission jouable", "First playable mission"],
      ["Progression du prototype", "Prototype progress"],
      ["PIÈCES JOINTES", "ATTACHMENTS"],
      ["PIECES JOINTES", "ATTACHMENTS"],
      ["SPRITESHEET", "SPRITESHEET"],
      ["TILESETS", "TILESETS"],
      ["CONCEPTS", "CONCEPTS"],
      ["LOGO VEIL", "VEIL LOGO"],
      ["CAPTURES GODOT", "GODOT SCREENSHOTS"],
      ["MISSIONS", "MISSIONS"],
      ["PERSONNAGES", "CHARACTERS"],
      ["Spritesheets", "Spritesheets"],
      ["Logo VEIL", "VEIL logo"],
      ["Tilesets", "Tilesets"],
      ["Captures Godot", "Godot screenshots"],
      ["Personnages", "Characters"],
      ["ANIMATION TEST", "ANIMATION TEST"],
      ["Démo spritesheet", "Spritesheet demo"],
      ["Aperçu", "Preview"],
      ["Déplacement", "Movement"],
      ["Spritesheet", "Spritesheet"],
      ["Fond déplacement", "Movement background"],
      ["Grille", "Grid"],
      ["Blanc", "White"],
      ["Vert", "Green"],
      ["Herbe", "Grass"],
      ["Béton", "Concrete"],
      ["Nuit", "Night"],
      ["Recentrer le personnage", "Center character"],
      ["Héros - base", "Hero - base"],
      ["Héros - militaire", "Hero - military"],
      ["Civil rouge", "Red civilian"],
      ["Civil bleu", "Blue civilian"],
      ["Civil vert", "Green civilian"],
      ["Garde militaire", "Military guard"],
      ["Touches : flèches ou ZQSD. En anglais : flèches ou WASD. Le personnage garde l'idle de la dernière direction.", "Controls: arrows or WASD. In French keyboard mode: arrows or ZQSD. The character keeps the idle pose from the last direction."],
      ["Découpe utilisée : 64x64 pixels. Dans l'aperçu, la spritesheet tourne avec la barre FPS. Dans déplacement, les touches contrôlent le personnage.", "Frame cut: 64x64 pixels. In preview, the spritesheet cycles with the FPS slider. In movement mode, the keys control the character."],
      ["UTILISATION INTERDITE SANS ACCORD. Ces sprites appartiennent au projet VEIL.", "USE FORBIDDEN WITHOUT PERMISSION. These sprites belong to the VEIL project."],
      ["QUESTIONS OUVERTES", "OPEN QUESTIONS"],
      ["Quelle est l'idée principale de VEIL ?", "What is the main idea behind VEIL?"],
      ["VEIL est un jeu d'infiltration où les identités, les déguisements et les choix du joueur changent la façon d'entrer, d'observer et de fuir.", "VEIL is a stealth game where identities, disguises, and player choices change how you enter, observe, and escape."],
      ["Comment fonctionne l'usurpation d'identité ?", "How does identity theft work?"],
      ["Certains personnages peuvent être isolés puis neutralisés. Le joueur récupère alors leur tenue pour accéder à des zones normalement interdites.", "Some characters can be isolated and neutralized. The player then takes their outfit to access normally restricted areas."],
      ["Pourquoi la UFSSA surveille-t-elle le joueur ?", "Why does the UFSSA monitor the player?"],
      ["La UFSSA utilise le joueur comme agent forcé. Elle le surveille parce qu'il prépare aussi sa propre fuite en secret.", "The UFSSA uses the player as a forced agent. It monitors him because he is also secretly preparing his own escape."],
      ["Peut-on mettre le site en anglais ?", "Can the site be switched to English?"],
      ["Oui. Le bouton FR / EN en haut de la page permet de passer tout le site en français ou en anglais.", "Yes. The FR / EN button at the top of the page switches the whole site between French and English."],
      ["Pourquoi certaines images ne sont-elles pas encore disponibles ?", "Why are some images not available yet?"],
      ["Le jeu est encore en développement. Les sections vides seront complétées quand de nouveaux sprites, tilesets ou concepts seront prêts.", "The game is still in development. Empty sections will be completed when new sprites, tilesets, or concepts are ready."],
      ["Où suivre l'avancement du projet ?", "Where can I follow the project's progress?"],
      ["Les liens YouTube, Discord et X sont disponibles dans la section Suivre Lotys et le développement du jeu.", "YouTube, Discord, and X links are available in the Follow Lotys and the game's development section."],
      ["Le jeu sera-t-il en 3D ?", "Will the game be 3D?"],
      ["Non. Le jeu sera en 2D pixel art avec une vue de dessus pour l'infiltration et une vue de cote pour les fuites.", "No. The game will be 2D pixel art with a top-down view for stealth and a side view for escapes."],
      ["Peut-on voler des identites ?", "Can identities be stolen?"],
      ["Oui. Le joueur peut neutraliser certains PNJ dans des zones isolees et recuperer leur uniforme.", "Yes. The player can neutralize certain NPCs in isolated areas and recover their uniform."],
      ["Les missions auront-elles plusieurs solutions ?", "Will missions have several solutions?"],
      ["Oui. Le joueur pourra utiliser les deguisements, les distractions, les gadgets, les accidents ou la force.", "Yes. The player will be able to use disguises, distractions, gadgets, accidents, or force."],
      ["Le jeu sera-t-il rejouable ?", "Will the game be replayable?"],
      ["Oui. Les routines, certains objets, les positions et certains evenements pourront varier.", "Yes. Routines, certain objects, positions, and some events may vary."],
      ["Pourquoi les civils sont-ils blancs ?", "Why are civilians white?"],
      ["Pour rendre les personnages importants immediatement reconnaissables et donner au jeu une identite visuelle forte.", "To make important characters instantly recognizable and give the game a strong visual identity."],
      ["Le jeu est-il deja termine ?", "Is the game already finished?"],
      ["Non. Il est encore en developpement.", "No. It is still in development."],
      ["TRANSMISSION", "TRANSMISSION"],
      ["Suivre Lotys et le developpement du jeu", "Follow Lotys and the game's development"],
      ["CREDITS", "CREDITS"],
      ["Rory Mitchell", "Rory Mitchell"],
      ["pour la template du character en top down view.", "for the top-down character template."],
      ["Piece jointe", "Attachment"],
      ["Emplacement pret a remplacer par une image, un sprite, une capture Godot ou un concept art.", "Placeholder ready to be replaced by an image, sprite, Godot screenshot, or concept art."],
      ["Personnage de base", "Base character"],
      ["Identite usurpee : militaire", "Stolen identity: military"],
      ["Civil rouge", "Red civilian"],
      ["Civil bleu", "Blue civilian"],
      ["Civil vert", "Green civilian"],
      ["Garde militaire", "Military guard"],
      ["Heros - base", "Hero - base"],
      ["Heros - militaire", "Hero - military"],
      ["Logo principal de VEIL", "Main VEIL logo"],
    ];

    return entries.reduce((map, [fr, en]) => {
      map[fr] = { fr: restoreFrench(fr), en };
      return map;
    }, {});
  }

  function restoreFrench(text) {
    const fixes = {
      "ACCEDER AU DOSSIER": "ACCÉDER AU DOSSIER",
      "Retour a l'accueil": "Retour à l'accueil",
      "Createur": "Créateur",
      "CRÉATEUR IDENTIFIÉ": "CRÉATEUR IDENTIFIÉ",
      "CREATEUR IDENTIFIE": "CRÉATEUR IDENTIFIÉ",
      "Genre prefere": "Genre préféré",
      "Creation graphique": "Création graphique",
      "En developpement": "En développement",
      "Lotys est un joueur passionne qui a toujours aime les jeux d'infiltration, les jeux narratifs et les univers mysterieux. Apres avoir passe beaucoup de temps a jouer, il a decide de creer son propre projet.": "Lotys est un joueur passionné qui a toujours aimé les jeux d'infiltration, les jeux narratifs et les univers mystérieux. Après avoir passé beaucoup de temps à jouer, il a décidé de créer son propre projet.",
      "Son objectif est de construire un jeu original, accessible et rejouable, avec une vraie identite visuelle et un scenario rempli de revelations.": "Son objectif est de construire un jeu original, accessible et rejouable, avec une vraie identité visuelle et un scénario rempli de révélations.",
      "Avec le gang de ta mafia, vous allez subtiliser une mallette lors d'une soiree privee. Elle contient les plans d'une arme revolutionnaire. Mais en vous echappant, vous allez recevoir une balle qui va vous tracer et vous forcer a travailler pour l'UFSSA.": "Avec le gang de ta mafia, vous allez subtiliser une mallette lors d'une soirée privée. Elle contient les plans d'une arme révolutionnaire. Mais en vous échappant, vous allez recevoir une balle qui va vous tracer et vous forcer à travailler pour l'UFSSA.",
      "Vous allez devoir eliminer le chef de votre mafia dans son manoir aux Philippines. Apres l'avoir tue, vous regardez son ordinateur laisse ouvert sur une page UF Bank.": "Vous allez devoir éliminer le chef de votre mafia dans son manoir aux Philippines. Après l'avoir tué, vous regardez son ordinateur laissé ouvert sur une page UF Bank.",
      "Une ile dans les Caraibes": "Une île dans les Caraïbes",
      "La nuit a l'UFSSA": "La nuit à l'UFSSA",
      "Il n'y a pas encore de description ici. Revenez plus tard, le site est encore en cours de developpement.": "Il n'y a pas encore de description ici. Revenez plus tard, le site est encore en cours de développement.",
      "Deguisements": "Déguisements",
      "Observer les rondes, trouver les zones isolees, attirer les gardes, recuperer des uniformes, cacher les corps et eviter les temoins.": "Observer les rondes, trouver les zones isolées, attirer les gardes, récupérer des uniformes, cacher les corps et éviter les témoins.",
      "Le joueur peut prendre l'identite d'un garde, d'un employe, d'un technicien, d'un cuisinier ou d'un VIP. Chaque tenue donne acces a certaines zones.": "Le joueur peut prendre l'identité d'un garde, d'un employé, d'un technicien, d'un cuisinier ou d'un VIP. Chaque tenue donne accès à certaines zones.",
      "Certaines missions se terminent par une fuite en vue de cote. Le personnage avance rapidement et doit sauter, glisser, esquiver des obstacles et eviter les tirs.": "Certaines missions se terminent par une fuite en vue de côté. Le personnage avance rapidement et doit sauter, glisser, esquiver des obstacles et éviter les tirs.",
      "Le joueur gagne de l'argent pendant les missions. Il doit le blanchir pour preparer sa fuite. Plus il blanchit vite, plus le risque de controle augmente.": "Le joueur gagne de l'argent pendant les missions. Il doit le blanchir pour préparer sa fuite. Plus il blanchit vite, plus le risque de contrôle augmente.",
      "La UFSSA surveille le joueur. Une jauge de suspicion peut augmenter selon ses choix. Si elle atteint un niveau eleve, l'agence peut saisir une partie de son argent.": "La UFSSA surveille le joueur. Une jauge de suspicion peut augmenter selon ses choix. Si elle atteint un niveau élevé, l'agence peut saisir une partie de son argent.",
      "Chaque mission propose plusieurs chemins, plusieurs deguisements, des evenements variables et plusieurs methodes pour atteindre l'objectif.": "Chaque mission propose plusieurs chemins, plusieurs déguisements, des événements variables et plusieurs méthodes pour atteindre l'objectif.",
      "Le classement depend du nombre d'alertes, de temoins, de corps decouverts, du temps et de la discretion.": "Le classement dépend du nombre d'alertes, de témoins, de corps découverts, du temps et de la discrétion.",
      "Fantome": "Fantôme",
      "Identite recuperable": "Identité récupérable",
      "Lisible, froide, selective": "Lisible, froide, sélective",
      "Les civils sont entierement blancs et sans visage.": "Les civils sont entièrement blancs et sans visage.",
      "Le heros a des yeux rouges discrets qui permettent de le reconnaitre.": "Le héros a des yeux rouges discrets qui permettent de le reconnaître.",
      "Les vetements changent selon les metiers et les deguisements.": "Les vêtements changent selon les métiers et les déguisements.",
      "Les niveaux utilisent une perspective vue de dessus legerement inclinee.": "Les niveaux utilisent une perspective vue de dessus légèrement inclinée.",
      "Systeme de couleurs": "Système de couleurs",
      "Le blanc represente les civils, le jaune les personnages dont on peut usurper l'identite, le rouge les cibles, et le vert le heros. Ces couleurs servent a comprendre rapidement qui est neutre, utile, dangereux ou controle par le joueur.": "Le blanc représente les civils, le jaune les personnages dont on peut usurper l'identité, le rouge les cibles, et le vert le héros. Ces couleurs servent à comprendre rapidement qui est neutre, utile, dangereux ou contrôlé par le joueur.",
      "Developpement": "Développement",
      "Securite interne": "Sécurité interne",
      "Idee du jeu": "Idée du jeu",
      "Creation de l'univers": "Création de l'univers",
      "Creation de la UFSSA": "Création de la UFSSA",
      "Premiere direction artistique": "Première direction artistique",
      "Systeme d'infiltration": "Système d'infiltration",
      "Systeme de deguisements": "Système de déguisements",
      "Premiere mission jouable": "Première mission jouable",
      "Développement": "Développement",
      "Developpement": "Développement",
      "Suivre Lotys et le developpement du jeu": "Suivre Lotys et le développement du jeu",
      "Piece jointe": "Pièce jointe",
      "Credits": "Crédits",
      "CREDITS": "CRÉDITS",
      "Le jeu est-il deja termine ?": "Le jeu est-il déjà terminé ?",
      "Non. Il est encore en developpement.": "Non. Il est encore en développement.",
    };

    return fixes[text] || text;
  }
});
