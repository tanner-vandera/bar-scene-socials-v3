# Images

| File | Where it is used |
|---|---|
| `bss-logo.svg` | The logo. Painted as a **CSS mask** (`.logo`), so it takes its colour from the element. Do not add recoloured copies. |
| `haunted-bar-hop-shot.jpg` | Haunted Bar Hop hero **and** the polaroid in the homepage "Next up" section. |
| `brady-street.webp` | Haunted event cards everywhere, plus the homepage hero and both `.band--shot` backgrounds. **Monochrome source file** — see below. |
| `12bars-of-christmas-hero.jpg` | Christmas hero, every Christmas event card, and the larger of the two Christmas polaroids. |
| `12bars-of-christmas-polaroid.jpg` | The second Christmas polaroid only. |
| `shamrock-shuffle-hero.jpg` | Shamrock hero. |
| `shamrock-shuffle-card.jpg` | Shamrock event card. |
| `TicketButtonEmpty.svg` | Source artwork the ticket silhouette in `bss.js` was traced from. Not loaded at runtime. |

## brady-street.webp has no colour in it

Mean saturation 0.000 — it is a black-and-white file. Everywhere it appears
will read black and white however the CSS is set. Every other picture here is
colour and renders in colour. Drop a colour original in its place and nothing
else needs to change.

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
