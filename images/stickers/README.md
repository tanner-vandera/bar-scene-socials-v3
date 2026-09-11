# Calendar stickers

Drop the collage assets for the Happening Now calendar in this folder.

## Naming

`sticker-<slug>.png` — named in the `pins` block of `MONTH` (js/bss.js), keyed
by the day of the month it sits on. A pin does not have to belong to an event:
the Brewers glove sits on Oct 1 with no event of its own, because what it marks
is the playoff run crossing that fortnight.

In use now:

| File | Day | Notes |
|---|---|---|
| `sticker-brewers.png` | Oct 1 | Bottom-anchored so it sits ON the navy playoffs strip |
| `sticker-oktoberfest.png` | Oct 3 | A 2.4:1 banner, not a square badge — see Format |
| `sticker-chance-the-rapper.png` | Oct 4 | |
| `sticker-chief-keef.png` | Oct 14 | |

The two purple tickets by Oct 31 are not files — they are the homepage
curtain's own silhouette (`miniTicket()` in js/bss.js), reused as confetti.

To swap one, keep the filename and drop the new file in. To add one, any new
name works; it needs a line in `pins`.

## Format

- **SVG preferred**, PNG at ~3x the display size is fine. These render between
  46px and 98px wide, so the files in here are 240px (square badges) or 300px
  (the wide lockup).
- No JPEG. Every one of these sits on a near-white sheet and needs a real
  alpha channel, not a white box.
- **`size` in `pins` is a WIDTH; the height follows the file.** A wide lockup
  therefore takes a much larger number than a square badge for a mark that is
  shorter on the page — Oktoberfest is `size: 86` against Chief Keef's `80`
  and renders about a third as tall.
- **Trim the transparent margin before dropping a file in.** The Oktoberfest
  artwork arrived as a 2.4:1 lockup centred in a 531px square, i.e. two-thirds
  empty, which makes `size` mean nothing predictable. Its real bounds were
  found by reading the alpha channel and it was cropped to them.

## What to keep in mind

- **These sit on the white calendar sheet (`#F8F8F6`), not on the page ground.**
  A sticker that was drawn for the dark site will disappear here. If a mark is
  mostly white or cream it needs its own outline or a coloured backing shape.
- **Nothing in this folder should be orange.** `--orange` means "this one is
  ours" everywhere on the site, and the calendar's whole promise is
  "if it's orange, go." A sticker in `--orange` breaks it.
- **Trim the file.** Baked-in padding can't be removed in CSS and throws off
  the alignment inside a strip.
- Size: no rule, but keep SVGs under ~20KB. They're inlined or loaded on a page
  that already carries photography.

## Third-party marks

The Brewers glove, the Oktoberfest lockup and the two artist cut-outs are all
somebody else's marks or likeness. It's fine to put them on a listings calendar
that says where to be and when, but they do not get restyled, recoloured or
combined with the BSS logo — and they are decoration, not endorsement. Each one
is `alt=""` in the markup for the same reason: the name is already in the label
beside it, and a screen reader should not read the collage twice.
