SOURCE EXTRACTION REPORT
========================
URL: https://books.streamfiles.eu.org/
Date: 2026-10-26 07:55:33

Folders:
  html/    = 1  (page as browser sees — after PHP runs this is HTML)
  css/     = 5
  js/      = 1
  php/     = 0  (ONLY real <?php source if server exposed it)
  python/  = 0
  images/  = 5
  other/   = 0

WHY php/ may be empty:
  Live servers EXECUTE .php and send HTML to the browser.
  Original index.php source is NOT public. That is normal security.
  php/ fills only if host leaks source (bak/old/misconfig).

POWERED BY OLD-HACKER

---- UPDATE NOTES ----
index.html                  -> full-screen iframe shell loading https://books.streamfiles.eu.org/ + 2 popups (community, install app)
css/codexstudys-popup.css   -> popup styles (black/green)
js/codexstudys-popup.js     -> popup flow (once per session, optional 24h snooze) + PWA install + service worker registration
manifest.json, service-worker.js, images/icon-192.png, images/icon-512.png, images/apple-touch-icon.png (new PW BOOKS logo) -> make the page an installable web app
vercel.json                 -> minimal headers
html/index.html             -> UNCHANGED original page copy (backup of the previous index.html)
