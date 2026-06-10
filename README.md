# Express Bun TS Boilerplate

A professional, high-performance boilerplate for Express.js using **Bun** runtime and **TypeScript**.

## Features

- 🚀 **Bun** runtime for extreme speed
- 📘 **TypeScript** with path aliases (`@/`)
- 🏗️ **Modular Architecture** (routes, controllers, services, repositories, validations per module)
- 🛡️ **JWT Auth Middleware** for protected route access
- 🗄️ **PostgreSQL** via `pg` with parameterized queries
- ✅ **Payload validation** with `zod`
- 📝 **Swagger/OpenAPI** auto-generated docs via `swagger-jsdoc`
- 🌐 **CORS** enabled for cross-origin requests
- 📊 **Morgan** request logging
- 🔄 **Graceful shutdown** on SIGTERM/SIGINT

## Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd express-bun-ts-boilerplate
bun install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Fill in your PostgreSQL connection string and secrets (see `.env.example`).

### 3. Start Development
```bash
bun dev
```

### 4. Production Build
```bash
bun run build
bun start
```

## Project Structure

```text
src/
├── config/
│   ├── index.ts          # Unified environment config (APP_CONFIG)
│   ├── db.ts             # pg Pool
│   └── swagger.ts       # Swagger/OpenAPI setup
│
├── middlewares/
│   ├── api-key.middleware.ts   # API key check for write routes
│   ├── auth.middleware.ts      # JWT verification
│   ├── validate.middleware.ts  # Zod schema validation
│   └── error.middleware.ts     # Global error handler
│
├── modules/              # Feature modules (each is self-contained)
│   ├── auth/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── validation.ts
│   │   └── route.ts
│   ├── profile/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   ├── model.ts
│   │   ├── validation.ts
│   │   └── route.ts
│   ├── skills/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   ├── model.ts
│   │   ├── validation.ts
│   │   └── route.ts
│   ├── skill-categories/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   ├── model.ts
│   │   ├── validation.ts
│   │   └── route.ts
│   └── projects/
│       ├── controller.ts
│       ├── service.ts
│       ├── repository.ts
│       ├── model.ts
│       ├── validation.ts
│       └── route.ts
│
├── routes/
│   └── index.ts          # Mount all module routes
│
├── types/
│   └── index.ts          # Shared TypeScript types (TypedRequest, Pagination, etc.)
│
├── utils/
│   └── response.util.ts  # sendSuccess / sendError helpers
│
└── app.ts                # Express app setup & server entry point (graceful shutdown)

rebuild_db.ts             # Database rebuild & seed script
tests/                    # Test files directory
```

## API Endpoints

### Authentication
| Method | Endpoint       | Auth | Description          |
|--------|----------------|------|----------------------|
| POST   | `/auth/login`  | —    | Login & get JWT      |

### Profile
| Method | Endpoint                    | Auth          | Description        |
|--------|-----------------------------|---------------|--------------------|
| GET    | `/profile`                  | —             | Get public profile |
| PUT    | `/profile`                  | JWT           | Update profile     |
| PUT    | `/profile/change-password`  | JWT           | Change password    |

### Skills
| Method | Endpoint        | Auth | Description             |
|--------|-----------------|------|-------------------------|
| GET    | `/skills`       | —    | List skills (grouped)   |
| POST   | `/skills`       | JWT  | Create skill            |
| GET    | `/skills/:uid`  | —    | Get skill detail        |
| PUT    | `/skills/:uid`  | JWT  | Update skill            |
| DELETE | `/skills/:uid`  | JWT  | Soft-delete skill       |

### Skill Categories
| Method | Endpoint                    | Auth | Description                  |
|--------|-----------------------------|------|------------------------------|
| GET    | `/skill-categories`         | —    | List all skill categories    |
| POST   | `/skill-categories`         | JWT  | Create skill category        |
| GET    | `/skill-categories/:uid`    | —    | Get category detail          |
| PUT    | `/skill-categories/:uid`    | JWT  | Update skill category        |
| DELETE | `/skill-categories/:uid`    | JWT  | Soft-delete skill category   |

### Projects
| Method | Endpoint              | Auth | Description             |
|--------|-----------------------|------|-------------------------|
| GET    | `/projects`           | —    | List all projects       |
| POST   | `/projects`           | JWT  | Create project          |
| GET    | `/projects/:uid`      | —    | Get project detail      |
| PUT    | `/projects/:uid`      | JWT  | Update project          |
| DELETE | `/projects/:uid`      | JWT  | Soft-delete project     |

## Scripts

| Command                | Description                              |
|------------------------|------------------------------------------|
| `bun dev`              | Start in watch mode (hot reload)         |
| `bun run build`        | Compile TypeScript to `dist/`            |
| `bun start`            | Run compiled production build            |
| `bun run typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |

## Environment Variables (`.env`)

| Variable        | Description                          | Default               |
|-----------------|--------------------------------------|-----------------------|
| `DATABASE_URL`  | PostgreSQL connection string         | —                     |
| `JWT_SECRET`    | Secret for signing JWT tokens        | `secret`              |
| `PUBLIC_API_KEY`| API key for write-protected routes   | `default_public_key`  |
| `PORT`          | Server port                          | `3000`                |
| `BASE_URL`      | Base URL for Swagger docs            | `http://localhost`    |
| `NODE_ENV`      | Environment mode                     | `development`         |

## Best Practices Implemented

- **Soft delete** on all data tables (`is_deleted` flag)
- **UUID primary keys** exposed to clients; internal `serial` for indexing
- **Foreign key constraints** at DB level (e.g. `project_skills` junction table)
- **Zod validation** schemas with descriptive error messages
- **Centralized environment config** (`APP_CONFIG`) via `src/config/index.ts`
- **Graceful shutdown** on `SIGTERM`/`SIGINT`
- **bcrypt** for password hashing (no plain-text comparison)
- **Modular architecture** — each feature module is self-contained with its own controller, service, repository, model, validation, and route files