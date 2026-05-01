# API Testing Checklist

Base URL: `http://localhost:5000/api/v1`

This file is the practical testing order for this backend. Use it with `API_DOCS.md`.

## 1. Start with environment checks

- Confirm `backend/.env` has working `MONGO_URI` and `JWT_SECRET`.
- Start the server with `npm run dev` inside `backend`.
- Verify boot first:
  - `GET /`
  - `GET /api/v1/health`

## 2. Use this testing order

1. Health
2. Auth
3. Categories
4. Subcategories
5. Products
6. Search
7. Collections
8. Pages / Blogs / FAQ / Banners / Homepage / SEO
9. Newsletter / Contact / Leads
10. Wishlist
11. Cart
12. Orders
13. Payments
14. Admin-only CMS routes

## 3. For every endpoint, test these cases

- Happy path
- Validation failure
- Missing required field
- Wrong data type
- Unauthorized request
- Forbidden request for normal user on admin route
- Not found with invalid or missing resource ID
- Empty-state response
- Duplicate submission where relevant
- Pagination, filtering, search, and sorting where supported

## 4. Auth flow to create reusable test data

Run these first and save the returned token.

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Keep:

- one normal user token
- one admin token
- one invalid token for negative tests

## 5. Public modules to test

- `GET /categories`
- `GET /categories/:id`
- `GET /subcategories`
- `GET /subcategories/:id`
- `GET /products`
- `GET /products/:slug`
- `GET /products/:slug/related`
- `GET /search`
- `GET /search/suggestions`
- `GET /collections`
- `GET /collections/:slug`
- `GET /collections/:slug/products`
- `GET /pages`
- `GET /pages/:slug`
- `GET /pages/navigation/header`
- `GET /pages/navigation/footer`
- `GET /blogs`
- `GET /blogs/featured/list`
- `GET /blogs/:slug`
- `GET /blogs/related/:slug`
- `GET /faqs`
- `GET /banners`
- `GET /homepage`
- `GET /seo/:pageKey`

## 6. Logged-in user modules to test

- `GET /wishlist`
- `POST /wishlist/add`
- `DELETE /wishlist/remove/:productId`
- `DELETE /wishlist/clear`
- `GET /cart`
- `POST /cart/add`
- `PATCH /cart/item/:itemId`
- `DELETE /cart/remove/:productId`
- `DELETE /cart/clear`
- `POST /orders/checkout`
- `GET /orders/my-orders`
- `GET /orders/:id`
- `POST /payments/verify`

## 7. Form modules to test

- `POST /newsletter/subscribe`
- `POST /contact`
- `POST /leads`
- `POST /leads/gemstone-recommendation`
- `POST /leads/rudraksha-recommendation`
- Check spam/validation behavior with invalid payloads

## 8. Admin modules to test

- Category create/update/delete
- Subcategory create/update/delete
- Product create/update/delete
- Order listing and status update
- Review approval and moderation
- Leads listing, status update, notes
- Collection admin CRUD
- Homepage section admin CRUD
- FAQ admin CRUD
- Banner admin CRUD
- Page admin CRUD
- SEO admin CRUD
- Blog admin CRUD

## 9. Recommended tools

- Postman for manual collections and environment variables
- Thunder Client if you want lighter VS Code testing
- The included smoke runner for quick repeat checks:
  - `cd backend`
  - `npm run smoke:test`

## 10. Minimum evidence to collect while testing

- Request body
- Response status
- Response body
- DB side effect
- Screenshot for UI-triggered flows
- Bug note with exact endpoint and timestamp

## 11. Suggested defect format

- Endpoint:
- Method:
- Test case:
- Expected:
- Actual:
- Request payload:
- Response payload:
- Token used:
- Severity:

## 12. What to automate next

- Add `jest` or `vitest`
- Add `supertest`
- Seed test fixtures
- Run isolated API integration tests against a test database
- Add CI so smoke and integration tests run on every push
