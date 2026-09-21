# Cursors

The drawn pointer, one per page. Built by `cursor()` in `js/bss.js`; everything
visual is in the `THE CURSOR` block of `css/bss.css`.

| File | Pages |
|---|---|
| `logo.svg` | **The default.** Every page without an event of its own — About, Tickets, Featured, Contact, Happening Now. |
| `ghost.svg` | Home and the Haunted Bar Hop page |
| `clover.svg` | Shamrock Shuffle |
| `snowflake.svg` | 12 Bars of Christmas |

The page-to-cursor map is `CURSOR_FOR` in `js/bss.js`, keyed on the
`data-page` attribute of `<body>`. A page whose key is missing gets `logo.svg`,
so a NEW page needs nothing here unless it wants its own mark.

## They are two-tone on purpose

White body, black keyline, no `currentColor`. The keyline is the only thing
holding the shape together on the white bands, and the white body is the only
thing holding it together on the dark ones — so **neither colour is optional**,
and there is no per-page tint any more. An earlier version of these was a
single-colour inline `<svg>` that took the event's ink; that is gone, and the
`--cur-c` variable with it.

## They are `<img>`, which costs one rule

Loading the art as a file means it may not have arrived when the pointer first
moves. The native arrow is therefore hidden (`html.has-cur`) only once the
image has actually loaded AND the pointer has moved — `cursor()` gates both on
the same `ready` flag. If the file 404s the drawn cursor removes itself and the
real arrow stays. **Do not hoist that class back to boot time**: a moment with
no pointer at all is a genuine bug, a missing doodle is not.

## Size and crop

Each file is cropped tight to its own artwork, so the four viewBoxes have
different aspect ratios (the logo is wide, the ghost is tall). They are fitted
with `object-fit:contain` inside a 42px square and their longest dimensions are
all within ~7% of each other, which is what keeps them optically the same size.
**A replacement should be cropped tight the same way** — padding baked into the
viewBox reads as a smaller cursor, not a centred one.

## Replacing one in place needs a ?v=

Same rule as the rest of `images/` — see the note in `../README.md`. These are
referenced from `js/bss.js` rather than the HTML, so `bin-bump.sh` does NOT
touch them; a file replaced under its existing name needs its `?v=` added by
hand in `CURSOR_SRC`, or a new filename.
