## Mentor

An AI voice-first mentoring platform built with Next.js, Clerk, Supabase, and Vapi. Learners can browse curated mentors, spin up their own subject matter expert with custom voices/styles, and hold real-time audio tutoring sessions that automatically log transcripts and session history.

---

## Overview

`Mentor` is a full-stack Next.js 16 application that turns AI companions into on-demand mentors. Authenticated users can:
- Search and filter the mentor library.
- Create personalized mentors (subject, topic, voice, style, duration).
- Launch live voice sessions powered by Vapi + GPT-4 with ElevenLabs voices.
- Review completed sessions and mentors inside a Clerk-secured profile.
- Manage billing via Clerk's pricing table experience.

Public visitors still see “Example Mentors” along with a CTA that explains the flow, making it easy to understand the product before signing in.

---

## Feature Highlights
- **Voice-first sessions** — `components/MentorComponent` integrates Vapi to stream bi-directional audio, animate voice waves with Lottie, and maintain live transcripts.
- **Dynamic mentor catalog** — `app/mentors` uses server actions (`getAllCompanions`) plus client-side search and subject filters to surface the right expert fast.
- **Mentor creation workflow** — `components/MentorForm` (zod + react-hook-form) validates input before persisting mentors to Supabase via server actions.
- **Personalized dashboard** — `app/profile` shows Clerk user info, Supabase-powered stats, and collapsible tables of recent sessions and self-created mentors.
- **Session history tracking** — every completed call writes to the `session_history` table through `addToSessionHistory`, unlocking “previously completed sessions” on the home page.
- **Billing-ready** — `app/billing` renders Clerk’s `PricingTable`, so upgrading plans (and associated feature limits in `newCompanionPermissions`) is one click away.
- **Responsive UI kit** — Custom CSS modules + shadcn/ui primitives (Button, Select, Table, Accordion) keep the experience consistent across breakpoints.

---

## Tech Stack

**Front-End:**  
<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="nextjs" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="css3" />
  <img src="https://img.shields.io/badge/shadcn/ui-111?style=for-the-badge&logo=radix-ui&logoColor=white" alt="shadcn" />
  <img src="https://img.shields.io/badge/Lottie-1AB394?style=for-the-badge&logo=lottie&logoColor=white" alt="lottie" />
</p>

**Back-End & Services:**  
<p>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="clerk" />
  <img src="https://img.shields.io/badge/Vapi-FF5200?style=for-the-badge&logo=voipdotms&logoColor=white" alt="vapi" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="openai" />
</p>

---

## Project Structure

```
app/
 ├─ page.tsx                 # Home with mentor tiles + CTA
 ├─ mentors/                 # Mentor library + detail + creation pages
 ├─ profile/                 # Authenticated dashboard
 ├─ billing/                 # Clerk pricing table
 └─ login/[[...login]]/      # Clerk Sign-In wrapper
components/
 ├─ Navbar + NavItems        # Top navigation with Clerk buttons
 ├─ MentorTile / MentorList  # Grid + table renderers
 ├─ MentorForm               # Create mentor form
 ├─ MentorComponent          # Voice session UI + Vapi hooks
 └─ ui/                      # shadcn-generated primitives
lib/
 ├─ actions/companion.action # Supabase server actions
 ├─ supabase.ts              # Authenticated Supabase client
 ├─ utils.ts                 # Styling helpers + Vapi configuration
 └─ vapi.sdk.ts              # Vapi client instantiation
public/
 └─ icons & images referenced across the UI
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set env vars** using `.env.local` as documented above.

3. **Run Supabase migrations** (or manually create the tables shown in the schema section).

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`. Sign in with a Clerk test user to unlock mentor creation and live sessions.

5. **Build for production**
   ```bash
   npm run build && npm run start
   ```

---

## Available Scripts
- `npm run dev` — Launch Next.js locally with hot reload.
- `npm run build` — Production build.
- `npm run start` — Start the compiled server.
- `npm run lint` — Run ESLint across the project.

---
