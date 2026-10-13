(function () {
  'use strict';
  var WA = '41786550331';
  var EMAIL = 'anita_nikito@live.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Google reviews (copied from the Google Business profile, Oct 2026) */
  var REVIEWS = [
    { n: 'Nolwenn Jordan', d: 'octobre 2026', s: 5, soin: 'Drainage lymphatique', t: 'Une très belle expérience ! La séance de drainage lymphatique m’a fait beaucoup de bien. Ana est douce, bienveillante et à l’écoute. Elle prend le temps de répondre aux questions et de donner de précieux conseils. Je recommande vivement ! 🥰' },
    { n: 'Marisa Alexandra', d: 'janvier 2026', s: 5, soin: 'Cervicales', t: 'Je suis venue, sous recommandation de ma médecin traitant, pour des problèmes de cervicales et, pour la première fois, j’ai réellement ressenti un massage qui me fait du bien, sans déclencher de migraines et avec un vrai soulagement durable. Ana est d’un grand professionnalisme, à l’écoute, bienveillante et très sympathique.' },
    { n: 'Florence Berger', d: 'février 2026', s: 5, soin: 'Drainage lymphatique', guide: true, t: 'Je suis venue pour un drainage lymphatique et suis ressortie avec les jambes légères comme une plume. Ana est très professionnelle, accueillante et chaleureuse. Elle a des doigts de fée, je la recommande vivement.' },
    { n: 'Guillermo Barco', d: 'février 2026', s: 5, soin: 'Ventouses', t: 'Le traitement par ventouses m’a beaucoup aidé à soulager mes douleurs dorsales.' },
    { n: 'Diego Aron Collazos Ruiz', d: 'août 2026', s: 5, t: 'Excellent professional, very kind and attentive. I felt very well taken care of and was very satisfied with the results. Highly recommended.' },
    { n: 'Veronica Rodriguez Morante', d: 'février 2026', s: 5, t: 'Ana elle est simplement géniale, ses massages sont super efficaces, en plus elle transmet une énergie très positive. Je la recommande à 100 %.' },
    { n: 'Daniela Rodrigues Picoto', d: '2025', s: 5, t: 'Ana est incroyable ! Très douce, à l’écoute et d’un grand professionnalisme. Je la recommande les yeux fermés.' },
    { n: 'Julietta', d: 'mars 2026', s: 5, t: 'Un moment relaxant, reposant et rempli de bienveillance et de douceur 🥰 Je recommande à 10000 % !!!! Muchas gracias Ana !' },
    { n: 'Rita Fernandes', d: '2025', s: 5, t: 'Magnifique !!! Ana est super professionnelle et ses massages sont super, ça a beaucoup soulagé mes douleurs.' },
    { n: 'Nicolina Pollicino', d: 'mars 2026', s: 5, t: 'Le massage, sublime et très efficace. En plus elle est très gentille, professionnelle et très aimable.' },
    { n: 'Micaela Pinto', d: 'février 2026', s: 4, soin: 'Mal de dos', t: 'Je suis venue parce que j’avais mal au dos, je suis repartie en me sentant mieux. Je la recommande, elle fait bien son travail.' },
    { n: 'Irène Maceiras', d: 'février 2026', s: 5, t: 'Ana, c’est une personne très compétente et agréable. C’est une excellente thérapeute.' }
  ];
  var AV = ['#B4572E', '#6E3A22', '#7C8B5E', '#A0674B', '#5E6F7A', '#C07A3C'];

  /* header shadow + dock/fab after hero */
  var top = document.querySelector('.top');
  var dock = document.querySelector('.dock');
  var fab = document.querySelector('.fab');
  var hero = document.querySelector('.hero');
  var contact = document.getElementById('contact');
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 8);
    var past = y > (hero ? hero.offsetHeight * 0.55 : 400);
    var r = contact.getBoundingClientRect();
    var inContact = r.top < window.innerHeight * 0.6 && r.bottom > 0;
    dock.classList.toggle('is-on', past && !inContact);
    fab.classList.toggle('is-on', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });

  /* reveals: opacity/translate only, never clip-path */
  var rv = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el, i) {
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
      io.observe(el);
    });
    // failsafe: anything already scrolled past gets shown
    window.addEventListener('scroll', function fs() {
      rv.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); });
    }, { passive: true });
  }

  /* soin finder */
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var cardsWrap = document.querySelector('.cards');
  var cards = [].slice.call(document.querySelectorAll('.card'));
  var out = document.querySelector('.finder__out');
  var NAMES = { drainage: 'le drainage lymphatique', abhyanga: 'le massage ayurvédique Abhyanga', reflexologie: 'la réflexologie plantaire', ventouses: 'les ventouses', reiki: 'le Reiki', classique: 'le massage classique' };
  chips.forEach(function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () {
      var on = c.getAttribute('aria-pressed') !== 'true';
      chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      cards.forEach(function (k) { k.classList.remove('is-match'); });
      if (!on) { cardsWrap.classList.remove('is-filtering'); out.textContent = ''; return; }
      c.setAttribute('aria-pressed', 'true');
      var m = c.getAttribute('data-match').split(' ');
      cardsWrap.classList.add('is-filtering');
      cards.forEach(function (k) { if (m.indexOf(k.getAttribute('data-soin')) > -1) k.classList.add('is-match'); });
      var txt = m.map(function (x) { return NAMES[x]; }).join(' ou ');
      var msg = encodeURIComponent('Bonjour Ana, je viens pour : ' + c.textContent.trim().toLowerCase() + '. Quel soin me conseillez-vous ?');
      out.innerHTML = 'Pistes à envisager : <strong>' + txt + '</strong>. Pas sûr·e ? <a href="https://wa.me/' + WA + '?text=' + msg + '" target="_blank" rel="noopener">Demandez conseil à Ana</a>.';
    });
  });

  /* "Réserver ce soin" prefills the form */
  var form = document.getElementById('form');
  [].forEach.call(document.querySelectorAll('[data-pick]'), function (a) {
    a.addEventListener('click', function () {
      var sel = form.elements.soin, v = a.getAttribute('data-pick');
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) sel.selectedIndex = i;
    });
  });

  /* reviews rail */
  var track = document.querySelector('[data-rail-track]');
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function card(r, i, clone) {
    var st = '';
    for (var k = 0; k < 5; k++) st += k < r.s ? '★' : '<span class="off">★</span>';
    return '<article class="rev"' + (clone ? ' aria-hidden="true"' : '') + '>' +
      '<div class="rev__head"><span class="rev__av" style="background:' + AV[i % AV.length] + '">' + esc(r.n.charAt(0)) + '</span>' +
      '<span class="rev__who"><strong>' + esc(r.n) + '</strong><span>' + (r.guide ? 'Local Guide · ' : '') + esc(r.d) + '</span></span>' +
      '<svg class="rev__g" viewBox="0 0 48 48" aria-hidden="true"><use href="#i-google"/></svg></div>' +
      '<div class="rev__stars" role="img" aria-label="' + r.s + ' étoiles sur 5">' + st + '</div>' +
      '<p>' + esc(r.t) + '</p>' + (r.soin ? '<span class="rev__soin">' + esc(r.soin) + '</span>' : '') + '</article>';
  }
  var html = REVIEWS.map(function (r, i) { return card(r, i, false); }).join('');
  var clones = REVIEWS.map(function (r, i) { return card(r, i, true); }).join('');
  track.insertAdjacentHTML('beforeend', html + clones);

  var paused = false, hover = false, drag = null, last = 0, pos = 0, resumeAt = 0;
  var speed = 0.035; // px per ms
  function half() { return track.scrollWidth / 2; }
  function wrap() {
    var h = half();
    if (track.scrollLeft >= h) track.scrollLeft -= h;
    else if (track.scrollLeft <= 0) track.scrollLeft += h;
  }
  function tick(t) {
    var dt = last ? Math.min(t - last, 64) : 16;
    last = t;
    if (!reduce && !hover && !drag && !paused && t > resumeAt) {
      pos += speed * dt;
      if (pos >= 1) { var whole = Math.floor(pos); track.scrollLeft += whole; pos -= whole; wrap(); }
    }
    requestAnimationFrame(tick);
  }
  // start in the first set, not at the edge, so backwards scrolling works
  requestAnimationFrame(function () { track.scrollLeft = 1; requestAnimationFrame(tick); });
  track.addEventListener('mouseenter', function () { hover = true; });
  track.addEventListener('mouseleave', function () { hover = false; });
  track.addEventListener('focusin', function () { paused = true; });
  track.addEventListener('focusout', function () { paused = false; });
  track.addEventListener('touchstart', function () { resumeAt = performance.now() + 4000; }, { passive: true });
  track.addEventListener('scroll', function () { if (drag || performance.now() < resumeAt) wrap(); }, { passive: true });
  track.addEventListener('wheel', function () { resumeAt = performance.now() + 3000; }, { passive: true });
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, s: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; track.classList.add('is-drag'); }
    track.scrollLeft = drag.s - dx; wrap();
  });
  function endDrag() { if (!drag) return; drag = null; track.classList.remove('is-drag'); resumeAt = performance.now() + 2500; }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); }
  });
  function step(dir) {
    var c = track.querySelector('.rev');
    var w = c ? c.getBoundingClientRect().width + 18 : 320;
    resumeAt = performance.now() + 4000;
    if (dir < 0 && track.scrollLeft < w) track.scrollLeft += half();
    track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
  }
  [].forEach.call(document.querySelectorAll('.rbtn'), function (b) {
    b.addEventListener('click', function () { step(+b.getAttribute('data-dir')); });
  });

  /* booking form -> WhatsApp or e-mail, message prepared */
  var err = form.querySelector('.form__err');
  function compose() {
    var f = form.elements;
    var nom = f.nom.value.trim(), tel = f.tel.value.trim();
    [f.nom, f.tel].forEach(function (x) { x.classList.toggle('is-bad', !x.value.trim()); });
    if (!nom || !tel) {
      err.hidden = false;
      err.textContent = 'Merci d’indiquer votre nom et votre numéro de téléphone.';
      (nom ? f.tel : f.nom).focus();
      return null;
    }
    err.hidden = true;
    var jours = [].filter.call(form.querySelectorAll('input[name=jour]:checked'), function () { return true; }).map(function (x) { return x.value; });
    var mom = form.querySelector('input[name=moment]:checked');
    var l = ['Bonjour Ana,', '', 'Je souhaite prendre rendez-vous.', '',
      'Soin : ' + f.soin.value, 'Durée : ' + f.duree.value];
    if (jours.length) l.push('Jours possibles : ' + jours.join(', '));
    if (mom) l.push('De préférence ' + mom.value);
    if (f.msg.value.trim()) l.push('', f.msg.value.trim());
    l.push('', nom + ' · ' + tel);
    return l.join('\n');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = compose(); if (!m) return;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
  });
  form.querySelector('[data-mail]').addEventListener('click', function () {
    var m = compose(); if (!m) return;
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Demande de rendez-vous') + '&body=' + encodeURIComponent(m);
  });

  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
