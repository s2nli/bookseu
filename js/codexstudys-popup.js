(function () {
  var KEY = 'codexstudys_popup_seen';
  var overlay = document.getElementById('cx-popup');
  if (!overlay) return;
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (seen) return;

  var lastFocus = null;
  function close() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    overlay.classList.remove('cx-show');
    setTimeout(function () {
      overlay.classList.remove('cx-open');
      overlay.setAttribute('aria-hidden', 'true');
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }, 250);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('cx-open');
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { overlay.classList.add('cx-show'); });
    document.addEventListener('keydown', onKey);
    var later = overlay.querySelector('.cx-later');
    if (later) later.focus({ preventScroll: true });
  }

  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  var later = overlay.querySelector('.cx-later');
  if (later) later.addEventListener('click', close);
  // Joining also counts as seen so it won't reappear this session
  Array.prototype.forEach.call(overlay.querySelectorAll('a.cx-btn'), function (a) {
    a.addEventListener('click', function () { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} });
  });

  setTimeout(open, 1200);
})();
