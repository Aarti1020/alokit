# Alokit API Documentation

Base URL:

```text
http://localhost:5000/api/v1
```

Root health URL:

```text
http://localhost:5000/
```

## Auth and Roles

Protected routes require:

```text
Authorization: Bearer <token>
```

Role rules:

- `user`: normal logged-in customer
- `admin`: admin access
- `superAdmin`: full admin access
- Admin routes accept `admin` or `superAdmin`

Notes:

- Public register does not allow setting `role`
- Public content endpoints usually return only active or published data
- Some form endpoints use a honeypot field named `website`
- Honeypot-triggered spam-safe responses return `202`
- Local development now defaults to mock Razorpay mode unless `RAZORPAY_MOCK_MODE=false`

## Health

### `GET /`

Basic app check.

Returns:

- API running message
- local API base

### `GET /health`

API health check.

Returns:

- `status`
- `timestamp`
- `mongoTransactions.supported`
- `mongoTransactions.fallbackAllowed`
- `mongoTransactions.topology`
- `mongoTransactions.mode`

## Auth

### `POST /auth/register`

Create a normal user account.

Body:

```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "Test1234",
  "phone": "9876543210"
}
```

Validation:

- `fullName` required
- `email` required and must be valid
- `password` minimum 6 characters
- `role` must not be sent

### `POST /auth/login`

Login and get JWT token.

Body:

```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

### `POST /auth/forgot-password`

Generate a password reset token, store its hashed value, build a reset URL, and send the reset email.

Body:

```json
{
  "email": "test@example.com"
}
```

Response behavior:

- always returns a generic success message for both existing and non-existing accounts
- does not expose the reset token in normal usage
- can optionally return `data.preview` in local/dev mail mode only when `EMAIL_DEV_EXPOSE_RESET_TOKEN=true`

Email configuration:

- `EMAIL_MODE=local` captures emails locally for development/testing
- `EMAIL_MODE=smtp` sends real email via Nodemailer SMTP transport
- required SMTP vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SENDER_EMAIL`

### `POST /auth/reset-password`

Reset password with the raw reset token and send a confirmation email after a successful password change.

Body:

```json
{
  "token": "raw_reset_token",
  "password": "NewTest1234",
  "confirmPassword": "NewTest1234"
}
```

### `GET /auth/me`

Get authenticated user profile.

Auth required: Yes

## Categories

Base path:

```text
/categories
```

### `GET /categories`

Get all categories.

### `GET /categories/:id`

Get category by Mongo ID.

### `POST /categories`

Create category.

Auth required: Admin

### `PATCH /categories/:id`

Update category.

Auth required: Admin

### `DELETE /categories/:id`

Delete category.

Auth required: Admin

## Subcategories

Base path:

```text
/subcategories
```

### `GET /subcategories`

Get all subcategories.

### `GET /subcategories/:id`

Get subcategory by Mongo ID.

### `POST /subcategories`

Create subcategory.

Auth required: Admin

### `PATCH /subcategories/:id`

Update subcategory.

Auth required: Admin

### `DELETE /subcategories/:id`

Delete subcategory.

Auth required: Admin

## Products

Base path:

```text
/products
```

### `GET /products`

Public product listing.

Only published products are returned.

Supported query params:

- `page`
- `limit`
- `search`
- `category` as Mongo ID
- `subCategory` as Mongo ID
- `productType`: `gemstone | rudraksha | bracelet | jewellery | crystal`
- `collection` as Mongo ID
- `featured`: boolean
- `showOnHomepage`: boolean
- `inStock`: boolean
- `minPrice`
- `maxPrice`
- `sort`: `latest | price_asc | price_desc | name_asc | name_desc`

### `GET /products/:slug`

Get published product by slug.

### `GET /products/:slug/related`

Get related published products using subcategory, category, product type, or collection.

### `POST /products`

Create product.

Auth required: Admin

Minimum required body:

```json
{
  "title": "Certified Blue Sapphire 7.25 Carat",
  "sku": "ALO-GEM-BS-725",
  "category": "CATEGORY_OBJECT_ID",
  "subCategory": "SUBCATEGORY_OBJECT_ID",
  "productType": "gemstone",
  "basePrice": 45000,
  "stock": 4
}
```

Important optional fields:

- `name`
- `slug`
- `shortDescription`
- `description`
- `featuredImage`
- `galleryImages`
- `images`
- `thumbnail`
- `salePrice`
- `emiPrice`
- `status`: `draft | published`
- `isFeatured`
- `showOnHomepage`
- `tags`
- `origin`
- `shape`
- `style`
- `weightCarat`
- `weightRatti`
- `certificationLab`
- `treatment`
- `specifications`
- `variants`
- `collections`
- `seoTitle`
- `seoDescription`
- `seo`

