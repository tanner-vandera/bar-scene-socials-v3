/* Bar Scene Socials — v3 chrome + drawn objects.
   Header, footer, the brand mark, the ticket, and the hand-drawn marks
   all live here so they stay identical across the nine pages. */

(function () {
  'use strict';

  var NAV = [
    { href: 'haunted-bar-hop.html', label: 'Haunted Bar Hop',      key: 'halloween' },
    { href: 'christmas.html',       label: '12 Bars of Christmas', key: 'christmas', soon: true },
    { href: 'shamrock.html',        label: 'Shamrock Shuffle',     key: 'shamrock',  soon: true }
  ];
  var MORE = [
    { href: 'tickets.html',       label: 'All tickets',   key: 'tickets' },
    { href: 'happening-now.html', label: 'Happening Now', key: 'happening' },
    { href: 'featured-bars.html', label: 'Featured Bars', key: 'bars' },
    { href: 'about.html',         label: 'About Us',      key: 'about' },
    { href: 'contact.html',       label: 'Contact',       key: 'contact' }
  ];

  /* ---------------------------------------------------------
     THE ACTIVE MONTH — one definition, rendered on both the
     homepage and Happening Now so the two can never drift apart.
     Oct 1 2026 falls on a Thursday, hence four leading blanks.
     --------------------------------------------------------- */
  var MONTH = {
    label: 'October 2026',
    lead: 4,
    days: 31,
    events: {
      3:  { name: 'Concert of the year', where: 'The Rave · doors 7pm' },
      17: { name: 'Festival name',       where: 'Third Ward · all day' },
      24: { name: 'Big show',            where: 'Fiserv Forum · Deer District' },
      31: { name: 'Haunted Bar Hop',     where: 'Brady Street · ours',
            ours: true, href: 'haunted-bar-hop.html' }
    }
  };

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
      '<g class="mark-stroke" fill="none" stroke="' + color + '" stroke-width="3.4" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 16.5 L12.3 9.2 L20 16.8 L28.4 9 L36 16.4 L44 9.4"/>' +
      '<path d="M4.3 26.8 L12 19.4 L20.4 27 L28 19.2 L36.3 26.6 L44 19.2"/>' +
      '<path d="M4 37 L12.4 29.6 L20 37.2 L28.2 29.4 L36 36.8 L43.8 29.6"/>' +
      '</g></svg>';
  }

  /* ---------------------------------------------------------
     THE TICKET — built to the Figma component (node 2081-85):
     a real cinema ticket. Scalloped short edges, a stub at each
     end carrying the date, an inset keyline, heavy centred label.

     Two layouts, same language:
       full     2:1, label on two lines  — page CTAs
       compact  3.4:1, label on one line — the header bar, where a
                2:1 ticket cannot fit under 65px
     --------------------------------------------------------- */
  var TK = 0;

  function luminance(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) return 1;
    var n = parseInt(m[1], 16);
    return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255;
  }

  // outline: straight top and bottom, scalloped left and right
  function ticketOutline(W, H, n) {
    var r = H / (2 * n), d = 'M0 0 H' + W, i;
    for (i = 0; i < n; i++) {                       // right edge, downward
      d += ' A' + r + ' ' + r + ' 0 0 1 ' + W + ' ' + ((i + 1) * 2 * r).toFixed(2);
    }
    d += ' H0';
    for (i = n; i > 0; i--) {                       // left edge, upward
      d += ' A' + r + ' ' + r + ' 0 0 1 0 ' + ((i - 1) * 2 * r).toFixed(2);
    }
    return d + ' Z';
  }

  function splitLabel(text, lines) {
    var w = String(text).toUpperCase().trim().split(/\s+/);
    if (lines === 1 || w.length === 1) return [w.join(' ')];
    if (w.length === 2) return w;
    var mid = Math.ceil(w.length / 2);
    return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
  }

  function ticket(el) {
    var compact = el.classList.contains('ticket--compact');
    var sold    = el.getAttribute('data-state') === 'sold';
    var label   = el.getAttribute('data-main') || 'Get tickets';
    var note    = el.getAttribute('data-sub') || '';
    var date    = el.getAttribute('data-date') || '10/31/26';

    var W = 356, H = compact ? 104 : 178, n = compact ? 4 : 7;
    var r  = H / (2 * n);
    var id = 'tk' + (++TK);

    var fill = sold ? '#C9C8C3' : (el.getAttribute('data-fill') || '#FF9152');
    var line = sold ? '#8A8A85' : (el.getAttribute('data-line') || '#B8141C');
    // ticket stock is light by design; if a dark fill is ever set, flip the
    // label rather than printing near-black on near-black
    var ink  = sold ? '#5C5B57' : (luminance(fill) < .42 ? '#FFFFFF' : '#111110');

    var pad  = compact ? 11 : 15;          // keyline inset
    var stub = compact ? 42 : 54;          // stub width inside the keyline
    var rows = splitLabel(label, compact ? 1 : 2);
    var fs   = compact ? 40 : 46;
    var midY = H / 2;

    var text = rows.length === 1
      ? '<text x="' + (W / 2) + '" y="' + (midY + fs * 0.35) + '" text-anchor="middle" ' +
          'fill="' + ink + '" font-family="Anton, sans-serif" font-size="' + fs + '" ' +
          'letter-spacing="1">' + esc(rows[0]) + '</text>'
      : '<text x="' + (W / 2) + '" y="' + (midY - 4) + '" text-anchor="middle" fill="' + ink + '" ' +
          'font-family="Anton, sans-serif" font-size="' + fs + '" letter-spacing="1">' + esc(rows[0]) + '</text>' +
        '<text x="' + (W / 2) + '" y="' + (midY + fs - 2) + '" text-anchor="middle" fill="' + ink + '" ' +
          'font-family="Anton, sans-serif" font-size="' + fs + '" letter-spacing="1">' + esc(rows[1]) + '</text>';

    var stubDate = function (cx) {
      return '<text transform="translate(' + cx + ' ' + midY + ') rotate(-90)" text-anchor="middle" ' +
        'fill="' + line + '" font-family="Anton, sans-serif" font-size="' + (compact ? 15 : 17) + '" ' +
        'letter-spacing="1.1">' + esc(date) + '</text>';
    };

    el.innerHTML =
      '<svg viewBox="' + (-r - 1) + ' -1 ' + (W + 2 * r + 2) + ' ' + (H + 2) + '" ' +
        'role="img" aria-label="' + esc(label) + (note ? ' — ' + esc(note) : '') + '">' +
        '<defs>' +
          '<clipPath id="' + id + 'c"><path d="' + ticketOutline(W, H, n) + '"/></clipPath>' +
          '<filter id="' + id + 'g"><feTurbulence type="fractalNoise" baseFrequency="1.1" ' +
            'numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>' +
        '</defs>' +
        '<path d="' + ticketOutline(W, H, n) + '" fill="' + fill + '"/>' +
        // print grain across the stock
        '<g clip-path="url(#' + id + 'c)"><rect x="' + (-r) + '" y="0" width="' + (W + 2 * r) + '" ' +
          'height="' + H + '" filter="url(#' + id + 'g)" opacity=".2" ' +
          'style="mix-blend-mode:multiply"/></g>' +
        // inset keyline and the two stub rules
        '<rect x="' + pad + '" y="' + pad + '" width="' + (W - pad * 2) + '" height="' + (H - pad * 2) + '" ' +
          'rx="7" fill="none" stroke="' + line + '" stroke-width="2.4"/>' +
        '<line x1="' + (pad + stub) + '" y1="' + pad + '" x2="' + (pad + stub) + '" y2="' + (H - pad) + '" ' +
          'stroke="' + line + '" stroke-width="2.4"/>' +
        '<line x1="' + (W - pad - stub) + '" y1="' + pad + '" x2="' + (W - pad - stub) + '" y2="' + (H - pad) + '" ' +
          'stroke="' + line + '" stroke-width="2.4"/>' +
        stubDate(pad + stub / 2) + stubDate(W - pad - stub / 2) +
        text +
      '</svg>' +
      (note ? '<span class="ticket__note">' + esc(note) + '</span>' : '');
  }

  /* hand-drawn marks — 2 shapes reused everywhere, never regenerated
     per instance, so the "drawn by a person" feel stays consistent */
    'M170 24C152 8 96 2 54 13 12 24 2 53 15 71 28 89 79 98 123 92 167 86 197 65 190 43 186 29 161 17 139 13"/></svg>';
  var SQUIG = '<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="' +
    'M3 8C28 2 46 11 72 6 98 1 116 10 142 5 165 1 182 8 197 4"/></svg>';
  var CALRING = '<svg class="must" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="' +
    'M84 19C72 7 33 3 15 14 -3 25 2 62 14 76 26 90 71 93 87 80 99 70 97 40 88 26"/></svg>';

  function calendar() {
    var head = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      .map(function (d) { return '<th>' + d + '</th>'; }).join('');

    var cells = [];
    for (var i = 0; i < MONTH.lead; i++) cells.push('<td></td>');
    for (var d = 1; d <= MONTH.days; d++) {
      var ev = MONTH.events[d];
      if (!ev) { cells.push('<td><span class="dnum">' + d + '</span></td>'); continue; }
      cells.push(
        '<td class="has must-ring' + (ev.ours ? ' ours' : '') + '">' +
          '<span class="dnum">' + d + '</span>' +
          '<a class="evt' + (ev.ours ? ' evt--ours' : '') + '" href="' + (ev.href || '#') + '">' +
            esc(ev.name) + '<em>' + esc(ev.where) + '</em></a>' +
        '</td>');
    }
    while (cells.length % 7) cells.push('<td></td>');

    var rows = '';
    for (var r = 0; r < cells.length; r += 7) rows += '<tr>' + cells.slice(r, r + 7).join('') + '</tr>';

    return '<table class="cal"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

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
        mark(38, '#FF4D14') +
        '<span class="lockup__wm"><b>Bar Scene</b><i>Socials</i></span>' +
      '</a>' +
      '<nav class="nav">' + links +
        '<div class="more"><button type="button" data-more aria-expanded="false">More</button>' +
        '<div class="more__menu">' + moreLinks + '</div></div>' +
      '</nav>' +
      '<div class="hdr__cta" style="flex:none">' +
        '<a class="ticket ticket--compact" href="tickets.html" data-ticket data-main="Get tickets"></a>' +
      '</div>' +
      '<button class="burger" type="button" data-burger>Menu</button>' +
    '</div></header>' +
    '<div class="drawer" data-drawer><div class="row row--between" style="margin-bottom:26px">' +
      '<span class="kicker">Menu</span>' +
      '<button class="btn" type="button" data-close>Close</button></div>' +
      drawerLinks +
      '<a class="ticket ticket--flat" href="tickets.html" style="margin-top:26px" ' +
        'data-ticket data-main="Get tickets" data-sub="Haunted Bar Hop · 10/31/26"></a>' +
      '</div>';
  }

  function footer() {
    return '' +
    '<footer class="ftr grain grain--dark"><div class="shell" style="padding-top:clamp(44px,5vw,76px)">' +
      '<div class="row row--between" style="align-items:flex-end; gap:26px; margin-bottom:44px">' +
        '<div>' +
          '<p class="kicker kicker--paper">Next one out the door</p>' +
          '<p class="d3" style="margin-top:12px">Haunted<br>Bar Hop</p>' +
        '</div>' +
        '<a class="ticket ticket--flat" href="tickets.html" data-ticket data-main="Get tickets" data-sub="10/31/26 · from $11.95"></a>' +
      '</div>' +
      '<div class="ftr__grid">' +
        '<div><p class="ftr__h">When</p><p class="small">Saturday 10/31/26<br>3pm until close</p></div>' +
        '<div><p class="ftr__h">Where</p><p class="small">Brady Street<br>Milwaukee, Wisconsin</p></div>' +
        '<div><p class="ftr__h">Who</p><p class="small">21 and over<br>Bring ID, they will check</p></div>' +
        '<div><p class="ftr__h">Find us</p><p class="small">' +
          '<a href="#">@barscenesocials</a> — Instagram<br>' +
          '<a href="#">@barscenesocials</a> — TikTok<br>' +
          '<a href="#">hello@barscenesocials.com</a></p></div>' +
      '</div>' +
      '<div style="border-top:1px solid rgba(255,255,255,.18); padding:30px 0 8px">' +
        '<div class="cols c-wide-right" style="align-items:center">' +
          '<div><p class="h4" style="margin-bottom:6px">Know before everyone else</p>' +
          '<p class="small" style="color:rgba(255,255,255,.6)">Two emails a year, both of them a date.</p></div>' +
          '<form class="capture" onsubmit="return false">' +
            '<input class="field" type="email" placeholder="you@example.com" aria-label="Email address">' +
            '<button class="btn btn--orange" type="submit">Notify me</button>' +
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

    [].forEach.call(document.querySelectorAll('[data-calendar]'), function (el) {
      el.innerHTML = calendar();
    });
    [].forEach.call(document.querySelectorAll('[data-month-label]'), function (el) {
      el.textContent = MONTH.label;
    });

    [].forEach.call(document.querySelectorAll('[data-ticket]'), ticket);
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

    // Over a full-bleed hero the bar is transparent; it goes solid as soon as
    // the picture starts leaving. State change, not decoration.
    var hdr = document.querySelector('.hdr');
    if (hdr && document.body.classList.contains('has-hero')) {
      var sync = function () { hdr.classList.toggle('hdr--over', window.scrollY < 60); };
      sync();
      window.addEventListener('scroll', sync, { passive: true });
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
