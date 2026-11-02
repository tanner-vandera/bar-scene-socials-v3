import io, json, re

# The apex 308-redirects to www — www IS the canonical host on Vercel.
# Pointing canonical/og:url/sitemap at the apex made every one of them
# name a URL that immediately redirects, which is exactly what a
# canonical is supposed to prevent. If the Vercel primary domain is ever
# flipped to the apex, change this ONE line and re-run.
SITE = 'https://www.barscenesocials.com'
# Cache-bust token for assets replaced UNDER THEIR EXISTING NAME. Kept in
# step with the stylesheets by bin-bump.sh, which rewrites every ?v= in the
# HTML; the value here only matters when this script regenerates the block.
ASSET_V = '1793654911'
TIX  = 'https://www.ticketsignup.io/TicketEvent/HauntedBarHopOnBrady'
IG   = 'https://www.instagram.com/barscenesocials/'

ORG = {"@type":"Organization","@id":SITE+"/#org","name":"Bar Scene Socials",
       "url":SITE+"/","logo":SITE+"/images/bss-logo.svg",
       "email":"barscenesocials@gmail.com","sameAs":[IG],
       "areaServed":{"@type":"City","name":"Milwaukee","addressRegion":"WI"}}

def place(street=None, name=None):
    a={"@type":"PostalAddress","addressLocality":"Milwaukee","addressRegion":"WI","addressCountry":"US"}
    if street: a["streetAddress"]=street; a["postalCode"]="53202"
    return {"@type":"Place","name":name or street or "Milwaukee","address":a}

# ── 12 Bars of Christmas ticket links ──────────────────────────────
# One TicketSignup event PER STREET — decoded from the owners' three QR
# codes on 11/2/26. The same three URLs are on every [data-street] link in
# the HTML (12barsofchristmas, index, tickets); change all four together.
# If any is emptied the Event carries NO offers — see trap 2 in README
# "Search & sharing": a fake InStock offer is worse than none.
XMAS_TIX = {
    'brady': ('Brady Street', 'https://www.ticketsignup.io/TicketEvent/12barsofchristmasBradySt'),
    'water': ('Water Street', 'https://www.ticketsignup.io/TicketEvent/12BarsOfChristmasWaterSt'),
    'mlk':   ('MLK & Third',  'https://www.ticketsignup.io/TicketEvent/12BarsOfChristmasThirdSt'),
}
# EARLY BIRD, quoted WITH the fee like the Haunted prices: TicketSignup
# shows "$11 incl. $1 Fee" on all three. It ends when general admission
# opens, which TicketSignup publishes as "Mon November 16, 2026 at
# 12:00am EST" — 11pm Central on the 15th, so that is validThrough.
# No validFrom: the links were live on 11/2 though the owners said 11/3,
# and a guessed start date is worse than none.
# WHEN EARLY BIRD ENDS: change XMAS_PRICE to the general admission price
# TicketSignup then shows (with fee), and drop XMAS_UNTIL.
XMAS_PRICE = '11.00'
XMAS_UNTIL = '2026-11-15T23:00:00-06:00'

def xmas_offers():
    if not all(u for _, u in XMAS_TIX.values()):
        return None
    out = []
    for name, url in XMAS_TIX.values():
        o = {"@type":"Offer","name":"12 Bars of Christmas — "+name,"url":url,
             "price":XMAS_PRICE,"priceCurrency":"USD",
             "availability":"https://schema.org/InStock"}
        if XMAS_UNTIL: o["validThrough"] = XMAS_UNTIL
        out.append(o)
    return out

def event(name,slug,start,end,loc,desc,offers=None,status="EventScheduled"):
    e={"@context":"https://schema.org","@type":"Event","name":name,
       "startDate":start,
       "eventStatus":"https://schema.org/"+status,
       "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
       "location":loc,"description":desc,
       # versioned like og:image above — Google caches the image it pulls
       # for a rich result against this URL too, and three of these
       # renders changed on 2026-09-20 without changing filename
       "image":[SITE+"/images/og/"+slug+".jpg?v="+ASSET_V],
       "url":SITE+"/"+slug,
       # inlined, NOT {"@id": .../#org} — that node only exists on the
       # homepage, and a crawler parsing this page alone cannot resolve a
       # cross-document @id reference.
       "organizer":{"@type":"Organization","name":"Bar Scene Socials",
                    "url":SITE+"/","sameAs":[IG]},
       "isAccessibleForFree":False,
       "typicalAgeRange":"21-"}
    if end: e["endDate"]=end
    if offers: e["offers"]=offers
    return e

HAUNTED_DESC = ("Milwaukee's only Halloween bar crawl on Brady Street. Fourteen bars, free cover at all "
                "of them, drink and food specials, costume prizes and daytime DJs. 21+.")

