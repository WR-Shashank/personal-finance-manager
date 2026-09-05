# Personal Finance Manager

A Spring Boot REST API for tracking income, expenses, categories, savings goals
and financial reports. Session-based authentication, strict per-user data
isolation, and a consistent JSON error contract.

The backend under `src/` is the deliverable. A React client is included under
`frontend/` for manual exploration only — it is not required to run or evaluate
the API.

---

## Tech stack

| Component | Choice |
|-----------|--------|
| Language  | Java 17 |
| Framework | Spring Boot 3.4.5 |
| Security  | Spring Security (session cookie, BCrypt) |
| Data      | Spring Data JPA + H2 (in-memory) |
| Testing   | JUnit 5, Mockito, AssertJ, Spring Security Test |
| Coverage  | JaCoCo (build fails below 80%) |
| Build     | Maven (wrapper included) |

---

## Running it

```bash
git clone https://github.com/<your-username>/personal-finance-manager.git
cd personal-finance-manager
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Base path for all resources is `/api`.

### Tests and coverage

```bash
./mvnw verify        # runs tests, generates coverage, fails if under 80%
```

The HTML coverage report is written to `target/site/jacoco/index.html`.

---

## Architecture

The project is organised **by feature**, not by layer. Everything about a
concept lives in one package.

```
com.syfe.personalfinancemanager
├── common/          cross-cutting, owned by no feature
│   ├── TransactionType          shared enum (INCOME / EXPENSE)
│   ├── config/                  security, clock, health endpoints
│   ├── exception/               typed exception hierarchy + one handler
│   └── validation/              @NotFuture, @FutureDate constraints
├── user/            User entity, repository, CurrentUser, UserDetailsService
├── auth/            registration + login/logout session lifecycle
├── category/        entity, repository, service, controller, defaults, dto/
├── transaction/     entity, repository, service, controller, specs, dto/
├── goal/            entity, repository, service, controller, GoalProgress, dto/
└── report/          service, controller, dto/
```

Within a feature the flow is the usual `Controller → Service → Repository`, with
request/response records in `dto/` kept separate from the JPA entities.

### Design decisions

- **Typed exception hierarchy.** Every deliberate error extends `ApiException`
  and carries its own HTTP status (`ResourceNotFoundException` → 404,
  `DuplicateResourceException` → 409, `BusinessRuleException` → 400,
  `ForbiddenOperationException` → 403). The global handler maps one type instead
  of a growing chain of `instanceof`. No business meaning is hung on JDK
  exceptions like `IllegalArgumentException`.

- **No 5xx for known scenarios.** The only path that returns 500 is the
  catch-all, which logs the stack trace and returns a stable, generic message —
  internal exception text is never echoed to the client.

- **Validation lives in constraints.** Date rules are custom constraints
  (`@NotFuture` on transaction dates, `@FutureDate` on goal target dates) rather
  than `if` statements in services, so they are declared next to the field and
  reported through the same field-error channel as everything else.

- **Injectable `Clock`.** Date logic runs through a `Clock` bean, so "today is
  allowed, tomorrow is not" is asserted against a fixed clock in tests instead
  of the wall clock.

- **Composable transaction filters.** Listing uses JPA `Specification`s, so date
  range, category and type filters combine freely. A naive `if/else if` chain
  silently makes "date range **and** category" impossible.

- **Category type is authoritative.** A transaction's `type` is taken from its
  category, never from client input, which removes the entire class of "INCOME
  transaction filed under an expense category" errors.

- **Default categories are a shared catalogue.** The system defaults exist as
  one row each (`owner IS NULL`), seeded once at startup, not copied into every
  account. They cannot be modified or deleted; `isCustom` is a single null check.

- **Goal progress is derived, not stored.** Progress is computed from the
  transaction ledger on every read, so deleting or editing a transaction is
  reflected immediately and no stored total can drift out of step.

- **Deletion protection via a port.** The category package asks "is this in
  use?" through a `CategoryUsage` interface implemented in the transaction
  package, keeping the dependency one-directional and the service unit-testable.

---

## API

All endpoints are under `/api`. Every endpoint except register and login
requires the session cookie returned by login.

### Auth

**Register** — `POST /api/auth/register`
```json
{ "username": "user@example.com", "password": "password123",
  "fullName": "John Doe", "phoneNumber": "+1234567890" }
