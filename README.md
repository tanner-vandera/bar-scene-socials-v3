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

**Colour** — paper `#F4F1EC` and warm ink `#24291F` carry everything;
rust `#C0512F` is the single accent and owns every ticket, CTA and mark.
Forest `#38654A` carries the two green seasons. The nightlife gradient
(`--night-1/2/3`) appears **only** on Haunted Bar Hop surfaces — it is the
after-dark moment, and used anywhere else it turns into a generic club flyer.

**Motion** — deliberately almost none. The owners said the animation was too
much, so there are no scroll reveals, no parallax, no counters. What is left is
interaction feedback only: hover, focus, the ticket lift, the mobile drawer.
`prefers-reduced-motion` kills even that.

## Pages

`index.html` (home) · `haunted-bar-hop.html` · `christmas.html` ·
`shamrock.html` · `tickets.html` · `happening-now.html` ·
`featured-bars.html` · `about.html` · `contact.html`

The wireframe's sitemap page is gone — it was explicitly not part of the site.

## Shared pieces

`js/bss.js` holds the header, footer, brand mark, ticket, and the two
hand-drawn marks, so all nine pages stay in sync. Edit the `NAV`, `MORE` and
`FUTURE` arrays at the top of that file to change navigation everywhere.

**The brand mark is a placeholder.** Three hand-drawn zigzag waves — a crowd
moving as one, a soundwave, the zigzag from the owners' own mood board. It
satisfies their stated non-negotiables (not a letterform, not literal, works in
any season) but it is a stand-in, not a proposal.

**The ticket** is the signature object: Admit One silhouette with side notches,
a perforated stub, halftone on the stub and vertical stub type. One component,
seven appearances, four states (Register / Going Fast / Last Chance / Sold Out).

**Photography** is not faked. Every image slot is a riso-style colour field with
halftone and grain plus an honest label, so nobody mistakes a placeholder for a
real photo.

## Accessibility

Text was audited against WCAG AA with a contrast script; label greys, small
rust text and the ink-band numerals were all darkened as a result. One known
exception: placeholder captions sitting on the night gradient measure ~3.4:1
against the gradient's lightest stop. They carry a text-shadow and they go away
when real photography lands.

## Still open

- **Tickets as a page or a header button?** Both exist right now — the page,
  and the persistent Admit One button in the header. Not yet decided.
- How much of the MKE ecosystem ships (five tabs on Featured Bars are dashed
  placeholders from the client doc).
- Whether Happening Now should link out to competitors' events.
- All copy is placeholder written in the Shamrock voice. It reads like finished
  copy on purpose, so the tone can be judged — but the owners should write it.

## Related

`../bar-scene-socials/` (v1), `../bar-scene-socials-v2/` (the deployed
one-pager), `../bar-scene-socials-wireframe/` (the low-fi architecture) are all
untouched.
