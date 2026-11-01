/**
 * ══════════════════════════════════════════════════════════════
 *  CONFIGURATION DU SITE « EXPERT DU SOMMEIL »
 * ──────────────────────────────────────────────────────────────
 *  Modifiez uniquement ce fichier pour changer les textes,
 *  les prix, le numéro WhatsApp ou les produits.
 *  Aucun autre fichier n'a besoin d'être touché.
 * ══════════════════════════════════════════════════════════════
 */

const CONFIG = {

  /* ─── Informations de la boutique ─────────────────────────── */
  boutique: {
    nom: 'Expert du Sommeil',
    slogan: 'Le savoir\u2011faire marocain au service de votre confort',
    description: 'Matelas haut de gamme et accessoires pour la maison. Qualité marocaine, livrés en Côte d\u2019Ivoire.',
    whatsapp: '2250000000000',        // Numéro avec indicatif pays, sans «\u202F+\u202F» ni espaces
    adresse: 'Abidjan, Côte d\u2019Ivoire',  // Adresse complète
    horaires: 'Lundi \u2013 Samedi : 8\u202Fh \u2013 19\u202Fh',
    email: 'contact@expertdusommeil.ci',
    siteUrl: 'https://expertdusommeil.ci',
  },

  /* ─── Kits de matelas (Offre Spéciale affiche & Gamme Ph) ── */
  kits: [
    {
      id: 'offre-speciale',
      nom: 'Pack Offre Spéciale',
      nomMatelasSeul: 'Matelas 2 places ép. 20 (Ph 8)',
      sousTitre: '2 places épaisseur 20 (Ph 8) + 2 coussins + 1 ventilateur',
      description: 'L\u2019offre star Expert du Sommeil : matelas capitonné bleu royal & blanc, 2 coussins moelleux et ventilateur sur pied.',
      badgeTexte: '🔥 OFFRE SPÉCIALE • GARANTIE 10 ANS',
      prix: 52900,              // Prix exact de l'affiche
      prixMatelasSeul: 39900,   // Prix du matelas seul détaché
      image: 'img/kit-bundle-real.jpg',
      imageSolo: 'img/matelas-ph8-real.jpg',
      scene3d: 'kit-bundle',
      couleur3d: 0x11467E,
      populaire: true,
      contenu: [
        { nom: '1 matelas 2 places épaisseur 20 (Ph 8)', prixSeul: 39900, principal: true },
        { nom: '2 coussins moelleux grand confort', prixSeul: 7000 },
        { nom: '1 ventilateur sur pied silencieux', prixSeul: 14900 },
      ],
      modele: null,
    },
    {
      id: 'pack-confort',
      nom: 'Pack Confort (Ph 10)',
      nomMatelasSeul: 'Matelas 2 places ép. 25 (Ph 10)',
      sousTitre: '2 places épaisseur 25 (Ph 10) + 2 coussins + 1 ventilateur',
      description: 'Mousse haute densité marocaine renforcée (25 cm) pour un maintien dorsal ergonomique et durable.',
      badgeTexte: 'GARANTIE 10 ANS',
      prix: 69900,              // Prix pack complet
      prixMatelasSeul: 54900,   // Prix du matelas seul détaché
      image: 'img/matelas-ph10-real.jpg',
      imageSolo: 'img/matelas-ph10-real.jpg',
      scene3d: 'mattress-ph10',
      couleur3d: 0x0A3668,
      contenu: [
        { nom: '1 matelas 2 places épaisseur 25 (Ph 10)', prixSeul: 54900, principal: true },
        { nom: '2 coussins moelleux grand confort', prixSeul: 7000 },
        { nom: '1 ventilateur sur pied silencieux', prixSeul: 14900 },
      ],
      modele: null,
    },
    {
      id: 'pack-prestige',
      nom: 'Pack Orthopédique (Ph 12)',
      nomMatelasSeul: 'Matelas 2 places ép. 30 (Ph 12)',
      sousTitre: '2 places épaisseur 30 (Ph 12) + 2 coussins + 1 ventilateur',
      description: 'Notre modèle le plus épais avec plateau capitonné mémoire de forme pour un confort hôtelier 5 étoiles.',
      badgeTexte: '⭐ GRAND LUXE • GARANTIE 10 ANS',
      prix: 89900,              // Prix pack complet
      prixMatelasSeul: 74900,   // Prix du matelas seul détaché
      image: 'img/matelas-ph12-real.jpg',
      imageSolo: 'img/matelas-ph12-real.jpg',
      scene3d: 'mattress-ph12',
      couleur3d: 0x072448,
      contenu: [
        { nom: '1 matelas 2 places épaisseur 30 (Ph 12)', prixSeul: 74900, principal: true },
        { nom: '2 coussins moelleux grand confort', prixSeul: 7000 },
        { nom: '1 ventilateur sur pied silencieux', prixSeul: 14900 },
      ],
      modele: null,
    },
  ],

  /* ─── Articles détachés à l'unité (Chaque produit du kit seul) ─ */
  accessoires: [
    {
      id: 'mixeur-blender',
      nom: 'Mixeur Blender en verre Homa',
      description: 'Bol en verre gradué 1,5 L haute résistance, lames en inox et variateur de vitesse rétro-éclairé.',
      prix: 18900,
      image: 'img/mixeur-blender-real.png',
      scene3d: 'mixeur-blender',
      couleur3d: 0xCCCCCC,
      modele: null,
    },
    {
      id: 'bouilloire-inox',
      nom: 'Bouilloire électrique inox 1,8 L',
      description: 'Corps en acier inoxydable brossé, poignée isolante ergonomique, arrêt automatique et base 360°.',
      prix: 12500,
      image: 'img/bouilloire-inox-real.png',
      scene3d: 'bouilloire-inox',
      couleur3d: 0xDDDDDD,
      modele: null,
    },
    {
      id: 'fer-repasser',
      nom: 'Fer à repasser à vapeur céramique',
      description: 'Semelle antiadhésive haute glisse, débit vapeur continu puissant et défroissage vertical.',
      prix: 11900,
      image: 'img/fer-repasser-real.png',
      scene3d: 'fer-repasser',
      couleur3d: 0x0A5C80,
      modele: null,
    },
    {
      id: 'ventilateur-sur-pied',
      nom: 'Ventilateur sur pied',
      description: 'Télescopique sur pied en croix, 3 vitesses, oscillation 90°, grille sécurisée.',
      prix: 14900,
      image: 'img/ventilateur-sur-pied-real.jpg',
      scene3d: 'ventilateur-sur-pied',
      couleur3d: 0x1A1A1A,
      modele: null,
    },
    {
      id: 'coussins-duo',
      nom: 'Lot de 2 coussins moelleux',
      description: 'Finition blanche soyeuse, fibres siliconées hypoallergéniques et maintien cervical.',
      prix: 7000,
      image: 'img/coussins-duo-real.jpg',
      scene3d: 'coussins-duo',
      couleur3d: 0xFFFFFF,
      modele: null,
    },
    {
      id: 'couette',
      nom: 'Couette',
      description: 'Couette matelassée moelleuse grand confort, garnissage hypoallergénique respirant et toucher soyeux.',
      prix: 18500,
      image: 'img/couette-moelleuse-real.png',
      scene3d: 'couette',
      couleur3d: 0xFFFFFF,
      modele: null,
    },
    {
      id: 'matelas-seul-ph8',
      nom: 'Matelas 2 places ép. 20 (Ph 8)',
      description: 'Côtés bleu royal, plateau blanc capitonné, mousse Ph 8 marocaine, garantie 10 ans.',
      prix: 39900,
      image: 'img/matelas-ph8-real.jpg',
      scene3d: 'matelas-seul-ph8',
      couleur3d: 0x11467E,
      modele: null,
    },
    {
      id: 'matelas-seul-ph10',
      nom: 'Matelas 2 places ép. 25 (Ph 10)',
      description: 'Épaisseur 25 cm, haute résilience, capitonnage moelleux, garantie 10 ans.',
      prix: 54900,
      image: 'img/matelas-ph10-real.jpg',
      scene3d: 'matelas-seul-ph10',
      couleur3d: 0x0A3668,
      modele: null,
    },
    {
      id: 'matelas-seul-ph12',
      nom: 'Matelas 2 places ép. 30 (Ph 12)',
      description: 'Épaisseur 30 cm, soutien orthopédique de référence, capitonnage grand luxe.',
      prix: 74900,
      image: 'img/matelas-ph12-real.jpg',
      scene3d: 'matelas-seul-ph12',
      couleur3d: 0x072448,
      modele: null,
    },
  ],

  /* ─── Livraison (Conforme à l'affiche officielle) ───────────── */
  livraison: {
    zones: [
      { zone: 'Abidjan (Toutes communes)', delai: 'Dans la journée / 24\u202Fh', frais: 'GRATUIT 🎁' },
      { zone: 'Bouaké',                    delai: '24\u202Fh à 48\u202Fh',           frais: 'Payant à tarif réduit' },
      { zone: 'Yamoussoukro',              delai: '24\u202Fh à 48\u202Fh',           frais: 'Payant à tarif réduit' },
      { zone: 'San\u2011Pédro',            delai: '48\u202Fh',                  frais: 'Payant à tarif réduit' },
      { zone: 'Intérieur du pays',         delai: '48\u202Fh à 72\u202Fh',           frais: 'Selon la ville' },
    ],
    note: 'Paiement à la livraison. Livraison gratuite à Abidjan et payante à l\u2019intérieur du pays.',
  },

  /* ─── Textes « L'entreprise » ─────────────────────────────── */
  entreprise: {
    titre: 'Notre savoir\u2011faire',
    intro: 'Expert du Sommeil allie la tradition marocaine du textile et de la literie à une présence de proximité en Côte d\u2019Ivoire. Nous sélectionnons chaque produit pour vous offrir confort, durabilité et un service irréprochable.',
    engagements: [
      {
        icone: '🏭',
        titre: 'Fabrication marocaine',
        texte: 'Nos matelas sont conçus au Maroc, berceau d\u2019un savoir\u2011faire reconnu dans le textile et la mousse.',
      },
      {
        icone: '🤝',
        titre: 'Proximité & conseil',
        texte: 'Installés à Abidjan, nous vous accompagnons dans le choix de votre literie, en magasin ou par WhatsApp.',
      },
      {
        icone: '✅',
        titre: 'Qualité contrôlée',
        texte: 'Chaque produit est vérifié avant expédition pour garantir votre entière satisfaction.',
      },
      {
        icone: '🚚',
        titre: 'Livraison à domicile',
        texte: 'Nous livrons partout en Côte d\u2019Ivoire, directement chez vous.',
      },
    ],
  },

  /* ─── Témoignages clients ───────────────────────────────────── */
  temoignages: {
    stats: {
      clientsSatisfaits: 2847,
      noteGlobale: 4.9,
      livraisons: 3200,
      villesDesservies: 15,
    },
    avis: [
      {
        nom: 'Aminata K.',
        ville: 'Abidjan – Cocody',
        note: 5,
        date: 'Octobre 2026',
        texte: 'Mon matelas Ph 10 est arrivé le jour même ! Très confortable, mes douleurs de dos ont disparu en 2 semaines. Je recommande vivement Expert du Sommeil.',
        avatar: '👩🏾',
      },
      {
        nom: 'Kouassi T.',
        ville: 'Abidjan – Yopougon',
        note: 5,
        date: 'Septembre 2026',
        texte: 'Le pack complet matelas + coussins + ventilateur est une vraie affaire. La qualité marocaine se sent immédiatement. Merci pour la livraison gratuite !',
        avatar: '👨🏾',
      },
      {
        nom: 'Fatou D.',
        ville: 'Bouaké',
        note: 5,
        date: 'Août 2026',
        texte: 'J\'ai commandé le kit Ph 8 pour ma chambre d\'amis. Le service est impeccable, le WhatsApp est réactif et le matelas est de très bonne qualité.',
        avatar: '👩🏾',
      },
      {
        nom: 'Jean-Marc A.',
        ville: 'Yamoussoukro',
        note: 4,
        date: 'Juillet 2026',
        texte: 'Livraison rapide même à Yamoussoukro. Le matelas orthopédique Ph 12 est incroyable, on dirait un hôtel 5 étoiles. Ma femme est ravie aussi.',
        avatar: '👨🏾',
      },
      {
        nom: 'Marie-Claire B.',
        ville: 'Abidjan – Marcory',
        note: 5,
        date: 'Octobre 2026',
        texte: 'La couette et les coussins sont d\'une douceur incroyable. J\'ai aussi pris le blender Homa, il fonctionne à merveille. Boutique de confiance !',
        avatar: '👩🏾',
      },
      {
        nom: 'Ibrahim S.',
        ville: 'San-Pédro',
        note: 5,
        date: 'Septembre 2026',
        texte: 'Même à San-Pédro, la livraison s\'est faite en 48h comme promis. Matelas Ph 10 très ferme et durable. Je suis client fidèle maintenant.',
        avatar: '👨🏾',
      },
    ],
  },

  /* ─── Format des messages WhatsApp ────────────────────────── */
  whatsappMessage(produit, prix) {
    return `Bonjour Expert du Sommeil ! 👋\nJe suis intéressé(e) par : *${produit}* (${prix})\nPouvez-vous me donner plus d\u2019informations ?`;
  },
  whatsappMessageGeneral: 'Bonjour Expert du Sommeil ! 👋\nJ\u2019aimerais en savoir plus sur vos produits.',

  /* ─── Utilitaire : formater un prix en FCFA ───────────────── */
  formatPrix(montant) {
    return montant.toLocaleString('fr-FR') + '\u202FFCFA';
  },
};