```
→ `201` `{ "message": "User registered successfully", "userId": 1 }`
Errors: `400` validation, `409` username already registered.

**Login** — `POST /api/auth/login`
```json
{ "username": "user@example.com", "password": "password123" }
```
→ `200` `{ "message": "Login successful" }` + session cookie. `401` on bad creds.

**Logout** — `POST /api/auth/logout` (uses session cookie)
→ `200` `{ "message": "Logout successful" }`, `401` if no active session.

### Transactions

**Create** — `POST /api/transactions`
```json
{ "amount": 50000.00, "date": "2024-01-15",
  "category": "Salary", "description": "January Salary" }
```
→ `201` `{ "id":1, "amount":50000.00, "date":"2024-01-15",
"category":"Salary", "description":"January Salary", "type":"INCOME" }`
The type is derived from the category. The date cannot be in the future.

**List** — `GET /api/transactions?startDate=&endDate=&categoryId=&type=`
→ `200` `{ "transactions": [ ... ] }`, newest first. Filters optional and combinable.

**Update** — `PUT /api/transactions/{id}` — any field **except date**.
```json
{ "amount": 60000.00, "description": "Updated" }
```

**Delete** — `DELETE /api/transactions/{id}` → `200`.

### Categories

**List** — `GET /api/categories`
→ `200` `{ "categories": [ { "name":"Salary","type":"INCOME","isCustom":false }, ... ] }`

**Create** — `POST /api/categories`
```json
{ "name": "SideBusinessIncome", "type": "INCOME" }
```
→ `201` `{ "name":"SideBusinessIncome","type":"INCOME","isCustom":true }`, `409` if taken.

**Delete** — `DELETE /api/categories/{name}` → `200`.
`403` default category, `400` still referenced by transactions, `404` unknown.

**Default categories** (not modifiable or deletable): `Salary` (income);
`Food`, `Rent`, `Transportation`, `Entertainment`, `Healthcare`, `Utilities` (expense).

### Savings goals

**Create** — `POST /api/goals`
```json
{ "goalName": "Emergency Fund", "targetAmount": 5000.00,
  "targetDate": "2026-01-01", "startDate": "2025-01-01" }
```
→ `201` with `currentProgress`, `progressPercentage`, `remainingAmount`.
`startDate` defaults to today; `targetDate` must be in the future.

**List / Get** — `GET /api/goals`, `GET /api/goals/{id}`.
**Update** — `PUT /api/goals/{id}` — `targetAmount` and/or `targetDate`.
**Delete** — `DELETE /api/goals/{id}` → `200`.

Progress = (total income − total expenses) since the goal's start date.

### Reports

**Monthly** — `GET /api/reports/monthly/{year}/{month}`
```json
{ "month":1, "year":2024,
  "totalIncome": { "Salary":3000.00 },
  "totalExpenses": { "Food":400.00, "Rent":1200.00 },
  "netSavings":1400.00 }
```

**Yearly** — `GET /api/reports/yearly/{year}` — same shape, full-year totals.

---

## Error format

```json
{ "timestamp":"...", "status":400, "error":"Bad Request",
  "message":"...", "fieldErrors": { "field":"reason" } }
```
`fieldErrors` appears only for validation failures.

| Status | When |
|--------|------|
| 400 | validation error, malformed input, broken business rule |
| 401 | not authenticated / bad credentials |
| 403 | forbidden operation (e.g. deleting a default category) |
| 404 | resource not found, or not owned by the caller |
| 409 | duplicate username or category name |

---

## Configuration

Every value has a development default and an environment-variable override:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 8080 | server port |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | H2 in-memory | datasource |
| `DDL_AUTO` | `update` | Hibernate schema mode |
| `SESSION_TIMEOUT` | `30m` | session lifetime |
| `COOKIE_SECURE` | `false` | set `true` behind HTTPS |
| `CORS_ORIGINS` | localhost + `*.onrender.com` | allowed origins |

---

## Deployment

Deploys on Render as a Docker service (see `Dockerfile`). Set `COOKIE_SECURE=true`
and `CORS_ORIGINS` to your front-end origin in production.
