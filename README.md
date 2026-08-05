# Tactician Portfolio

Stack: Next.js 14 (App Router) · Supabase Auth · Backblaze B2 (content + media storage)

## Local setup

```
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase and B2 values, then:

```
npm run dev
```

## Environment variables (Vercel → Settings → Environment Variables)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
B2_KEY_ID
B2_APPLICATION_KEY
B2_BUCKET_NAME
B2_ENDPOINT
CONTACT_NOTIFY_EMAIL   (optional, for contact form email alerts).....
RESEND_API_KEY          (optional, for contact form email alerts)......
```

## Creating your admin login

In Supabase Dashboard -> Authentication -> Users -> Add User, create one user with your email/password. That's the only login /admin accepts.

## Admin dashboard

- /admin/login - sign in
- /admin/projects - create, edit, delete, feature, drag-reorder projects
- /admin/content - edit hero, about, skills, tools, socials, contact info

## Content storage

All site content and project data live as JSON in your B2 bucket (content/site.json, content/projects.json). All media (images, PDFs, videos) upload into the same bucket under organized folders and are served through /api/media/[key], which signs a temporary B2 URL per request - the bucket itself stays private.
