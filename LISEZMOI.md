# Expert du Sommeil — Site vitrine

Site vitrine statique pour **Expert du Sommeil**, entreprise marocaine installée en Côte d'Ivoire, spécialisée dans les matelas et les accessoires pour la maison.

---

## Comment modifier le site

Toutes les informations du site se trouvent dans **un seul fichier** : `config.js`. Ouvrez-le avec un éditeur de texte (Bloc-notes, VS Code, Notepad++…) et modifiez les valeurs.

### Changer le numéro WhatsApp

Cherchez la ligne `whatsapp:` et remplacez le numéro :

```javascript
whatsapp: '2250700000000',   // votre numéro avec indicatif pays
```

> ⚠️ Le numéro doit commencer par l'indicatif pays (225 pour la Côte d'Ivoire), **sans** le signe `+`, **sans** espaces ni tirets.

### Changer les prix (Kits complets & Matelas seuls)

Chaque kit a un prix pour le pack complet et un prix pour le matelas seul :

```javascript
prix: 75000,            // Prix du pack complet en FCFA
prixMatelasSeul: 50000, // Prix du matelas seul à l'unité en FCFA
```

Et chaque élément de la liste `contenu:` a son propre prix unitaire :
```javascript
{ nom: '1 drap housse coton', prixSeul: 15000 },
```
Modifiez simplement les nombres selon vos tarifs.

### Changer les textes

Modifiez les champs `nom:`, `description:`, `slogan:`, etc. dans `config.js`. Les guillemets simples `'...'` entourent chaque texte. Si votre texte contient une apostrophe, écrivez `\u2019` à sa place (c'est l'apostrophe typographique).

### Changer l'adresse et les horaires

```javascript
adresse: 'Abidjan, Côte d\u2019Ivoire',
horaires: 'Lundi – Samedi : 8 h – 19 h',
```

### Ajouter ou retirer un produit

Copiez un bloc `{ id: '...', nom: '...', ... },` existant et modifiez-le. Supprimez le bloc entier pour retirer un produit.

### Renseigner les zones de livraison

Cherchez la section `livraison:` et remplacez `'À renseigner'` par les vrais délais et frais.

---

## Comment tester le site localement

1. **Méthode simple** : double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur. Les modèles 3D peuvent ne pas s'afficher en local avec certains navigateurs (restrictions de sécurité).

2. **Méthode recommandée** : utilisez un petit serveur local.
   - Si vous avez **Python** installé :
     ```
     python -m http.server 8000
     ```
     Puis ouvrez `http://localhost:8000` dans votre navigateur.
   - Si vous avez **Node.js** installé :
     ```
     npx -y serve .
     ```
     Puis ouvrez l'adresse indiquée.

---

## Comment mettre le site en ligne gratuitement

### Option 1 : Netlify (recommandé)

1. Créez un compte gratuit sur [netlify.com](https://www.netlify.com/)
2. Depuis le tableau de bord, cliquez sur « Add new site » → « Deploy manually »
3. Glissez-déposez le **dossier complet du site** (le dossier qui contient `index.html`)
4. Le site est en ligne en quelques secondes !
5. Vous pouvez ajouter un nom de domaine personnalisé dans les paramètres

### Option 2 : Cloudflare Pages

1. Créez un compte gratuit sur [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Cliquez « Create a project » → « Direct Upload »
3. Glissez-déposez le dossier du site
4. Choisissez un nom de sous-domaine (ex : expertdusommeil.pages.dev)

### Option 3 : GitHub Pages

1. Créez un compte sur [github.com](https://github.com/)
2. Créez un nouveau dépôt (repository)
3. Déposez tous les fichiers du site dans le dépôt
4. Allez dans Settings → Pages → Source : « Deploy from a branch » → branche `main`
5. Le site sera accessible sur `votre-nom.github.io/nom-du-depot`

---

## Structure des fichiers

| Fichier | Rôle |
|---------|------|
| `index.html` | La page du site (structure HTML) |
| `style.css` | Le design, effet verre (glassmorphism) et variables centralisées |
| `config.js` | **Toutes les informations modifiables** (textes, prix, numéro WhatsApp) |
| `app.js` | Logique du site (menu mobile, animations) |
| `three-scene.js` | Moteur de rendu 3D des produits (fond transparent) |
| `lib/three.min.js` | Bibliothèque Three.js (ne pas modifier) |
| `fonts/` | Polices locales : Bricolage Grotesque (titres) et Inter (texte) |
| `models/` | Dossier pour de futurs modèles 3D au format `.glb` |
| `img/` | Dossier pour les images |
| `sitemap.xml` | Plan du site pour les moteurs de recherche |
| `robots.txt` | Instructions pour les moteurs de recherche |

---

## Remplacer les modèles 3D par des fichiers .glb

Pour remplacer un modèle 3D procédural par un vrai modèle 3D :

1. Placez votre fichier `.glb` dans le dossier `models/` (ex : `models/kit-eco.glb`)
2. Dans `config.js`, trouvez le produit correspondant et renseignez le chemin :
   ```javascript
   modele: 'models/kit-eco.glb',
   ```
3. Le site chargera automatiquement le fichier .glb au lieu du modèle procédural

> Note : cette fonctionnalité nécessite l'ajout du GLTFLoader de Three.js. Contactez votre développeur pour l'activer.

---

## Style visuel : Effet Verre (Glassmorphism) & Thème sombre

Le site utilise une ambiance nocturne chaleureuse avec :
- Un fond dégradé sombre (#14100E vers #2A1B14) enrichi de 3 halos dérivants (ambre, cuivre, bleu nuit).
- Des panneaux et cartes en verre dépoli translucide avec flou d'arrière-plan (`backdrop-filter: blur(20px)` sur ordinateur, `12px` sur mobile).
- Une zone de texte sombre pour garantir un contraste optimal (WCAG AA).
- Toutes les couleurs, les flous et les polices sont modifiables directement en haut de `style.css`.

---

## Accessibilité

- Navigation au clavier (touche Tab)
- Contrastes de couleurs conformes (WCAG AA)
- Textes alternatifs sur les éléments visuels
- Animations désactivées si l'utilisateur préfère (paramètre système)

---

*Fichier rédigé le 1er novembre 2026.*
