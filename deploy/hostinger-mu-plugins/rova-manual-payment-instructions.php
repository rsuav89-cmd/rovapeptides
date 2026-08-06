<?php
/**
 * Plugin Name: ROVA — Manual Payment Instructions
 * Description: Renders Zelle and Cash App payment details, with the order number
 *              to quote in the memo, on the order-received page and in the
 *              customer's order emails.
 *
 * INSTALL: wp-content/mu-plugins/rova-manual-payment-instructions.php
 *
 * Why code rather than the gateway's "Instructions" settings field: that field
 * is static text with no placeholder support, so it cannot print the order
 * number. Manual reconciliation depends on the shopper quoting that number, so
 * it has to be generated per order.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Payment destinations. Edit here — nowhere else references these values.
 */
function rova_manual_payment_accounts() {
	return array(
		'zelle' => array(
			'label'  => __( 'Zelle', 'rova' ),
			'field'  => __( 'Send to (phone)', 'rova' ),
			'value'  => '321-482-6724',
			'memo'   => __( 'Memo / note', 'rova' ),
		),
		'cashapp' => array(
			'label'  => __( 'Cash App', 'rova' ),
			'field'  => __( 'Send to (Cashtag)', 'rova' ),
			'value'  => '$JRandone',
			'memo'   => __( 'For / note', 'rova' ),
		),
	);
}

/**
 * Which manual method is this order using?
 *
 * Matches the gateway ID first, then falls back to the gateway title, so this
 * keeps working whatever the custom gateway plugin calls itself.
 *
 * @return string|false 'zelle', 'cashapp', or false.
 */
function rova_detect_manual_method( $order ) {
	$haystack = strtolower(
		$order->get_payment_method() . ' ' . $order->get_payment_method_title()
	);

	if ( false !== strpos( $haystack, 'zelle' ) ) {
		return 'zelle';
	}
	if ( false !== strpos( $haystack, 'cashapp' ) || false !== strpos( $haystack, 'cash app' ) || false !== strpos( $haystack, 'cash_app' ) ) {
		return 'cashapp';
	}
	return false;
}

/**
 * Build the instruction block.
 *
 * @param WC_Order $order
 * @param bool     $for_email Plain-ish markup for the email template.
 */
