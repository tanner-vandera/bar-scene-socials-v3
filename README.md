# Bar Scene Socials — v3 (designed)

Nine pages, raw HTML/CSS/JS, no build step. The architecture from
`../bar-scene-socials-wireframe/` with the visual direction applied.

## Run it

```
python3 -m http.server 5181
```

Then <http://localhost:5181>. Or use the `bar-scene-socials-v3` config in
`.claude/launch.json`.

## Direction

Per the `bss-visual-direction` skill: **a hand-made zine pinned to a bar wall,
not a ticketing platform.** Torn paper, riso ink, collage grids, halftone,
taped photos, one rust accent. Nothing glossy, nothing 3D, no clip art.

**Type** — Anton (display, monumental, ~10:1 against body at desktop),
Caveat (hand-written accents only, never body copy), Space Grotesk (body/UI).

**Colour** — black and white grounds, three electric accents, nothing else.
Near-white `#F8F8F6` and near-black `#111110` (never pure `#fff`/`#000`) carry
every surface; white `#FFFFFF` is for cards, and `#EFEFEC` is the one grey band.
The accents are **orange `#FF4D14`** (THE accent — CTAs, marks, links, live
state), **green `#00C24E`** and **red `#E8202A`**, each with a darker sibling
(`--orange-d`, `--green-d`, `--red-d`) for text sizes on white.

**One colour rule worth knowing:** electric orange is mid-luminance, so *white
text on it is only 3.3:1 and fails AA*. Everything on an orange surface — chips,
buttons, the orange band — carries **ink type**, which is 5.7:1 and reads
punchier anyway. Never put white on `--orange`.

**Controls** — buttons and chips are pills, solid-filled, level (no rotation),
with modern focus rings. The printed, hand-made character lives in the artwork
(grain, halftone, taped photos, hand-drawn calendar circles), not in the things
people click.

**Heroes** — home and the three event pages open on a full-bleed picture with a
centred stacked headline, modelled directly on the Shamrock Shuffle page: viewport-height
image, header riding transparently over it until you scroll, kicker / headline / detail
line / one ticket, all centred. The other five pages keep a paper head, also centred.

**Navigation** — the top bar is Haunted Bar Hop / 12 Bars / Shamrock / More;
"All tickets" sits at the top of the More menu. On a phone the bar carries three
things in order: mark, ticket, Menu.

**Header** — fixed, not sticky. Over a full-bleed hero it starts transparent with cream
type and goes solid paper once you scroll past 60px. Below 760px it drops the ticket and
shows just the mark and Menu, as the reference does; the drawer carries a ticket instead.

**Motion** — deliberately almost none. The owners said the animation was too
much, so there are no scroll reveals, no parallax, no counters. What is left is
interaction feedback only: hover, focus, the ticket lift, the mobile drawer.
`prefers-reduced-motion` kills even that.

## Pages

Every page is served at an extension-less URL. `vercel.json` sets
`cleanUrls: true`, so Vercel serves `/about` from `about.html` and redirects
`/about.html` to `/about` on its own. **The file name IS the URL** — keep them
matching, and a rename is a URL change.

