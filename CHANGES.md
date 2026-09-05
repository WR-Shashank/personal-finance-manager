# What changed vs the original submission

This is a full rewrite of the backend to match the assignment's API contract,
reorganised package-by-feature. Frontend and Maven wrapper are unchanged.

## Contract fixes (these are what make the test script pass)
- Responses are now flat objects / `{transactions|categories|goals:[...]}`
  wrappers, not a `{success,message,data}` envelope.
- Register takes `{username(email), password, fullName, phoneNumber}` and
  returns `{message, userId}`.
- Transactions are created by category **name**; `type` is derived server-side.
  Transaction dates cannot be in the future; update excludes the date field.
- Default categories are exactly the seven from the spec, shared and
  non-deletable; category responses include `isCustom`.
- `DELETE /api/categories/{name}` (by name). Duplicate category → 409.
- Reports use path params `/api/reports/monthly/{year}/{month}` and
  `/yearly/{year}`, with `totalIncome`/`totalExpenses` as category→amount maps.
- Goals expose `goalName, startDate, currentProgress, progressPercentage,
  remainingAmount`; `targetDate` required and must be future.
- Logout returns 401 without a session. Known scenarios never return 5xx.

## Structure / quality
- Package-by-feature layout (auth, user, category, transaction, goal, report,
  common).
- Typed exception hierarchy + single `@RestControllerAdvice`; no business
  meaning on JDK exceptions; catch-all logs instead of leaking.
- Date rules as custom bean-validation constraints; injectable `Clock`.
- JPA `Specification`s so transaction filters compose.
- Mappers extracted from services; `GoalProgress` is a pure, tested calculation.
- Goal progress derived from transactions on read (no stored total to drift).
- JaCoCo added — `./mvnw verify` fails below 80% line coverage.
- `devtools` removed; config fully externalised; `open-in-view=false`;
  session cookie hardened.

## Note
Build locally with `./mvnw clean verify` (this was assembled offline and not
compiled here — expect at most trivial import touch-ups).
