# Minto Management

Merchant management platform for digital tokens, credits, coupons, and loyalty programs.

## Features

- **Dashboard** - Merchant info, usage statistics, quick actions
- **Token Management** - Create and manage Credits, Coupons, Flyers, Membership cards, Gift cards
- **Wallet System** - Master wallet + sub-wallets with hierarchical token transfer
- **Marketing Tools** - Air drop, customer management, analytics

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: SQLite (dev) / PostgreSQL (prod), Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database and seed data
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login

- Email: `admin@minto.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Authenticated pages
│   │   ├── home/              # 0.0 Dashboard
│   │   ├── token/             # 1.0 Token overview + 1.1 Create
│   │   ├── wallet/            # 2.0 Overview + 2.1 Management + Detail
│   │   ├── marketing/         # 3.0 Tools + 3.1 Airdrop
│   │   └── settings/          # Settings
│   └── api/                   # REST API endpoints
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── layout/                # Sidebar, Topbar
│   ├── dashboard/             # Dashboard components
│   ├── token/                 # Token components
│   ├── wallet/                # Wallet components
│   └── marketing/             # Marketing components
├── lib/                       # Utilities, DB client, auth config
└── types/                     # TypeScript types
```

## Documentation

- [UI Design Analysis](docs/UI-DESIGN.md) - Detailed breakdown of all UI pages from the design spec
- [Implementation Plan](docs/IMPLEMENTATION-PLAN.md) - Phase-by-phase development plan

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/merchant` | Merchant profile + stats |
| GET/POST | `/api/tokens` | List / Create tokens |
| GET | `/api/tokens/stats` | Token statistics |
| GET/PUT/DELETE | `/api/tokens/[id]` | Single token CRUD |
| GET/POST | `/api/wallets` | List / Create wallets |
| GET/PUT/DELETE | `/api/wallets/[id]` | Single wallet CRUD |
| GET | `/api/wallets/[id]/transfers` | Transfer history |
| POST | `/api/wallets/transfer` | Execute token transfer |
| POST | `/api/airdrop` | Batch airdrop |

## License

See [LICENSE](LICENSE)
