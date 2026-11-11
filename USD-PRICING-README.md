# UGG EN — USD pricing

The storefront displays USD prices using a fixed **illustrative** conversion rate of **80 RUB = 1 USD**. This is not a live market rate. USD values are rounded to cents per product variant.

- The original `demo_price_rub` column remains unchanged and is the source of truth.
- `demo_price_usd` is an audit/reference column calculated from that RUB value.
- `catalog.js` converts demo prices to USD for the product catalog, product detail, bag and inquiry totals.
- `app.js` formats all displayed amounts as USD ($).
- Inquiry drafts include `currency: USD` and the assumed exchange rate.
- `data/feed-demo.xml` and `data/generate-feed.mjs` are RUB-based **legacy/demo feed artifacts**, not an EN USD feed; do not publish them as an USD feed.
- Original UGG RU repository/files have not been changed.

Before actual sales, replace demonstration prices with verified USD selling prices, including taxes, shipping and any applicable exchange-rate policy.
