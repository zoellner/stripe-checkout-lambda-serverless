/*
 * This function implements a Stripe webhook handler to handle
 * fulfillment for our successful payments.
 *
 * @see https://stripe.com/docs/payments/checkout/fulfillment#webhooks
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // All log statements are written to CloudWatch
  console.info('received:', event);
  const {requestContext, body, header} = event;
  if (requestContext.http.method !== 'POST') {
    throw new Error(`handlePurchase only accept POST method, you tried: ${requestContext.http.method}`);
  }

  let requestBody;
  if (event.isBase64Encoded) {
    requestBody = JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
  } else {
    requestBody = JSON.parse(body);
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      requestBody,
      header['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const eventObject = stripeEvent.data.object;
      const items = JSON.parse(eventObject.metadata.items);
      const shippingDetails = eventObject.shipping;

      // Here make an API call / send an email to your fulfillment provider.
      const purchase = { items, shippingDetails };
      console.log(`📦 Fulfill purchase:`, JSON.stringify(purchase, null, 2));
      // Send and email to our fulfillment provider using Sendgrid.
      const msg = {
        to: process.env.FULFILLMENT_EMAIL_ADDRESS,
        from: process.env.FROM_EMAIL_ADDRESS,
        subject: `New purchase from ${shippingDetails.name}`,
        text: JSON.stringify(purchase, null, 2),
      };
      await sgMail.send(msg);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
