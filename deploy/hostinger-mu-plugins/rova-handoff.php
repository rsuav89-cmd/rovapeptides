<?php
/**
 * Plugin Name: Rova Cart Handoff
 * Description: Receives an HMAC-signed cart from the headless Next.js storefront,
 *              rebuilds the WooCommerce cart server-side, and redirects to checkout.
 * Version:     1.0.0
 * Author:      RovaPeptides
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * INSTALL (Must-Use plugin — always active, no activation needed):
 *   Upload this file to:  wp-content/mu-plugins/rova-handoff.php
 *   (create the mu-plugins folder if it does not exist)
 *
 * SHARED SECRET:
 *   Add this line to wp-config.php (above "That's all, stop editing"), using the
 *   SAME value you set for the Vercel env var HANDOFF_SECRET:
 *
 *       define( 'HANDOFF_SECRET', 'your-long-random-secret-here' );
 *
 *   (A getenv('HANDOFF_SECRET') fallback is also supported if your host injects
 *   env vars, but the wp-config constant is the reliable path on Hostinger.)
 *
 * ENDPOINT:
 *   GET/POST  https://shop.rovapeptides.com/rova-handoff?data=<base64url>&sig=<hex>
 *   No permalink flush required — this hooks template_redirect, which fires for
 *   every front-end request (including this otherwise-unmatched path).
 * ─────────────────────────────────────────────────────────────────────────────
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve the shared HMAC secret: wp-config constant first, then env var.
 *
 * @return string
 */
function rova_handoff_secret() {
	if ( defined( 'HANDOFF_SECRET' ) && HANDOFF_SECRET ) {
		return (string) HANDOFF_SECRET;
	}
	$env = getenv( 'HANDOFF_SECRET' );
	return $env ? (string) $env : '';
}

/**
 * Intercept /rova-handoff, verify the signature, rebuild the cart, go to checkout.
 */
function rova_handle_cart_handoff() {
	$path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH );
	if ( ! $path || untrailingslashit( $path ) !== '/rova-handoff' ) {
		return;
	}

	$secret = rova_handoff_secret();
	if ( '' === $secret ) {
		status_header( 500 );
		wp_die( 'Checkout handoff is not configured (missing HANDOFF_SECRET).' );
	}

	// phpcs:disable WordPress.Security.NonceVerification.Recommended
	$data = isset( $_REQUEST['data'] ) ? (string) wp_unslash( $_REQUEST['data'] ) : '';
	$sig  = isset( $_REQUEST['sig'] ) ? (string) wp_unslash( $_REQUEST['sig'] ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Recommended

	if ( '' === $data || '' === $sig ) {
		status_header( 400 );
		wp_die( 'Missing cart handoff parameters.' );
	}

	// Verify HMAC-SHA256 over the exact base64url `data` string (hex digest).
	$expected = hash_hmac( 'sha256', $data, $secret );
	if ( ! hash_equals( $expected, $sig ) ) {
		status_header( 403 );
		wp_die( 'Invalid cart signature.' );
	}

	// Decode base64url → JSON (restore + / and padding for PHP's base64_decode).
	$b64 = strtr( $data, '-_', '+/' );
	$mod = strlen( $b64 ) % 4;
	if ( $mod ) {
		$b64 .= str_repeat( '=', 4 - $mod );
	}
	$json = base64_decode( $b64, true );
	if ( false === $json ) {
		status_header( 400 );
		wp_die( 'Malformed cart payload.' );
	}

	$payload = json_decode( $json, true );
	if ( ! is_array( $payload ) || empty( $payload['items'] ) || ! is_array( $payload['items'] ) ) {
		status_header( 400 );
		wp_die( 'Empty or invalid cart payload.' );
	}

	// Expiry (exp is inside the signed payload, so it is tamper-proof).
	$exp = isset( $payload['exp'] ) ? intval( $payload['exp'] ) : 0;
	if ( $exp > 0 && time() > $exp ) {
		status_header( 403 );
		wp_die( 'This checkout link has expired. Please return to the store and try again.' );
	}

	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		status_header( 500 );
		wp_die( 'WooCommerce cart is unavailable.' );
	}

	// Make sure the WooCommerce customer session exists BEFORE we mutate the cart,
	// so the session cookie is issued on this very response.
	if ( WC()->session && ! WC()->session->has_session() ) {
		WC()->session->set_customer_session_cookie( true );
	}

	// Start from a clean cart, then add each mapped line.
	WC()->cart->empty_cart();

	$added = 0;
	foreach ( $payload['items'] as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}
		$product_id   = isset( $item['product_id'] ) ? intval( $item['product_id'] ) : 0;
		$variation_id = isset( $item['variation_id'] ) ? intval( $item['variation_id'] ) : 0;
		$qty          = isset( $item['qty'] ) ? max( 1, intval( $item['qty'] ) ) : 1;

		if ( $product_id <= 0 ) {
			continue;
		}

		$key = ( $variation_id > 0 )
			? WC()->cart->add_to_cart( $product_id, $qty, $variation_id )
			: WC()->cart->add_to_cart( $product_id, $qty );

		if ( $key ) {
			$added++;
		}
	}

	// If nothing landed in the cart, the checkout page would just bounce back to
	// /cart. Surface the real problem instead of silently redirecting.
	if ( $added === 0 || WC()->cart->is_empty() ) {
		status_header( 400 );
		wp_die( 'Cart could not be built from the handoff payload (no valid, purchasable products were added). Check the product/variation IDs.' );
	}

	// ── SESSION PERSISTENCE (the fix for "lands on empty /cart") ──────────────
	// The cart lives in the WooCommerce session. When we build it in one request
	// and immediately redirect, the session must be written AND its cookie sent
	// on THIS response, or the follow-up /checkout/ request reads an empty cart
	// and WooCommerce bounces it to /cart. Force all three, in order.
	WC()->cart->calculate_totals();
	WC()->cart->set_session();                 // write cart into the session object
	if ( WC()->session ) {
		WC()->session->set_customer_session_cookie( true ); // ensure the session cookie is issued
		WC()->session->save_data();            // flush session to storage now, not on shutdown
	}
	WC()->cart->maybe_set_cart_cookies();      // set woocommerce_items_in_cart / hash cookies

	// Off to WooCommerce checkout. Prefer wc_get_checkout_url(); fall back to an
	// explicit /checkout/ permalink so we never land on /cart with a full cart.
	$checkout_url = wc_get_checkout_url();
	if ( empty( $checkout_url ) || false !== stripos( $checkout_url, '/cart' ) ) {
		$checkout_url = home_url( '/checkout/' );
	}
	wp_safe_redirect( $checkout_url, 303 );
	exit;
}
// Priority 5: run before the theme's 404 template loads. WooCommerce's cart/
// session are already initialized by the time template_redirect fires.
add_action( 'template_redirect', 'rova_handle_cart_handoff', 5 );
