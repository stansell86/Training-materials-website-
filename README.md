# Training Materials Website

Marketing website for a company that creates **animated, interactive training materials** that help businesses onboard new employees and upskill current ones.

It's a fast, dependency-free static site (plain HTML, CSS, and JavaScript), so there is no build step.

## What's included

| Section | Description |
| --- | --- |
| **Hero** | Headline, calls to action, animated stat counters, and an animated SVG "lesson" illustration |
| **Services** | Explainer animations, interactive scenarios, onboarding, upskilling, quizzes, LMS-ready (SCORM/xAPI) delivery |
| **Try a demo** | A working 3-question interactive sample lesson with instant feedback and a progress bar |
| **How it works** | 4-step process: Discover → Design → Build → Launch |
| **Industries** | The industries you serve |
| **Contact** | Lead-capture form (validation included; connect a form service to receive messages) |

It's responsive (phone → desktop), supports dark mode, honors "reduce motion" settings, and is keyboard/screen-reader friendly.

## Project structure

```
index.html              Page content
css/styles.css          Styles; brand colors are at the top in :root
js/main.js              Nav, scroll animations, demo quiz, contact form
assets/favicon.svg      Logo / favicon
.github/workflows/      Automatic deploy to GitHub Pages
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Make it yours: checklist

- [ ] Replace **YourBrand** with your company name (`index.html`: title, logo, footer)
- [ ] Replace `hello@yourbrand.com` with your real email
- [ ] Update brand colors in `css/styles.css` (`--brand`, `--accent`, …)
- [ ] Replace `assets/favicon.svg` with your logo
- [ ] Replace the placeholder hero stats with real results (or remove them)
- [ ] Edit the demo quiz questions in `js/main.js` (`questions` array)
- [ ] Set `FORM_ENDPOINT` in `js/main.js` to a form service (e.g. [Formspree](https://formspree.io)) to receive inquiries
- [ ] Add client logos, testimonials, and portfolio samples as you get them

## Deploying

A GitHub Actions workflow (`.github/workflows/pages.yml`) publishes the site to **GitHub Pages** on every push to `main`.
To turn it on: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Then add a custom domain in the same settings page if you have one.

The site also works as-is on Netlify, Vercel, or Cloudflare Pages: point them at the repo root, with no build command.
