# aiRoast

aiRoast.app

## Checklist prod

- [x] Buy domain
- [x] Setup domain in cloudflare
- [] setup domain in vercel
- [] update url in robots.ts and sitemap
- [] update url in supabase auth config
- [] Configure custom bucket domain and add to next.config

- [] Set up analytics
- [] trigger google search to index the site

## Test strip locally

install cli and run: stripe listen --forward-to
localhost:3000/api/webhooks/stripe
