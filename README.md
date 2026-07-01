# DealFlow Portal

A production-ready deal management platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Manage deals, orders, and refunds with role-based access for buyers, mediators, and administrators.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (SSR with cookies)
- **Storage:** Supabase Storage
- **Validation:** Zod
- **Deployment:** Vercel

---

## Features

- **Role-based dashboards** — Buyer, Mediator, Admin
- **Live deals** — Browse, filter, and submit orders
- **Order tracking** — Real-time status timeline
- **Refund management** — Request and track refunds
- **File uploads** — Screenshot storage via Supabase
- **Row Level Security** — Database-level access control
- **Mobile-first** — Responsive design, bottom nav, touch-friendly
- **PWA-ready** — Manifest, service worker structure, iOS meta tags

---

## Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, how it works, trust section |
| `/deals` | Browse live deals with filters |
| `/order` | Submit a new order |
| `/track` | Track order/refund by tracking ID |
| `/refund` | Request a refund |
| `/help` | FAQ and contact |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/refund-policy` | Refund policy details |

### Auth
| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Reset password |
| `/reset-password` | Set new password |
| `/auth/callback` | Auth redirect handler |

### Buyer (`/buyer/*`)
| Route | Description |
|-------|-------------|
| `/buyer/dashboard` | Overview — stats, recent orders/refunds |
| `/buyer/orders` | All orders |
| `/buyer/orders/[id]` | Single order detail |
| `/buyer/refunds` | All refund requests |
| `/buyer/refunds/[id]` | Single refund detail |
| `/buyer/profile` | Account settings |

### Mediator (`/mediator/*`)
| Route | Description |
|-------|-------------|
| `/mediator` | Redirects to dashboard |
| `/mediator/dashboard` | Overview — assigned cases |
| `/mediator/orders` | Assigned orders |
| `/mediator/orders/[id]` | Single order detail |
| `/mediator/refunds` | Assigned refunds |
| `/mediator/refunds/[id]` | Single refund detail |
| `/mediator/profile` | Account settings |

### Admin (`/admin/*`)
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Full platform overview |
| `/admin/deals` | Manage deals (CRUD) |
| `/admin/deals/new` | Create deal |
| `/admin/deals/[id]/edit` | Edit deal |
| `/admin/orders` | All orders |
| `/admin/orders/[id]` | Order detail |
| `/admin/refunds` | All refunds |
| `/admin/refunds/[id]` | Refund detail |
| `/admin/users` | User management |
| `/admin/settings` | Platform settings |
| `/admin/audit-logs` | Audit trail |

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the schema migration

Open the Supabase SQL Editor and paste the contents of `supabase/schema.sql`.

### 3. Configure Auth settings

In your Supabase dashboard under **Authentication > Providers**:
- Ensure Email/Password is enabled
- Disable "Confirm email" for demo purposes (or keep it for production)

Under **Authentication > URL Configuration**:
```
Redirect URLs:
  http://localhost:3000/auth/callback
  https://your-vercel-domain.vercel.app/auth/callback
  https://your-custom-domain.com/auth/callback

Site URL:
  http://localhost:3000
```

### 4. Create demo users

Create the following users in **Supabase Auth > Users > Add User**:

| Email | Password |
|-------|----------|
| `buyer@demo.com` | `Demo@123` |
| `mediator@demo.com` | `Demo@123` |
| `admin@demo.com` | `Admin@123` |

### 5. Run the seed script

Copy the user UUIDs from the Auth dashboard and replace the placeholders at the top of `scripts/seed.sql`. Then run the script in Supabase SQL Editor.

### 6. Create Storage buckets

Create these buckets in **Supabase Storage**:
- `order-screenshots`
- `refund-screenshots`
- `avatars`

Apply the following RLS policies to each bucket (use the SQL Editor):

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own order screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can read their own order screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials from **Settings > API**:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role key |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev, your production URL for prod |

**Security notes:**
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for client-side code
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — use ONLY in server-side code
- Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`
- Never commit `.env` or `.env.local` to version control

---

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run db:migrate` | Run Supabase schema migration |
| `npm run db:seed` | Seed demo data |

---

## Deployment

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/dealflow-portal.git
git push -u origin main
```

### Vercel

1. Go to [vercel.com](https://vercel.com) and import the GitHub repository
2. Add the environment variables from `.env.example` in Vercel's project settings
3. Deploy — the build command will run automatically
4. Add the Vercel production URL to Supabase Auth redirect URLs

---

## Security Checklist

- [ ] All RLS policies enabled and tested
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never exposed to client
- [ ] No `.env` files committed
- [ ] CSP headers configured before launch
- [ ] Rate limiting added for auth endpoints
- [ ] File upload size/type validation
- [ ] Audit logging for sensitive actions
- [ ] Branch protection on `main`
- [ ] Dependabot configured for auto-updates
- [ ] GitHub Secrets used for CI environment variables

---

## Production Notes

Before deploying to production, review the following:

- **Auth:** Replace demo password flow with proper email confirmation, OTP, or OAuth
- **Rate limiting:** Add @upstash/ratelimit or similar for auth endpoints
- **File uploads:** Add server-side file type validation, size limits, and virus scanning
- **Monitoring:** Add Sentry or similar for error tracking
- **Backups:** Enable Supabase point-in-time recovery
- **SSL:** Enforce HTTPS (Vercel handles this by default)
- **Custom domain:** Add your domain to Vercel and Supabase Auth

---

## Known Limitations

- Demo users must be created manually via Supabase Auth dashboard
- Seed script requires manual UUID replacement
- Real-time updates not yet implemented (use Supabase Realtime)
- No CI/CD for Supabase migrations (use `supabase migration` CLI)
- Email templates not customized (use Supabase Auth email templates)

---

## License

MIT — Demo project for educational purposes.
