# Hostinger deployment artifacts

`rova-handoff.php` is the WordPress **Must-Use** plugin that receives the signed
cart from the Next.js `/api/checkout` route and rebuilds the WooCommerce cart.

Deploy: upload `rova-handoff.php` to `wp-content/mu-plugins/rova-handoff.php`
on shop.rovapeptides.com, and add to wp-config.php:

    define('HANDOFF_SECRET', '<same value as the Vercel HANDOFF_SECRET env var>');

Contract (must match app/api/checkout/route.ts exactly):
  endpoint : /rova-handoff
  params   : data = base64url(JSON.stringify({items,exp})),  sig = HMAC_SHA256_hex(secret, data)
