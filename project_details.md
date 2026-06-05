# MAD Tech — Project Overview

## What is this?
A promotional website for MAD Tech, a fictional tech startup. Built with plain HTML, CSS, and JavaScript — no frameworks.

---

## Pages
| Home | `index.html` | Landing page with hero section |
| Waitlist | `waitlist.html` | Email sign-up form |
| Contact | `contact.html` | Contact message form |
| News | `news.html` | Live tech headlines |

---

## Frontend
- **HTML/CSS/JS** — Core structure, styling, and logic
- **GSAP** — Smooth animations and page transitions
- **Popper.js** — Floating validation tooltips on forms
- **Moment.js** — Dynamic date formatting
- **Vite** — Local dev server and build tool (reads `.env` variables)

---

## Backend
- **Supabase** — Cloud database (PostgreSQL)
  - `waitlist` table — stores sign-up emails
  - `contacts` table — stores contact form messages
  - Row Level Security enabled — visitors can only insert, not read

---

## Environment Variables
Stored in `.env` locally and in Vercel for production:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
---

## Deployment
- **GitHub** → [katrate/mad-tech-startup](https://github.com/katrate/mad-tech-startup)
- **Vercel** → [techstartup.vercel.app](https://techstartup.vercel.app)
- Every push to `main` triggers an automatic Vercel redeploy.
