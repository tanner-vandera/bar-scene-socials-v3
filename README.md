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

**The ticket** is the signature object, built to the Figma component
(`Shamrock-Shuffle`, node `2081-85`): a real cinema ticket — scalloped short
edges, a stub at each end carrying the event date, an inset keyline, and a heavy
centred Anton label on orange stock (`#FF9152`) with a red keyline and print
grain. 248px wide at full size. Two layouts, one language:
`full` (2:1, label on two lines) for page CTAs, and `ticket--compact` (3.4:1,
one line) for the header, where a 2:1 ticket cannot fit under a 65px bar. A
`data-sub` renders as a small note under the ticket rather than inside it, since
the Figma component has no slot for it.

**Photography** is not faked. Every image slot is a riso-style colour field with
halftone and grain plus an honest label, so nobody mistakes a placeholder for a
real photo.

## Pre-launch gate — REMOVE ON LAUNCH DAY

`coming-soon.html` + `js/gate.js` put a soft password gate in front of the site
for team review. **This is not security.** The check runs in the visitor's
browser; anyone can read the source or skip it in devtools, and the repo is
public. It keeps casual visitors and crawlers out, nothing more. For a real gate
use Vercel Project → Settings → Deployment Protection → Password Protection,
which runs at the edge before any of this code.

The password is stored as a SHA-256 hash in `js/gate.js` so it is not greppable
in plain text. That does not make it secure.

State lives in `sessionStorage` under `bss-preview`, so it clears when the
browser closes — each person enters it once per session.

**To remove, from this directory:**

```
rm js/gate.js coming-soon.html
sed -i '' '/js\/gate\.js/d' *.html
```

That is the whole removal — nothing else references the gate.

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