| URL | file |
| --- | --- |
| `/` | `index.html` |
| `/hauntedbarhop` | `hauntedbarhop.html` |
| `/12barsofchristmas` | `12barsofchristmas.html` |
| `/shamrockshuffle` | `shamrockshuffle.html` |
| `/tickets` | `tickets.html` |
| `/happeningnow` | `happeningnow.html` |
| `/featured` | `featured.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |

Five of these were renamed on 2026-09-10 (`haunted-bar-hop`, `christmas`,
`shamrock`, `happening-now`, `featured-bars`). `cleanUrls` cannot redirect a
path whose file no longer exists, so those old paths are listed explicitly in
`vercel.json`'s `redirects` — **do not delete them**, they are what keeps any
already-shared link alive.

Internal links are absolute (`/tickets`, not `tickets.html`), including the
nav tables at the top of `js/bss.js`. Nav highlighting matches `data-page` on
`<body>` against each entry's `key`, NOT the URL, so a rename does not touch it.

The wireframe's sitemap page is gone — it was explicitly not part of the site.

## Search & sharing

**`bin-seo.py` is the source of truth, not the HTML.** Every page's `<title>`,
meta description, canonical, Open Graph / Twitter tags and JSON-LD are generated
from the `PAGES` table at the top of that script and written into each file
between `<!-- SEO:begin -->` and `<!-- SEO:end -->`. **Edit the table and re-run
`python3 bin-seo.py`** — hand-editing inside the markers works until the next
run overwrites it. The script is idempotent and rewrites the block in place.

What it emits per page:

- **canonical** — needed because `/about` and `/about.html` both resolve
  (the second redirects), and a canonical stops that reading as duplicate content.
- **Open Graph + Twitter `summary_large_image`** — controls the preview when a
  link is pasted into Instagram, iMessage, Facebook or Slack. Absolute URLs:
  scrapers do not resolve relative ones.
- **`Event` JSON-LD** on the three event pages. This is the one with real upside —
  it makes the page eligible for Google's event rich results (date, venue and a
  ticket link shown in the result). `Organization` + `WebSite` sit on the homepage.

Two traps already hit, do not undo them:

1. **`organizer` is inlined on each event, not `{"@id": ".../#org"}`.** The
   Organization node only exists on the homepage, and a crawler parsing an event
   page on its own cannot resolve a cross-document `@id`.
2. **Christmas and Shamrock carry a date-only `startDate` and NO `offers`.**
   Their running times are not announced and they are not on sale; a guessed time
   or a fake `InStock` offer is worse than an absent one. Add both together, when
   they are real.

**Timezones are hand-checked, not guessed.** `2026-10-31T15:00:00-05:00` is CDT
because US DST ends Sun 11/01/2026 — the day AFTER the crawl. 12/12/26 and
3/6/27 both fall in CST (`-06:00`); DST 2027 starts 3/14.

**The social cards are generated too.** `images/og/*.jpg` are 1200x630 renders of
a template built from the site's own CSS, so a share preview looks like the page
it opens. Regenerate by re-creating the `_og_*.html` templates and screenshotting
at 1200x630 with headless Chrome, then `sips -s format jpeg -s formatOptions 82`
— the PNGs come out ~700KB and the JPEGs ~100KB. **Set `padding:0` on `body` in
the template**: `bss.css` puts `padding-top:var(--hdr-h)` there for the fixed
header, which otherwise shunts the whole card down and clips the URL off the bottom.

**The canonical host is `www.barscenesocials.com`, not the apex.** The apex
308-redirects to www on Vercel, so every canonical, `og:url`, sitemap `<loc>`
and JSON-LD `url` uses www — pointing them at the apex made each one name a URL
that immediately redirects, which is the exact thing a canonical exists to
prevent. It is one constant (`SITE`) at the top of `bin-seo.py`; if the Vercel
primary domain is ever flipped to the apex, change that line, re-run, and fix
`sitemap.xml` + `robots.txt` to match.

Legacy `.html` URLs take three hops — apex→www, then Vercel's `cleanUrls`
strips `.html`, then the rename redirect fires. **That middle hop is why
`vercel.json` lists BOTH `/haunted-bar-hop.html` and bare `/haunted-bar-hop`:**
cleanUrls strips the extension before the redirect table is consulted, so the
`.html` rule never matches and only the bare rule saves the URL from a 404.

`favicon.svg` is the linked-O element from `images/bss-logo.svg` — the only part
of the lockup that survives at 16px. `apple-touch-icon.png` is that SVG rendered
at 180. `sitemap.xml` lists all nine URLs and is referenced from `robots.txt`.

## Shared pieces

`js/bss.js` holds the header, footer, logo, ticket, and the hand-drawn marks,
so all nine pages stay in sync. Edit the `NAV` and `MORE` arrays at the top of
that file to change navigation everywhere.

**The logo is the real one** — `images/bss-logo.svg`, a stacked
"BAR SCENE / SOCIALS" wordmark with the O and C of SOCIALS fused into a single
lozenge. It replaced the three-wave placeholder that stood in through the whole
build.

It is painted as a **CSS mask**, never as an `<img>`, so one file serves every
placement and takes its colour from whatever it sits in — white in the header,
white over a hero, white in the footer, `currentColor` in the loader. See
`.logo` in `bss.css`; `logo()` in `bss.js` only emits the box and its
accessible name. To recolour it anywhere, set `color` on the container. Never
add a second, recoloured copy of the artwork.

Three placements: `.lockup__logo` (header, 126px), `.ftr__logo` (the footer
sign-off, at wordmark scale with "Setting the scene" under it in the script
face), and `.drop__logo` (the falling-ticket loader).

**"On Brady" is part of the Haunted Bar Hop mark**, not a caption — it ships on
the two heroes and the two section lockups, in `--orange` in the script face.
**Not on the event cards.** At card size it was competing with the name above it
in a box that is mostly title already, and the cards are the one place the
lockup sits inside a hover transform.
Two elements, both load-bearing, and both of them cost a bug to get right:

- `.hl__on-line` is a plain block carrying no text of its own. It opens the line
  AND zeroes the strut: a line box is at least as tall as its container's
  font-size x line-height, which inside a headline is .46 x 190px = 87px of
  empty space under a 34px tagline. Its margin is in the PARENT's em, so the gap
  scales with the lockup rather than with the clamped tagline.
- `.hl__on` is **plain painted text, not an `.ink`** — the only run in a headline
  that is. Every other one paints itself as a background clipped to its own
  glyphs; this one sets `color` directly and takes a `text-shadow` halo. That is
  the fix for a ghosting bug, not a stylistic preference: it is also the only run
  that is *transformed* (the -2deg tilt), and `background-clip:text` plus a
  transform does not survive a parent transform. Hovering an event card animates
  `translateY` on `.event__title`, which repainted the clipped fill from the
  element's untransformed origin and left a second "On Brady" lying across
  "HAUNTED". The stylesheet already carried the warning — *keep the headline out
  of transforms* — and this run was breaking it.
- It must still be an **atomic inline** (`display:inline-block`). A `.fx`
  headline's clip reaches every glyph in its subtree *except* inside an atomic
  inline, which is why `.fx .ink` and `.fx .scr` are inline-block too. Set to
  `display:block` it stopped being atomic and the parent painted "On Brady" a
  second time in the headline's own colour — the first double-render.
- **It carries no transform.** It had a -2deg tilt, and that produced the
  second, more stubborn double-render: on the HEROES only, a ghost copy lying
  across "HAUNTED". The tell was that the section lockups never showed it —
  `.fx--neon` animates `filter` on the parent *continuously*, and a transformed
  child inside an animating-filter subtree is rasterised from the wrong origin.
  Dropping the clip did not fix it because the hazard is the transform. The
  stylesheet already said so: **keep the headline out of transforms.**

**The ticket** is the signature object, built to the Figma component
(`Shamrock-Shuffle`, node `2081-85`): a real cinema ticket — scalloped short
edges, a stub at each end carrying the event date, an inset keyline, and a heavy
centred Anton label on orange stock (`#FF9152`) with a red keyline and print
grain. 248px wide at full size. Two layouts, one language:
`full` (2:1, label on two lines) for page CTAs, and `ticket--compact` (3.4:1,
one line) for the header, where a 2:1 ticket cannot fit under a 65px bar. A
`data-sub` renders as a small note under the ticket rather than inside it, since
the Figma component has no slot for it.

**Photography is in colour.** It was fully desaturated and two stops down
everywhere until the pictures got good enough to run as pictures. The grade is
now barely there — `saturate(1.05) contrast(1.03)` and nothing else — in all
four places a picture appears: `.hero__media--shot img`, `.event__shot > img`,
`.band--shot > .band__bg img`, `.photo > img`. Slots still without a photograph
stay honest riso colour fields with halftone, grain and a label.

**The neon is derived, not hand-written.** Every colourway is one line
(`--ink-c`) and `--neon` builds the glow from it with `color-mix`, so an ink can
never have a halo that disagrees with its fill and a sixth colour is free. It
replaced two hand-tuned rgba stops per ink.

Four stops on a roughly geometric radius progression (`.006 / .022 / .05 /
.105em`) with alpha falling away much faster than radius grows. **That ratio is
the whole trick** — light falls off with distance, so a glow that keeps its
density as it widens looks like fog, and one that loses it looks like light. The
previous version had two stops, 90% and 40%, with nothing between: a step, not a
falloff, which read as a sticker with a coloured outline.

The first stop is the tube itself — a *lightened* tint of the ink, one pixel
wide at hero size. Real neon blows its core toward white and saturates outward,
and that single hot line is most of what separates "glowing" from "coloured".
`--neon-lift` tunes how far; `.on-white` drops it to ~0 so a dark ink on a white
ground does not get a white core.

`saturate/brightness` lead the chain so they grade the FILL only — filters apply
in order, so anything after a `drop-shadow` grades the shadows too and muddies
the falloff.

**A hero carries a flat 50% overlay and nothing else.** The scrim went through
five settings to get here — a heavy radial plus a full-height wash, then a 13%
wash plus a plate cut to the type, then nothing at all, then 20%, then this.
Flat is the point: it is an exposure decision applied evenly to the picture, not
a shape cut around the words, so the photograph reads the same in the corners as
it does behind the lockup. **It is a hero-only number** — the event cards are
tuned separately on `.event__shot::before` and must not be moved with it. On top of it sits a shallow gradient over the top 18% of the
frame, and that one is chrome rather than a photo treatment — the fixed header
floats transparently over every hero and its links need something predictable to
sit on.

**Legibility still lives on the type.**
`.hero--shot .fx .ink` draws three tight dark shadows behind each glyph before
its colour glows, so every letter carries its own backing board — which is how a
neon sign actually photographs: bright tube, dark backing, bloom outside both.
`.hero__meta`, the ticket note and the "On Brady" tagline get the same idea as a
`text-shadow`, since they are ordinary text rather than background-clip fills.
The overlay and the halo were tuned together: on the Haunted hero the halo alone
held the worst painted edge at 2.31:1, a flat 20% took the same word to 3.36,
and at 50% every hero on the site clears its floor outright. See Accessibility
for the full ladder.

**Every halo radius carries a px floor via `max()`.** Pure `em` radii scale with
the word, which is right for a glow and wrong for a halo: at 175px `.016em` is
2.8px and does the job, at 34px it is 0.4px and is invisible. The floor is what
small type needs; the em term stops big type wearing a hard outline.

**A card is different and still has a real scrim.** Its title is centred on a
16:9 thumbnail and its box IS most of the card, so there is no sub-region to
plate and no room for a halo to breathe. `.event__shot::before` absorbed what
the grade gave up: the composited card sits at mean luminance .025 against the
.028 it measured while greyscale — the same darkness, arriving as a neutral wash
over a colour photograph instead of a desaturation plus two stops. The one
exception is `.event__title .hl__on`, the tagline, which is the only run on a
card small enough to need 4.5:1 rather than 3:1 and gets a halo of its own.
`.band--shot` is the same argument again, harder: a whole section of 16px body
copy needs 4.5:1 edge to edge.

**Exposure and crop are per-picture, not per-component**, set inline where they
are used: `--hero-b` / `--shot-b` (both default to 1, untouched) and
`--hero-pos`. Nothing currently overrides any of them. **Re-measure if you swap
a picture** — with no scrim left there is no margin absorbing a bad frame.

**Mid-luminance inks are the trap.** `--violet` (#C13BFF, L=.19) and `--red`
(#E8202A, L=.18) sit in the MIDDLE of the range, so unlike white they are
squeezed from both ends: a blown highlight and a lit mid-tone are equally fatal,
and no plate strength fixes one without the ground passing through the other on
the way. Both take the deeper card scrim; green and orange live on the base.
When measuring either, sample the pixels the glyphs actually paint — a diagonal
script word is mostly empty box, and the box measure is off by a full point in
both directions.

**`brady-street.webp` is a MONOCHROME SOURCE FILE** (mean saturation 0.000). The
homepage hero, the Haunted event cards and both section backgrounds will stay
black and white however the CSS is set, because there is no colour in the file.
It is also the brightest and flattest frame on the site, which made it the last
hero to clear its contrast floor. A colour original would fix the colour; no
code change needed.

## The page-to-page flicker

Two separate causes, both fixed, both worth knowing because both are the kind
that only show up when you actually navigate rather than reload one page.

**1. The hero fallback was bright orange.** `.hero > .hero__media--shot` carried
the full `--orange -> --red -> black` gradient as its background, written when
the heroes had no photographs and that gradient *was* the hero. Every hero now
loads a 300-500KB image, and this painted for the frame or two before it
decoded — so moving between pages flashed orange and then cut to a dark photo.
It is now a dark warm gradient that lands on the page's own ground, so a gap
reads as the site continuing. Still a gradient, not flat, so a genuinely missing
image looks composed rather than broken.

**2. The reveal groups painted visible, then hid, then faded in.**
`.has-js` was added inside `reveal()`, which runs at `DOMContentLoaded` from a
script at the end of `<body>` — late enough that the browser could paint the
content first. Result: content appears, vanishes, fades back. It is now set by a
small inline script at the top of every `<head>`, before first paint.

That script is **guarded twice**, because hiding content pre-paint is exactly
the kind of thing that leaves a blank page:

- **Reduced motion never hides anything.** `reveal()` returns early under
  `prefers-reduced-motion` and never adds `is-in`, so if the head script hid
  things there they would stay hidden forever. Both use the same query.
- **A failed script self-heals.** If `window.__bssBooted` is not set within
  2.5s, the class is stripped and everything becomes visible. `bss.js` failing
  to load, being blocked, or 404ing can no longer blank a page. Verified by
  loading a copy of the guard with no `bss.js` at all: hidden at 0s, visible at
  3.2s.

`__bssBooted` is set at the *top* of `boot()`, not the bottom — a throw further
down must not look like a failed load and re-show content that is mid-reveal.

**3. The cursor blinked out on every navigation.** `.has-cur` was added on the
first `mousemove`, so clicking a link and holding still gave you the native
arrow on the new page until you happened to move. `mouseover` now initialises it
too, and that fires on the element under a stationary pointer as soon as the new
document is live.

## The cursor

One drawn object per page — **ghost** (home, Haunted), **four-leaf clover**
(Shamrock), **snowflake** (Christmas), **sparkle** (everywhere else) — turning
slowly, and opening up (faster spin, 1.6x) on anything you can act on. Shapes in
`CURSOR_ART`, behaviour in `cursor()`, everything visual under `.cur`.

Three rules came before the fun, and they are the difference between playful and
broken:

- **Fine pointers only.** On touch there is no cursor to replace, and hiding the
  native one is unrecoverable.
- **The native cursor is hidden only once the drawn one is on screen.**
  `.has-cur` is added on the first `mousemove`, never at boot, so a browser that
  never fires one keeps its arrow. Text fields keep their I-beam and the drawn
  cursor fades out over them — a missing caret is a real cost, a missing doodle
  is not.
- **Three nested elements, one job each.** `.cur` is moved by the rAF loop,
  `.cur__scale` takes the hover growth, `.cur__spin` takes the rotation. All
  three write `transform`, and a CSS animation beats a plain declaration on the
  same element — put two of these on one node and the hover silently stops
  working. Same trap as the polaroid tilts.

Reduced motion keeps the object and drops the movement: no spin, no growth, and
the follow snaps instead of gliding.

## Motion

Still deliberately restrained, but no longer absent:

- **The press.** Every interactive object gives when clicked — hover lift drops,
  the object compresses ~2%. It was two `:active` rules across the whole site,
  which is why clicks felt soft. Written through the same
  `--tx/--ty/--rot/--sc` variables the reveal composes, so it survives inside a
  `[data-reveal]` group; a plain `transform` would be beaten by the reveal at
  (0,3,0).
- **Hero drift.** The hero photograph rises at ~88% of scroll rate. The
  *picture* only — moving a headline at a different rate to its own meta line is
  what reads as broken rather than deep — capped at the hero's own height, and
  off entirely under reduced motion.
- **Body links** draw a rule that thickens on hover, so colour is no longer the
  only affordance (WCAG 1.4.1).

## Performance

Below-fold images are `loading="lazy" decoding="async"`; the four hero images are
eager with `fetchpriority="high"`. **This affects the audit harness**: lazy
images never load in an offscreen iframe, so anything auditing cards must force
`loading="eager"` and await them first, or it silently skips every card.

## Dates

All dates are **MM/DD/YY** — including the ticket stubs. `MONTH` in `js/bss.js`
and the `data-date` default on the ticket are the two places a date is defined
in code; everything else is literal in the markup.

## The calendar

`MONTH` at the top of `js/bss.js` is the single definition of the active month.
Both the homepage section and Happening Now render from it through
`[data-calendar]`, so they cannot drift apart. Edit that object to change the
month or its events. It is October 2026 — the month the season actually starts,
not today's date.

**One month, no switcher.** Happening Now used to carry six dashed month tabs
(October through March). They are gone: only October has data, so five of the
six led nowhere, and the page is meant to be a very short answer to "is
anything on?", not a listings archive. If more months are ever added, `MONTH`
becomes an array and the switcher comes back with real destinations.

**Ten stops, one event.** The route is ten named bars — Nomad World Pub through
HiHat Lounge — and every "sixteen bars" on the site went with the placeholders.
The rows carry names only; the one-line captions under them ("Bingo stamp here",
"DJ 4-7pm") were invented colour under placeholder names, and with a real route
in they would be ten more things to keep true.

**One event on the calendar, and it is ours.** The three other listings were placeholders for
other people's shows with nothing real behind them. An empty month with one
thing painted on it is a better answer to "is anything on?" than three invented
ones. The `.listing` on Happening Now was trimmed to match — it renders the same
events in list form, and leaving three rows under a one-event calendar would
have been a bug rather than a feature. Two copy lines that counted events ("Two
to four things a month", "Four a month, chosen by us") went with them, and the
scrawl on both pages now reads "if it's orange, go." because nothing is circled
any more.

**Our own date is painted, not annotated.** `td.ours` gets a solid `--orange`
block, rotated ~1.4deg by a pseudo-element (a `<td>` itself cannot be
transformed), the same 6px halftone as the rest of the print, the day numeral in
the display face, the event name in the **script** face, and two doodled arrows
that hang outside the cell on purpose. A ring said "worth going to" — right for
somebody else's show, far too polite for the only event on the page that we run.
Other events still get `CALRING`; the JS scopes it `:not(.ours)`.

**The type on that block is near-black, always** — `--orange` is mid-luminance,
white on it is 3.3:1 and fails. Measured: numeral and name 5.69:1, detail line
4.91:1. Note that every `.band--ink .cal *` and `.sheet.sheet .cal *` rule is
scoped `td:not(.ours)`: those blocks theme the calendar for the ground it sits
on, and this cell is not themed. Excluding it there is the fix — out-specifying
it does not work, because `.sheet.sheet .cal .dnum` is (0,4,0) and beats
`.cal td.ours .dnum` at (0,3,1). That is exactly how the numeral first shipped
at 2.32:1 on the orange.

## Two layout traps in this stylesheet

Both already bit once. `.photo` and the `.collage`/`.hero` container rules sit at equal
specificity (0,1,0), and the containers are declared **later** in the file, so they win:

- `.collage > *` was repainting every photo inside a collage — now scoped to `:not(.photo)`.
- `.photo{position:relative}` was overriding `.hero__media{position:absolute}` — the hero
  layers are now `.hero > .hero__media` to outrank it.

Separately: `.photo` carries `min-height:130px`, which combined with an `aspect-ratio`
becomes a hard **minimum width** (130 x 4/3 = 173px). That was blowing the homepage's
4-column strip 71px past a 375px phone. The `.ar-*` classes now reset `min-height:0`.

## Accessibility

Text is audited against WCAG AA by measurement, never by eye. `_audit.js` (local
only, gitignored, never deployed) is the harness: load it into any page and call
`BSSAudit()`. It composites the real graded photograph and the real *computed*
scrims into a canvas, rasterises each run with its own font and size as a mask,
and then does one of two things:

- **Where there is a scrim** (cards, section backgrounds) it samples the pixels
  the glyphs actually paint.
- **Where there is not** (the heroes) it composites every DARK `drop-shadow` the
  element declares — and any `text-shadow` — and samples the RING just outside
  the glyphs, because the halo is what the strokes actually sit against. The
  coloured bloom is deliberately excluded: a glow is not a ground.

Large text (≥24px, or ≥18.66px bold) is held to 3:1, everything else to 4.5:1.

**Everything off a hero passes**, at rest and on hover. The tightest is the
Christmas card title at 3.17:1 against a 3.0 floor.

**The heroes do not, and it is a deliberate, visible trade.** A hero lockup and
a section lockup are the same sign and have to look like it, so the hero now
runs the *same* glow as everywhere else — one tight 4.5px dark layer plus the
standard `.034em/.085em` colour bloom. The heavier halo that preceded it read as
a soft purple cloud beside a section headline that stayed crisp, which is a
worse fault than a contrast number. Current worst painted edge, and the share of
that edge under 3:1:

| Hero | Worst | Edge under 3:1 |
|---|---|---|
| Haunted Bar Hop | 1.83 | ≤6.9% |
| 12 Bars of Christmas | 2.63 | ≤0.5% |
| Shamrock Shuffle | 2.00 | ≤0.2% |
| Home (Brady Street) | 1.90 | ≤6.1% |

**The look and the darkness are coupled, and the overlay is the only honest
lever.** A section headline reads crisp because its band sits on an 86-93%
plate; the hero sits on 50%. Matching the type treatment exactly cannot make up
that difference — the same purple over a bright ground simply reads washed.
Measured on the homepage, the hardest frame:

| Hero overlay | Worst edge (no halo) | Worst edge (tight halo) |
|---|---|---|
| 50% | 1.03 (72% of edge) | 1.90 (≤6%) |
| 62% | — | 2.65 (≤0.2%) |
| 78% | 2.81 (≤4.6%) | — |

So: **62% closes it with the glow left exactly as it is.** Going the other way —
dropping the halo entirely so the filters are byte-identical — needs ~78%, i.e.
a much darker photograph, which is the thing that was rejected twice. The halo
is what buys the bright picture.

**The overlay is a hero-only number.** The event cards carry their own scrim on
`.event__shot::before`, tuned separately because a card has no room to plate
only its type. The two were never the same instrument and must not be moved
together.

**Order is the whole thing, and it cost four passes to learn.** Chained
`drop-shadow` filters each cast from the RESULT of the last. With the dark
backing declared FIRST, every colour stop after it was pushed outward by the
dark's own radius — so the bloom stopped hugging the glyph and became a detached
ring floating ~6px off it. A ring reads as a big soft halo; a bloom that starts
at the letter reads as a lit tube. The giveaway was that the hero's colour radii
were by then SMALLER than the section headline's and it still looked like more
glow.

The dark now goes LAST. It casts from (glyph + finished glow) and paints behind
all of it, so the neon is pixel-identical to every other lockup on the site and
the dark is a soft aura on the photograph rather than a spacer inside the type.
That is also how a real sign sits on a wall — and it measured BETTER, because a
wide trailing aura darkens more of the picture around the letters than a tight
leading one did.

**The halo has a shape, and every rule about it cost a bug.** It shipped once as
three layers, the innermost fully opaque and the outermost wider than the neon
glow, and read as a black keyline drawn around the letters. Then as two, which
still bloomed wider than the section lockups. It is now one:

- **Nothing fully opaque.** A tight shadow at alpha 1 has a crisp edge, and a
  crisp dark edge on a letterform is an outline, not a shadow.
- **The dark stays well inside the colour.** Chained `drop-shadow` filters each
  cast from the *result* of the last, so a wide dark layer pushes the neon bloom
  outward and leaves a black band between a glyph and its own glow.
- **The colour radii must match the site default exactly.** A filter list
  replaces wholesale, so `.hero--shot .fx .ink` has to restate `.034em/.085em`
  rather than widen them. Widening them is what made the hero read as a
  different sign from the section headline below it.

Four findings worth keeping:

- **Size the plate before you strengthen it.** A plate that missed the cap line
  by 90px read as a strength problem and was a geometry problem.
- **A hover state is the worst moment to thin a scrim.** The event cards used
  to lift their plate to `opacity:.82` on hover — "the picture opens up" —
  which took every card title under 3:1 exactly while someone was reading it.
  The scale and the title lift carry the interaction on their own now.
- **Sample the glyphs, not the box.** Measured over its bounding box the
  Christmas script word reads a full point away from its true value in both
  directions, because most of that box is empty.
- **A translucent chip is its own background.** `.sticker` ships
  `rgba(248,248,246,.12)`, which is fine over a known ground and a liability
  over a photograph: it lifts whatever is behind it 12% toward white, straight
  into `--orange-on`'s own luminance. On the Haunted hero that read 3.08:1
  against a 4.5 floor. Chips on photography — including the hollow
  `--ghost-paper` variant, which was 1.48:1 on the Shamrock hero once the scrim
  came off — now take a solid `#2A2A28`, exactly what the translucent version
  composites to over `--paper`, so nothing changes where it already looked
  right. **Composite the semi-transparent layer before measuring, or the number
  is fiction** — in both directions; the naive measurement said 4.23.

One known exception: placeholder captions sitting on the night gradient measure
~3.4:1 against the gradient's lightest stop. They carry a text-shadow and they
go away when real photography lands.

## Ticketing, prices and the forms that went (2026-09-09)

**Checkout is TicketSignup, not this site.** Every control that offers to sell
a ticket — the header button, the drawer stub, the hero tickets, the two price
stubs on Haunted and on the tickets page, the closing CTAs, and the "one you
can buy now" pitch on Shamrock and Christmas — points at
`https://www.ticketsignup.io/TicketEvent/HauntedBarHopOnBrady`, in a new tab
with `rel="noopener noreferrer"`. The URL is the `TIX` constant in `js/bss.js`
for the two chrome placements; the page CTAs carry it inline. **`tickets.html`
survives as a page**, and the only links still pointing at it are navigational:
"All tickets" in the More menu and the drawer, plus one inline "tickets page"
sentence on Haunted. The homepage pitch ticket used to say "Get tickets" and go
to the event page — it now goes to checkout, because a button that says it
sells you something should.

**Prices came off the live TicketSignup event, and the tiers changed shape.**
Single **$14.99**, and the group tier is a **group of four for $49.96**
($12.49 each) — not the group of five the site had been carrying. The saving is
$10.00 on four, so the chip reads "Save $10" rather than the old "Save 20%",
which is no longer the arithmetic. Every dependent line moved with it: "Bring
three friends, pay less", "$49.96 for the four of you", the small-print
"group of four is one purchase, four tickets", the `data-sub` notes now reading
"From $12.49 each", and the tickets-page meta description. **The listed prices
are the base price; TicketSignup adds its own fee at checkout** ($16.65 and
$14.07 respectively on the day this was written) and the site does not mention
that anywhere.

**Three email captures and the contact form are gone.** None of them had an
endpoint — this is a static site on Vercel, so every one of them swallowed the
address or the message and said nothing, which is worse than not asking. The
footer signup, the "stay up to date" block on Shamrock and the identical one on
Christmas are now Instagram buttons, and the two locked event cards on the
tickets page say "Follow for the date" instead of "Notify me". The contact page
lost its form entirely and is a two-column pair of cards, Instagram and email.
Announcements genuinely break on Instagram first, so this is the honest
mechanism rather than a downgrade.

**Real Shamrock photography.** `images/shamrock-shuffle-polaroid-{1,2,3}.jpg` —
the crew in the green tees, the DJ, and the back patio — replace the three flat
colour placeholders in "What it'll be". All three are cropped to the same 3:4
so they read as prints off one camera; the third is a landscape original and is
centre-cropped. Letting it keep its native 4:3 left it 210px shorter than its
neighbours and the row read as a broken grid. Captions moved off the `.photo`
overlay onto the tape labels.

**The homepage calendar headline** is "Happening now", matching the page it
links to. It was "What's worth leaving for".

## Still open

- **Tickets as a page or a header button?** Both exist right now — the page,
  and the persistent Admit One button in the header. Not yet decided.
- **`brady-street.webp` needs a colour original.** It is a monochrome file, so
  the homepage hero, the Haunted cards and both section backgrounds are the only
  pictures on the site still reading black and white; nothing in the CSS can fix
  that. It is also the flattest, most blown-out frame here, so it was the last
  hero to clear its contrast floor. Contrast is no longer the argument at 50%,
  but the colour still is.
- How much of the MKE ecosystem ships. The five dashed category tabs and the
  neighbourhood chips came off Featured Bars — it is a straight grid of bars now.
- Whether Happening Now should link out to competitors' events.
- The homepage no longer links to About anywhere in the body. The numbers
  section carried that link, and the charity story with it; both went when the
  metrics came out. About is still one click away in the More menu.
- The About charity block is now a figure and a paragraph with no logos. The
  named charities and what the money paid for are still to come.
- All copy is placeholder written in the Shamrock voice. It reads like finished
  copy on purpose, so the tone can be judged — but the owners should write it.

## Related

`../bar-scene-socials/` (v1), `../bar-scene-socials-v2/` (the deployed
one-pager), `../bar-scene-socials-wireframe/` (the low-fi architecture) are all
untouched.
