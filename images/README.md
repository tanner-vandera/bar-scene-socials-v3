# Images

| File | Where it is used |
|---|---|
| `bss-logo.svg` | The logo. Painted as a **CSS mask** (`.logo`), so it takes its colour from the element. Do not add recoloured copies. |
| `haunted-bar-hop-hero.jpg` | **The official Haunted picture.** Homepage hero, Haunted page hero, and every Haunted event card (homepage, about, Christmas and Shamrock pitch cards). Three crawlers in Spider-Man suits. Portrait 2:3 — see the crop note below. |
| `haunted-bar-hop-polaroid-1/2/3.jpg` | The three taped prints, on BOTH the homepage and the Haunted page. Those two rows are deliberately identical — change one, change the other. |
| `haunted-bar-hop-crowd.jpg` | Both `.band--shot` backgrounds (homepage "Next up", Haunted "What you get") AND the square taped print on the tickets page, captioned "The floor". |
| `12bars-of-christmas-hero.jpg` | Christmas hero, every Christmas event card, and the larger of the two Christmas polaroids. |
| `12bars-of-christmas-polaroid.jpg` | The second Christmas polaroid only. |
| `shamrock-shuffle-hero.jpg` | Shamrock hero. |
| `shamrock-shuffle-card.jpg` | Shamrock event card. |
| `TicketButtonEmpty.svg` | Source artwork the ticket silhouette in `bss.js` was traced from. Not loaded at runtime. |

## The Halloween photographs are not from Brady Street

`haunted-bar-hop-hero.jpg`, the three polaroids and `haunted-bar-hop-crowd.jpg`
are from a different Halloween event last year, not from Brady. That is why the
polaroid captions are vague ("The lineup", "Peak hour", "No notes") and carry no
venue, street or year. **Do not caption them with a Brady bar or call them "Last
Halloween on Brady"** - the pictures cannot back the claim. The alt text
describes what is in frame and names no location, for the same reason.

## The Haunted hero needs BOTH knobs, and that was measured

`--hero-pos:85%` + `--hero-b:.7`, set inline on the `.hero` of index.html and
hauntedbarhop.html. Both are load-bearing:

- **Crop.** The Spider-Man trio sits in the bottom half of a 2:3 frame. The
  default 50% throws them away.
- **Exposure.** The frame is flash-lit. Mean luminance is only .023, but the
  flash leaves hot highlights (lit faces, a white striped shirt) exactly where
  the headline lands, and `--violet` is a mid-luminance ink that loses from both
  ends. **At exposure 1 every crop from 50% to 95% fails** - `BSSAudit()` puts
  "Haunted" between 2.25 and 2.75 against a 3:1 floor. This is the case the
  note above warns about: moving the crop cannot save a mid-tone ink, so the
  exposure has to come down. `.7` puts the worst word at 3.44; `.85` passes at
  only 3.02, which is too thin to survive a re-encode.

Verified 0 failures across 26 texts on the homepage and 21 on the Haunted page,
at 1440x900 and at 375x812.

## The social cards are separate renders and go stale silently

The cards in `og/` are separate 1200x630 renders. They do NOT update when a hero
changes, so swapping a hero without re-rendering means every share on iMessage,
Facebook and Twitter keeps showing the old photograph.

- `og/hauntedbarhop.jpg` — the event card. Haunted headline over the Spider-Man
  picture. Rendered from `_og-card.html`.
- `og/default.jpg` — the BRAND card: "Bar Scene Socials / Milwaukee bar crawls ·
  since 2018" over the same Spider-Man picture. Rendered from `_og-brand.html`.
  **It fronts five pages** — home, about, contact, featured, happening-now — so
  it is the card most people see, and it is currently a Halloween photograph.
  When the season turns, re-render it from whatever the homepage hero is then;
  that is the only thing keeping the two in agreement.

Both are rendered from `_og-card.html` / `_og-brand.html` (local-only,
`_*`-ignored) with headless Chrome at
`--window-size=1200,630`, then `sips -s format jpeg -s formatOptions 82` — PNG
~800KB down to ~117KB. **Trap:** set `padding:0` on `body` in that template;
`bss.css` carries `padding-top:var(--hdr-h)` for the fixed header, which shunts
the composition down and clips the URL off the bottom edge. `bin-seo.py` owns
the meta tags that point at these files.

## Swapping a picture

Pictures now run **in colour** with only a light wash over them; the darkness
that keeps type legible is a *plate* sized to the type, not a grade on the
image. That makes swapping a file more consequential than it used to be, not
less: **re-measure the type that sits on it.** Load `_audit.js` into the page
and call `BSSAudit()`.

Three knobs, all set inline where the picture is used, all carrying a comment
recording what was measured:

- `--hero-b` / `--shot-b` — exposure. Both default to `1` (untouched).
- `--hero-pos` — the vertical crop, and the most useful of the three. A portrait
  file in a 16:10 hero throws away 60% of its height; which 40% survives decides
  whether a bright subject lands behind the headline or below it. The Haunted
  hero runs `15%` for exactly that reason.

Two rules that cost real time to learn:

- **Size the plate before you strengthen it.** A plate that misses the cap line
  looks like a strength problem and is a geometry problem.
- **Mid-luminance inks (`--violet`, `--red`) are squeezed from both ends.** No
  plate strength saves them from a lit mid-tone, because the ground passes
  through their own value on the way down. Move the crop instead.

## Two files were deleted on 2026-09-10

`brady-street.webp` (the monochrome historic street scene) and
`haunted-bar-hop-shot.jpg` (the mummy in the window). Both went unused when the
Spider-Man picture became the official Haunted image and both social cards were
re-rendered off it. They are in git history if either is ever wanted back —
`git show HEAD:images/brady-street.webp > images/brady-street.webp`.

## Sizes

No `cwebp`/`magick` on this machine — `sips` only, which cannot write WebP.
New photography is therefore JPEG, resized to ~1800-2200px on the long edge at
quality 50-70, which lands each file between 150KB and 520KB.

## Bar photography

Seven real bars, all `bar-<slug>.jpg`, all 900px on the long edge:
`water-street-brewery`, `jacks-american-pub`, `jo-cats`, `deer-camp`,
`burnhearts`, `finks`, `the-sofie`.

The first four also run as the polaroid strip on the homepage; all seven are the
Featured Bars grid. Those cards are **photo and name only** — the neighbourhood
line, the write-up and the route chip came off, because there is nothing written
up yet and a card carrying three lines of invented copy under a real photograph
is worse than one carrying none. They go back in per bar as the owners write
them.
