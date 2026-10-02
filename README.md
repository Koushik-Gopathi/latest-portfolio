# Koushik Gopathi — Portfolio

My personal site. Red and white, one typeface doing most of the work, and a
page that is mostly about the things I have built.

**Live:** [koushik-gopathi.vercel.app](https://koushik-gopathi.vercel.app)

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`) |
| Motion | Framer Motion, Lenis for weighted scrolling |
| Type | Archivo (self-hosted, variable weight + width), Instrument Serif via `next/font` |
| Hosting | Vercel — fully prerendered, no server, no database |

First load is about 180 kB of JavaScript and both routes are static.

---

## The sections

| | |
|---|---|
| **Landing** | A full-bleed red plate with my name. On scroll it breaks into twenty shards, centre first and corners last, and the letters travel with the piece behind them. |
| **About** | A pinned block: the opening line set as a statement with a few words in the accent serif, the rest of the bio typing itself out, and the facts a recruiter scans for — course, college, year, CGPA — plus the CV. |
| **Portrait band** | Two rows of my name running in opposite directions, their speed and direction driven by how you are scrolling, with the portrait held still between them. |
| **Work** | Seven project cards fanned like a hand of cards, dealt out from behind the middle as the section arrives. Hovering lifts a card forward; clicking opens it full size. Cards carry Code and Live links, screenshots of the running apps, and a video walkthrough for GuardianMesh. |
| **Skills** | Four rows, no grid. Hovering (or tapping) a row wipes it white and opens it. |
| **Journey** | A red line drawn down the page as you scroll, with a card per year. |
| **Education** | Degree, school record, certifications, leadership, and the CV download. |
| **Contact** | Email and phone, copied on click; LinkedIn and GitHub; a closing marquee. |

A fixed header appears once the landing plate has started to break.

---

## Running it

```bash
npm install
npm run dev
```

Two things that will cost you an afternoon if you do not know them:

- **Check which port it actually took.** If something is holding 3000, Next
  moves to 3001 without much fuss and you end up debugging a stale build.
- **Never run `next build` while `next dev` is running.** They share `.next`
  and the result is a mixture that fails with missing-chunk errors. Stop the
  dev server first. Stopping the terminal is not always enough on Windows —
  check nothing is still listening on the port.

```bash
npm run build && npm start   # production build, served locally
```

---

## Deploying

Pushed to `main` on GitHub, deployed to Vercel. See [docs/DEPLOY.md](docs/DEPLOY.md).

---

## Where things live

| what | where |
|---|---|
| Page title, description, CV path | `src/config/site.ts` |
| Colour and type tokens, shared effects | `src/app/globals.css` |
| Project list, links, screenshots | `src/components/work/ProjectsFan.tsx` |
| Skills rows | `src/components/work/SkillsBentoGrid.tsx` |
| Journey entries | `src/components/journey/JourneyTimeline.tsx` |
| Education, certifications, leadership | `src/components/education/Education.tsx` |
| Contact details | `src/components/footer/ConnectCTA.tsx` |
| Share image, favicon, touch icon | `src/app/opengraph-image.jpg`, `icon.svg`, `apple-icon.png` |
| Screenshots, video, CV, portrait | `public/` |

The site's own URL is not hard-coded: `src/config/url.ts` takes
`NEXT_PUBLIC_SITE_URL` if set, otherwise Vercel's production domain, otherwise
localhost. Attaching a custom domain needs one redeploy and no code change.

---

## Accessibility and motion

Everything that moves has a still version. `prefers-reduced-motion` turns off
the shatter, the marquee, the fan's deal-out and the typewriter, and resolves
each reveal to its finished state. Text on red is solid white at 4.5:1 or
better, which is why the red is `#ee0000` rather than `#ff0000`.
