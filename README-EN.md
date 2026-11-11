# UGG Store — English edition

This is an **independent English-language copy** of the UGG Store demo. It is not affiliated with UGG. The original Russian project is unchanged.

## Run

From this directory: `node server.mjs`, then open the local address shown by the server (usually http://localhost:3000).

Alternatively, host the `public/` folder on any static web host. To refresh it after edits, run `node prepare-pages.mjs`.

## Important

- Prices remain **demo prices in RUB**; they are not converted or verified.
- Checkout and automatic sending of inquiries are not implemented. Inquiries are local drafts only.
- English cart/wishlist use a separate localStorage namespace, so they do not overwrite the Russian edition.
- Catalog data remains demonstrative and should be verified before publication.