PAGES = {
 'index.html': dict(
   # The share card follows the headline event (12 Bars from 11/2/26):
   # default.jpg is a Halloween frame, and a link pasted into a group chat
   # in December should not open on Spider-Men. Back to 'default' after.
   url='/', slug='12barsofchristmas',
   title="Bar Scene Socials — Milwaukee's Most Anticipated Bar Crawls",
   # Leads with whichever event is on sale — 12 Bars from 11/2/26.
   desc=("12 Bars of Christmas, Saturday 12/12/26 — Milwaukee's ugly sweater bar crawl on "
         "three streets, benefiting Toys for Tots. $11 early bird through 11/15. 21+."),
   ogtype='website',
   ld=[{"@context":"https://schema.org","@graph":[
        ORG,
        {"@type":"WebSite","@id":SITE+"/#site","url":SITE+"/","name":"Bar Scene Socials",
         "publisher":{"@id":SITE+"/#org"},"inLanguage":"en-US"}]}]),

 'hauntedbarhop.html': dict(
   url='/hauntedbarhop', slug='hauntedbarhop',
   title="Haunted Bar Hop 2026 — Milwaukee Halloween Bar Crawl",
   # Past tense since 11/2/26: the 2026 crawl has happened, and a snippet
   # that reads as a live sale sends people to a page with no tickets.
   desc=("Milwaukee's Halloween bar crawl on Brady Street, 3pm–8pm. Fourteen bars, free "
         "cover, specials and costume prizes. 2026 was a wrap — join us next year. 21+."),
   ogtype='article',
   ld=[event("Haunted Bar Hop on Brady","hauntedbarhop",
        # 10/31/2026 is still CDT — US DST ends Sun 11/01/2026
        "2026-10-31T15:00:00-05:00","2026-10-31T20:00:00-05:00",
        # No offers since 11/2/26: the crawl has happened and the page no
        # longer sells tickets. The 2026 AggregateOffer ($13.98–$16.65,
        # quoted with fees, validThrough 10/31 11:59am CDT) is in git
        # history for next year.
        place("Brady Street"), HAUNTED_DESC)]),

 '12barsofchristmas.html': dict(
   url='/12barsofchristmas', slug='12barsofchristmas',
   # "Ugly sweater bar crawl" is what people actually search for in
   # December; "12 Bars of Christmas" alone is a phrase many cities share,
   # so Milwaukee goes in the title, not just the description.
   title="12 Bars of Christmas 2026 — Milwaukee Ugly Sweater Bar Crawl",
   desc=("Saturday 12/12/26, 12–5pm. Pick Brady Street, Water Street or MLK & Third. "
         "Holiday mug, lanyard, donation to Toys for Tots. $11 early bird to 11/15. 21+."),
   ogtype='article',
   # 12pm start confirmed by TicketSignup (11/2). PLACEHOLDER: the 5pm
   # finish is last year's, shown on the page too until the owners confirm
   # this year's. 12/12/26 is CST, -06:00.
   # One Place for the whole crawl, named for the three streets: Google's
   # event results take a single location, and three separate Events for
   # one ticketed night would read as three events.
   ld=[event("12 Bars of Christmas 2026","12barsofchristmas",
        "2026-12-12T12:00:00-06:00","2026-12-12T17:00:00-06:00",
        place(name="Brady Street, Water Street and MLK Drive / Third Street, Milwaukee"),
        "The thirteenth annual 12 Bars of Christmas, Milwaukee's ugly sweater bar crawl. "
        "Choose from three streets — Brady, Water or MLK & Third. Every ticket includes a "
        "holiday drinking mug, a passport lanyard with food and drink specials, no cover, and a "
        "donation to Toys for Tots, which this crawl has raised over $22,000 for since 2013. 21+.",
        offers=xmas_offers())]),

 'shamrockshuffle.html': dict(
   url='/shamrockshuffle', slug='shamrockshuffle',
   title="Shamrock Shuffle #18 — Milwaukee St. Patrick's Bar Crawl",
   desc=("Saturday 3/6/27 in Milwaukee — the eighteenth Shamrock Shuffle, the crawl that started "
         "Bar Scene Socials. Not on sale yet. 21+."),
   ogtype='article',
   # same as Christmas — date only, so endDate is the same day.
   ld=[event("Shamrock Shuffle #18","shamrockshuffle","2027-03-06","2027-03-06",
        place(), "Milwaukee's Shamrock Shuffle bar crawl, eighteenth year. Green shirts, ten-plus "
                 "bars and a patio you will not leave. 21+.")]),

 'tickets.html': dict(
   url='/tickets', slug='12barsofchristmas',
   title="Tickets — 12 Bars of Christmas, Milwaukee 12/12/26",
   desc=("12 Bars of Christmas tickets, 12/12/26: choose Brady Street, Water Street or "
         "MLK & Third. $11 early bird through 11/15, with a holiday mug and lanyard. 21+."),
   ogtype='website', ld=[]),

 'happeningnow.html': dict(
   url='/happeningnow', slug='default',
   title="Happening Now — Milwaukee Events, November & December 2026",
   desc=("A very short answer to “is anything on in Milwaukee?” — what is worth leaving "
         "the house for this month, picked by the people who run the bar crawls."),
   ogtype='website', ld=[]),

 'featured.html': dict(
   url='/featured', slug='default',
   title="Featured Bars — Brady Street & Milwaukee",
   desc=("The Milwaukee bars worth your night, chosen by the people who run the crawls — Brady "
         "Street regulars and the ones we send everyone to."),
   ogtype='website', ld=[]),

 'about.html': dict(
   url='/about', slug='default',
   title="About — Bar Scene Socials, Milwaukee Bar Crawls",
   desc=("We host Milwaukee’s most anticipated bar crawl traditions: 12 Bars of Christmas, "
         "the Shamrock Shuffle and the Haunted Bar Hop. Local organizers, 21+."),
   ogtype='website', ld=[]),

 'contact.html': dict(
   url='/contact', slug='default',
   title="Contact — Bar Scene Socials, Milwaukee",
   desc=("Get in touch with Bar Scene Socials about the Milwaukee bar crawls — crawler questions, "
         "bars and sponsors who want in, or press."),
   ogtype='website', ld=[]),
}