function rova_manual_payment_markup( $order, $for_email = false ) {
	$method = rova_detect_manual_method( $order );
	if ( ! $method ) {
		return '';
	}

	// Once the order is paid, "send us money" is the wrong message.
	if ( ! $order->needs_payment() && ! $order->has_status( array( 'pending', 'on-hold' ) ) ) {
		return '';
	}

	$accounts = rova_manual_payment_accounts();
	if ( empty( $accounts[ $method ] ) ) {
		return '';
	}

	$account = $accounts[ $method ];
	// get_order_number() respects sequential-order-number plugins; get_id() does not.
	$number  = $order->get_order_number();
	$total   = $order->get_formatted_order_total();

	ob_start();
	?>
	<div class="rova-manual-pay" style="<?php echo $for_email ? 'border:1px solid #e0dad0;border-left:4px solid #a85e49;border-radius:8px;padding:16px;margin:0 0 20px;background:#faf7f2;font-family:Helvetica,Arial,sans-serif;' : ''; ?>">
		<h2 class="rova-manual-pay__title" style="<?php echo $for_email ? 'margin:0 0 8px;font-size:16px;' : ''; ?>">
			<?php
			/* translators: %s: payment method name, e.g. Zelle */
			printf( esc_html__( 'Complete your payment with %s', 'rova' ), esc_html( $account['label'] ) );
			?>
		</h2>

		<p class="rova-manual-pay__lede" style="<?php echo $for_email ? 'margin:0 0 12px;font-size:14px;line-height:1.6;' : ''; ?>">
			<?php
			printf(
				/* translators: 1: order total */
				esc_html__( 'Send %1$s using the details below. Your order is reserved and will be dispatched once we confirm the payment.', 'rova' ),
				wp_kses_post( $total )
			);
			?>
		</p>

		<table class="rova-manual-pay__table" cellpadding="0" cellspacing="0" style="<?php echo $for_email ? 'width:100%;border-collapse:collapse;font-size:14px;' : ''; ?>">
			<tbody>
				<tr>
					<th scope="row" align="left" style="<?php echo $for_email ? 'padding:6px 12px 6px 0;color:#575249;font-weight:600;white-space:nowrap;' : ''; ?>">
						<?php echo esc_html( $account['field'] ); ?>
					</th>
					<td style="<?php echo $for_email ? 'padding:6px 0;font-weight:700;font-size:16px;' : ''; ?>">
						<?php echo esc_html( $account['value'] ); ?>
					</td>
				</tr>
				<tr>
					<th scope="row" align="left" style="<?php echo $for_email ? 'padding:6px 12px 6px 0;color:#575249;font-weight:600;white-space:nowrap;' : ''; ?>">
						<?php echo esc_html( $account['memo'] ); ?>
					</th>
					<td style="<?php echo $for_email ? 'padding:6px 0;font-weight:700;font-size:16px;' : ''; ?>">
						<?php
						/* translators: %s: order number */
						printf( esc_html__( 'Order %s', 'rova' ), esc_html( $number ) );
						?>
					</td>
				</tr>
				<tr>
					<th scope="row" align="left" style="<?php echo $for_email ? 'padding:6px 12px 6px 0;color:#575249;font-weight:600;white-space:nowrap;' : ''; ?>">
						<?php esc_html_e( 'Amount', 'rova' ); ?>
					</th>
					<td style="<?php echo $for_email ? 'padding:6px 0;font-weight:700;font-size:16px;' : ''; ?>">
						<?php echo wp_kses_post( $total ); ?>
					</td>
				</tr>
			</tbody>
		</table>

		<p class="rova-manual-pay__memo-warning" style="<?php echo $for_email ? 'margin:12px 0 0;font-size:13px;line-height:1.6;color:#7e4636;font-weight:600;' : ''; ?>">
			<?php
			printf(
				/* translators: 1: memo field name, 2: order number */
				esc_html__( 'Please put %1$s: Order %2$s in the transaction. We match payments to orders by that reference, and a payment without it can take significantly longer to verify.', 'rova' ),
				esc_html( $account['memo'] ),
				esc_html( $number )
			);
			?>
		</p>
	</div>
	<?php
	return ob_get_clean();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Suppress the gateway's own placeholder instructions.
 *
 * The Zelle gateway ships default "Instructions" text still containing
 * [YOUR-ZELLE-EMAIL-OR-PHONE-HERE] and #{order_number} — literal placeholders
 * the gateway never substitutes. Left alone it renders directly above our own
 * block, so the shopper sees a broken template and a correct one side by side
 * and has no way to know which to trust.
 *
 * Three layers, because gateways differ in how they emit that text:
 *   1. blank the public `instructions` property (BACS/COD and most forks)
 *   2. strip placeholders from the checkout-page gateway description
 *   3. an output buffer over the thank-you page as the catch-all, for gateways
 *      that echo get_option('instructions') directly
 * ───────────────────────────────────────────────────────────────────────────── */

/** Literal tokens that mark unsubstituted template text. Extend as needed. */
function rova_placeholder_tokens() {
	return array(
		'[YOUR-ZELLE-EMAIL-OR-PHONE-HERE]',
		'[YOUR-CASHTAG-HERE]',
		'#{order_number}',
		'{order_number}',
		'{{order_number}}',
	);
}

function rova_contains_placeholder( $text ) {
	if ( ! is_string( $text ) || '' === $text ) {
		return false;
	}
	foreach ( rova_placeholder_tokens() as $token ) {
		if ( false !== strpos( $text, $token ) ) {
			return true;
		}
	}
	return false;
}

/** Layer 1 — blank the property before any gateway renders it. */
function rova_scrub_gateway_instructions() {
	if ( ! function_exists( 'WC' ) || ! WC()->payment_gateways ) {
		return;
	}
	foreach ( WC()->payment_gateways()->payment_gateways() as $gateway ) {
		if ( isset( $gateway->instructions ) && rova_contains_placeholder( $gateway->instructions ) ) {
			$gateway->instructions = '';
		}
	}
}
add_action( 'wp', 'rova_scrub_gateway_instructions', 5 );
add_action( 'woocommerce_email_before_order_table', 'rova_scrub_gateway_instructions', 1 );

/** Layer 2 — checkout page descriptions. */
function rova_scrub_gateway_description( $description, $gateway_id = '' ) {
	return rova_contains_placeholder( $description ) ? '' : $description;
}
add_filter( 'woocommerce_gateway_description', 'rova_scrub_gateway_description', 10, 2 );

/**
 * Layer 3 — catch-all on the order-received page.
 *
 * Buffers everything emitted between `woocommerce_before_thankyou` and our own
 * renderer, drops any block still carrying a placeholder, then prints the rest.
 * Priority 1 so it flushes before rova_thankyou_manual_payment() runs at 10.
 */
function rova_start_thankyou_buffer() {
	ob_start();
}
add_action( 'woocommerce_before_thankyou', 'rova_start_thankyou_buffer', 0 );

function rova_flush_thankyou_buffer() {
	if ( ! ob_get_level() ) {
		return;
	}
	$html = ob_get_clean();

	// Drop whole paragraphs/divs that contain a placeholder; WooCommerce
	// wpautop()s instruction text, so it arrives as <p> blocks.
	$html = preg_replace_callback(
		'#<(p|div)\b[^>]*>.*?</\1>#is',
		function ( $matches ) {
			return rova_contains_placeholder( $matches[0] ) ? '' : $matches[0];
		},
		$html
	);

	// Belt and braces: remove any bare token that survived outside a block.
	$html = str_replace( rova_placeholder_tokens(), '', $html );

	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- passthrough of already-rendered markup.
}
add_action( 'woocommerce_thankyou', 'rova_flush_thankyou_buffer', 1 );

/**
 * Order-received (thank-you) page.
 */
function rova_thankyou_manual_payment( $order_id ) {
	$order = wc_get_order( $order_id );
	if ( ! $order ) {
		return;
	}
	echo rova_manual_payment_markup( $order, false ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped at build time.
}
add_action( 'woocommerce_thankyou', 'rova_thankyou_manual_payment', 10, 1 );

/**
 * Customer emails. Most people pay from the email, not the thank-you page, so
 * the details have to travel with it.
 */
function rova_email_manual_payment( $order, $sent_to_admin = false, $plain_text = false, $email = null ) {
	if ( $sent_to_admin || $plain_text ) {
		return;
	}
	echo rova_manual_payment_markup( $order, true ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped at build time.
}
add_action( 'woocommerce_email_before_order_table', 'rova_email_manual_payment', 10, 4 );

/**
 * Front-end styling for the thank-you page only.
 */
function rova_manual_payment_styles() {
	if ( ! function_exists( 'is_order_received_page' ) || ! is_order_received_page() ) {
		return;
	}
	?>
	<style id="rova-manual-pay-css">
		.rova-manual-pay {
			margin: 0 0 2rem;
			padding: 1.25rem 1.5rem;
			border: 1px solid rgba(23, 22, 20, 0.12);
			border-left: 4px solid #a85e49;
			border-radius: 12px;
			background: #faf7f2;
		}
		.rova-manual-pay__title { margin: 0 0 0.5rem; font-size: 1.15rem; }
		.rova-manual-pay__lede { margin: 0 0 1rem; font-size: 0.95rem; line-height: 1.6; color: #4a453f; }
		.rova-manual-pay__table { width: 100%; border-collapse: collapse; }
		.rova-manual-pay__table th {
			padding: 0.4rem 1rem 0.4rem 0;
			text-align: left;
			font-size: 0.75rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: #575249;
			white-space: nowrap;
			vertical-align: baseline;
		}
		.rova-manual-pay__table td {
			padding: 0.4rem 0;
			font-size: 1.05rem;
			font-weight: 700;
			color: #171614;
			word-break: break-word;
		}
		.rova-manual-pay__memo-warning {
			margin: 1rem 0 0;
			font-size: 0.85rem;
			line-height: 1.6;
			font-weight: 600;
			color: #7e4636;
		}
		@media (max-width: 480px) {
			.rova-manual-pay__table th,
			.rova-manual-pay__table td { display: block; padding: 0; }
			.rova-manual-pay__table th { margin-top: 0.75rem; }
		}
	</style>
	<?php
}
add_action( 'wp_head', 'rova_manual_payment_styles' );
