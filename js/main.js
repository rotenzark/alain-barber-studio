/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'alain-barber-studio',
    /* nessun WhatsApp dichiarato: il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (1–2/10/2026): martedì–venerdì 10–19:30, sabato 9–18, domenica e lunedì chiuso */
    hours: {
      0: [], 1: [],
      2: [['10:00', '19:30']], 3: [['10:00', '19:30']], 4: [['10:00', '19:30']], 5: [['10:00', '19:30']], 6: [['09:00', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1099,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "ALAIN Barber Studio: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.vetrina": "The window",
      "n.servizi": "In the chair",
      "n.foto": "Photos",
      "n.recensioni": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "t.orari": "Hours",
      "h.occhio": "Via Lomellina 24 · Milan",
      "h.testo": "Italian barbers in Via Lomellina: haircuts, beards, and a shop window you recognise from the street.",
      "h.voton": "4.6",
      "h.voto": "on Google, 84 reviews",
      "a.valigie": "The leather suitcases of the shop window seen from inside, the top one open; behind them, the barber chairs and the mirrors.",
      "h.fvaligie": "The suitcases, from inside",
      "a.facciata": "The front in Via Lomellina 24: the black ALAIN Barber Studio sign, the window with four stacked leather suitcases, the door open onto the shop.",
      "h.ffacciata": "The front, in Via Lomellina 24",
      "a.poltrone": "The two chrome barber chairs with their white bases in front of the wooden counter and the mirrors; above, the bell-shaped lamps.",
      "h.fpoltrone": "The chairs and the counter",
      "v.occhio": "The window",
      "v.titolo2": "You’ll know us by the suitcases",
      "v.intro": "Leather suitcases, stacked one on top of the other behind the glass at Via Lomellina 24, the top one open. If you see them, you’re here.",
      "v.intro2": "Here we have redrawn them: choose what hangs inside.",
      "v.titolo": "The suitcases in the window",
      "v.desc": "Our shop window seen from the street, with its black frame and stone sill. Four leather suitcases drop one on top of the other, from the largest to the smallest. The two chrome latches of the top one snap open, the lid lifts and inside, hanging from a hook, a pair of scissors swings. In the second mode a shaving brush hangs from the hook, and a steel bowl sits in the suitcase.",
      "v.d0": "Hair: the suitcases stack up, the top one opens and the scissors swing inside.",
      "v.d1": "Beard: in the open suitcase, the shaving brush hangs from the hook next to the steel bowl of lather.",
      "v.modi": "What is in the suitcase",
      "v.b0": "Hair",
      "v.b1": "Beard",
      "s.occhio": "In the chair",
      "s.titolo": "What we do",
      "s.c1": "Haircut",
      "s.c1t": "Scissor cut or fade, short or long. First a few words to find the right cut for you, then we start.",
      "s.c2": "Mullet &amp; curly perm",
      "s.c2t": "The mullet is at home here: straight, wavy, or with the curls of a perm.",
      "s.c3": "Beard",
      "s.c3t": "Trimmed and shaped, or shaved with a brush and lather.",
      "s.c4": "Little man",
      "s.c4t": "Haircuts for the little ones, with all the patience it takes.",
      "s.c5": "The groom",
      "s.c5t": "The haircut for the wedding day: seeing a groom through it is, for us, the greatest honour of the trade.",
      "s.c6": "Strengthening treatment",
      "s.c6t": "New in 2026: a mask and a tonic to strengthen the hair from the root.",
      "s.prodotti": "In the shop you will also find products for home: sea salt spray, beard and hair cream, curl definer.",
      "s.appuntamento": "We work by appointment: call us and we will find the day.",
      "f.occhio": "On the wall",
      "f.titolo": "The cuts and the room",
      "a.t1": "A mullet with permed curls, seen from the side: curls on top, a fade above the ear, long at the nape.",
      "f.t1": "Mullet &amp; curly perm",
      "a.t2": "A wavy mullet seen from the side: a fade at the temple, long hair at the nape.",
      "f.t2": "Mullet",
      "a.t3": "Straight hair swept back, seen from the side, short above the ear.",
      "f.t3": "Minimal",
      "a.sala": "The room: the cowhide over the mezzanine railing, the gear clock on the white wall, the wash basin, the chairs.",
      "f.sala": "The room, under the mezzanine",
      "a.ingresso": "The front desk in oxidised metal with a slit of light; behind it, the small frames and the gear clock.",
      "f.ingresso": "The front desk",
      "a.attesa": "The waiting corner: two orange velvet poufs on wire baskets, a plant, the desk reflected in the mirror.",
      "f.attesa": "The waiting corner",
      "f.nota": "These cuts are ours, from our Instagram: you will find the others there too.",
      "r.occhio": "Reviews",
      "r.titolo": "People who sat here",
      "r.g22": "Google, 2022",
      "r.g23": "Google, 2023",
      "r.g24": "Google, 2024",
      "r.g25": "Google, 2025",
      "r.g26": "Google, 2026",
      "r.nota": "From the reviews on Google, as they were written, in Italian; […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "o.occhio": "Hours and directions",
      "o.titolo": "Tuesday to Saturday",
      "o.orari": "Hours",
      "o.cap": "Opening hours",
      "o.nota": "Hours from our Google listing (October 2026). We work by appointment.",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "w.dove": "Where",
      "w.dovev": "Via Lomellina 24, 20133 Milan",
      "w.tram": "Tram",
      "w.tramv": "the 12 and the 27 on Viale Corsica, Via Lomellina stop, about 200 metres away",
      "w.bus": "Bus",
      "w.busv": "the 45 and the 175 at Viale Corsica – Via Negroli, about 200 metres away; trolleybus 93 at Via Lomellina – Via Sismondi",
      "w.metro": "Metro",
      "w.metrov": "M4 Stazione Forlanini or Argonne, less than 500 metres away",
      "w.tel": "Phone",
      "w.mappa": "Map: ALAIN Barber Studio, Via Lomellina 24, Milan",
      "q.occhio": "Questions",
      "q.titolo": "Before you call",
      "q.d1": "Do I need an appointment?",
      "q.r1": "Yes, we work by appointment: call 334 381 5911 and we will find the day and the time together.",
      "q.d2": "Do you cut children’s hair too?",
      "q.r2": "Yes, little ones are welcome: we take all the time they need.",
      "q.d3": "Do you do beards as well?",
      "q.r3": "Yes: we trim and shape it, or shave it with a brush and lather.",
      "q.d4": "When are you open?",
      "q.r4": "Tuesday to Friday from 10am to 7:30pm, Saturday from 9am to 6pm. We are closed on Sunday and Monday.",
      "q.d5": "How do I get there?",
      "q.r5": "We are at Via Lomellina 24, a few steps from Viale Corsica: trams 12 and 27, buses 45 and 175, trolleybus 93; the M4 at Stazione Forlanini or Argonne, less than 500 metres away.",
      "f2.dove": "Via Lomellina 24, 20133 Milan",
      "f2.orario": "Tuesday–Friday 10am–7:30pm · Saturday 9am–6pm · closed Sunday and Monday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026); photos from our Google listing and our Instagram (a few labels blurred). We redrew the sign and the suitcases.",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ ALAIN BARBER STUDIO — barbiere, Via Lomellina 24 ══════════
     la FIRMA — «le valigie in vetrina»: dietro il vetro le quattro valigie di cuoio cadono una sull'altra, le chiusure di quella in
     cima scattano, il coperchio si alza, l'attrezzo scende sul gancio e dondola, un riflesso passa sul vetro. Lo stato è M (Capelli /
     Barba), T (0…1) e V (0 al suo posto; fino a 1 la pila sale di poco e si spegne; da −1 a 0 arriva la prossima vetrina, vuota).
     Senza JS e alla fine: Capelli, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la vetrina vuota. Reduced-motion: tutto
     subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,600],"via":-12,"modi":[{"nome":"Capelli","cade":[[0.03,0.08],[0.15,0.08],[0.27,0.08],[0.39,0.08]],"rimb":[[0.11,0.04],[0.23,0.04],[0.35,0.04],[0.47,0.04]],"alt":[536,444,360,284],"salto":9,"fibbie":[[0.54,0.07],[0.57,0.07]],"giri":[-150,150],"perni":[[228,207],[352,207]],"apre":[0.66,0.14],"cerniera":198,"scende":[0.81,0.05],"cala":30,"dondola":[0.81,0.19],"ampiezza":20,"onde":2.5,"gancio":[290,96],"riflesso":[0.86,0.14],"corsa":[-240,760],"luce":0.42},{"nome":"Barba","cade":[[0.03,0.08],[0.15,0.08],[0.27,0.08],[0.39,0.08]],"rimb":[[0.11,0.04],[0.23,0.04],[0.35,0.04],[0.47,0.04]],"alt":[536,444,360,284],"salto":9,"fibbie":[[0.54,0.07],[0.57,0.07]],"giri":[-150,150],"perni":[[228,207],[352,207]],"apre":[0.66,0.14],"cerniera":198,"scende":[0.81,0.05],"cala":30,"dondola":[0.81,0.19],"ampiezza":20,"onde":2.5,"gancio":[290,96],"riflesso":[0.86,0.14],"corsa":[-240,760],"luce":0.42}],"tempi":{"inizio":300,"valigie":6000,"servi":420,"arriva":300,"valigieV":4800}};
  /* le valigie a (M, T, V) — una sola fonte: la usano _abs_firma.mjs (l'HTML allo stato finale), main.js (via main.cjs) e la prova
     (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS: vetrina vuota).
     Dietro il vetro le quattro valigie di cuoio cadono una sull'altra, dalla più grande alla più piccola, con un piccolo rimbalzo;
     le due chiusure cromate di quella in cima scattano; il coperchio si alza (il bordo davanti si accorcia, l'interno sale); dentro
     scende e dondola l'attrezzo appeso; un riflesso passa sul vetro. Col V la pila sale di poco e si spegne; la prossima vetrina
     arriva vuota. */
  function creaValigie(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m, k) { return q('.' + cl + '[data-m="' + m + '"]' + (k === undefined ? '' : '[data-k="' + k + '"]')); };
    var pezzi = D.modi.map(function (M, m) {
      return {
        valigie: M.cade.map(function (_, k) { return uno('vl-valigia', m, k); }),
        fibbie: M.fibbie.map(function (_, k) { return uno('vl-fibbia', m, k); }),
        coperchio: uno('vl-coperchio', m), bordo: uno('vl-bordo', m), oggetto: uno('vl-oggetto', m), riflesso: uno('vl-riflesso', m)
      };
    });
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k;
      /* le valigie: cadono accelerando (u²) dall'alto della vetrina, poi un piccolo rimbalzo che si spegne */
      for (k = 0; k < P.valigie.length; k++) {
        var u = fase(t, M.cade[k]), w = fase(t, M.rimb[k]);
        var y = -M.alt[k] * (1 - u * u) - M.salto * Math.sin(Math.PI * w) * (1 - w);
        P.valigie[k].setAttribute('transform', 'translate(0 ' + r1(y) + ')');
      }
      /* le chiusure di quella in cima scattano: ruotano attorno al loro perno */
      for (k = 0; k < P.fibbie.length; k++) {
        var a = M.giri[k] * dolce(fase(t, M.fibbie[k]));
        P.fibbie[k].setAttribute('transform', 'rotate(' + r1(a) + ' ' + M.perni[k][0] + ' ' + M.perni[k][1] + ')');
      }
      /* il coperchio gira all'indietro di 90°: da davanti l'interno sale col seno, il bordo si accorcia col coseno */
      var ang = Math.PI / 2 * dolce(fase(t, M.apre));
      P.coperchio.setAttribute('transform', 'translate(0 ' + M.cerniera + ') scale(1 ' + r3(Math.sin(ang)) + ')');
      P.bordo.setAttribute('transform', 'translate(0 ' + M.cerniera + ') scale(1 ' + r3(Math.cos(ang)) + ')');
      /* l'attrezzo appeso: scende sul gancio e dondola, sempre meno */
      var e = dolce(fase(t, M.scende)), d = fase(t, M.dondola);
      var giro = M.ampiezza * Math.sin(2 * Math.PI * M.onde * d) * (1 - d) * (1 - d);
      P.oggetto.setAttribute('transform', 'rotate(' + r1(giro) + ' ' + M.gancio[0] + ' ' + M.gancio[1] + ') translate(0 ' + r1(-M.cala * (1 - e)) + ')');
      P.oggetto.setAttribute('opacity', r3(e));
      /* il riflesso passa sul vetro e se ne va */
      var f = fase(t, M.riflesso);
      P.riflesso.setAttribute('transform', 'translate(' + r1(M.corsa[0] + (M.corsa[1] - M.corsa[0]) * f) + ' 0)');
      P.riflesso.setAttribute('opacity', r3(M.luce * Math.sin(Math.PI * f)));
      /* col V la pila sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.coperchio && P.bordo && P.oggetto && P.riflesso && P.valigie.every(Boolean) && P.fibbie.every(Boolean); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('valigie-firma'), svgF = prendi('valigieSvg'), leggiF = prendi('valigieLeggi');
  var VALIGIE = svgF ? creaValigie(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.vetrina__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.vetrina__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    VALIGIE.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) VALIGIE.disegna(k, 1, 0); });
    VALIGIE.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la vetrina vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la vetrina vuota */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.valigie, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.valigie });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la pila sale di poco e si spegne, la vetrina resta vuota e la pila si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.valigieV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && VALIGIE && VALIGIE.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaValigie); } catch (e) {}
    window.__valigie = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__valigie.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la vetrina vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__valigie.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
