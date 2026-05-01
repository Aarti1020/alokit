# Backend Testing TODO

This file tracks what is already automated and what still needs manual or environment-backed verification.

## Automated Now

- System:
  - `GET /`
  - `GET /api/v1/health`
  - unknown route `404`
  - CORS preflight for allowed and unknown origins
- Auth:
  - register
  - duplicate register
  - login
  - invalid login
  - `GET /auth/me`
  - forgot password email flow
  - reset password
- Catalog:
  - category create/read/validation/forbidden
  - subcategory create/not-found
  - product create/list/filter/not-found
- Commerce:
  - cart add
  - checkout
  - payment verify
  - duplicate payment verify idempotency
  - stock rollback on payment failure
  - partial rollback when cart clearing fails
  - order access control
- Forms and search:
  - newsletter subscribe
  - newsletter duplicate subscribe
  - newsletter honeypot
  - contact validation
  - contact lead creation
  - contact missing product
  - lead create
  - recommendation lead create
  - admin lead list/status/note
  - search validation/results
  - search suggestions validation/results

## Manual Or External-Dependency Testing Still Needed

- Real SMTP delivery against actual mail credentials
- Real Razorpay live payment flow
- Mongo replica-set deployment verification in a production-like environment
- Frontend-to-backend browser CORS checks with deployed domains
- Performance/load checks for search, checkout, and payment verification
- Security checks:
  - auth token abuse/rate limiting
  - spam pressure on public forms
  - malicious payload fuzzing
- Full CMS endpoint coverage:
  - blogs
  - pages
  - banners
  - FAQs
  - homepage sections
  - SEO config
  - collections
  - wishlist full flow
  - review moderation flow

## Next Good Automation Targets

- Add dedicated tests for wishlist CRUD
- Add tests for public CMS reads
- Add admin CRUD tests for blogs/pages/banners/FAQs/SEO/collections
- Add negative tests for order status updates
- Add smoke test coverage for `GET /api/v1/health` transaction capability fields
