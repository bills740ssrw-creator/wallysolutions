# Wally Solutions

Static site for Wally Solutions. No build step, no framework, no dependencies.

Design direction: dark canvas with a teal accent, big display type and motion throughout
(char-reveal hero, double marquee, horizontal process accordion, dual testimonial rails,
client logo slider, FAQ accordion, custom cursor).

## Preview

```powershell
cd C:\Users\Deepanshu\wallysolutions
python -m http.server 8080
```

Open http://127.0.0.1:8080

## Deploy

Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
There is nothing to compile. `index.html` is the entry point.

## Replace before going live

1. **Testimonials.** The quotes in the `#testimonials` section of `index.html` are
   placeholders (role-only attributions, no invented names). Replace them with real
   client feedback — or delete the section — before launch.
2. **Email address.** `hello@wallysolutions.com` appears in `index.html`, `privacy.html`,
   `terms.html` and the JSON-LD block. Swap it for the real inbox.
3. **Domain.** `https://wallysolutions.com/` appears in the canonical tags, OG tags,
   `robots.txt` and `sitemap.xml`. Swap it for the real domain.
4. **Company Instagram.** There is no company profile linked yet. Add it to the footer
   when the account exists.
5. **Legal pages.** `privacy.html` and `terms.html` are plain-language drafts marked as
   pending legal review. Have them checked before launch.

## Files

```
index.html          Hero, about, work, services, process, clients, team,
                    testimonials, packages, FAQ, contact
privacy.html        Privacy policy
terms.html          Terms of service
404.html            Not found page
assets/css/style.css   Full design system (also skins the legal + 404 pages)
assets/js/main.js      Nav, mobile menu, cursor, reveal, accordions,
                       parallax, copy email, back-to-top (no dependencies)
assets/fonts/       Self-hosted variable fonts (Bricolage Grotesque, Geist)
assets/img/         Client screenshots and OG card
robots.txt, sitemap.xml
```

## Notes

- Client thumbnails are real screenshots of `investors-heaven.com` and
  `homegram.co.in`. Re-capture them if those sites change.
- Fonts are self-hosted, so the site makes no third-party requests.
- The contact section is email-first on purpose. No form backend is wired up.
- All animation is CSS + IntersectionObserver, respects `prefers-reduced-motion`,
  and degrades to fully visible content without JavaScript.
- Packs are shown without prices on purpose — every scope is quoted after a call.
  Add numbers to `.pack__price` if you decide to publish rates.