### `PATCH /products/:id`

Update product.

Auth required: Admin

### `DELETE /products/:id`

Delete product.

Auth required: Admin

## Wishlist

Base path:

```text
/wishlist
```

Auth required for all wishlist routes.

### `GET /wishlist`

Get current user wishlist.

### `POST /wishlist/add`

Add product to wishlist.

Body:

```json
{
  "productId": "PRODUCT_OBJECT_ID"
}
```

### `DELETE /wishlist/remove/:productId`

Remove product from wishlist by product ID.

### `DELETE /wishlist/clear`

Clear current user wishlist.

## Cart

Base path:

```text
/cart
```

Auth required for all cart routes.

### `GET /cart`

Get current user cart.

### `POST /cart/add`

Add item to cart.

Body:

```json
{
  "productId": "PRODUCT_OBJECT_ID",
  "quantity": 1,
  "selectedVariant": {
    "label": "Style",
    "value": "Loose Stone"
  }
}
```

### `PATCH /cart/item/:itemId`

Update cart item quantity.

Body:

```json
{
  "quantity": 2
}
```

### `DELETE /cart/remove/:productId`

Remove cart item by product ID.

### `DELETE /cart/clear`

Clear current user cart.

## Orders

Base path:

```text
/orders
```

Auth required for all order routes.

### `POST /orders/checkout`

Create order from current cart.

Important behavior:

- cart must not be empty
- all cart products must still be published
- stock is checked
- payment method currently supports only `razorpay`
- if Razorpay order creation fails, created order is rolled back
- local development can return a mock Razorpay order for testing

Body:

```json
{
  "shippingAddress": {
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "addressLine1": "123 Street",
    "addressLine2": "Near Temple",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "billingAddress": {
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "addressLine1": "123 Street",
    "addressLine2": "Near Temple",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "notes": "Call before delivery"
}
```

Local testing note:

- in local mock mode, checkout response includes `paymentGatewayMode: "mock"`
- in local mock mode, `razorpayKeyId` returns `mock_key_id`
- you can continue payment verification without real Razorpay credentials

### `GET /orders/my-orders`

Get logged-in user's orders.

### `GET /orders/:id`

Get single order.

Access:

- order owner can access
- admin can access
- other users get `403`

### `GET /orders`

Admin order listing.

Auth required: Admin

Supported query params:

- `page`
- `limit`
- `paymentStatus`: `pending | paid | failed | refunded | partially_refunded`
- `orderStatus`: `created | confirmed | processing | shipped | delivered | cancelled`

### `PATCH /orders/:id/status`

Update order status.

Auth required: Admin

Body:

```json
{
  "orderStatus": "confirmed"
}
```

Allowed values:

- `created`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

## Payments

Base path:

```text
/payments
```

Auth required for all payment routes.

### `POST /payments/verify`

Verify Razorpay payment for an order.

Important behavior:

- user can verify only own order
- signature must be valid
- `razorpay_order_id` must match stored order value
- successful verification updates stock
- successful verification marks order as paid and confirmed
- successful verification clears cart items
- transaction rollback protects stock/order/cart consistency on replica sets
- already paid order returns success with "Payment already verified"
- local standalone MongoDB can use a narrower fallback only when transaction fallback is enabled for development

Body:

