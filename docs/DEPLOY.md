# Running and deploying

## Locally

```bash
npm install
npm run dev
```

Two things will waste your afternoon if you do not know them:

- **Check which port it actually took.** If a stale server is holding 3000,
  Next moves to 3001 without much fuss and you end up debugging an old build.
- **Never run `next build` while `next dev` is running.** They share `.next`,
  and the result is a broken mixture — missing chunks, a 500 on every request.
  Stop the dev server, and on Windows check nothing is still listening:

```bash
npx next start -p 3000
```

## Building

```bash
npm run build && npm start
```

The whole site prerenders to static files — no server, no database, no API.

## Deploying

The repo is `Koushik-Gopathi/latest-portfolio` and the Vercel project is
`koushik-gopathi`. Pushing to `main` is the source of truth for the code.

If the Vercel GitHub app has access to the repo, every push to `main`
redeploys on its own. If it does not, deploy from the command line:

```bash
npx vercel deploy --prod --yes
```

To connect pushes to deploys, install the Vercel app for this repository
(github.com/apps/vercel), then:

```bash
npx vercel git connect https://github.com/Koushik-Gopathi/latest-portfolio
```

### A domain

Buy it anywhere, then add it under Settings → Domains in the Vercel project;
Vercel issues the certificate itself. The site's URL comes from
`src/config/url.ts`, which reads Vercel's production domain at build time, so
**redeploy once after attaching a domain** — the pages are prerendered and the
old address is baked into them until you do.

## Changing content

| what | where |
|---|---|
| Page title, description, CV path | `src/config/site.ts` |
| Projects, links, screenshots | `src/components/work/ProjectsFan.tsx` |
| Skills, journey, education, contact | the component for that section |
| Colours, type, shared effects | `src/app/globals.css` |

## Utilities

```bash
npm run shoot -- hero 1440 900 0 4200        # screenshot: name, w, h, scrollY, wait
npm run shoot -- whole 1440 900 0 4200 full  # full page
```

`tools/` is optional — `npm uninstall playwright && rm -rf tools` if you would
rather not carry it.
