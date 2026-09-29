# Bread of Life Campus Fellowship Website

A full-stack web application for **Kapasa Makasa University Bread of Life Campus Fellowship**.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Backend / Auth / DB / Storage**: Supabase (free tier)
- **Hosting (Recommended)**: **Vercel** (best free option for Next.js)

### Why Vercel?
- Free tier is generous (hobby plan)
- Zero-config deployment for Next.js
- Automatic HTTPS, previews, and edge network
- Seamless integration with Supabase
- Alternative free options: Netlify, Cloudflare Pages

---

## Quick Start (VS Code)

### 1. Open in VS Code
```bash
cd bol-fellowship
code .
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a Supabase project
1. Go to https://supabase.com → New Project
2. Note your **Project URL** and **anon public key** (Settings → API)
3. Go to SQL Editor → New query → paste the entire contents of `supabase/schema.sql` → Run
4. Go to Storage → Create two **public** buckets:
   - `event-photos`
   - `gallery-photos`
5. (Optional) Authentication → Users → Invite / Create an admin user (email + password)

### 4. Environment variables
Copy the example and fill in your keys:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (Home, About, Events, Gallery, Contact)
│   ├── (auth)/login/      # Login page
│   └── (dashboard)/       # Protected admin area
│       └── dashboard/     # Members, Alumni, Assets, Events, Gallery, Updates
├── components/
│   ├── layout/            # Navbar, Footer, Dashboard sidebar
│   └── dashboard/         # Forms, tables, etc.
├── lib/
│   ├── supabase/          # Client, server, middleware helpers
│   └── utils.ts
└── types/
    └── index.ts           # TypeScript types + constants (positions, etc.)
```

---

## Features

### Public Pages
- **Home** – Hero, mission, latest 5 upcoming events, latest 5 updates
- **About** – History, vision, leadership, meeting info
- **Events** – List with Upcoming / Past filter
- **Gallery** – Grid of photos (newest first)
- **Contact** – Address + contact form (saves to Supabase)

### Authentication
- Supabase Auth (email + password)
- Middleware protects `/dashboard/*`
- Redirects after login / logout

### Admin Dashboard
- Summary stats
- Full CRUD for:
  - Members (with position dropdown, search & filters)
  - Alumni
  - Assets
  - Events (with optional photo upload)
  - Gallery (photo upload)
  - Updates / Announcements

---

## Deploy to Vercel (Free)

1. Push the project to GitHub
2. Go to vercel.com → New Project → Import the repo
3. Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

That’s it. Every push to `main` will auto-deploy.

---

## Creating the first admin user

In Supabase Dashboard:
- Authentication → Users → Add user
- Or use the Login page after you create a user via Supabase

---

## Notes

- All data is stored in Supabase (PostgreSQL + Storage)
- Row Level Security is enabled (public can read events/gallery/updates; only authenticated users can write)
- Photo uploads go to Supabase Storage
- Event status (Upcoming/Past) is calculated automatically from the date

---

Built for Bread of Life Campus Fellowship – Kapasa Makasa University.
