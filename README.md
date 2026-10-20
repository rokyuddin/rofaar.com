# Rofaar.com

Premium Islamic lifestyle and gifting store for Bangladesh. **Faith, Refined.**

Built with Next.js (App Router), shadcn/ui, Drizzle ORM, and Neon Postgres.

## Features

- Storefront inspired by curated gift commerce (category browse, product grid, cart, checkout)
- Guest checkout — billing & shipping saved with each order (no customer login)
- Admin panel at `/admin` for orders, products, and customers

## Setup

```bash
pnpm install
cp .env.example .env.local
# set DATABASE_URL and ADMIN_SESSION_SECRET
pnpm db:push
pnpm db:seed
pnpm dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default admin (seeded): `rofaar.official@gmail.com` / `1234`

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Production build         |
| `pnpm db:push` | Push Drizzle schema      |
| `pnpm db:seed` | Seed admin + products    |
