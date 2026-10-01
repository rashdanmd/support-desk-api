# Support Desk API

REST API for a support desk application. It manages teams, tickets, ticket
responses, authenticated users, and role-based ticket workflows. Supabase
provides authentication and data storage.

## Tech stack

- Node.js and npm
- TypeScript
- Express 5
- Supabase Auth and PostgreSQL
- `tsx` for local development

## Prerequisites

- Node.js 18 or later
- npm
- A Supabase project containing the `profiles`, `teams`, `tickets`, and
  `ticket_responses` tables expected by the services in `src/features`
- A Supabase secret key with access to those tables

Database migrations are not included in this repository, so the required
Supabase schema must already exist.

## Installation

1. Install the dependencies:

   ```bash
   npm ci
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SECRET_KEY=your-supabase-secret-key
   PORT=4000
   ```

   `PORT` is optional and defaults to `4000`. Keep the Supabase secret key
   server-side and never commit the `.env` file.

## Running locally

Start the development server with automatic reload:

```bash
npm run dev
```

The API is available at `http://localhost:4000` by default. Check that it is
running with:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{"status":"ok"}
```

## Production build

Compile the TypeScript source and run the generated JavaScript:

```bash
npm run build
npm start
```

Compiled files are written to `dist/`.

## Available scripts

- `npm run dev` — run the API in watch mode
- `npm run build` — compile TypeScript into `dist/`
- `npm start` — run the compiled server
- `npm run typecheck` — check TypeScript without generating output
- `npm test` — currently a placeholder; automated tests are not configured

## Authentication and roles

Protected routes require a Supabase access token:

```http
Authorization: Bearer <access-token>
```

The authentication middleware validates the token with Supabase Auth and reads
the user's role from `profiles.role`. Supported roles are:

- `user` — create tickets and manage their own pending tickets
- `support` — review, refer, resolve, and respond to tickets
- `admin` — support permissions plus permanent ticket deletion

## API routes

### Public

- `GET /health` — service health check
- `GET /api/teams` — list teams alphabetically

### Users

- `GET /api/users/me` — return the authenticated user's ID, email, and role

### Tickets

- `GET /api/tickets` — list tickets
- `GET /api/tickets/:id` — get a ticket
- `POST /api/tickets` — create a ticket
- `PATCH /api/tickets/:id` — edit a pending ticket owned by the current user
- `PATCH /api/tickets/:id/cancel` — cancel a pending ticket owned by the current
  user
- `PATCH /api/tickets/:id/review` — move a pending ticket into review
- `PATCH /api/tickets/:id/refer` — refer a ticket that is in review
- `PATCH /api/tickets/:id/resolve` — resolve a ticket that is in review
- `DELETE /api/tickets/:id` — delete a ticket as an admin

Ticket creation accepts `title`, `description`, `teamId`, `affectedUrl`, `curl`,
and `priority`. Priorities are `low`, `medium`, `high`, or `urgent`; the default
is `medium`.

### Ticket responses

- `GET /api/tickets/:ticketId/responses` — list responses in chronological order
- `POST /api/tickets/:ticketId/responses` — add a response as the ticket owner,
  support, or an admin

All routes in the Users, Tickets, and Ticket responses sections require
authentication.

## Folder structure

```text
.
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── features/
│   │   ├── responses/           # Ticket response routes, handlers, and service
│   │   ├── teams/               # Team routes, handlers, and service
│   │   ├── tickets/             # Ticket workflow, types, and data access
│   │   └── users/               # Current-user endpoint
│   ├── middleware/
│   │   └── auth-middleware.ts   # Token validation and profile role lookup
│   ├── types/
│   │   └── auth.ts              # Authenticated request and role types
│   ├── app.ts                   # Express middleware and route registration
│   └── server.ts                # Environment loading and HTTP server startup
├── package.json
├── package-lock.json
└── tsconfig.json
```

Each feature is split into routing, HTTP handlers, and Supabase-facing service
functions. Add new endpoint behavior to the appropriate feature rather than
placing it directly in `app.ts`.

## Current limitations

- Automated tests are not configured.
- Input validation is handled within individual handlers rather than by a
  shared schema-validation layer.
- CORS currently allows all origins.
