/* Bar Scene Socials — v3 chrome + drawn objects.
   Header, footer, the brand mark, the ticket, and the hand-drawn marks
   all live here so they stay identical across the nine pages. */

(function () {
  'use strict';

  var NAV = [
    { href: 'tickets.html',         label: 'Tickets',              key: 'tickets' },
    { href: 'haunted-bar-hop.html', label: 'Haunted Bar Hop',      key: 'halloween' },
    { href: 'christmas.html',       label: '12 Bars of Christmas', key: 'christmas', soon: true },
    { href: 'shamrock.html',        label: 'Shamrock Shuffle',     key: 'shamrock',  soon: true }
  ];
  var MORE = [
    { href: 'happening-now.html', label: 'Happening Now', key: 'happening' },
    { href: 'featured-bars.html', label: 'Featured Bars', key: 'bars' },
    { href: 'about.html',         label: 'About Us',      key: 'about' },
    { href: 'contact.html',       label: 'Contact',       key: 'contact' }
  ];

  var page = document.body.getAttribute('data-page') || '';
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ---------------------------------------------------------
     BRAND MARK — placeholder, and deliberately not a letterform.
     Three hand-drawn waves: a crowd moving as one, a soundwave,
     the zigzag from the owners' own mood board. Reads in any
     season, not literal about beer or shamrocks.
     --------------------------------------------------------- */
  function mark(size, color) {
    return '<svg viewBox="0 0 48 48" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<g fill="none" stroke="' + color + '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 16.5 L12.3 9.2 L20 16.8 L28.4 9 L36 16.4 L44 9.4"/>' +
      '<path d="M4.3 26.8 L12 19.4 L20.4 27 L28 19.2 L36.3 26.6 L44 19.2"/>' +
      '<path d="M4 37 L12.4 29.6 L20 37.2 L28.2 29.4 L36 36.8 L43.8 29.6"/>' +
      '</g></svg>';
  }

  /* ---------------------------------------------------------
     THE TICKET — Admit One silhouette: side notches, perforated
     stub, halftone on the stub, vertical ADMIT ONE.
     --------------------------------------------------------- */
  var TK = 0;
  function ticket(el) {
    var W = 352, H = 88, r = 11, stub = 256;
    var sold  = el.getAttribute('data-state') === 'sold';
    var main  = el.getAttribute('data-main') || 'Get tickets';
    var sub   = el.getAttribute('data-sub')  || '';
    var fill  = sold ? '#969182' : (el.getAttribute('data-fill') || '#C0512F');
    var id    = 'tk' + (++TK);

    var d = 'M0 0 H' + W +
            ' V' + (H/2 - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + W + ' ' + (H/2 + r) +
            ' V' + H + ' H0' +
            ' V' + (H/2 + r) + ' A' + r + ' ' + r + ' 0 0 0 0 ' + (H/2 - r) + ' Z';

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(main) + (sub ? ' — ' + esc(sub) : '') + '">' +
        '<defs>' +
          '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
          '<pattern id="' + id + 'h" width="7" height="7" patternUnits="userSpaceOnUse">' +
            '<circle cx="3.5" cy="3.5" r="1.5" fill="#FEFEFB" opacity=".26"/></pattern>' +
        '</defs>' +
        '<g clip-path="url(#' + id + ')">' +
          '<path d="' + d + '" fill="' + fill + '"/>' +
          '<rect x="' + stub + '" y="0" width="' + (W - stub) + '" height="' + H + '" fill="url(#' + id + 'h)"/>' +
        '</g>' +
        '<line x1="' + stub + '" y1="7" x2="' + stub + '" y2="' + (H - 7) + '" ' +
          'stroke="#FEFEFB" stroke-opacity=".62" stroke-width="1.6" stroke-dasharray="4 5"/>' +
        '<text x="24" y="' + (sub ? 44 : 52) + '" fill="#FEFEFB" font-family="Anton, sans-serif" ' +
          'font-size="30" letter-spacing=".5" style="text-transform:uppercase">' +
          esc(main).toUpperCase() + '</text>' +
        (sub ? '<text x="25" y="65" fill="#FEFEFB" fill-opacity=".76" font-family="Space Grotesk, sans-serif" ' +
          'font-size="10.5" font-weight="500" letter-spacing="2.1">' + esc(sub).toUpperCase() + '</text>' : '') +
        '<text transform="translate(' + (stub + 48) + ' ' + (H/2) + ') rotate(-90)" text-anchor="middle" ' +
          'fill="#FEFEFB" fill-opacity=".9" font-family="Space Grotesk, sans-serif" font-size="10.5" ' +
          'font-weight="700" letter-spacing="3.4">ADMIT ONE</text>' +
      '</svg>';
  }

  /* hand-drawn marks — 2 shapes reused everywhere, never regenerated
     per instance, so the "drawn by a person" feel stays consistent */
  var RING = '<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="' +
    'M170 24C152 8 96 2 54 13 12 24 2 53 15 71 28 89 79 98 123 92 167 86 197 65 190 43 186 29 161 17 139 13"/></svg>';
  var SQUIG = '<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="' +
    'M3 8C28 2 46 11 72 6 98 1 116 10 142 5 165 1 182 8 197 4"/></svg>';
  var CALRING = '<svg class="must" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="' +
    'M84 19C72 7 33 3 15 14 -3 25 2 62 14 76 26 90 71 93 87 80 99 70 97 40 88 26"/></svg>';

  /* ---------------------------------------------------------
     CHROME
     --------------------------------------------------------- */
  function header() {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (page === n.key ? ' class="is-active"' : '') + '>' +
        esc(n.label) + (n.soon ? '<span class="soon">Soon</span>' : '') + '</a>';
    }).join('');
    var moreLinks = MORE.map(function (n) {
      return '<a href="' + n.href + '"' + (page === n.key ? ' class="is-active"' : '') + '>' + esc(n.label) + '</a>';
    }).join('');
    var drawerLinks = [{ href:'index.html', label:'Home', key:'home' }]
      .concat(NAV, MORE).map(function (n) {
        return '<a href="' + n.href + '">' + esc(n.label) +
          (n.soon ? '<span class="soon">Soon</span>' : '') + '</a>';
      }).join('');

    return '' +
    '<header class="hdr"><div class="hdr__in">' +
      '<a class="lockup" href="index.html" aria-label="Bar Scene Socials — home">' +
        mark(38, '#C0512F') +
        '<span class="lockup__wm"><b>Bar Scene</b><i>Socials</i></span>' +
      '</a>' +
      '<nav class="nav">' + links +
        '<div class="more"><button type="button" data-more aria-expanded="false">More</button>' +
        '<div class="more__menu">' + moreLinks + '</div></div>' +
      '</nav>' +
      '<button class="burger" type="button" data-burger>Menu</button>' +
      '<div class="hdr__cta" style="flex:none">' +
        '<a class="ticket ticket--sm" href="tickets.html" data-ticket data-main="Tickets" ' +
          'data-sub="Haunted Bar Hop"></a>' +
      '</div>' +
    '</div></header>' +
    '<div class="drawer" data-drawer><div class="row row--between" style="margin-bottom:26px">' +
      '<span class="kicker">Menu</span>' +
      '<button class="btn" type="button" data-close>Close</button></div>' +
      drawerLinks + '</div>';
  }

  function footer() {
    return '' +
    '<footer class="ftr grain grain--dark"><div class="shell" style="padding-top:clamp(44px,5vw,76px)">' +
      '<div class="row row--between" style="align-items:flex-end; gap:26px; margin-bottom:44px">' +
        '<div>' +
          '<p class="kicker kicker--paper">Next one out the door</p>' +
          '<p class="d3" style="margin-top:12px">Haunted<br>Bar Hop</p>' +
        '</div>' +
        '<a class="ticket ticket--flat" href="tickets.html" data-ticket data-main="Get tickets" data-sub="31 Oct 2026 · from $11.95"></a>' +
      '</div>' +
      '<div class="ftr__grid">' +
        '<div><p class="ftr__h">When</p><p class="small">Saturday 31 October 2026<br>3pm until close</p></div>' +
        '<div><p class="ftr__h">Where</p><p class="small">Brady Street<br>Milwaukee, Wisconsin</p></div>' +
        '<div><p class="ftr__h">Who</p><p class="small">21 and over<br>Bring ID, they will check</p></div>' +
        '<div><p class="ftr__h">Find us</p><p class="small">' +
          '<a href="#">@barscenesocials</a> — Instagram<br>' +
          '<a href="#">@barscenesocials</a> — TikTok<br>' +
          '<a href="#">hello@barscenesocials.com</a></p></div>' +
      '</div>' +
      '<div style="border-top:1px solid rgba(254,254,251,.18); padding:30px 0 8px">' +
        '<div class="cols c-wide-right" style="align-items:center">' +
          '<div><p class="h4" style="margin-bottom:6px">Know before everyone else</p>' +
          '<p class="small" style="color:rgba(254,254,251,.6)">Two emails a year, both of them a date.</p></div>' +
          '<form class="capture" onsubmit="return false">' +
            '<input class="field" type="email" placeholder="you@example.com" aria-label="Email address">' +
            '<button class="btn btn--rust" type="submit">Notify me</button>' +
          '</form>' +
        '</div>' +
      '</div>' +
      '<div class="ftr__fine">' +
        '<span>Rain or shine · Drink water, tip your bartenders, get home safe</span>' +
        '<span>Prototype — nothing here takes payment</span>' +
      '</div>' +
    '</div></footer>';
  }

  function boot() {
    var h = document.getElementById('chrome-header');
    var f = document.getElementById('chrome-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();

    [].forEach.call(document.querySelectorAll('[data-ticket]'), ticket);
    [].forEach.call(document.querySelectorAll('.ring'), function (el) { el.insertAdjacentHTML('afterbegin', RING); });
    [].forEach.call(document.querySelectorAll('.squig'), function (el) { el.insertAdjacentHTML('beforeend', SQUIG); });
    [].forEach.call(document.querySelectorAll('td.must-ring'), function (el) { el.insertAdjacentHTML('afterbegin', CALRING); });

    var more = document.querySelector('.more');
    if (more) {
      var btn = more.querySelector('[data-more]');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = more.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', function () {
        more.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false');
      });
    }

    var drawer = document.querySelector('[data-drawer]');
    var burger = document.querySelector('[data-burger]');
    if (drawer && burger) {
      burger.addEventListener('click', function () { drawer.classList.add('is-open'); });
      drawer.querySelector('[data-close]').addEventListener('click', function () { drawer.classList.remove('is-open'); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') drawer.classList.remove('is-open');
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
