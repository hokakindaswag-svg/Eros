/* ============================================================
   EROS PARIS — Fiche produit
   Variantes, galerie, zoom, sticky add-to-cart.
   ============================================================ */
(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ----------------------------------------------------------
     Sélecteur de variantes
     ---------------------------------------------------------- */
  $$('[data-product-form]').forEach(function (root) {
    var dataEl = $('[data-variants-json]', root);
    if (!dataEl) return;
    var variants;
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var form = $('form[data-atc-form]', root);
    var idInput = form ? form.querySelector('[name="id"]') : null;
    var priceEl = $('[data-price-target]', root);
    var atc = $('[data-atc]', root);
    var stock = $('[data-stock]', root);
    var sticky = $('[data-sticky-atc]');
    var stickyPrice = sticky ? $('[data-sticky-price]', sticky) : null;
    var updateUrl = root.getAttribute('data-update-url') !== 'false';

    function currentOptions() {
      return $$('[data-option-index]', root).map(function (group) {
        var checked = group.querySelector('input:checked');
        return checked ? checked.value : null;
      });
    }

    function findVariant(opts) {
      return variants.find(function (v) {
        return opts.every(function (o, i) { return !o || v.options[i] === o; });
      });
    }

    function renderPrice(v) {
      if (!priceEl) return;
      var html = '<span class="price__amount">' + window.ErosMoney(v.price) + '</span>';
      if (v.compare_at_price && v.compare_at_price > v.price) {
        html += '<s class="price__compare">' + window.ErosMoney(v.compare_at_price) + '</s>';
      }
      priceEl.innerHTML = html;
      priceEl.classList.toggle('price--sale', !!(v.compare_at_price && v.compare_at_price > v.price));
      if (stickyPrice) stickyPrice.textContent = window.ErosMoney(v.price);
    }

    function renderLabels() {
      $$('[data-option-index]', root).forEach(function (group) {
        var checked = group.querySelector('input:checked');
        var label = $('[data-option-value]', group);
        if (label && checked) label.textContent = checked.value;
      });
    }

    /* Grise les combinaisons indisponibles sur la dernière option choisie */
    function renderAvailability() {
      var opts = currentOptions();
      $$('[data-option-index]', root).forEach(function (group) {
        var idx = parseInt(group.getAttribute('data-option-index'), 10);
        $$('input', group).forEach(function (input) {
          var test = opts.slice();
          test[idx] = input.value;
          var match = variants.find(function (v) {
            return test.every(function (o, i) { return !o || v.options[i] === o; });
          });
          var label = input.nextElementSibling;
          if (!label) return;
          var exists = !!match;
          var available = match && match.available;
          label.classList.toggle('variant__opt--off', !exists || !available);
          input.disabled = !exists;
        });
      });
    }

    function renderMedia(v) {
      if (!v || !v.featured_media_id) return;
      var target = $('[data-media-id="' + v.featured_media_id + '"]');
      if (!target) return;
      var scroller = target.closest('.gallery__scroller');
      if (!scroller) return;
      if (window.matchMedia('(min-width: 990px)').matches) {
        var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
      } else {
        scroller.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      }
    }

    function update(e) {
      renderLabels();
      renderAvailability();
      var v = findVariant(currentOptions());

      if (!v) {
        if (atc) { atc.setAttribute('aria-disabled', 'true'); atc.querySelector('.btn__label').textContent = 'COMBINAISON INDISPONIBLE'; }
        return;
      }
      if (idInput) idInput.value = v.id;
      renderPrice(v);

      if (atc) {
        var label = atc.querySelector('.btn__label');
        if (v.available) { atc.removeAttribute('aria-disabled'); label.textContent = atc.getAttribute('data-label-add'); }
        else { atc.setAttribute('aria-disabled', 'true'); label.textContent = atc.getAttribute('data-label-sold'); }
      }
      if (stock) {
        stock.textContent = v.available ? stock.getAttribute('data-in') : stock.getAttribute('data-out');
        stock.classList.toggle('buy__stock--out', !v.available);
      }
      if (updateUrl && window.history.replaceState && e) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      }
      if (e) renderMedia(v);
    }

    root.addEventListener('change', function (e) {
      if (e.target.matches('[data-option-index] input')) update(e);
    });
    renderAvailability();
    renderLabels();

    /* Soumission AJAX */
    if (form) {
      form.addEventListener('submit', function (e) {
        if (!window.ErosCart) return; // fallback : POST natif
        e.preventDefault();
        if (atc && atc.getAttribute('aria-disabled') === 'true') return;
        var fd = new FormData(form);
        var payload = { items: [{ id: Number(fd.get('id')), quantity: Number(fd.get('quantity') || 1) }] };
        var props = {};
        fd.forEach(function (value, key) {
          var m = key.match(/^properties\[(.+)\]$/);
          if (m && String(value).trim() !== '') props[m[1]] = value;
        });
        if (Object.keys(props).length) payload.items[0].properties = props;
        if (atc) atc.classList.add('is-loading');
        window.ErosCart.add(payload)
          .catch(function () {})
          .then(function () { if (atc) atc.classList.remove('is-loading'); });
      });
    }

    /* Bouton sticky mobile → déclenche le formulaire */
    if (sticky) {
      var sBtn = $('[data-sticky-add]', sticky);
      if (sBtn && form) {
        sBtn.addEventListener('click', function () {
          form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        });
      }
    }
  });

  /* ----------------------------------------------------------
     Galerie : points + compteur (mobile)
     ---------------------------------------------------------- */
  $$('[data-gallery]').forEach(function (gal) {
    var scroller = $('.gallery__scroller', gal);
    var dots = $$('.gallery__dot', gal);
    var counter = $('[data-gallery-counter]', gal);
    if (!scroller) return;
    var items = $$('.gallery__item', scroller);
    if (items.length < 2) return;

    var ticking = false;
    scroller.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var i = Math.round(scroller.scrollLeft / scroller.clientWidth);
        i = Math.max(0, Math.min(items.length - 1, i));
        dots.forEach(function (d, di) { d.classList.toggle('is-active', di === i); });
        if (counter) counter.textContent = (i + 1) + ' / ' + items.length;
        ticking = false;
      });
    }, { passive: true });

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        scroller.scrollTo({ left: i * scroller.clientWidth, behavior: 'smooth' });
      });
    });
  });

  /* ----------------------------------------------------------
     Zoom plein écran
     ---------------------------------------------------------- */
  (function zoom() {
    var lightbox = $('[data-zoom]');
    if (!lightbox) return;
    var img = $('img', lightbox);

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-zoom-src]');
      if (trigger) {
        img.src = trigger.getAttribute('data-zoom-src');
        img.alt = trigger.getAttribute('data-zoom-alt') || '';
        lightbox.classList.add('is-open');
        lightbox.classList.remove('is-zoomed');
        document.body.classList.add('eros--locked');
        return;
      }
      if (e.target.closest('[data-zoom-close]')) {
        lightbox.classList.remove('is-open', 'is-zoomed');
        document.body.classList.remove('eros--locked');
        return;
      }
      if (lightbox.classList.contains('is-open') && e.target === img) {
        lightbox.classList.toggle('is-zoomed');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        lightbox.classList.remove('is-open', 'is-zoomed');
        document.body.classList.remove('eros--locked');
      }
    });
  })();

  /* ----------------------------------------------------------
     Sticky add-to-cart mobile : visible quand le bouton principal sort de l'écran
     ---------------------------------------------------------- */
  (function stickyAtc() {
    var sticky = $('[data-sticky-atc]');
    var anchor = $('[data-atc]');
    if (!sticky || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        sticky.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    io.observe(anchor);
  })();

  /* ----------------------------------------------------------
     Recommandations produits (chargement différé)
     ---------------------------------------------------------- */
  $$('[data-recommendations]').forEach(function (el) {
    var url = el.getAttribute('data-url');
    if (!url) return;
    function load() {
      fetch(url)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var fresh = doc.querySelector('[data-recommendations]');
          if (fresh && fresh.innerHTML.trim()) {
            el.innerHTML = fresh.innerHTML;
            if (window.ErosReveal) window.ErosReveal(el);
          } else {
            el.closest('[data-recommendations-section]').hidden = true;
          }
        })
        .catch(function () {});
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { load(); io.disconnect(); }
      }, { rootMargin: '400px' });
      io.observe(el);
    } else { load(); }
  });
})();
