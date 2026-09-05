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
  /* The ticket silhouette, traced from the designer's TicketButtonEmpty.svg
     rather than generated. The generated one was a plain rectangle with
     equal semicircular bites down both edges; the drawn one is a different
     object — the four corners are cut back with CONCAVE quarter arcs, and
     the scallops are small half-circles that read as a perforation rather
     than a gear.

     Fixed geometry, 278x136, because the corner arcs and the scallop
     rhythm are drawn proportions, not parameters — regenerating them at
     another size is what lost the character last time. The <svg> scales
     to whatever .ticket's max-width allows. */
  var TICKET_W = 278, TICKET_H = 136;
  var TICKET_PATH = 'M252 0C252 14.3594 263.641 26 278 26C274.686 26 272 28.6863 272 32C272 35.3137 274.686 38 278 38C274.686 38 272 40.6863 272 44C272 47.3137 274.686 50 278 50C274.686 50 272 52.6863 272 56C272 59.3137 274.686 62 278 62C274.686 62 272 64.6863 272 68C272 71.3137 274.686 74 278 74C274.686 74 272 76.6863 272 80C272 83.3137 274.686 86 278 86C274.686 86 272 88.6863 272 92C272 95.3137 274.686 98 278 98C274.686 98 272 100.686 272 104C272 107.314 274.686 110 278 110C263.641 110 252 121.641 252 136H26C26 121.641 14.3594 110 0 110C3.31371 110 6 107.314 6 104C6 100.686 3.31371 98 0 98C3.31371 98 6 95.3137 6 92C6 88.6863 3.31371 86 0 86C3.31371 86 6 83.3137 6 80C6 76.6863 3.31371 74 0 74C3.31371 74 6 71.3137 6 68C6 64.6863 3.31371 62 0 62C3.31371 62 6 59.3137 6 56C6 52.6863 3.31371 50 0 50C3.31371 50 6 47.3137 6 44C6 40.6863 3.31371 38 0 38C3.31371 38 6 35.3137 6 32C6 28.6863 3.31371 26 0 26C14.3594 26 26 14.3594 26 0H252Z';



  /* Jomhuria is ~1.5x wider than the old display face at the same cap
     height, so a fixed-width component like the ticket can no longer
     assume a label fits. Measure the real advance width and step the
     size down only when it has to. Runs again after document.fonts
     resolves, because a first pass before the webfont lands would
     measure the fallback. */
  function fitFs(text, maxW, idealFs, track) {
    var c = fitFs._c || (fitFs._c = document.createElement('canvas'));
    var x = c.getContext('2d');
    x.font = '400 100px Jomhuria, sans-serif';
    var unit = x.measureText(text).width / 100;          // width per 1px of size
    if (!unit) return idealFs;
    var fs = (maxW - track * text.length) / unit;
    return Math.max(12, Math.min(idealFs, Math.floor(fs)));
  }

  function splitLabel(text, lines) {
    var w = String(text).toUpperCase().trim().split(/\s+/);
    if (lines === 1 || w.length === 1) return [w.join(' ')];
    if (w.length === 2) return w;
    var mid = Math.ceil(w.length / 2);
    return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
  }

  function ticket(el) {
    var sold  = el.getAttribute('data-state') === 'sold';
    var label = el.getAttribute('data-main') || 'Get tickets';
    var note  = el.getAttribute('data-sub') || '';
    var date  = el.getAttribute('data-date') || '10/31/26';
    var id    = 'tk' + (++TK);

    var W = TICKET_W, H = TICKET_H;

    // The light purple is the artwork's own fill. Black on it measures
    // 6.81:1, so every mark on the stock is simply black at an opacity.
    var fill = sold ? '#C9C8C3' : (el.getAttribute('data-fill') || '#B78BCB');
    var ink  = sold ? '#6E6D69' : '#000000';

    // Keyline inset and stub rules come straight from the artwork:
    // rect 20,20 238x96 r12, and a second rect at x=44 w=190 whose two
    // vertical edges ARE the stub rules.
    var pad = 20, stubX = 44, innerW = W - 2 * pad, innerH = H - 2 * pad;

    // The label is large display type, so the artwork's 0.7 black holds at
    // 4.86:1. The stub dates are small and 0.5 would be 3.02:1 against a
    // 4.5 requirement — they go to 0.85 (6.45:1).
    var labelOp = sold ? 1 : 0.7, dateOp = sold ? 1 : 0.85;

    // Jomhuria's cap is .3907em and its em box is not centred on it, so the
    // baselines below centre the CAP BAND inside the keyline (20..116),
    // not the em box. Centring the em box sat the label ~3px high and put
    // the first line's cap through the keyline.
    var rows = splitLabel(label, 2);
    var labelW = W - 2 * stubX - 18;
    // 68 is measured off the artwork, not guessed. Its own label outline
    // spans x 75.4..202.5, y 30.1..106.0 — a cap band 75.9 tall centred on
    // (139, 68). The baselines below put the cap band at 1.1107 * fs, so
    // 75.9 / 1.1107 = 68.3, and at 68 this reproduces the drawn label's
    // size and position to within a tenth of a unit. fitFs still takes it
    // down further when a longer word would not fit the width.
    var fsMax = 68;
    var fs = fsMax;
    for (var ri = 0; ri < rows.length; ri++) {
      fs = Math.min(fs, fitFs(rows[ri], labelW, fsMax, 2.5));
    }
    var midY = H / 2;

    var text = rows.length === 1
      ? '<text x="' + (W / 2) + '" y="' + (midY + fs * 0.195) + '" text-anchor="middle" ' +
          'fill="' + ink + '" fill-opacity="' + labelOp + '" font-family="Jomhuria, sans-serif" ' +
          'font-size="' + fs + '" letter-spacing="2.5">' + esc(rows[0]) + '</text>'
      : '<text x="' + (W / 2) + '" y="' + (midY - fs * 0.165) + '" text-anchor="middle" fill="' + ink + '" ' +
          'fill-opacity="' + labelOp + '" font-family="Jomhuria, sans-serif" font-size="' + fs + '" ' +
          'letter-spacing="2.5">' + esc(rows[0]) + '</text>' +
        '<text x="' + (W / 2) + '" y="' + (midY + fs * 0.555) + '" text-anchor="middle" fill="' + ink + '" ' +
          'fill-opacity="' + labelOp + '" font-family="Jomhuria, sans-serif" font-size="' + fs + '" ' +
          'letter-spacing="2.5">' + esc(rows[1]) + '</text>';

    // Also measured: the artwork's stub dates are 13.1 units of cap (fs 33)
    // running 62.1 long, centred at x 32.65 / 245.35. dy carries the
    // rotated glyph column onto that centre. Opacity is the one deliberate
    // departure from the drawing — see dateOp above.
    var stubDate = function (cx) {
      return '<text transform="translate(' + cx + ' ' + midY + ') rotate(-90)" text-anchor="middle" ' +
        'fill="' + ink + '" fill-opacity="' + dateOp + '" font-family="Jomhuria, sans-serif" ' +
        'font-size="33" letter-spacing="1.8" dy="7.1">' + esc(date) + '</text>';
    };

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
        'aria-label="' + esc(label) + (note ? ' \u2014 ' + esc(note) : '') + '">' +
        '<defs>' +
          // the artwork's own grain: turbulence reduced to alpha, cut to a
          // hard 50/50 dither, clipped to the shape and flooded 5% black
          '<filter id="' + id + 'n" x="0" y="0" width="' + W + '" height="' + H + '" ' +
            'filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
            '<feTurbulence type="fractalNoise" baseFrequency="1 1" stitchTiles="stitch" ' +
              'numOctaves="3" result="noise" seed="4856"/>' +
            '<feColorMatrix in="noise" type="luminanceToAlpha" result="a"/>' +
            '<feComponentTransfer in="a" result="d"><feFuncA type="discrete" ' +
              'tableValues="1 1 1 1 1 0 0 0 0 0"/></feComponentTransfer>' +
            '<feComposite operator="in" in2="SourceGraphic" in="d" result="clipped"/>' +
            '<feFlood flood-color="rgba(0,0,0,0.05)" result="f"/>' +
            '<feComposite operator="in" in2="clipped" in="f" result="grain"/>' +
            '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="grain"/></feMerge>' +
          '</filter>' +
        '</defs>' +
        '<path d="' + TICKET_PATH + '" fill="' + fill + '" filter="url(#' + id + 'n)"/>' +
        '<rect x="' + pad + '" y="' + pad + '" width="' + innerW + '" height="' + innerH + '" ' +
          'rx="12" fill="none" stroke="' + ink + '" stroke-opacity="' + labelOp + '" stroke-width="2"/>' +
        '<rect x="' + stubX + '" y="' + pad + '" width="' + (W - 2 * stubX) + '" height="' + innerH + '" ' +
          'fill="none" stroke="' + ink + '" stroke-opacity="' + labelOp + '" stroke-width="2"/>' +
        stubDate(pad + (stubX - pad) / 2) + stubDate(W - pad - (stubX - pad) / 2) +
        text +
      '</svg>' +
      (note ? '<span class="ticket__note">' + esc(note) + '</span>' : '');
  }


  /* hand-drawn marks — 2 shapes reused everywhere, never regenerated
     per instance, so the "drawn by a person" feel stays consistent */
    'M170 24C152 8 96 2 54 13 12 24 2 53 15 71 28 89 79 98 123 92 167 86 197 65 190 43 186 29 161 17 139 13"/></svg>';
  /* A torn paper edge for the seams where a light field meets a dark one.
     Not a zigzag: a slowly wandering baseline with fibre-scale jitter on
     top and a few deeper notches where the sheet gave way. Generated once
     and pinned, so the tear is identical on every page and every build —
     a re-randomised edge would flicker between navigations. */
  var TEAR = '<svg viewBox="0 0 1200 26" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0,26.0 L0,15.9 L0.0,15.9 L8.7,16.1 L23.3,13.9 L36.8,14.1 L49.3,16.7 L57.5,15.7 L70.2,16.8 L78.2,16.1 L90.2,14.6 L104.7,16.5 L116.5,14.7 L130.2,14.1 L136.6,16.1 L143.8,16.3 L155.3,15.0 L164.4,15.4 L171.0,14.8 L182.0,14.8 L190.3,15.4 L198.0,14.9 L207.4,13.0 L221.7,15.0 L235.4,9.8 L244.6,12.8 L255.1,12.8 L261.9,14.2 L275.9,14.7 L283.3,15.5 L295.2,15.9 L307.5,15.8 L315.3,14.8 L322.5,15.3 L334.7,14.7 L343.6,13.9 L351.2,14.7 L359.7,15.2 L369.2,17.5 L378.5,16.4 L384.8,16.2 L399.1,11.4 L405.7,16.5 L419.3,17.7 L432.8,15.9 L446.1,14.9 L457.4,14.8 L464.0,9.4 L471.0,17.6 L483.7,16.3 L494.8,16.9 L508.0,13.5 L519.9,14.0 L526.9,15.5 L535.1,13.6 L544.5,15.1 L556.9,13.4 L570.2,12.7 L581.7,13.4 L593.6,12.3 L606.4,12.5 L620.8,8.7 L627.7,8.5 L637.3,8.9 L645.1,11.0 L656.9,10.6 L669.2,7.5 L681.0,8.1 L689.9,9.5 L701.0,7.7 L713.9,9.9 L727.4,6.8 L740.3,7.3 L748.3,9.5 L756.0,8.1 L764.5,9.5 L776.4,7.8 L789.7,10.0 L798.9,10.3 L811.6,11.0 L825.3,10.5 L839.1,11.1 L850.2,12.5 L861.5,13.1 L872.8,10.9 L887.4,13.4 L896.0,13.3 L905.3,10.8 L917.0,11.0 L924.6,12.2 L939.2,14.1 L948.2,14.0 L957.6,13.1 L967.9,13.1 L979.5,11.9 L991.7,12.6 L998.7,11.7 L1010.3,13.3 L1018.2,12.4 L1024.7,11.6 L1037.8,12.5 L1050.2,12.6 L1062.7,10.8 L1077.4,10.7 L1087.4,10.3 L1095.5,10.9 L1102.8,11.5 L1117.6,10.5 L1130.3,11.2 L1139.9,11.7 L1148.5,11.9 L1154.8,12.8 L1167.4,14.4 L1181.9,14.2 L1191.4,13.5 L1200.0,15.3 L1200.0,26.0 Z"/></svg>';

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
        '<a class="btn btn--white" href="tickets.html">Get tickets</a>' +
      '</div>' +
      '<button class="burger" type="button" data-burger>Menu</button>' +
    '</div>' +
      '<span class="tear tear--hdr" style="--tear-fill:var(--paper)"></span>' +
    '</header>' +
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
      '<div class="ftr__grid">' +
        '<div><p class="ftr__h">When</p><p class="small">Saturday 10/31/26<br>3pm until close</p></div>' +
        '<div><p class="ftr__h">Where</p><p class="small">Brady Street<br>Milwaukee, Wisconsin</p></div>' +
        '<div><p class="ftr__h">Who</p><p class="small">21 and over<br>Bring ID, they will check</p></div>' +
        '<div><p class="ftr__h">Find us</p><p class="small">' +
          '<a href="#">@barscenesocials</a> — Instagram<br>' +
          '<a href="#">@barscenesocials</a> — TikTok<br>' +
          '<a href="#">hello@barscenesocials.com</a></p></div>' +
      '</div>' +
      '<div class="ftr__signup">' +
        '<p class="h4">Know before everyone else</p>' +
        '<p class="small">Two emails a year, both of them a date.</p>' +
        '<form class="capture" onsubmit="return false">' +
          '<input class="field" type="email" placeholder="you@example.com" aria-label="Email address">' +
          '<button class="btn btn--red" type="submit">Notify me</button>' +
        '</form>' +
      '</div>' +
    '</div></footer>';
  }

  /* Entrance reveal.
     The owners previously said the animation on this site was too much, so
     this is deliberately quiet: a 14px rise and a fade, once, on the way in
     — no parallax, no scroll-driven scrubbing, no count-ups, nothing that
     moves while you read. Siblings cascade rather than all landing at once.

     Deliberately NOT IntersectionObserver. IO reports state changes, so an
     element scrolled past between ticks (a fast flick, the End key, a
     restored scroll position) reports isIntersecting:false and would stay
     invisible for good — measured, not theoretical. A rAF-throttled scroll
     check re-evaluates position every frame and cannot miss; it reveals
     anything at or above the trigger line, including everything already
     scrolled past. It unbinds itself once the last group has landed, so it
     costs nothing for the rest of the visit.

     The hidden state is applied by JS (html.has-js), never in the base CSS,
     so a failed or blocked script leaves every page fully readable instead
     of blank. prefers-reduced-motion is honoured by never arming it. */
  function reveal() {
    var root = document.documentElement;
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    var pending = [].slice.call(document.querySelectorAll('[data-reveal]'));
    if (!pending.length) return;
    root.classList.add('has-js');

    function show(g) {
      var kids = g.querySelectorAll(':scope > *');
      var list = kids.length ? kids : [g];
      [].forEach.call(list, function (el, i) {
        el.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        el.classList.add('is-in');
      });
      g.classList.add('is-in');
    }

    var ticking = false;
    function check() {
      ticking = false;
      var trigger = window.innerHeight * 0.88;
      for (var i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top < trigger) {
          show(pending[i]);
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
  }

  /* Count-up on the numbers section. The final value is already in the
     markup, so with no JS (or reduced motion) the correct number is simply
     there — this only ever replaces it for the ~1.1s it is animating and
     then puts it back verbatim.

     Same rAF-throttled scroll check as reveal() and ignite(). Delays are
     matched to the CSS stagger on .ledger__n so the digits start moving as
     each numeral finishes wiping up, not before it is visible. */
  function counters() {
    var els = [].slice.call(document.querySelectorAll('[data-count-to]'));
    if (!els.length) return;

    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    function format(v, fmt) {
      if (fmt === 'k')  return Math.round(v / 1000) + 'k';
      if (fmt === '$k') return '$' + Math.round(v / 1000) + 'k';
      return String(Math.round(v));
    }

    function run(el, i) {
      var to    = parseFloat(el.getAttribute('data-count-to'));
      var fmt   = el.getAttribute('data-count-fmt') || '';
      var final = el.textContent;
      var dur   = 1100;
      var delay = 120 + i * 80;
      var t0    = null;

      el.textContent = format(0, fmt);
      setTimeout(function () {
        requestAnimationFrame(function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          // easeOutExpo — fast out of the gate, long settle onto the value
          var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = format(to * e, fmt);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = final;   // land on the authored string exactly
        });
      }, delay);
    }

    var pending = els.slice();
    var ticking = false;
    function check() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          run(pending[i], els.indexOf(pending[i]));
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
  }

  /* Neon ignition. The ambient flicker in bss-neon puts its stutter at 86%
     of a 5.5s cycle, so a headline you have just landed on does nothing for
     four seconds. This strikes the tube once, the first time each headline
     is actually in view: immediately for a hero, on scroll for the closing
     line on the homepage. CSS does the rest — see .fx--lit.

     Same rAF-throttled scroll check as reveal(), and for the same reason:
     an IntersectionObserver misses elements that are scrolled past between
     ticks. Worst case here is only a missed strike, but there is no reason
     to keep two different answers to the same question in one file. */
  function ignite() {
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    var pending = [].slice.call(document.querySelectorAll('.fx--neon'));
    if (!pending.length) return;

    var ticking = false;
    function check() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          pending[i].classList.add('fx--lit');
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
  }

  function boot() {
    var h = document.getElementById('chrome-header');
    var f = document.getElementById('chrome-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();

    /* The footer tear only earns its place when the section above it is a
       different colour. On pages that close on a .band--ink the two fields
       are both --ink-deep, so the torn silhouette reads as nothing — just a
       flat strip with no grain between two grainy fields, which is exactly
       the grey seam it was supposed to avoid. */
    if (f) {
      var lastSection = document.querySelector('main > section:last-of-type');
      var ftr = f.querySelector('.ftr');
      if (lastSection && ftr) {
        var above = getComputedStyle(lastSection).backgroundColor;
        var below = getComputedStyle(ftr).backgroundColor;
        // a transparent section inherits the page ground
        if (above === 'rgba(0, 0, 0, 0)') above = getComputedStyle(document.body).backgroundColor;
        /* A page whose last section is a white band already closes on its
           own torn edge in the markup. Adding a second one here stacks two
           tears, ~50px of ragged edge, instead of one seam. */
        var mainEl = document.querySelector('main');
        var endsInTear = mainEl && mainEl.lastElementChild &&
                         mainEl.lastElementChild.classList.contains('tear');
        if (above !== below && !endsInTear) {
          ftr.insertAdjacentHTML('beforebegin',
            '<span class="tear tear--down" style="--tear-fill:var(--ink-deep)"></span>');
        }
      }
    }

    [].forEach.call(document.querySelectorAll('[data-calendar]'), function (el) {
      el.innerHTML = calendar();
    });
    [].forEach.call(document.querySelectorAll('[data-month-label]'), function (el) {
      el.textContent = MONTH.label;
    });

    [].forEach.call(document.querySelectorAll('[data-ticket]'), ticket);
    // the first pass may have measured the fallback face; redraw on the real one
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        [].forEach.call(document.querySelectorAll('[data-ticket]'), ticket);
      });
    }
    [].forEach.call(document.querySelectorAll('.squig'), function (el) { el.insertAdjacentHTML('beforeend', SQUIG); });
    [].forEach.call(document.querySelectorAll('.tear'), function (el) {
      if (!el.firstElementChild) el.insertAdjacentHTML('beforeend', TEAR);
    });
    reveal();
    ignite();
    counters();
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