```json
{
  "orderId": "ORDER_OBJECT_ID",
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

Local mock payment body example:

```json
{
  "orderId": "ORDER_OBJECT_ID",
  "razorpay_order_id": "mock_order_ORDER_OBJECT_ID",
  "razorpay_payment_id": "mock_payment_ORDER_OBJECT_ID",
  "razorpay_signature": "mock_signature"
}
```

## Reviews

Base path:

```text
/reviews
```

### `POST /reviews`

Submit product review.

Body:

```json
{
  "product": "PRODUCT_OBJECT_ID",
  "name": "Rahul",
  "email": "rahul@example.com",
  "rating": 5,
  "title": "Very good",
  "comment": "This product quality is excellent and delivery was smooth."
}
```

Validation:

- `product` required and must be valid
- `name` 2 to 80 chars
- `email` optional but must be valid if sent
- `rating` 1 to 5
- `title` optional max 120 chars
- `comment` 10 to 1500 chars
- `website` honeypot must be empty if sent

### `GET /reviews/featured`

Get featured approved reviews.

Supported query params:

- `limit` from `1` to `20`

### `GET /reviews/product/:productId`

Get approved product reviews plus summary.

Supported query params:

- `page`
- `limit`

Response also includes:

- `summary.averageRating`
- `summary.totalReviews`
- `summary.ratingBreakdown`

### `GET /reviews`

Admin review listing.

Auth required: Admin

Supported query params:

- `page`
- `limit`
- `status`: `pending | approved | rejected | hidden | spam`
- `product` as Mongo ID
- `rating`
- `isFeatured`
- `search`

### `PATCH /reviews/:id/approve`

Approve review.

Auth required: Admin

### `PATCH /reviews/:id/reject`

Reject review.

Auth required: Admin

Body:

```json
{
  "rejectionReason": "Looks like spam"
}
```

### `PATCH /reviews/:id/hide`

Hide review.

Auth required: Admin

### `PATCH /reviews/:id/feature`

Toggle featured status.

Auth required: Admin

## Leads

Base path:

```text
/leads
```

### `POST /leads`

Create generic lead.

Body:

```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "phone": "9999999999",
  "message": "I need help choosing a gemstone.",
  "formType": "consultation",
  "source": "homepage",
  "product": "PRODUCT_OBJECT_ID",
  "priority": "medium"
}
```

Validation:

- `name` required, 2 to 80 chars
- `email` optional but must be valid if sent
- `phone` optional, 7 to 20 chars
- `message` required, 10 to 1000 chars
- `formType` optional:
  `contact | consultation | custom_order | bulk_order | callback | gemstone_recommendation | rudraksha_recommendation`
- `product` optional Mongo ID
- `priority` optional: `low | medium | high`
- `website` honeypot must be empty if sent

### `POST /leads/gemstone-recommendation`

Create gemstone recommendation lead.

Behavior:

- internally sets `formType=gemstone_recommendation`
- default `source=product_page` if source not sent

### `POST /leads/rudraksha-recommendation`

Create rudraksha recommendation lead.

Behavior:

- internally sets `formType=rudraksha_recommendation`
- default `source=product_page` if source not sent

### `GET /leads`

Admin leads list.

Auth required: Admin

Supported query params:

- `page`
- `limit`
- `status`: `new | contacted | qualified | converted | closed | spam`
- `formType`
- `source`
- `isSpam`
- `search`

### `GET /leads/:id`

Admin lead detail.

Auth required: Admin

### `PATCH /leads/:id/status`

Update lead status.

Auth required: Admin

Body:

```json
{
  "status": "contacted"
}
```

### `POST /leads/:id/note`

Add admin note to lead.

Auth required: Admin

Body:

```json
{
  "note": "Called customer and requested birth details."
}
```

## Contact

Base path:

```text
/contact
```

### `POST /contact`

Submit contact form.

Behavior:

- creates a lead with `formType=contact`
- default `source=contact_page`
- optional `product` must exist if sent

Body:

```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "phone": "9999999999",
  "message": "Please help me choose the right product.",
  "source": "contact_page",
  "product": "PRODUCT_OBJECT_ID"
}
```

## Newsletter

Base path:

```text
/newsletter
```

### `POST /newsletter/subscribe`

Subscribe to newsletter.

Body:

```json
{
  "email": "test@example.com",
  "name": "Test User",
  "source": "homepage"
}
```

Behavior:

- new email returns `201`
- already active subscription returns `200`
- inactive existing subscriber is reactivated
- default `source=homepage`

## Search

### `GET /search`

Global search across:

- products
- collections
- blogs
- pages
- categories
- subcategories

Supported query params:

- `q`
- `page`
- `limit`

### `GET /search/suggestions`

Autocomplete-style suggestions.

Supported query params:

- `q`
- `limit`

## Collections

Base path:

```text
/collections
```

### `GET /collections`

Public collection listing.

Only published collections are returned.

Supported query params:

- `page`
- `limit`
- `search`
- `productType`: `gemstone | rudraksha | bracelet | jewellery | crystal | ""`
- `featured`
- `showOnHomepage`

### `GET /collections/:slug`

Get published collection by slug.

### `GET /collections/:slug/products`

Get products linked to published collection.

Supported query params:

- `page`
- `limit`
- `search`
- `productType`
- `minPrice`
- `maxPrice`
- `sort`: `latest | price_asc | price_desc | name_asc | name_desc`

### `GET /admin/collections`

Admin collection list.

Auth required: Admin

Supports same list filters as public collection list.

### `GET /admin/collections/:id`

Admin collection detail.

Auth required: Admin

### `POST /admin/collections`

Create collection.

Auth required: Admin

Minimum body:

```json
{
  "title": "Astrology Essentials"
}
```

Important optional fields:

- `slug`
- `shortDescription`
- `description`
- `heroImage`
- `thumbnail`
- `productIds`
- `productType`
- `about`
- `whoShouldWear`
- `benefits`
- `qualityAndPrice`
- `faqs`
- `filtersConfig`
- `sortOrder`
- `showOnHomepage`
- `isFeatured`
- `status`
- `seo`

### `PUT /admin/collections/:id`

Update collection.

Auth required: Admin

### `DELETE /admin/collections/:id`

Delete collection.

Auth required: Admin

## Homepage CMS

### `GET /homepage`

Get homepage-composed public response.

It may include:

- active homepage sections
- active banners for homepage
- homepage and featured FAQs
- featured blogs
- featured collections
- featured products
- featured reviews
- homepage SEO
- newsletter endpoint reference
- lead endpoint references

### `GET /admin/homepage/sections`

Admin homepage sections list.

Auth required: Admin

### `GET /admin/homepage/sections/:id`

Admin homepage section detail.

Auth required: Admin

### `POST /admin/homepage/sections`

Create homepage section.

Auth required: Admin

Body:

```json
{
  "key": "hero-primary",
  "title": "Hero Primary",
  "sectionType": "hero",
  "data": {},
  "status": "active",
  "sortOrder": 1
}
```

Allowed `sectionType` values:

- `hero`
- `announcement`
- `featuredCategories`
- `featuredProducts`
- `imageText`
- `trustBadges`
- `testimonials`
- `blogPreview`
- `faqPreview`
- `cta`
- `customHtml`
- `trust_badges`
- `category_explorer`
- `collection_grid`
- `product_slider`
- `image_text`
- `faq_preview`
- `reviews_preview`
- `newsletter`
- `custom_html`

Allowed `status` values:

- `active`
- `inactive`

### `PUT /admin/homepage/sections/:id`

Update homepage section.

Auth required: Admin

### `DELETE /admin/homepage/sections/:id`

Delete homepage section.

Auth required: Admin

## FAQ

### `GET /faqs`

Public FAQ listing.

Supported query params:

- `module`: `general | product | order | shipping | refund | rudraksha | gemstone | homepage | collection`
- `category`
- `entityId`

### `GET /admin/faqs`

Admin FAQ list.

Auth required: Admin

### `GET /admin/faqs/:id`

Admin FAQ detail.

Auth required: Admin

### `POST /admin/faqs`

Create FAQ.

Auth required: Admin

Body:

```json
{
  "question": "How do I choose the right gemstone?",
  "answer": "Start with your purpose and recommendation details.",
  "category": "Gemstones",
  "module": "gemstone",
  "entityId": "OPTIONAL_OBJECT_ID",
  "status": "active",
  "sortOrder": 1,
  "isFeatured": true
}
```

### `PUT /admin/faqs/:id`

Update FAQ.

Auth required: Admin

### `DELETE /admin/faqs/:id`

Delete FAQ.

Auth required: Admin

## Banners

### `GET /banners`

Public active banner list.

Supported query params:

- `page`: `homepage | category | product | blog | global | collection`
- `type`: `hero | promo | category | popup | announcement`

Note:

- public banner response also respects banner date range and active status

### `GET /admin/banners`

Admin banner list.

Auth required: Admin

### `GET /admin/banners/:id`

Admin banner detail.

Auth required: Admin

### `POST /admin/banners`

Create banner.

Auth required: Admin

Body:

```json
{
  "title": "Homepage Hero",
  "slug": "homepage-hero",
  "type": "hero",
  "image": "https://example.com/hero.jpg",
  "mobileImage": "https://example.com/hero-mobile.jpg",
  "link": "/collections/astrology-essentials",
  "buttonText": "Shop Now",
  "page": "homepage",
  "position": "top",
  "status": "active",
  "startDate": "2026-04-01T00:00:00.000Z",
  "endDate": "2026-05-01T00:00:00.000Z",
  "sortOrder": 1,
  "isClickable": true,
  "targetType": "collection",
  "targetValue": "astrology-essentials"
}
```

### `PUT /admin/banners/:id`

Update banner.

Auth required: Admin

### `DELETE /admin/banners/:id`

Delete banner.

Auth required: Admin

## Pages

### `GET /pages`

Get published pages.

### `GET /pages/:slug`

Get published page by slug.

### `GET /pages/navigation/header`

Get published pages with `showInHeader=true`.

### `GET /pages/navigation/footer`

Get published pages with `showInFooter=true`.

### `GET /admin/pages`

Admin page list.

Auth required: Admin

### `GET /admin/pages/:id`

Admin page detail.

Auth required: Admin

### `POST /admin/pages`

Create page.

Auth required: Admin

Body:

```json
{
  "title": "About Us",
  "slug": "about-us",
  "pageType": "about",
  "content": "<p>About content</p>",
  "status": "published",
  "showInHeader": true,
  "showInFooter": true,
  "seo": {
    "metaTitle": "About Alokit",
    "metaDescription": "Learn more about Alokit."
  }
}
```

Allowed `pageType` values:

- `custom`
- `about`
- `contact`
- `privacy-policy`
- `terms`
- `shipping-policy`
- `refund-policy`
- `faq-page`

### `PUT /admin/pages/:id`

Update page.

Auth required: Admin

### `DELETE /admin/pages/:id`

Delete page.

Auth required: Admin

## SEO

### `GET /seo/:pageKey`

Get SEO config by page key.

Allowed `pageKey` values:

- `homepage`
- `blog-listing`
- `product-listing`
- `category-listing`
- `contact-page`
- `about-page`

### `GET /admin/seo`

Admin SEO config list.

Auth required: Admin

### `GET /admin/seo/:id`

Admin SEO config detail.

Auth required: Admin

### `POST /admin/seo`

Create SEO config.

Auth required: Admin

Body:

```json
{
  "pageKey": "homepage",
  "metaTitle": "Alokit Homepage",
  "metaDescription": "Discover products and collections from Alokit.",
  "metaKeywords": ["alokit", "gemstones", "rudraksha"],
  "ogTitle": "Alokit Homepage",
  "ogDescription": "Featured products and collections.",
  "ogImage": "https://example.com/og.jpg",
  "canonicalUrl": "/",
  "robots": "index,follow"
}
```

### `PUT /admin/seo/:id`

Update SEO config.

Auth required: Admin

Note:

- there is no SEO delete endpoint in the current codebase

## Blogs

### `GET /blogs`

Public blog listing.

Only published blogs are returned.

Supported query params:

- `page`
- `limit`
- `search`
- `category`
- `tag`
- `featured`

### `GET /blogs/featured/list`

Get featured published blogs.

### `GET /blogs/related/:slug`

Get related published blogs based on category and tags.

### `GET /blogs/:slug`

Get published blog by slug.

### `GET /admin/blogs`

Admin blog listing.

Auth required: Admin

Supported query params:

- `page`
- `limit`
- `search`
- `category`
- `tag`
- `featured`
- `status`

### `GET /admin/blogs/:id`

Admin blog detail.

Auth required: Admin

### `POST /admin/blogs`

Create blog.

Auth required: Admin

Body:

```json
{
  "title": "How to Choose Your First Gemstone",
  "slug": "how-to-choose-your-first-gemstone",
  "excerpt": "A beginner guide.",
  "content": "<p>Blog content</p>",
  "featuredImage": "https://example.com/blog.jpg",
  "images": ["https://example.com/blog.jpg"],
  "tags": ["gemstone", "guide"],
  "category": "Gemstone Guide",
  "authorName": "Alokit Team",
  "status": "published",
  "isFeatured": true,
  "publishedAt": "2026-04-06T00:00:00.000Z",
  "seo": {
    "metaTitle": "How to Choose Your First Gemstone",
    "metaDescription": "A simple gemstone buying guide."
  }
}
```

### `PUT /admin/blogs/:id`

Update blog.

Auth required: Admin

### `DELETE /admin/blogs/:id`

Delete blog.

Auth required: Admin

## Postman / QA Execution Order

Suggested order:

1. `GET /`
2. `GET /health`
3. Auth
4. Categories
5. Subcategories
6. Products
7. Search
8. Collections
9. Pages
10. Blogs
11. FAQ
12. Banners
13. Homepage
14. Newsletter
15. Contact
16. Leads
17. Wishlist
18. Cart
19. Orders
20. Payments
21. Reviews
22. Admin CMS routes

## Seeded Local Demo Content

If you ran:

```text
npm run seed:website
```

You should have:

- 1 super admin
- categories
- subcategories
- published products
- collection
- banners
- blogs
- pages
- FAQs
- homepage sections
- homepage SEO
- featured review

## Important Current Constraints

- Root `package.json` still has no real test framework
- Backend has smoke test utility, not full automated integration coverage
- Local checkout and payment verification can now be tested with mock Razorpay data
- Live checkout still requires real Razorpay credentials
- Live payment verification still requires valid Razorpay signature and configured secret
- Public register creates only `user` accounts
- SEO config has create and update endpoints but no delete endpoint
