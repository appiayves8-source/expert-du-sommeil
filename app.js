/**
 * ══════════════════════════════════════════════════════════════
 *  APP.JS — Logique principale de « Expert du Sommeil »
 * ──────────────────────────────────────────────────────────────
 *  • Génération dynamique du contenu depuis CONFIG
 *  • Navigation mobile + sticky header
 *  • Toggle clair / sombre
 *  • Scroll reveal
 *  • Liens WhatsApp pré-rédigés
 *  • Initialisation des scènes 3D
 * ══════════════════════════════════════════════════════════════
 */

/* global CONFIG, SceneManager */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  //  1. THÈME SOMBRE UNIQUE (Glassmorphism)
  // ═══════════════════════════════════════════════════════════
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('eds-theme', 'dark');

  // ═══════════════════════════════════════════════════════════
  //  2. WHATSAPP HELPERS
  // ═══════════════════════════════════════════════════════════
  function waLink(message) {
    const num = CONFIG.boutique.whatsapp;
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(message);
  }

  function waProductLink(nom, prix) {
    return waLink(CONFIG.whatsappMessage(nom, prix));
  }

  function waGeneralLink() {
    return waLink(CONFIG.whatsappMessageGeneral);
  }

  // ═══════════════════════════════════════════════════════════
  //  3. CONTENU DYNAMIQUE
  // ═══════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    // ── Titre de la page ───────────────────────────────────
    document.title = CONFIG.boutique.nom + ' — Matelas & Accessoires | Abidjan';

    // ── Hero ───────────────────────────────────────────────
    setText('hero-title-name', CONFIG.boutique.nom);
    setAttr('hero-wa-btn', 'href', waGeneralLink());
    setAttr('hero-products-btn', 'href', '#produits');

    // ── Floating WhatsApp ──────────────────────────────────
    setAttr('fab-wa', 'href', waGeneralLink());

    // ── Kits ───────────────────────────────────────────────
    const kitsGrid = document.getElementById('kits-grid');
    if (kitsGrid) {
      kitsGrid.innerHTML = CONFIG.kits.map((kit) => kitCardHTML(kit)).join('');
      initKitSwitchers();
    }

    // ── Accessoires ────────────────────────────────────────
    const accGrid = document.getElementById('acc-grid');
    if (accGrid) {
      accGrid.innerHTML = CONFIG.accessoires.map((a) => accCardHTML(a)).join('');
    }

    // ── Entreprise ─────────────────────────────────────────
    setText('ent-titre', CONFIG.entreprise.titre);
    setText('ent-intro', CONFIG.entreprise.intro);
    const engGrid = document.getElementById('engagements-grid');
    if (engGrid) {
      engGrid.innerHTML = CONFIG.entreprise.engagements
        .map((e) => engagementHTML(e))
        .join('');
    }

    // ── Livraison ──────────────────────────────────────────
    const tbody = document.getElementById('livraison-body');
    if (tbody) {
      tbody.innerHTML = CONFIG.livraison.zones
        .map(
          (z) => `<tr>
            <td>${z.zone}</td>
            <td>${z.delai}</td>
            <td>${z.frais}</td>
          </tr>`
        )
        .join('');
    }
    setText('livraison-note', CONFIG.livraison.note);

    // ── Contact ────────────────────────────────────────────
    setAttr('contact-wa-btn', 'href', waGeneralLink());
    setText('contact-adresse', CONFIG.boutique.adresse);
    setText('contact-horaires', CONFIG.boutique.horaires);
    setText('contact-email', CONFIG.boutique.email);
    setAttr('contact-email', 'href', 'mailto:' + CONFIG.boutique.email);

    // ── Footer ─────────────────────────────────────────────
    setText('footer-nom', CONFIG.boutique.nom);
    setText('footer-desc', CONFIG.boutique.description);
    setText('footer-year', new Date().getFullYear().toString());

    // ── Témoignages ─────────────────────────────────────────
    const tGrid = document.getElementById('testimonials-grid');
    if (tGrid && CONFIG.temoignages) {
      tGrid.innerHTML = CONFIG.temoignages.avis.map((t) => testimonialCardHTML(t)).join('');
    }
    initCounterAnimation();

    // ── Init 3D ────────────────────────────────────────────
    if (typeof SceneManager !== 'undefined') {
      SceneManager.init();
    }

    // ── Init Scroll Reveal ─────────────────────────────────
    initScrollReveal();

    // ── Init Header ────────────────────────────────────────
    initHeader();

    // ── Init Mobile Nav ────────────────────────────────────
    initMobileNav();

    // ── Active nav link ────────────────────────────────────
    initActiveNav();

    // ── Init 3D Tilt & Toggles ─────────────────────────────
    init3DTilt();
    init3DToggles();
  });

  // ═══════════════════════════════════════════════════════════
  //  4. TEMPLATES HTML
  // ═══════════════════════════════════════════════════════════
  function kitCardHTML(kit) {
    const prixKit = CONFIG.formatPrix(kit.prix);
    const prixSolo = CONFIG.formatPrix(kit.prixMatelasSeul || Math.round(kit.prix * 0.7));
    const nomSolo = kit.nomMatelasSeul || (kit.nom.replace('Kit', 'Matelas') + ' (seul)');
    const linkKit = waProductLink(kit.nom + ' (pack complet)', prixKit);
    const linkSolo = waProductLink(nomSolo, prixSolo);

    // Contenu détaillé avec possibilité d'achat à l'unité détaché
    const contenuItems = (kit.contenu || []).map((item) => {
      if (typeof item === 'string') {
        return `<li class="kit-item"><span class="kit-item__name"><span class="check-icon">✓</span> ${item}</span></li>`;
      }
      const itemPrix = item.prixSeul ? CONFIG.formatPrix(item.prixSeul) : '';
      const itemLink = item.prixSeul ? waProductLink(item.nom + ' (' + kit.nom + ')', itemPrix) : '';
      const isPrincipal = item.principal ? 'kit-item--primary' : '';
      return `
        <li class="kit-item ${isPrincipal}">
          <span class="kit-item__name"><span class="check-icon">✓</span> ${item.nom}</span>
          ${item.prixSeul ? `
            <div class="kit-item__detached">
              <span class="kit-item__price">${itemPrix}</span>
              <a href="${itemLink}"
                 class="kit-item__buy-btn"
                 target="_blank"
                 rel="noopener noreferrer"
                 title="Commander uniquement cet article">
                Acheter seul →
              </a>
            </div>
          ` : ''}
        </li>
      `;
    }).join('');

    const badge = kit.badgeTexte
      ? `<span class="kit-card__badge" aria-label="${kit.badgeTexte}">${kit.badgeTexte}</span>`
      : (kit.populaire ? '<span class="kit-card__badge" aria-label="Le plus populaire">Populaire</span>' : '');
    const colorHex = kit.couleur3d.toString(16).padStart(6, '0');
    const sceneType = kit.scene3d || ('mattress-' + kit.id);
    const defaultImg = kit.image || 'img/kit-bundle-real.jpg';
    const soloImg = kit.imageSolo || 'img/matelas-ph8-real.jpg';

    return `
    <article class="kit-card ${kit.populaire ? 'kit-card--popular' : ''} reveal"
             aria-label="Kit matelas ${kit.nom}"
             id="card-${kit.id}">
      ${badge}
      <div class="kit-card__media" data-tilt-3d>
        <img src="${defaultImg}"
             alt="${kit.nom}"
             class="kit-card__img"
             id="img-${kit.id}"
             data-img-kit="${defaultImg}"
             data-img-solo="${soloImg}"
             loading="lazy">
        <div class="card__glass-shine" aria-hidden="true"></div>
        <div class="kit-card__3d canvas-wrapper"
             id="canvas-${kit.id}"
             data-scene="${sceneType}"
             data-color="${colorHex}"
             data-label="${kit.nom}"
             style="display: none;">
        </div>
        <button type="button" class="card-3d-toggle" data-target="${kit.id}" aria-label="Basculer vue 3D">
          🔄 3D / Photo
        </button>
      </div>
      <div class="kit-card__body">
        <div class="kit-card__top">
          <h3 class="kit-card__name">${kit.nom}</h3>
          <span class="kit-card__subtitle">${kit.sousTitre}</span>
          <p class="kit-card__desc">${kit.description}</p>
        </div>

        <!-- Sélecteur Pack Complet / Matelas Seul -->
        <div class="kit-switch" role="group" aria-label="Format d'achat pour ${kit.nom}">
          <button type="button"
                  class="kit-switch__btn active"
                  data-kit-target="${kit.id}"
                  data-mode="kit"
                  aria-pressed="true">
            📦 Pack Complet
          </button>
          <button type="button"
                  class="kit-switch__btn"
                  data-kit-target="${kit.id}"
                  data-mode="solo"
                  aria-pressed="false">
            🛏️ Matelas Seul
          </button>
        </div>

        <!-- Détail des éléments détachables -->
        <div class="kit-breakdown">
          <span class="kit-breakdown__label">Inclus dans le pack (ou à l'unité) :</span>
          <ul class="kit-card__list">
            ${contenuItems}
          </ul>
        </div>

        <!-- Footer avec affichage du prix choisi et bouton WhatsApp -->
        <div class="kit-card__footer">
          <div class="kit-card__price-wrap">
            <span class="kit-card__price-type" id="price-type-${kit.id}">Pack complet :</span>
            <span class="kit-card__price"
                  id="price-val-${kit.id}"
                  data-prix-kit="${prixKit}"
                  data-prix-solo="${prixSolo}">
              ${prixKit}
            </span>
          </div>
          <a href="${linkKit}"
             id="wa-cta-${kit.id}"
             data-link-kit="${linkKit}"
             data-link-solo="${linkSolo}"
             class="btn btn--whatsapp btn--sm"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Commander ${kit.nom} sur WhatsApp">
            💬 Commander
          </a>
        </div>
      </div>
    </article>`;
  }

  function initKitSwitchers() {
    // Switchers individuels sur chaque carte
    document.querySelectorAll('.kit-switch__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kitId = btn.dataset.kitTarget;
        const mode = btn.dataset.mode;
        setKitCardMode(kitId, mode);
      });
    });

    // Sélecteur global en haut de la section produits
    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const mode = tab.dataset.mode;
        const targetMode = mode === 'solo' ? 'solo' : 'kit';
        CONFIG.kits.forEach((k) => {
          setKitCardMode(k.id, targetMode);
        });
      });
    });
  }

  function setKitCardMode(kitId, mode) {
    const card = document.getElementById('card-' + kitId);
    if (!card) return;

    card.querySelectorAll('.kit-switch__btn').forEach((b) => {
      const isActive = b.dataset.mode === mode;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const priceVal = document.getElementById('price-val-' + kitId);
    const priceType = document.getElementById('price-type-' + kitId);
    const waCta = document.getElementById('wa-cta-' + kitId);
    const img = document.getElementById('img-' + kitId);

    if (mode === 'solo') {
      if (priceVal) priceVal.textContent = priceVal.dataset.prixSolo;
      if (priceType) priceType.textContent = 'Matelas seul :';
      if (img && img.dataset.imgSolo) {
        img.src = img.dataset.imgSolo;
      }
      if (waCta) {
        waCta.href = waCta.dataset.linkSolo;
        waCta.innerHTML = '🛏️ Commander le matelas';
      }
      card.classList.add('kit-card--solo-active');
    } else {
      if (priceVal) priceVal.textContent = priceVal.dataset.prixKit;
      if (priceType) priceType.textContent = 'Pack complet :';
      if (img && img.dataset.imgKit) {
        img.src = img.dataset.imgKit;
      }
      if (waCta) {
        waCta.href = waCta.dataset.linkKit;
        waCta.innerHTML = '💬 Commander le pack';
      }
      card.classList.remove('kit-card--solo-active');
    }
  }

  function accCardHTML(acc) {
    const prix = CONFIG.formatPrix(acc.prix);
    const colorHex = acc.couleur3d.toString(16).padStart(6, '0');
    const sceneType = acc.scene3d || acc.id;
    const defaultImg = acc.image || 'img/matelas-ph8-real.jpg';

    return `
    <article class="acc-card reveal" aria-label="${acc.nom}">
      <div class="acc-card__media" data-tilt-3d>
        <img src="${defaultImg}"
             alt="${acc.nom}"
             class="acc-card__img"
             id="img-${acc.id}"
             loading="lazy">
        <div class="card__glass-shine" aria-hidden="true"></div>
        <div class="acc-card__3d canvas-wrapper"
             id="canvas-${acc.id}"
             data-scene="${sceneType}"
             data-color="${colorHex}"
             data-label="${acc.nom}"
             style="display: none;">
        </div>
        <button type="button" class="card-3d-toggle" data-target="${acc.id}" aria-label="Basculer vue 3D">
          🔄 3D / Photo
        </button>
      </div>
      <div class="acc-card__body">
        <h3 class="acc-card__name">${acc.nom}</h3>
        <p class="acc-card__desc">${acc.description}</p>
        <div class="acc-card__footer">
          <span class="acc-card__price">${prix}</span>
          <a href="${waProductLink(acc.nom, prix)}"
             class="btn btn--whatsapp btn--sm"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Commander ${acc.nom} sur WhatsApp">
            💬 Commander
          </a>
        </div>
      </div>
    </article>`;
  }

  function engagementHTML(e) {
    return `
    <div class="engagement-card reveal">
      <div class="engagement-card__icon">${e.icone}</div>
      <h3 class="engagement-card__title">${e.titre}</h3>
      <p class="engagement-card__text">${e.texte}</p>
    </div>`;
  }

  function testimonialCardHTML(t) {
    const stars = '★'.repeat(t.note) + '☆'.repeat(5 - t.note);
    return `
    <article class="testimonial-card reveal" aria-label="Avis de ${t.nom}">
      <div class="testimonial-card__header">
        <div class="testimonial-card__avatar" aria-hidden="true">${t.avatar}</div>
        <div class="testimonial-card__info">
          <span class="testimonial-card__name">${t.nom}</span>
          <span class="testimonial-card__ville">${t.ville}</span>
        </div>
      </div>
      <div class="testimonial-card__stars" aria-label="Note : ${t.note} sur 5">${stars}</div>
      <blockquote class="testimonial-card__text">
        « ${t.texte} »
      </blockquote>
      <time class="testimonial-card__date">${t.date}</time>
    </article>`;
  }

  // ═══════════════════════════════════════════════════════════
  //  ANIMATED COUNTER (Compte de 0 au nombre cible)
  // ═══════════════════════════════════════════════════════════
  function initCounterAnimation() {
    const statsBar = document.getElementById('stats-bar');
    if (!statsBar) return;

    const counters = statsBar.querySelectorAll('.stat-item__number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = parseFloat(counter.dataset.target);
            const isDecimal = counter.dataset.decimal === 'true';
            const duration = 2000; // 2 secondes
            const startTime = performance.now();

            function updateCounter(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Easing out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;

              if (isDecimal) {
                counter.textContent = current.toFixed(1);
              } else {
                counter.textContent = Math.floor(current).toLocaleString('fr-FR');
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                // Valeur finale exacte
                counter.textContent = isDecimal
                  ? target.toFixed(1)
                  : target.toLocaleString('fr-FR');
                // Ajouter le "+" pour les grands nombres
                if (!isDecimal && target >= 100) {
                  counter.textContent += '+';
                }
              }
            }
            requestAnimationFrame(updateCounter);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsBar);
  }

  // ═══════════════════════════════════════════════════════════
  //  5. HEADER (sticky + shadow on scroll)
  // ═══════════════════════════════════════════════════════════
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  6. MOBILE NAVIGATION
  // ═══════════════════════════════════════════════════════════
  function initMobileNav() {
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer au clic sur un lien
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  7. ACTIVE NAV LINK (scroll spy)
  // ═══════════════════════════════════════════════════════════
  function initActiveNav() {
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) => {
              l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ═══════════════════════════════════════════════════════════
  //  8. SCROLL REVEAL
  // ═══════════════════════════════════════════════════════════
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════════════
  //  9. EFFET 3D PERSPECTIVE INTERACTIF (TILT & SPECULAR SHEEN)
  // ═══════════════════════════════════════════════════════════
  function init3DTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tiltElements = document.querySelectorAll('[data-tilt-3d]');
    tiltElements.forEach((el) => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        const rotateX = ((y / rect.height) - 0.5) * -14;
        const rotateY = ((x / rect.width) - 0.5) * 14;

        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        el.style.setProperty('--shine-x', `${xPercent.toFixed(1)}%`);
        el.style.setProperty('--shine-y', `${yPercent.toFixed(1)}%`);
        el.style.setProperty('--shine-opacity', '0.28');
      };

      const onLeave = () => {
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.setProperty('--shine-opacity', '0');
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('touchmove', onMove, { passive: true });
      el.addEventListener('touchend', onLeave);
    });
  }

  function init3DToggles() {
    // Toggle Hero
    const heroBtn = document.getElementById('hero-view-toggle');
    const heroImg = document.getElementById('hero-img');
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroBtn && heroImg && heroCanvas) {
      heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isCanvasVisible = heroCanvas.style.display !== 'none';
        if (isCanvasVisible) {
          heroCanvas.style.display = 'none';
          heroImg.style.display = 'block';
          heroBtn.textContent = '🔄 3D 360° / Photo';
        } else {
          heroImg.style.display = 'none';
          heroCanvas.style.display = 'block';
          heroBtn.textContent = '📸 Photo Réelle';
          if (typeof SceneManager !== 'undefined') {
            SceneManager.init();
          }
        }
      });
    }

    // Toggles par carte produit
    document.querySelectorAll('.card-3d-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetId = btn.dataset.target;
        const img = document.getElementById('img-' + targetId);
        const canvas = document.getElementById('canvas-' + targetId);
        if (!img || !canvas) return;

        const isCanvas = canvas.style.display !== 'none';
        if (isCanvas) {
          canvas.style.display = 'none';
          img.style.display = 'block';
          btn.textContent = '🔄 3D / Photo';
        } else {
          img.style.display = 'none';
          canvas.style.display = 'block';
          btn.textContent = '📸 Photo Réelle';
          if (typeof SceneManager !== 'undefined') {
            SceneManager.init();
          }
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  UTILITAIRES DOM
  // ═══════════════════════════════════════════════════════════
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }
})();
