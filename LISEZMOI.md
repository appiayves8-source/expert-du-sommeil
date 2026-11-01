# Expert du Sommeil — Site vitrine

Site vitrine statique pour **Expert du Sommeil**, entreprise marocaine installée en Côte d'Ivoire, spécialisée dans les matelas et les accessoires pour la maison.

---

## Comment modifier le site

Toutes les informations du site se trouvent dans **un seul fichier** : `config.js`. Ouvrez-le avec un éditeur de texte (Bloc-notes, VS Code, Notepad++…) et modifiez les valeurs.

### Gérer les conseillers WhatsApp (Répartition automatique)

Dans `config.js`, cherchez la section `whatsappConseillers :`

```javascript
whatsappConseillers: [
  { numero: '2250700000001', nom: 'Awa', actif: true, poids: 1 },
  { numero: '2250700000002', nom: 'Kouamé', actif: true, poids: 1 },
  { numero: '2250700000003', nom: 'Fatou', actif: true, poids: 1 },
],
```

- **Ajouter un conseiller** : Ajoutez simplement une nouvelle ligne dans la liste, par exemple :
  ```javascript
  { numero: '2250711223344', nom: 'Ibrahim', actif: true, poids: 1 },
  ```
  > ⚠️ Le numéro doit toujours commencer par `225` (indicatif de la Côte d'Ivoire), **sans** le signe `+`, **sans** espaces ni tirets.

- **Retirer un conseiller** : Supprimez la ligne correspondante dans la liste.

- **Désactiver temporairement un conseiller** (en congé, en pause ou indisponible) :
  Changez simplement `actif: true` en `actif: false`. Le conseiller ne recevra plus aucun clic sans avoir besoin de supprimer son numéro :
  ```javascript
  { numero: '2250700000001', nom: 'Awa', actif: false, poids: 1 }, // Awa est en pause
  ```

- **Ajuster la répartition (le poids)** :
  Le champ `poids` permet de donner plus ou moins de clients à un conseiller :
  - Si tous les conseillers ont `poids: 1`, ils reçoivent chacun le même nombre de demandes en moyenne (ex. 33 % chacun pour 3 conseillers).
  - Si un conseiller a `poids: 2` et les autres `poids: 1`, il recevra deux fois plus de clients que les autres.

- **Mémorisation 24 heures** :
  Lorsqu'un visiteur clique sur un bouton pour la première fois, un conseiller lui est attribué au hasard. Pendant **24 heures**, ce visiteur sera toujours redirigé vers ce même conseiller pour garder la continuité de ses échanges. Passé 24h ou si ce conseiller est désactivé, un nouveau tirage a lieu.

---

### Changer les horaires et les jours d'ouverture

Dans `config.js`, cherchez la section `horairesService :`

```javascript
horairesService: {
  fuseau: 'Africa/Abidjan', // Calcule toujours l'heure réelle d'Abidjan
  joursOuverture: [1, 2, 3, 4, 5, 6], // 1=Lundi à 6=Samedi (0=Dimanche fermé)
  heureOuverture: '08:30', // Format 24h
  heureFermeture: '18:30', // Format 24h
  dureeRetentionHeures: 24,
},
```

- **Changer les heures d'ouverture et de fermeture** :
  Modifiez `'08:30'` ou `'18:30'` en respectant le format `'HH:mm'` (sur 24 heures). Par exemple `'08:00'` et `'19:00'`.
- **Changer les jours d'ouverture** :
  Les chiffres représentent les jours de la semaine :
  - `0` = Dimanche
  - `1` = Lundi
  - `2` = Mardi
  - `3` = Mercredi
  - `4` = Jeudi
  - `5` = Vendredi
  - `6` = Samedi  
  *Exemple pour ouvrir uniquement du lundi au vendredi* : `joursOuverture: [1, 2, 3, 4, 5]`
- **Comportement automatique en dehors des horaires** :
  Dès 18 h 30 (ou le dimanche), **tous les boutons WhatsApp disparaissent automatiquement** du site et sont remplacés par un message discret indiquant la prochaine reprise (par exemple : *« Nos conseillers sont fermés. Ils reprennent le lundi à 08 h 30. »*).
  Le site vérifie l'heure toutes les minutes en tâche de fond sans recharger la page.

---

### Vérifier la répartition des clics (Statistiques)

Vous pouvez à tout moment vérifier combien de clics chaque conseiller a reçus :
1. Ouvrez votre site dans votre navigateur (Chrome, Edge, Safari, Firefox).
2. Appuyez sur la touche `F12` de votre clavier (ou clic-droit > *Inspecter*), puis allez dans l'onglet **Console**.
3. Tapez la commande suivante et appuyez sur **Entrée** :
   ```javascript
   getWhatsAppStats()
   ```
4. Un tableau récapitulatif s'affiche immédiatement avec le nom de chaque conseiller et son total de clics enregistrés !

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
