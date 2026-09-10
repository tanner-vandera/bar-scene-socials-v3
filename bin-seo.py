import io, json, re

# The apex 308-redirects to www — www IS the canonical host on Vercel.
# Pointing canonical/og:url/sitemap at the apex made every one of them
# name a URL that immediately redirects, which is exactly what a
# canonical is supposed to prevent. If the Vercel primary domain is ever
# flipped to the apex, change this ONE line and re-run.
SITE = 'https://www.barscenesocials.com'
TIX  = 'https://www.ticketsignup.io/TicketEvent/HauntedBarHopOnBrady'
IG   = 'https://www.instagram.com/barscenesocials/'

ORG = {"@type":"Organization","@id":SITE+"/#org","name":"Bar Scene Socials",
       "url":SITE+"/","logo":SITE+"/images/bss-logo.svg",
       "email":"barscenesocials@gmail.com","sameAs":[IG],
       "areaServed":{"@type":"City","name":"Milwaukee","addressRegion":"WI"}}

def place(street=None):
    a={"@type":"PostalAddress","addressLocality":"Milwaukee","addressRegion":"WI","addressCountry":"US"}
    if street: a["streetAddress"]=street; a["postalCode"]="53202"
    return {"@type":"Place","name":street or "Milwaukee","address":a}

def event(name,slug,start,end,loc,desc,offers=None,status="EventScheduled"):
    e={"@context":"https://schema.org","@type":"Event","name":name,
       "startDate":start,
       "eventStatus":"https://schema.org/"+status,
       "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
       "location":loc,"description":desc,
       "image":[SITE+"/images/og/"+slug+".jpg"],
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

HAUNTED_DESC = ("Milwaukee's only Halloween bar crawl on Brady Street. Ten bars, no cover at any of "
                "them, drink specials at every stop, costume prizes, daytime DJs and an official "
                "afterparty. 21+.")

PAGES = {
 'index.html': dict(
   url='/', slug='default',
   title="Bar Scene Socials — Milwaukee Bar Crawls Since 2018",
   desc=("Milwaukee bar crawls run by people who actually go. The Haunted Bar Hop, "
         "12 Bars of Christmas and the Shamrock Shuffle. Three days a year, since 2018."),
   ogtype='website',
   ld=[{"@context":"https://schema.org","@graph":[
        ORG,
        {"@type":"WebSite","@id":SITE+"/#site","url":SITE+"/","name":"Bar Scene Socials",
         "publisher":{"@id":SITE+"/#org"},"inLanguage":"en-US"}]}]),

 'hauntedbarhop.html': dict(
   url='/hauntedbarhop', slug='hauntedbarhop',
   title="Haunted Bar Hop 2026 — Milwaukee Halloween Bar Crawl",
   desc=("Saturday 10/31/26 on Brady Street, 3pm–8pm with an afterparty DJ. Ten bars, no cover, "
         "drink specials, costume prizes and a bingo card. From $12.40. 21+."),
   ogtype='article',
   ld=[event("Haunted Bar Hop on Brady","hauntedbarhop",
        # 10/31/2026 is still CDT — US DST ends Sun 11/01/2026
        "2026-10-31T15:00:00-05:00","2026-10-31T20:00:00-05:00",
        place("Brady Street"), HAUNTED_DESC,
        offers={"@type":"AggregateOffer","url":TIX,"priceCurrency":"USD",
                "lowPrice":"12.40","highPrice":"14.99","offerCount":"2",
                "availability":"https://schema.org/InStock"})]),

 '12barsofchristmas.html': dict(
   url='/12barsofchristmas', slug='12barsofchristmas',
   title="12 Bars of Christmas 2026 — Milwaukee Bar Crawl",
   desc=("Saturday 12/12/26 in Milwaukee. Twelve bars, terrible jumpers and a souvenir stein. "
         "Tickets are not on sale yet — the date breaks on Instagram first. 21+."),
   ogtype='article',
   # date-only startDate: the running time has not been announced, and a
   # made-up one would be worse than none
   ld=[event("12 Bars of Christmas","12barsofchristmas","2026-12-12",None,
        place(), "Milwaukee's 12 Bars of Christmas bar crawl. Twelve bars, Christmas jumpers, "
                 "a souvenir stein and a DJ. 21+.")]),

 'shamrockshuffle.html': dict(
   url='/shamrockshuffle', slug='shamrockshuffle',
   title="Shamrock Shuffle #18 — Milwaukee St. Patrick's Bar Crawl",
   desc=("Saturday 3/6/27 in Milwaukee — the eighteenth Shamrock Shuffle, the crawl that started "
         "Bar Scene Socials. Not on sale yet. 21+."),
   ogtype='article',
   ld=[event("Shamrock Shuffle #18","shamrockshuffle","2027-03-06",None,
        place(), "Milwaukee's Shamrock Shuffle bar crawl, eighteenth year. Green shirts, ten-plus "
                 "bars and a patio you will not leave. 21+.")]),

 'tickets.html': dict(
   url='/tickets', slug='hauntedbarhop',
   title="Tickets — Haunted Bar Hop, Milwaukee 10/31/26",
   desc=("Haunted Bar Hop tickets, Saturday 10/31/26 on Brady Street: $14.99 single, or $12.40 "
         "each in a group of four ($49.60 total). 21+."),
   ogtype='website', ld=[]),

 'happeningnow.html': dict(
   url='/happeningnow', slug='default',
   title="Happening Now — Milwaukee Events, October 2026",
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
   desc=("Eight years of Milwaukee bar crawls run by people who actually go to them. No national "
         "operator, no office — three events a year on streets we drink on."),
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
    img = SITE + '/images/og/' + cfg['slug'] + '.jpg'
    L = [MARK_OPEN,
      '<link rel="canonical" href="%s">' % u,
      '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
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
        print('%-24s title/desc + %d meta + %d json-ld' % (f, 21, len(cfg['ld'])))
