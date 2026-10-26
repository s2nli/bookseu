(function () {
  var SEEN = 'codexstudys_popups_seen';          // once per browser session
  var SNOOZE = 'codexstudys_popups_snooze';      // optional 24h snooze
  var SNOOZE_MS = 24 * 60 * 60 * 1000;
  var community = document.getElementById('cx-popup');
  var install = document.getElementById('cx-install');
  var deferredPrompt = null;

  function standalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function snoozed() { try { return Number(localStorage.getItem(SNOOZE) || 0) > Date.now(); } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(SEEN, '1'); } catch (e) {} }

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', function () { closeModal(install); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('service-worker.js').catch(function () {}); });
  }

  var openEl = null, lastFocus = null, onClosed = null;
  function onKey(e) { if (e.key === 'Escape' && openEl) closeModal(openEl); }
  function openModal(el, cb) {
    if (!el) return;
    lastFocus = document.activeElement; onClosed = cb || null; openEl = el;
    el.classList.add('cx-open'); el.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { el.classList.add('cx-show'); });
    document.addEventListener('keydown', onKey);
    var f = el.querySelector('[data-first]'); if (f) f.focus({ preventScroll: true });
  }
  function closeModal(el) {
    if (!el || !el.classList.contains('cx-open')) return;
    el.classList.remove('cx-show');
    document.removeEventListener('keydown', onKey);
    setTimeout(function () {
      el.classList.remove('cx-open'); el.setAttribute('aria-hidden', 'true');
      if (openEl === el) openEl = null;
      var cb = onClosed; onClosed = null;
      if (cb) cb(); else if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }, 250);
  }

  function showInstall() {
    if (!install || standalone() || snoozed()) return;
    var btn = document.getElementById('cx-install-btn');
    var steps = document.getElementById('cx-ios-steps');
    var body = document.getElementById('cx-install-body');
    if (isIOS()) {
      if (btn) btn.style.display = 'none';
      if (steps) steps.style.display = 'block';
      if (body) body.textContent = 'Add Codexstudys Books to your home screen for a faster, app-like experience.';
    } else if (!deferredPrompt) {
      return; // browser can't install right now (already installed / unsupported) - skip silently
    }
    openModal(install);
  }

  if (install) {
    var btn = document.getElementById('cx-install-btn');
    if (btn) btn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () { deferredPrompt = null; closeModal(install); });
    });
    install.addEventListener('click', function (e) { if (e.target === install) closeModal(install); });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-cx-close]'), function (b) {
    b.addEventListener('click', function () { closeModal(b.closest('.cx-overlay')); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-cx-snooze]'), function (b) {
    b.addEventListener('click', function () {
      try { localStorage.setItem(SNOOZE, String(Date.now() + SNOOZE_MS)); } catch (e) {}
      closeModal(community); closeModal(install);
    });
  });

  if (!community || snoozed()) return;
  var seen = false; try { seen = sessionStorage.getItem(SEEN) === '1'; } catch (e) {}
  if (seen) return;

  community.addEventListener('click', function (e) { if (e.target === community) closeModal(community); });
  Array.prototype.forEach.call(community.querySelectorAll('a.cx-btn'), function (a) { a.addEventListener('click', markSeen); });

  setTimeout(function () {
    markSeen();
    openModal(community, function () { setTimeout(showInstall, 200); });
  }, 1200);
})();
