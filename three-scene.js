/**
 * ══════════════════════════════════════════════════════════════
 *  THREE-SCENE.JS — Moteur de rendu 3D pour Expert du Sommeil
 * ──────────────────────────────────────────────────────────────
 *  • Modèles 3D procéduraux (matelas, accessoires)
 *  • Rotation automatique + interaction souris/tactile
 *  • Lazy loading via IntersectionObserver
 *  • Pause hors écran, résolution adaptée au mobile
 *  • Fallback image si WebGL indisponible
 *  • Prêt pour remplacer par des fichiers .glb
 * ══════════════════════════════════════════════════════════════
 */

/* global THREE, CONFIG */

const SceneManager = (() => {
  'use strict';

  // ─── Détection WebGL ──────────────────────────────────────
  const hasWebGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  })();

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ─── Résolution adaptative ────────────────────────────────
  const getPixelRatio = () => {
    const w = window.innerWidth;
    if (w < 480) return Math.min(window.devicePixelRatio, 1.5);
    if (w < 960) return Math.min(window.devicePixelRatio, 2);
    return Math.min(window.devicePixelRatio, 2);
  };

  // ─── Scènes actives ──────────────────────────────────────
  const scenes = [];

  // ─── Classe de scène 3D ───────────────────────────────────
  class ProductScene {
    constructor(container, modelType, options = {}) {
      this.container = container;
      this.modelType = modelType;
      this.options = Object.assign(
        {
          color: 0x0047ab,
          autoRotateSpeed: 0.005,
          cameraDistance: 4,
          cameraY: 2,
        },
        options
      );
      this.running = false;
      this.disposed = false;
      this.rafId = null;
      this.isDragging = false;
      this.previousPointerX = 0;
      this.rotationY = 0;
      this.rotationVelocity = 0;
      this.modelGroup = null;

      this._init();
    }

    _init() {
      const w = this.container.clientWidth || 300;
      const h = this.container.clientHeight || 220;

      // Scene
      this.scene = new THREE.Scene();

      // Camera
      this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
      this.camera.position.set(0, this.options.cameraY, this.options.cameraDistance);
      this.camera.lookAt(0, 0.3, 0);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth > 480,
        alpha: true,
        powerPreference: 'low-power',
      });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(getPixelRatio());
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.shadowMap.enabled = window.innerWidth > 640;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;

      const canvas = this.renderer.domElement;
      canvas.style.touchAction = 'pan-y';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute(
        'aria-label',
        'Modèle 3D du produit – faites glisser pour tourner'
      );
      this.container.appendChild(canvas);

      // Lighting
      this._setupLighting();

      // Model
      this._buildModel();

      // Ground shadow
      this._addGroundShadow();

      // Events
      this._bindEvents();
    }

    _setupLighting() {
      // Ambient
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambient);

      // Key light
      const key = new THREE.DirectionalLight(0xffffff, 0.8);
      key.position.set(3, 5, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(512, 512);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 15;
      key.shadow.camera.left = -3;
      key.shadow.camera.right = 3;
      key.shadow.camera.top = 3;
      key.shadow.camera.bottom = -3;
      key.shadow.bias = -0.002;
      this.scene.add(key);

      // Fill light (warm)
      const fill = new THREE.DirectionalLight(0xffeedd, 0.3);
      fill.position.set(-2, 3, -2);
      this.scene.add(fill);

      // Rim light
      const rim = new THREE.DirectionalLight(0xaaccff, 0.2);
      rim.position.set(0, 2, -4);
      this.scene.add(rim);
    }

    _buildModel() {
      this.modelGroup = new THREE.Group();

      // Check if a .glb path is specified
      if (this.options.glbPath) {
        // Future: load .glb file here with GLTFLoader
        // For now, fall back to procedural model
        this._createProceduralModel();
      } else {
        this._createProceduralModel();
      }

      this.scene.add(this.modelGroup);
    }

    _createProceduralModel() {
      switch (this.modelType) {
        case 'kit-bundle':
        case 'mattress-hero':
          this._createKitBundle();
          break;
        case 'mattress-ph8':
        case 'mattress-eco':
        case 'matelas-seul-ph8':
          this._createMattress('ph8');
          break;
        case 'mattress-ph10':
        case 'mattress-confort':
        case 'matelas-seul-ph10':
          this._createMattress('ph10');
          break;
        case 'mattress-ph12':
        case 'mattress-premium':
        case 'matelas-seul-ph12':
          this._createMattress('ph12');
          break;
        case 'ventilateur-sur-pied':
        case 'ventilateur':
          this._createStandingFan();
          break;
        case 'coussins-duo':
        case 'coussin':
        case 'oreiller':
          this._createTwoPillows();
          break;
        case 'couette':
        case 'duvet':
        case 'drap-housse':
        case 'drap':
          this._createFoldedBedding();
          break;
        case 'mixeur-blender':
        case 'mixeur':
        case 'blender':
          this._createBlender();
          break;
        case 'bouilloire-inox':
        case 'bouilloire':
          this._createKettle();
          break;
        case 'fer-repasser':
        case 'fer':
          this._createIron();
          break;
        default:
          this._createMattress('ph8');
      }
    }

    /* ── Modèle : Bundle Complet (Matelas + 2 Coussins + Ventilateur sur pied) ── */
    _createKitBundle() {
      const g = this.modelGroup;

      // ── Helper : Signe "+" 3D noir (comme sur l'affiche publicitaire) ──
      const createPlus = (x, y, z) => {
        const plus = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          roughness: 0.35,
          metalness: 0.2
        });
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.06, 0.04), mat);
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 0.04), mat);
        plus.add(h);
        plus.add(v);
        plus.position.set(x, y, z);
        return plus;
      };

      // ── Matelas 2 places (Bleu royal & plateau blanc capitonné) ──
      const matGroup = new THREE.Group();
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x11467e, roughness: 0.65 });
      const main = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.28, 1.28), sideMat);
      main.position.y = 0.14;
      main.castShadow = true;
      matGroup.add(main);

      // Ganse médiane blanche
      const pip = new THREE.Mesh(
        new THREE.BoxGeometry(1.70, 0.02, 1.30),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
      );
      pip.position.y = 0.14;
      matGroup.add(pip);

      // Ganse supérieure blanche
      const topPip = new THREE.Mesh(
        new THREE.BoxGeometry(1.70, 0.015, 1.30),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
      );
      topPip.position.y = 0.28;
      matGroup.add(topPip);

      // Plateau capitonné blanc moelleux
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(1.64, 0.05, 1.24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 })
      );
      top.position.y = 0.305;
      top.castShadow = true;
      matGroup.add(top);

      // Boutons capitonné (grille)
      const tuftMat = new THREE.MeshStandardMaterial({ color: 0xd8e0ea, roughness: 0.9 });
      for (let x = -0.55; x <= 0.55; x += 0.38) {
        for (let z = -0.38; z <= 0.38; z += 0.26) {
          const b = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.012, 8), tuftMat);
          b.position.set(x, 0.335, z);
          matGroup.add(b);
        }
      }
      matGroup.position.set(-0.84, -0.32, 0.15);
      matGroup.rotation.y = -Math.PI / 12;
      matGroup.rotation.x = 0.06;
      g.add(matGroup);

      // ── Signe + entre matelas et coussins ──
      g.add(createPlus(-0.16, 0.04, 0.18));

      // ── 2 Coussins superposés (blancs moelleux au centre) ──
      const pillowGroup = new THREE.Group();
      const pMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.52), pMat);
      p1.position.y = 0.08;
      p1.castShadow = true;
      pillowGroup.add(p1);

      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.15, 0.48), pMat);
      p2.position.set(0.01, 0.22, 0.01);
      p2.rotation.y = 0.1;
      p2.castShadow = true;
      pillowGroup.add(p2);

      pillowGroup.position.set(0.28, 0.02, 0.1);
      pillowGroup.rotation.x = 0.08;
      pillowGroup.rotation.y = -0.15;
      g.add(pillowGroup);

      // ── Signe + entre coussins et ventilateur ──
      g.add(createPlus(0.76, 0.12, 0.15));

      // ── Ventilateur sur pied noir à droite ──
      const fanGroup = new THREE.Group();
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 });

      // Pied en croix
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.025, 0.05), blackMat);
      leg1.position.y = 0.012;
      fanGroup.add(leg1);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.75), blackMat);
      leg2.position.y = 0.012;
      fanGroup.add(leg2);

      // Mât télescopique
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.15, 16), blackMat);
      pole.position.y = 0.6;
      pole.castShadow = true;
      fanGroup.add(pole);

      // Bague chromée
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 })
      );
      ring.position.y = 0.95;
      fanGroup.add(ring);

      // Boîtier moteur
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16), blackMat);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(0, 1.2, -0.05);
      fanGroup.add(motor);

      // Cage circulaire
      const cageMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
      const cage = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.012, 8, 30), cageMat);
      cage.position.set(0, 1.2, 0.06);
      fanGroup.add(cage);

      // Rayons de la grille
      for (let a = 0; a < 8; a++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.68, 0.008), cageMat);
        spoke.rotation.z = (Math.PI / 8) * a;
        spoke.position.set(0, 1.2, 0.06);
        fanGroup.add(spoke);
      }

      // Pales rotatives
      this.blades = new THREE.Group();
      const bMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide });
      for (let i = 0; i < 5; i++) {
        const b = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.24), bMat);
        b.rotation.z = (Math.PI * 2 / 5) * i;
        b.position.set(Math.sin((Math.PI * 2 / 5) * i) * 0.13, Math.cos((Math.PI * 2 / 5) * i) * 0.13, 0);
        this.blades.add(b);
      }
      this.blades.position.set(0, 1.2, 0.04);
      fanGroup.add(this.blades);

      // Pastille rouge centrale (comme sur le flyer)
      const red = new THREE.Mesh(
        new THREE.CircleGeometry(0.035, 16),
        new THREE.MeshBasicMaterial({ color: 0xd32f2f, side: THREE.DoubleSide })
      );
      red.position.set(0, 1.2, 0.075);
      fanGroup.add(red);

      fanGroup.position.set(1.22, -0.42, -0.05);
      fanGroup.rotation.y = -Math.PI / 8;
      g.add(fanGroup);

      g.position.y = -0.15;
      g.rotation.y = -Math.PI / 16;
    }

    /* ── Modèle : Couette matelassée moelleuse pliée ─────────── */
    _createFoldedBedding() {
      const g = this.modelGroup;
      const duvetMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.95,
        metalness: 0.02
      });
      const seamMat = new THREE.MeshStandardMaterial({
        color: 0xe0e6ed,
        roughness: 0.9
      });
      const tagMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.4
      });

      // Couche inférieure pliée
      const layer1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.28, 0.95), duvetMat);
      layer1.position.y = 0.14;
      layer1.castShadow = true;
      g.add(layer1);

      // Couche supérieure pliée
      const layer2 = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.26, 0.90), duvetMat);
      layer2.position.set(-0.02, 0.39, 0);
      layer2.rotation.y = 0.05;
      layer2.castShadow = true;
      g.add(layer2);

      // Bords rebondis (effet gonflant / moelleux)
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.95, 24), duvetMat);
      roll.rotation.x = Math.PI / 2;
      roll.position.set(-0.64, 0.27, 0);
      g.add(roll);

      // Coutures matelassées carrées (surpiqûres)
      for (let x of [-0.25, 0.25]) {
        const seamX = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.54, 0.96), seamMat);
        seamX.position.set(x, 0.27, 0);
        g.add(seamX);
      }
      for (let z of [-0.25, 0.25]) {
        const seamZ = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.54, 0.02), seamMat);
        seamZ.position.set(0, 0.27, z);
        g.add(seamZ);
      }

      // Petite étiquette noire sur le coin (comme sur la photo de couette)
      const tag = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.02), tagMat);
      tag.position.set(0.35, 0.14, 0.49);
      tag.rotation.z = -0.15;
      g.add(tag);

      g.position.y = -0.25;
      g.rotation.y = -Math.PI / 6;
      g.rotation.x = 0.12;
    }

    /* ── Modèle : Matelas 2 places (Ph 8 / Ph 10 / Ph 12) ───── */
    _createMattress(quality) {
      const g = this.modelGroup;
      const thickness = quality === 'ph12' ? 0.46 : quality === 'ph10' ? 0.38 : 0.30;
      const blueColor = quality === 'ph12' ? 0x072448 : quality === 'ph10' ? 0x0a3668 : 0x11467e;

      // Base
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.9 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.7), baseMat);
      base.position.y = 0.06;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      // Corps bleu royal matelassé
      const sideMat = new THREE.MeshStandardMaterial({
        color: blueColor,
        roughness: 0.65,
        metalness: 0.05
      });
      const main = new THREE.Mesh(new THREE.BoxGeometry(2.36, thickness, 1.66), sideMat);
      main.position.y = 0.12 + thickness / 2;
      main.castShadow = true;
      g.add(main);

      // Ganse blanche médiane
      const pipingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const piping = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.025, 1.68), pipingMat);
      piping.position.y = 0.12 + thickness / 2;
      g.add(piping);

      // Ganse supérieure
      const topPiping = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.02, 1.68), pipingMat);
      topPiping.position.y = 0.12 + thickness - 0.01;
      g.add(topPiping);

      // Plateau capitonné moelleux blanc
      const topMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.88,
        metalness: 0.02
      });
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.06, 1.64), topMat);
      top.position.y = 0.12 + thickness + 0.03;
      top.castShadow = true;
      g.add(top);

      // Boutons capitonné (grille 3x4)
      const tuftMat = new THREE.MeshStandardMaterial({ color: 0xdde4ec, roughness: 0.9 });
      for (let x = -0.8; x <= 0.8; x += 0.53) {
        for (let z = -0.55; z <= 0.55; z += 0.36) {
          const button = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12), tuftMat);
          button.position.set(x, 0.12 + thickness + 0.06, z);
          g.add(button);
        }
      }

      // Poignées latérales en tissu
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      for (let s of [-0.4, 0.4]) {
        const handleF = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.02), handleMat);
        handleF.position.set(s, 0.12 + thickness / 2, 0.84);
        g.add(handleF);

        const handleB = handleF.clone();
        handleB.position.z = -0.84;
        g.add(handleB);
      }

      g.position.y = -0.28;
      g.rotation.y = -Math.PI / 6;
      g.rotation.x = 0.08;
    }

    /* ── Modèle : Lot de 2 Coussins superposés ───────────────── */
    _createTwoPillows() {
      const g = this.modelGroup;
      const pillowMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.95,
        metalness: 0
      });

      // Coussin 1 (inférieur)
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.8), pillowMat);
      p1.position.set(0, 0.11, 0);
      p1.castShadow = true;
      p1.receiveShadow = true;
      g.add(p1);

      // Coussin 2 (supérieur empilé)
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.22, 0.76), pillowMat);
      p2.position.set(0.02, 0.31, 0.01);
      p2.rotation.y = 0.08;
      p2.rotation.z = -0.02;
      p2.castShadow = true;
      g.add(p2);

      g.position.y = -0.2;
      g.rotation.y = -Math.PI / 8;
      g.rotation.x = 0.12;
    }

    /* ── Modèle : Ventilateur sur pied ─────────────────── */
    _createStandingFan() {
      const g = this.modelGroup;
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2, metalness: 0.8 });

      // Pied en croix (4 branches en X au sol)
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.035, 0.08), blackMat);
      leg1.position.y = 0.018;
      leg1.castShadow = true;
      g.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 1.2), blackMat);
      leg2.position.y = 0.018;
      leg2.castShadow = true;
      g.add(leg2);

      // Embouts
      for (let p of [[0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6]]) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.045, 0.09), blackMat);
        foot.position.set(p[0], 0.022, p[1]);
        g.add(foot);
      }

      // Tige télescopique
      const lowerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16), blackMat);
      lowerPole.position.y = 0.51;
      lowerPole.castShadow = true;
      g.add(lowerPole);

      // Bague chromée
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16), chromeMat);
      ring.position.y = 0.96;
      g.add(ring);

      const upperPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16), chromeMat);
      upperPole.position.y = 1.26;
      upperPole.castShadow = true;
      g.add(upperPole);

      // Boîtier de commande
      const ctrlBox = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.12), blackMat);
      ctrlBox.position.set(0, 1.45, 0.04);
      g.add(ctrlBox);

      // Moteur
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.22, 20), blackMat);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(0, 1.62, -0.05);
      g.add(motor);

      // Cage
      const cageMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.6 });
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.015, 8, 36), cageMat);
      outerRing.position.set(0, 1.62, 0.12);
      g.add(outerRing);

      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.01, 8, 24), cageMat);
      innerRing.position.set(0, 1.62, 0.13);
      g.add(innerRing);

      // Rayons de protection
      for (let i = 0; i < 8; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.04), cageMat);
        spoke.position.set(0, 1.62, 0.125);
        spoke.rotation.z = (Math.PI / 8) * i;
        g.add(spoke);
      }

      // Moyeu avec pastille rouge
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 20), blackMat);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(0, 1.62, 0.14);
      g.add(hub);

      const redDot = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), new THREE.MeshBasicMaterial({ color: 0xd32f2f }));
      redDot.position.set(0, 1.62, 0.162);
      g.add(redDot);

      // Pales (5 pales rotatives)
      this.blades = new THREE.Group();
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, side: THREE.DoubleSide });
      for (let i = 0; i < 5; i++) {
        const blade = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.38), bladeMat);
        blade.rotation.z = (Math.PI * 2 / 5) * i;
        blade.position.set(
          Math.sin((Math.PI * 2 / 5) * i) * 0.22,
          Math.cos((Math.PI * 2 / 5) * i) * 0.22,
          0
        );
        this.blades.add(blade);
      }
      this.blades.position.set(0, 1.62, 0.10);
      g.add(this.blades);

      g.position.y = -0.85;
      g.scale.set(0.9, 0.9, 0.9);
    }

    /* ── Modèle : Mixeur Blender en verre Homa ───────────────── */
    _createBlender() {
      const g = this.modelGroup;
      const steelMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.25 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.5 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5
      });
      const blueMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });

      // Base inox moteur
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.55, 32), steelMat);
      base.position.y = 0.275;
      base.castShadow = true;
      g.add(base);

      // Pieds noirs
      for (let a = 0; a < 4; a++) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.1), blackMat);
        foot.position.set(Math.sin((Math.PI / 2) * a) * 0.42, 0.02, Math.cos((Math.PI / 2) * a) * 0.42);
        g.add(foot);
      }

      // Molette de réglage avec bague bleue
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 16, 32), blueMat);
      ring.position.set(0, 0.26, 0.44);
      g.add(ring);

      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.04, 24), steelMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 0.26, 0.45);
      g.add(dial);

      // Bague intermédiaire noire
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.1, 32), blackMat);
      collar.position.y = 0.6;
      g.add(collar);

      // Bol en verre gradué
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.9, 32), glassMat);
      jar.position.y = 1.1;
      jar.castShadow = true;
      g.add(jar);

      // Poignée du bol
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.035, 12, 24, Math.PI), glassMat);
      handle.position.set(0.45, 1.15, 0);
      handle.rotation.z = -Math.PI / 2;
      g.add(handle);

      // Couvercle noir
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.43, 0.1, 32), blackMat);
      lid.position.y = 1.6;
      g.add(lid);

      // Bouchon doseur transparent
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 20), glassMat);
      cap.position.y = 1.69;
      g.add(cap);

      g.position.y = -0.7;
      g.scale.set(0.9, 0.9, 0.9);
    }

    /* ── Modèle : Bouilloire électrique inox ──────────────────── */
    _createKettle() {
      const g = this.modelGroup;
      const steelMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.85, roughness: 0.2 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 });
      const redMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });

      // Base chauffante noire 360°
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.54, 0.08, 32), blackMat);
      base.position.y = 0.04;
      base.castShadow = true;
      g.add(base);

      // Corps inox de la bouilloire
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.85, 32), steelMat);
      body.position.y = 0.50;
      body.castShadow = true;
      g.add(body);

      // Bec verseur
      const spout = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 16), steelMat);
      spout.position.set(-0.42, 0.8, 0);
      spout.rotation.z = Math.PI / 3;
      g.add(spout);

      // Poignée ergonomique noire
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 12, 24, Math.PI * 0.9), blackMat);
      handle.position.set(0.42, 0.52, 0);
      handle.rotation.z = -Math.PI / 2.3;
      g.add(handle);

      // Couvercle noir avec bouton
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.08, 32), blackMat);
      lid.position.y = 0.96;
      g.add(lid);
      const knob = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.08), blackMat);
      knob.position.y = 1.03;
      g.add(knob);

      // Témoin lumineux rouge
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), redMat);
      light.position.set(0, 0.12, 0.48);
      g.add(light);

      g.position.y = -0.45;
      g.scale.set(0.95, 0.95, 0.95);
    }

    /* ── Modèle : Fer à repasser à vapeur ─────────────────────── */
    _createIron() {
      const g = this.modelGroup;
      const soleMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.15 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 });
      const tealMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a6c8c,
        transparent: true,
        opacity: 0.65,
        roughness: 0.2,
        transmission: 0.6
      });

      // Semelle profilée
      const sole = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.55), soleMat);
      sole.position.y = 0.02;
      sole.castShadow = true;
      g.add(sole);

      // Réservoir eau transparent bleu sarcelle
      const tank = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.32, 0.5), tealMat);
      tank.position.set(-0.02, 0.20, 0);
      tank.castShadow = true;
      g.add(tank);

      // Nez pointu avant
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 16), tealMat);
      nose.rotation.z = Math.PI / 2;
      nose.position.set(0.65, 0.18, 0);
      g.add(nose);

      // Molette de thermostat
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20), whiteMat);
      dial.position.set(0, 0.38, 0);
      g.add(dial);

      // Poignée ergonomique blanche
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.18), whiteMat);
      handle.position.set(-0.05, 0.55, 0);
      handle.castShadow = true;
      g.add(handle);

      const postF = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.18), whiteMat);
      postF.position.set(0.38, 0.44, 0);
      postF.rotation.z = -0.3;
      g.add(postF);

      const postB = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.24), whiteMat);
      postB.position.set(-0.50, 0.32, 0);
      postB.rotation.z = 0.2;
      g.add(postB);

      // Bouton jet de vapeur
      const btnSteam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.08), tealMat);
      btnSteam.position.set(0.25, 0.63, 0);
      g.add(btnSteam);

      g.position.y = -0.28;
      g.rotation.y = -Math.PI / 5;
      g.scale.set(1.05, 1.05, 1.05);
    }

    /* ── Modèle générique ───────────────────────────────────── */
    _createGenericBox() {
      const g = this.modelGroup;
      const mat = new THREE.MeshStandardMaterial({ color: this.options.color, roughness: 0.6 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
      box.position.y = 0.5;
      box.castShadow = true;
      g.add(box);
    }

    /* ── Ombre au sol ───────────────────────────────────────── */
    _addGroundShadow() {
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        shadowMat
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.01;
      ground.receiveShadow = true;
      this.scene.add(ground);
    }

    /* ── Interactions souris/tactile ─────────────────────────── */
    _bindEvents() {
      const canvas = this.renderer.domElement;

      // Pointer events pour rotation horizontale
      canvas.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' && e.isPrimary === false) return;
        this.isDragging = true;
        this.previousPointerX = e.clientX;
        this.rotationVelocity = 0;
      });

      canvas.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.previousPointerX;
        this.rotationVelocity = dx * 0.008;
        this.rotationY += this.rotationVelocity;
        this.previousPointerX = e.clientX;
      });

      const endDrag = () => { this.isDragging = false; };
      canvas.addEventListener('pointerup', endDrag);
      canvas.addEventListener('pointercancel', endDrag);
      canvas.addEventListener('pointerleave', endDrag);

      // Resize
      this._onResize = () => {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        if (w === 0 || h === 0) return;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(getPixelRatio());
      };
      window.addEventListener('resize', this._onResize);
    }

    /* ── Boucle de rendu ────────────────────────────────────── */
    start() {
      if (this.running || this.disposed) return;
      this.running = true;
      this._animate();
    }

    pause() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    _animate() {
      if (!this.running) return;
      this.rafId = requestAnimationFrame(() => this._animate());

      if (this.modelGroup) {
        if (!this.isDragging) {
          // Auto-rotation
          this.rotationY += this.options.autoRotateSpeed;
          // Dampen velocity
          this.rotationVelocity *= 0.95;
          this.rotationY += this.rotationVelocity;
        }
        this.modelGroup.rotation.y = this.rotationY;
      }

      // Rotation des pales du ventilateur
      if (this.blades) {
        this.blades.rotation.z += 0.1;
      }

      this.renderer.render(this.scene, this.camera);
    }

    /* ── Nettoyage ──────────────────────────────────────────── */
    dispose() {
      this.disposed = true;
      this.pause();
      window.removeEventListener('resize', this._onResize);

      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }

  // ─── Lazy Loading avec IntersectionObserver ───────────────
  function initScenes() {
    if (!hasWebGL || prefersReducedMotion) {
      // Afficher les images de fallback
      document.querySelectorAll('[data-scene]').forEach((el) => {
        el.classList.add('no-webgl');
        const type = el.dataset.scene;
        const fallback = document.createElement('div');
        fallback.className = 'fallback-placeholder';
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', 'Image du produit ' + (el.dataset.label || ''));
        fallback.innerHTML = '<span class="fallback-icon">🛏️</span>';
        fallback.style.cssText =
          'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;opacity:.5;';
        el.appendChild(fallback);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const sceneObj = el._productScene;

          if (entry.isIntersecting) {
            if (!sceneObj) {
              // Créer la scène au premier affichage
              const type = el.dataset.scene;
              const color = parseInt(el.dataset.color, 16) || 0x0047ab;
              const scene = new ProductScene(el, type, { color });
              el._productScene = scene;
              scenes.push(scene);
              scene.start();
            } else {
              sceneObj.start();
            }
          } else if (sceneObj) {
            sceneObj.pause();
          }
        });
      },
      { rootMargin: '100px 0px', threshold: 0.01 }
    );

    document.querySelectorAll('[data-scene]').forEach((el) => {
      observer.observe(el);
    });
  }

  // ─── API publique ─────────────────────────────────────────
  return {
    init: initScenes,
    scenes,
    hasWebGL,
  };
})();
