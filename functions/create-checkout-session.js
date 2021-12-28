/*
 * This function creates a Stripe Checkout session and returns the session ID
 * for use with Stripe.js (specifically the redirectToCheckout method).
 *
 * @see https://stripe.com/docs/payments/checkout/one-time
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const domain = process.env.URL;

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
const inventory = require('./data/products.json');

exports.handler = async (event) => {
  // All log statements are written to CloudWatch
  console.info('received:', event);
  const {requestContext, body} = event;
  if (requestContext.http.method !== 'POST') {
    throw new Error(`createCheckoutSession only accept POST method, you tried: ${requestContext.http.method}`);
  }

  let requestBody;
  if (event.isBase64Encoded) {
    requestBody = JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
  } else {
    requestBody = JSON.parse(body);
  }

  const { sku, quantity } = requestBody;

  const product = inventory.find((p) => p.sku === sku);

  // ensure that the quantity is within the allowed range
  const validatedQuantity = quantity > 0 && quantity < 11 ? quantity : 1;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },

    success_url: `${domain}/success.html`,
    cancel_url: domain,
    line_items: [
      {
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: product.amount,
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image],
          },
        },
        quantity: validatedQuantity,
      },
    ],
    // We are using the metadata to track which items were purchased.
    // We can access this meatadata in our webhook handler to then handle
    // the fulfillment process.
    // In a real application you would track this in an order object in your database.
    metadata: {
      items: JSON.stringify([
        {
          sku: product.sku,
          name: product.name,
          quantity: validatedQuantity,
        },
      ]),
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  };
};
