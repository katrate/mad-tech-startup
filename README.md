# 🚀 MAD Tech Startup
A sleek, high-performance promotional website for **MAD Tech**, a visionary tech startup redefining the future of digital experiences. Built without heavy frameworks, relying on vanilla web technologies powered by modern tooling.

---

## ✨ Features

- **Dynamic Interactive Background:** A custom-built particle canvas that responds to user interactions.
- **Fluid Animations:** Powered by **GSAP** for smooth scroll triggers and page transitions.
- **Live Tech News:** Fetches and displays real-time technology headlines using the Hacker News API.
- **Form Validations & Tooltips:** Custom floating validation UI using **Popper.js**.
- **Backend Integration:** Real-time data storage for Waitlist and Contact forms using **Supabase**.

---

## 🗺️ Site Structure

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | The main landing page featuring the hero section, stats, and testimonials. |
| **Waitlist** | `waitlist.html` | An interactive email sign-up form for early access. |
| **Contact** | `contact.html` | A functional contact message form. |
| **News** | `news.html` | A live feed of the latest tech headlines. |

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 / CSS3 / Vanilla JS** — The core building blocks.
- **GSAP (GreenSock)** — Industry-standard animation library.
- **Popper.js** — Positioning engine for interactive tooltips.
- **Moment.js** — Robust date formatting and parsing.
- **Vite** — Lightning-fast local development server and bundler.

### Backend (BaaS)
- **Supabase** — Open-source Firebase alternative (PostgreSQL under the hood).
  - `waitlist` table: securely stores user sign-up emails.
  - `contacts` table: captures incoming contact requests.
  - *Note: Row Level Security (RLS) is strictly enabled so public visitors can only insert records, not read them.*

---

## 🌐 Deployment

The project is configured for seamless deployment on **Vercel**.
- **Live Preview:** [techstartup.vercel.app](https://techstartup.vercel.app)
- **Continuous Deployment:** Any pushes to the `main` branch automatically trigger a new deployment.

---
