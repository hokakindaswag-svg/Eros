/* ============================================================
   EROS PARIS — JS global
   Aucune dépendance. Tout est progressif : le site fonctionne sans JS.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Utilitaires
     ---------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function money(cents) {
    var fmt = window.EROS && window.EROS.moneyFormat ? window.EROS.moneyFormat : '{{amount_with_comma_separator}} €';
    var value = (cents / 100);
    var out = fmt;
    function withComma(n, dec) {
      var parts = n.toFixed(dec).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    }
    function withPeriod(n, dec) {
      var parts = n.toFixed(dec).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    out = out.replace('{{amount_with_comma_separator}}', withComma(value, 2))
             .replace('{{amount_no_decimals_with_comma_separator}}', withComma(value, 0))
             .replace('{{amount_with_period_and_space_separator}}', withComma(value, 2))
             .replace('{{amount_no_decimals}}', withPeriod(value, 0))
             .replace('{{amount}}', withPeriod(value, 2));
    return out.replace(/<[^>]*>/g, '').trim();
  }

  window.ErosMoney = money;

  /* ----------------------------------------------------------
     Header : sticky + masquage au scroll descendant
     ---------------------------------------------------------- */
  (function header() {
    var wrap = $('[data-header]');
    if (!wrap) return;
    var last = 0, ticking = false;
    var threshold = 10;

    function update() {
      var y = window.pageYOffset;
      wrap.classList.toggle('is-stuck', y > threshold);
      var hideAfter = 260;
      if (!document.body.classList.contains('eros--locked')) {
        if (y > last && y > hideAfter) wrap.classList.add('is-hidden');
        else wrap.classList.remove('is-hidden');
      }
      last = y < 0 ? 0 : y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ----------------------------------------------------------
     Drawers (menu, panier, recherche)
     ---------------------------------------------------------- */
  var openDrawer = null;
  var lastFocus = null;

  function drawerOpen(id) {
    var d = document.getElementById(id);
    if (!d) return;
    if (openDrawer && openDrawer !== d) drawerClose(openDrawer);
    lastFocus = document.activeElement;
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.body.classList.add('eros--locked');
    openDrawer = d;
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    var focusable = d.querySelector('[data-drawer-focus]') || d.querySelector('button, a, input');
    if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 240);
  }

  function drawerClose(d) {
    d = d || openDrawer;
    if (!d) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('eros--locked');
    $$('[aria-controls="' + d.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (openDrawer === d) openDrawer = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-drawer-open]');
    if (opener) {
      e.preventDefault();
      drawerOpen(opener.getAttribute('data-drawer-open'));
      return;
    }
    if (e.target.closest('[data-drawer-close]') || e.target.classList.contains('drawer__overlay')) {
      e.preventDefault();
      drawerClose();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openDrawer) drawerClose();
    if (e.key === 'Tab' && openDrawer) {
      var f = $$('a[href], button:not([disabled]), input, select, textarea', openDrawer)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.ErosDrawer = { open: drawerOpen, close: drawerClose };

  /* ----------------------------------------------------------
     Menu mobile : sous-menus
     ---------------------------------------------------------- */
  $$('[data-mnav-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  /* ----------------------------------------------------------
     Accordéons (fiche produit, FAQ)
     ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-acc]');
    if (!btn) return;
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.classList.toggle('is-open', !open);
  });

  /* ----------------------------------------------------------
     Reveal au scroll — rapide, un seul passage
     ---------------------------------------------------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });

    // Nouveaux éléments injectés (recommandations, chargement AJAX)
    window.ErosReveal = function (scope) {
      $$('.reveal', scope || document).forEach(function (el) {
        if (!el.classList.contains('is-in')) io.observe(el);
      });
    };
  })();

  /* ----------------------------------------------------------
     PANIER — AJAX
     ---------------------------------------------------------- */
  var routes = (window.EROS && window.EROS.routes) || {};
  var cartDrawer = $('#eros-cart-drawer');

  function toast(msg) {
    var el = $('#eros-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'eros-toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  function setCartCount(count) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count < 1;
    });
  }

  function refreshCartDrawer() {
    if (!cartDrawer) return Promise.resolve();
    var url = (routes.cart || '/cart') + '?section_id=cart-drawer';
    return fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-cart-contents]');
        var target = cartDrawer.querySelector('[data-cart-contents]');
        if (fresh && target) target.innerHTML = fresh.innerHTML;
        var count = doc.querySelector('[data-cart-count-source]');
        if (count) setCartCount(parseInt(count.getAttribute('data-cart-count-source'), 10) || 0);
      });
  }

  function refreshCartPage() {
    var page = $('[data-cart-page]');
    if (!page) return Promise.resolve();
    return fetch(window.location.pathname + '?section_id=main-cart')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-cart-page]');
        if (fresh) page.innerHTML = fresh.innerHTML;
      });
  }

  function addToCart(payload, opts) {
    opts = opts || {};
    return fetch(routes.cartAdd || '/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
      .then(function (res) {
        if (!res.ok) {
          toast(res.data.description || res.data.message || 'Indisponible');
          throw new Error(res.data.description || 'add error');
        }
        return refreshCartDrawer().then(function () {
          if (opts.silent) { toast('Ajouté au panier'); }
          else { drawerOpen('eros-cart-drawer'); }
          return res.data;
        });
      });
  }

  function changeLine(line, quantity) {
    var scope = cartDrawer && cartDrawer.classList.contains('is-open')
      ? cartDrawer.querySelector('[data-cart-contents]') : $('[data-cart-page]');
    if (scope) scope.classList.add('cart-loading');
    return fetch(routes.cartChange || '/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        setCartCount(cart.item_count);
        return Promise.all([refreshCartDrawer(), refreshCartPage()]);
      })
      .catch(function () { window.location.reload(); })
      .then(function () { if (scope) scope.classList.remove('cart-loading'); });
  }

  window.ErosCart = { add: addToCart, change: changeLine, refresh: refreshCartDrawer, toast: toast };

  /* Ajout rapide depuis les cartes produit */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-quick-add]');
    if (!form) return;
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var id = form.querySelector('[name="id"]');
    if (!id || !id.value) return;
    if (btn) { btn.setAttribute('aria-disabled', 'true'); }
    addToCart({ items: [{ id: Number(id.value), quantity: 1 }] })
      .catch(function () {})
      .then(function () { if (btn) btn.removeAttribute('aria-disabled'); });
  });

  /* Quantités (drawer + page panier) */
  document.addEventListener('click', function (e) {
    var step = e.target.closest('[data-qty-step]');
    if (step) {
      var input = step.parentElement.querySelector('input');
      if (!input) return;
      var delta = step.getAttribute('data-qty-step') === 'up' ? 1 : -1;
      var min = parseInt(input.getAttribute('min') || '0', 10);
      var next = Math.max(min, (parseInt(input.value, 10) || 0) + delta);
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    var remove = e.target.closest('[data-cart-remove]');
    if (remove) {
      e.preventDefault();
      changeLine(parseInt(remove.getAttribute('data-cart-remove'), 10), 0);
    }
  });

  document.addEventListener('change', function (e) {
    var input = e.target.closest('[data-cart-qty]');
    if (!input) return;
    changeLine(parseInt(input.getAttribute('data-cart-qty'), 10), parseInt(input.value, 10) || 0);
  });

  /* ----------------------------------------------------------
     Recherche : suggestions live (predictive search)
     ---------------------------------------------------------- */
  (function predictive() {
    var input = $('[data-predictive-input]');
    var out = $('[data-predictive-results]');
    if (!input || !out) return;
    var timer, controller;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      clearTimeout(timer);
      if (q.length < 2) { out.innerHTML = ''; return; }
      timer = setTimeout(function () {
        if (controller) controller.abort();
        controller = new AbortController();
        var url = (routes.predictive || '/search/suggest')
          + '?q=' + encodeURIComponent(q)
          + '&resources[type]=product,collection&resources[limit]=6'
          + '&section_id=predictive-search';
        fetch(url, { signal: controller.signal })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var fresh = doc.querySelector('[data-predictive-results]');
            out.innerHTML = fresh ? fresh.innerHTML : '';
            if (window.ErosReveal) window.ErosReveal(out);
          })
          .catch(function () {});
      }, 220);
    });
  })();

  /* ----------------------------------------------------------
     Bandeaux défilants : duplication du contenu pour une boucle propre
     ---------------------------------------------------------- */
  $$('[data-marquee]').forEach(function (track) {
    if (reduced) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  /* ----------------------------------------------------------
     Vidéos : lecture uniquement quand visibles (perf mobile)
     ---------------------------------------------------------- */
  (function lazyVideo() {
    var vids = $$('video[data-autoplay]');
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });
    vids.forEach(function (v) { io.observe(v); });
  })();
})();
