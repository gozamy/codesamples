# Node CRUD API

A RESTful CRUD API built with Node.js, TypeScript and Fastify, using PostgreSQL and Drizzle ORM.

The project demonstrates a clean controller → service → repository architecture with validation, error handling, database migrations and automated testing.

## Built With

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Drizzle ORM
- Zod
- Vitest
- Docker
- OpenAPI / Swagger

## Features

- Product CRUD operations
- Layered controller, service and repository architecture
- PostgreSQL with Drizzle ORM
- Database migrations
- Zod request validation
- Centralised error handling
- Duplicate SKU detection
- Separate development and test databases
- Unit and integration tests
- OpenAPI documentation
- Swagger UI

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products` | Get all products |
| GET | `/api/v1/products/:id` | Get a product |
| POST | `/api/v1/products` | Create a product |
| PATCH | `/api/v1/products/:id` | Update a product |
| DELETE | `/api/v1/products/:id` | Delete a product |

**Health check:** `/health`

**Swagger UI:** `/docs`

## Testing

The project includes unit tests for the service layer and integration tests for the repository and API against PostgreSQL.

Run the tests with:

```bash
pnpm test
```

## Running Locally

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
docker compose up -d
```

Run migrations:

```bash
pnpm db:migrate
```

Start the development server:

```bash
pnpm dev
```

The API runs on `http://localhost:3000`.

## Architecture

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

The project keeps HTTP handling, business logic and database access separate.
