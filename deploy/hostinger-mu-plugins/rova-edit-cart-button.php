<?php
/**
 * Plugin Name: ROVA — Edit Cart Escape Hatch
 * Description: Adds a "Need to modify items or quantities? Edit Cart" link to the
 *              order-pay screen, returning the shopper to the headless storefront
 *              with the cart drawer open.
 *
 * INSTALL: wp-content/mu-plugins/rova-edit-cart-button.php
 *
 * WooCommerce locks line items on a pending order-pay invoice, so without this a
 * shopper who wants a different quantity has no way back.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Where the shopper returns to. `openCart=true` opens the storefront drawer. */
function rova_storefront_cart_url() {
	return 'https://rovapeptides.com/shop?openCart=true';
}

/**
 * `woocommerce_pay_order_before_submit` fires inside the payment form on the
 * order-pay screen only, so this never appears on the regular checkout.
 */
function rova_render_edit_cart_button() {
	?>
	<div class="rova-edit-cart">
		<a class="rova-edit-cart__link" href="<?php echo esc_url( rova_storefront_cart_url() ); ?>">
			<span aria-hidden="true">&larr;</span>
			<?php esc_html_e( 'Need to modify items or quantities? Edit Cart', 'rova' ); ?>
		</a>
		<p class="rova-edit-cart__note">
			<?php esc_html_e( 'Quantities are locked on this invoice. Returning to the store reopens your cart so you can adjust it, then check out again.', 'rova' ); ?>
		</p>
	</div>
	<?php
}
add_action( 'woocommerce_pay_order_before_submit', 'rova_render_edit_cart_button' );

/** Styles are gated to the order-pay screen so nothing leaks sitewide. */
function rova_edit_cart_button_styles() {
	if ( ! function_exists( 'is_checkout_pay_page' ) || ! is_checkout_pay_page() ) {
		return;
	}
	?>
	<style id="rova-edit-cart-css">
		.rova-edit-cart {
			margin: 0 0 1.5rem;
			padding: 1rem 1.25rem;
			border: 1px solid rgba(23, 22, 20, 0.12);
			border-left: 3px solid #a85e49;
			border-radius: 12px;
			background: #faf7f2;
		}
		.rova-edit-cart__link {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			min-height: 44px;
			font-weight: 700;
			font-size: 0.95rem;
			line-height: 1.3;
			text-decoration: none;
			color: #8a4f3e;
			transition: color 160ms ease, transform 160ms ease;
		}
		.rova-edit-cart__link:hover,
		.rova-edit-cart__link:focus-visible { color: #7e4636; transform: translateX(-2px); }
		.rova-edit-cart__link:focus-visible {
			outline: 2px solid #8a4f3e;
			outline-offset: 3px;
			border-radius: 4px;
		}
		.rova-edit-cart__note {
			margin: 0.5rem 0 0;
			font-size: 0.8rem;
			line-height: 1.5;
			color: #575249;
		}
		@media (prefers-reduced-motion: reduce) {
			.rova-edit-cart__link { transition: none; }
			.rova-edit-cart__link:hover { transform: none; }
		}
	</style>
	<?php
}
add_action( 'wp_head', 'rova_edit_cart_button_styles' );
