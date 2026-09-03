# Hero photography

## brady-street.jpg  ← the Haunted Bar Hop hero

Used by the homepage hero and the Haunted Bar Hop hero (same event, same
picture). **Drop the real Brady Street photograph here, overwriting the
placeholder that is currently in this folder.**

The hero is full-bleed and cropped with `object-fit:cover`, so give it a
wide landscape file — 2000px on the long edge is plenty. A black-and-white
original is fine and arguably better: `.hero__media--shot` already lays a
warm orange/red multiply wash and a halftone dot screen over the top, so a
mono photo picks up the brand colour rather than fighting it.

If the file is missing the hero falls back to the orange/red night
gradient, which is the intended fallback — the alt text is hidden so it
never paints across the hero.

**After swapping the real photo in, re-run the hero contrast audit.** The
headline on this hero is `--orange`, which needs 3:1 against whatever sits
behind it. A photo with a bright sky or road can drop that below 2:1; the
radial scrim in `.hero__scrim` is sized to pull it back, but the numbers
should be re-measured against the actual picture rather than assumed.
