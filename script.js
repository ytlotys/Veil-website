const intro = document.querySelector("#intro");
const nav = document.querySelector("[data-nav]");
const modal = document.querySelector("[data-modal-panel]");
const modalVisual = document.querySelector("[data-modal-visual]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalBody = document.querySelector("[data-modal-body]");
const progress = document.querySelector("#progress");
const progressLabel = document.querySelector("[data-progress-label]");
const enterButton = document.querySelector("[data-enter]");
const projectLoader = document.querySelector("[data-project-loader]");

runIntroSequence();

enterButton.addEventListener("click", () => {
  intro.classList.add("is-hidden");
});

document.querySelector("[data-menu]").addEventListener("click", () => {
  nav.classList.toggle("is-open");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

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

document.querySelectorAll("[data-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".feature-card").classList.toggle("is-open");
  });
});

document.querySelector("[data-services]").addEventListener("click", () => {
  document.querySelector("[data-services-panel]").classList.toggle("is-open");
});

document.querySelectorAll("[data-modal]").forEach((tile) => {
  tile.addEventListener("click", () => {
    modalTitle.textContent = tile.dataset.modal;
    if (tile.dataset.sprites === "hero") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid hero-sheet-grid">
          <figure>
            <img src="assets/heros-base.png" alt="Spritesheet du heros en tenue de base">
            <figcaption>Personnage de base</figcaption>
          </figure>
          <figure>
            <img src="assets/heros-militaire.png" alt="Spritesheet du heros en tenue militaire">
            <figcaption>Identite usurpee : militaire</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = "<p>La premiere spritesheet montre le heros dans sa tenue de base. La deuxieme montre le heros apres usurpation d'identite, ici avec une tenue militaire.</p>";
    } else if (tile.dataset.sprites === "civils") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid">
          <img src="assets/pnj-1.png" alt="Spritesheet civil rouge">
          <img src="assets/pnj-2.png" alt="Spritesheet civil bleu">
          <img src="assets/pnj-3.png" alt="Spritesheet civil vert">
        </div>
      `;
      modalBody.innerHTML = `
        <p>Ces spritesheets montrent des civils. Ils servent de personnages neutres dans l'univers du jeu.</p>
        <p class="rights-warning">UTILISATION INTERDITE SANS ACCORD. Ces sprites appartiennent au projet VEIL. Il faut demander l'accord avant de les utiliser, les modifier, les republier ou les integrer dans un autre projet.</p>
      `;
    } else if (tile.dataset.sprites === "identity") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid identity-sheet-grid">
          <figure>
            <img src="assets/pnj-militaire.png" alt="Spritesheet d'un garde militaire">
            <figcaption>Garde militaire</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `
        <p>Ce personnage fait partie des identites recuperables. Le joueur peut l'isoler, neutraliser le garde, puis usurper son identite pour acceder a certaines zones.</p>
        <p class="rights-warning">UTILISATION INTERDITE SANS ACCORD. Ces sprites appartiennent au projet VEIL. Il faut demander l'accord avant de les utiliser, les modifier, les republier ou les integrer dans un autre projet.</p>
      `;
    } else if (tile.dataset.gallery === "sprites") {
      modalVisual.innerHTML = `
        <div class="sprite-sheet-grid all-sprites-grid">
          <figure>
            <img src="assets/heros-base.png" alt="Spritesheet du heros en tenue de base">
            <figcaption>Heros - base</figcaption>
          </figure>
          <figure>
            <img src="assets/heros-militaire.png" alt="Spritesheet du heros en tenue militaire">
            <figcaption>Heros - militaire</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-1.png" alt="Spritesheet civil rouge">
            <figcaption>Civil rouge</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-2.png" alt="Spritesheet civil bleu">
            <figcaption>Civil bleu</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-3.png" alt="Spritesheet civil vert">
            <figcaption>Civil vert</figcaption>
          </figure>
          <figure>
            <img src="assets/pnj-militaire.png" alt="Spritesheet d'un garde militaire">
            <figcaption>Garde militaire</figcaption>
          </figure>
        </div>
      `;
      modalBody.innerHTML = `
        <p class="rights-warning">UTILISATION INTERDITE SANS ACCORD. Ces sprites appartiennent au projet VEIL. Il faut demander l'accord avant de les utiliser, les modifier, les republier ou les integrer dans un autre projet.</p>
      `;
    } else if (tile.dataset.gallery === "logos") {
      modalVisual.innerHTML = `
        <div class="logo-preview">
          <img src="assets/veil-logo.png" alt="Logo principal de VEIL">
        </div>
      `;
      modalBody.innerHTML = "<p>Logo principal utilise a l'arrivee sur le site.</p>";
    } else if (tile.dataset.gallery === "empty") {
      modalVisual.innerHTML = `
        <div class="empty-gallery-message">
          <p>Il n'y a pas encore d'image ici. Revenez plus tard, le site est encore en cours de developpement.</p>
        </div>
      `;
      modalBody.innerHTML = "";
    } else {
      modalVisual.innerHTML = "";
      modalBody.innerHTML = "<p>Emplacement pret a remplacer par une image, un sprite, une capture Godot ou un concept art.</p>";
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });
});

document.querySelector("[data-modal-close]").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

progress.addEventListener("input", () => {
  progressLabel.textContent = `${progress.value}%`;
});

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

async function runIntroSequence() {
  const lines = document.querySelectorAll("[data-type-text]");

  for (const line of lines) {
    await typeText(line, line.dataset.typeText, 24);
    await wait(160);
  }

  await runProjectLoader();
  intro.classList.add("is-ready");
  enterButton.disabled = false;
}

async function typeText(element, text, speed) {
  element.textContent = "";

  for (const letter of text) {
    element.textContent += letter;
    await wait(speed);
  }
}

async function runProjectLoader() {
  const frames = ["PROJET_", "PROJET V_", "PROJET VE_", "PROJET VEI_", "PROJET VEIL_"];

  for (const frame of frames) {
    projectLoader.textContent = frame;
    await wait(260);
  }

  projectLoader.textContent = "PROJET VEIL // DOSSIER OUVERT";
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
