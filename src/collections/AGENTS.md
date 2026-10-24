# src/collections: Payload collections

Read the root `AGENTS.md` §2 first. In this folder, a mistake becomes a public API hole or a
production schema change.

## Rules

1. **Every collection exposes REST (`/api/<slug>`).** GraphQL is disabled in `payload.config.ts`;
   keep it off. Define `access.create/read/update/delete` explicitly on every collection. On `users`,
   also define `access.admin`.
   - Never rely on Payload's default, which is "any logged-in user".
   - Field-level `access` can only return booleans. Use it for sensitive fields (`roles`, `otp`,
     internal `notes`), and cover `create` as well as `update`.
2. **A field change is a schema change.** After editing fields:
   1. `pnpm generate:types`
   2. `pnpm payload migrate:create <name>`
   3. Commit the collection, `payload-types.ts`, and the migration `.ts` + `.json` + `index.ts`
      together.

   See `../migrations/AGENTS.md`.
3. **Hooks:**
   - Pass `req` to nested Payload operations, so they share the transaction.
   - Guard against recursion with `context` flags.
   - Keep slow I/O (email, DeepL) out of the request path, or tolerate failure explicitly.
4. **Localized fields** are `instruments.title` and `instruments.luthierNotes` only. Adding
   `localized: true` creates `_locales` tables, so it needs a migration and a data backfill.
5. **Use the shared helpers in `src/access/`** (`anyone`, `isAdmin`, `isAdminOrSelf`,
   `isAdminField`, `serverOnlyField`, `hasAdminRole`). Don't inline role checks.
6. **Uploads**: `media` has an explicit `mimeTypes` allowlist. Don't add SVG, XML, HTML or wildcard
   types.

## Inventory

| Collection | Admin title | Access today | Hooks | Notable fields |
|---|---|---|---|---|
| `users` (auth) | email | admin: admin. create, delete, unlock: admin. read, update: admin or self. Fields `email`, `roles`, `emailVerified`, `provider`, `providerId`: admin-only writes. `otp`, `otpExpiry`: server-only | `beforeLogin: adminOnlyApiLogin` (REST/GraphQL login is admin-only) | `roles[] admin\|user` (saveToJWT), `provider credentials\|google`, `providerId`, `emailVerified`, `otp`, `otpExpiry`, `firstName/lastName/name/phone/image`, `shippingAddress` group (legacy), `savedAddresses[]` |
| `media` (upload) | filename | read: anyone. create, update, delete: admin | — | `alt` (required). `disableLocalStorage: true`. `mimeTypes` allowlist (jpeg/png/webp, common audio, mp4). Stored in the S3 bucket `media` through the plugin. No `imageSizes` configured |
| `instruments` | title | read: anyone. Create, update, delete: admin | `afterChange: autoTranslateInstrument` | See `docs/domain-and-business-logic.md` §2. `slug` auto-fills from the title only when empty; `price` is nullable ("price on request") |
| `orders` (group "Shop") | orderNumber | read: admin, or own (`customer = user.id`). create, update, delete: admin. The storefront creates orders through the Local API | `afterChange: sendShippingNotification` (status → `shipped`, delivery only) | `orderNumber` unique, `status`, `paymentMethod`, `deliveryMethod`, conditional tracking and pickup fields, `items[] {instrument, title, price}` snapshot, `contactInfo`, `shippingAddress`, money fields, `customerRemarks`, internal `notes` |

## Invariants code must preserve

- An instrument with `price == null` can't be put into an order.
- `orders.items[].title/price` are snapshots. Never re-derive them from the instrument.
- Writing an instrument status from code must pass `context: { skipAutoTranslate: true }`.
- The `status` option values are stored strings, so renaming one needs a data migration. The
  `contrabass` value stays `contrabass` even though the UI now says "Double Bass".
- `orderNumber` is the public identifier, used in URLs and shown to customers. Never expose numeric
  ids in customer UIs.

## Planned changes (see roadmap)

- Split customers from admins.
- `reservedUntil` on orders or instruments.
- An `orders` → `instruments` status-sync hook.
- `imageSizes` on `media`.
- A `settings` global and an `inquiries` collection.
