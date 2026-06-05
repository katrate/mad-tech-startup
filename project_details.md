# MAD Tech Startup Website

Welcome to the codebase for the MAD Tech promotional website!

## Frontend Stack
- **Vanilla HTML/CSS/JS**: A lightweight, fast, and dependency-free foundation ensuring maximum performance and accessibility. Built natively for modern web browsers without heavy frameworks.
- **GSAP (GreenSock Animation Platform)**: Used extensively for premium, smooth micro-interactions and scroll animations, such as the initial staggered page load transitions and the news card pop-ins.
- **Popper.js**: Integrates elegant floating tooltips for robust form validation feedback, replacing the ugly default browser alerts.
- **Moment.js**: Handles seamless date and time manipulation, calculating relative times (e.g., "2 hours ago") for the Hacker News API integrations.
- **Vite**: Used locally to seamlessly inject and manage secure `.env` variables without exposing them in the client-side code, while supporting modern ES Modules.

## Backend Stack
- **Supabase**: A fully open-source Firebase alternative powered by PostgreSQL.
- **Waitlist Table**: Securely captures and stores visitor emails who opt-in for early access updates. Duplicate entries are blocked by database-level unique constraints.
- **Contacts Table**: Records direct message submissions from the Contact form.
- **Row Level Security (RLS)**: Enforced directly on the PostgreSQL database to ensure that anonymous users can only perform `INSERT` operations (submitting forms) and cannot read or query other users' sensitive information.

## Integrations
- **Algolia Hacker News API**: A live REST API integration used to fetch and display the most recent global technology advancements natively on the site.