# ── injector ────────────────────────────────────────────────────────
MARK_OPEN  = '<!-- SEO:begin — generated, see README "Search & sharing" -->'
MARK_CLOSE = '<!-- SEO:end -->'

def esc(t):
    return (t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;'))

def block(cfg):
    u   = SITE + cfg['url']
    # The og/ renders are cached by the SCRAPERS, not just by browsers:
    # Facebook, iMessage and X keep a preview against the image URL and do
    # not re-fetch it on their own. Three of these were re-rendered on
    # 2026-09-20 (new accent orange; the Shamrock lockup had Shuffle and
    # 18 the wrong way round) and the filenames did not change, so the
    # URL has to. Same rule as images/README.md states for in-place swaps.
    img = SITE + '/images/og/' + cfg['slug'] + '.jpg' + '?v=' + ASSET_V
    L = [MARK_OPEN,
      '<link rel="canonical" href="%s">' % u,
      # Search engines do not read SVG icons. Google Search only takes raster
      # formats, so with the SVG alone it fell back to apple-touch-icon.png;
      # Bing found nothing at all and showed its grey globe. favicon.ico is
      # the raster copy for them. sizes="32x32" (not "any") keeps browsers
      # that understand SVG on the sharper SVG below. No ?v= — Google wants a
      # stable favicon URL, and Bing probes the bare /favicon.ico path anyway.
      '<link rel="icon" href="/favicon.ico" sizes="32x32">',
      # The mark changed from orange to white on 2026-09-20 under the SAME
      # filename, and favicon.svg is served max-age=604800 — a whole week of
      # the old icon for anyone who had already loaded the site. A ?v= is the
      # only thing that moves them onto the new one. bin-bump.sh rewrites
      # every ?v= in the HTML, so this stays in step with the stylesheets.
      '<link rel="icon" href="/favicon.svg?v=%s" type="image/svg+xml">' % ASSET_V,
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
      '<meta name="theme-color" content="#111110">',
      '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">',
      '<meta property="og:site_name" content="Bar Scene Socials">',
      '<meta property="og:type" content="%s">' % cfg['ogtype'],
      '<meta property="og:locale" content="en_US">',
      '<meta property="og:url" content="%s">' % u,
      '<meta property="og:title" content="%s">' % esc(cfg['title']),
      '<meta property="og:description" content="%s">' % esc(cfg['desc']),
      '<meta property="og:image" content="%s">' % img,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      '<meta property="og:image:alt" content="%s">' % esc(cfg['title']),
      '<meta name="twitter:card" content="summary_large_image">',
      '<meta name="twitter:title" content="%s">' % esc(cfg['title']),
      '<meta name="twitter:description" content="%s">' % esc(cfg['desc']),
      '<meta name="twitter:image" content="%s">' % img,
      '<meta name="geo.region" content="US-WI">',
      '<meta name="geo.placename" content="Milwaukee">',
    ]
    for ld in cfg['ld']:
        L.append('<script type="application/ld+json">%s</script>'
                 % json.dumps(ld, ensure_ascii=False, separators=(',',':')))
    L.append(MARK_CLOSE)
    return '\n'.join(L)

if __name__ == '__main__':
    for f, cfg in PAGES.items():
        s = io.open(f, encoding='utf-8').read()
        # title + description are rewritten in place, not duplicated
        s = re.sub(r'<title>.*?</title>', '<title>%s</title>' % esc(cfg['title']), s, flags=re.S)
        s = re.sub(r'<meta name="description" content=".*?">',
                   '<meta name="description" content="%s">' % esc(cfg['desc']), s, flags=re.S)
        # replace an existing generated block, or insert before the stylesheets
        if MARK_OPEN in s:
            s = re.sub(re.escape(MARK_OPEN) + r'.*?' + re.escape(MARK_CLOSE), block(cfg), s, flags=re.S)
        else:
            anchor = '<link rel="stylesheet" href="css/fonts.css'
            i = s.index(anchor)
            s = s[:i] + block(cfg) + '\n' + s[i:]
        io.open(f, 'w', encoding='utf-8').write(s)
        print('%-24s title/desc + %d meta + %d json-ld' % (f, 22, len(cfg['ld'])))
