/* ─────────────────────────────────────────────────────────────
   TEMPORARY PRE-LAUNCH GATE — delete this file on launch day.

   This is a soft gate, NOT security. The check runs in the
   visitor's browser, so anyone who opens devtools can walk past
   it. It exists to keep casual visitors and crawlers off the
   site while the team reviews. For a real gate use Vercel's
   Deployment Protection, which runs before any of this code.

   The password is stored as a SHA-256 hash so it is not sitting
   in plain text in a public repo — that stops it being grepped,
   it does not make the gate secure.

   TO REMOVE (see README, "Pre-launch gate"):
     rm js/gate.js coming-soon.html
     then strip the gate <script> line from every page.
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var KEY = 'bss-preview';

  // sessionStorage can throw in private mode — never let that gate the gate
  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  window.BSSGate = {
    key: KEY,
    hash: '17cf3cd3b4031e802e86af04f65cd732d0c2e450fc284fa77fbe4988d7394717',
    unlocked: unlocked,
    unlock: function () { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} },
    lock:   function () { try { sessionStorage.removeItem(KEY); } catch (e) {} }
  };

  // The gate page itself never redirects, or you would loop forever.
  if (document.documentElement.hasAttribute('data-gate-page')) return;

  if (!unlocked()) {
    // replace() so Back does not bounce the visitor into the locked page
    location.replace('coming-soon.html');
  }
})();
