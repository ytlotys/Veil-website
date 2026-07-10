# VEIL - site vitrine

Site statique pour le jeu independant de Lotys.

## Ouvrir le site

Ouvre `index.html` dans un navigateur.

## Modifier les liens sociaux

Dans `index.html`, remplace les `href="#"` de la section `contact` par les vrais liens YouTube, TikTok, Discord et X.

## Ajouter des images

Place les fichiers dans un dossier `assets/`, puis remplace les tuiles de galerie par des balises `img` ou des fonds CSS.

## Mettre sur GitHub Pages

1. Cree un nouveau depot GitHub, par exemple `veil`.
2. Ajoute tout le contenu du dossier du site : `index.html`, `styles.css`, `script.js`, `assets/` et ce `README.md`.
3. Attention : mets bien `index.html` a la racine du depot, pas dans un sous-dossier.
4. Dans GitHub, ouvre `Settings`, puis `Pages`.
5. Dans `Build and deployment`, choisis `Deploy from a branch`.
6. Choisis la branche `main` et le dossier `/ root`.
7. Le site sera ensuite disponible a une adresse du type `https://tonpseudo.github.io/veil/`.

## A propos de l'URL locale

Quand tu ouvres le fichier directement sur ton ordinateur, le navigateur affiche une adresse qui commence par `file:///Users/...`. C'est normal : c'est le chemin complet du fichier local.

Pour avoir une URL propre, il faut publier le site, par exemple avec GitHub Pages.
