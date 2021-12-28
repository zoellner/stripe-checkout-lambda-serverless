# Serverless Stripe Checkout with AWS Lambda Functions

Use Stripe Checkout with AWS Lambda Functions to sell your products online.
This is based on a [similar demo for netlify](https://github.com/stripe-samples/checkout-netlify-serverless).

## Demo
<img src="stripe-checkout-netlify-functions-demo.gif" alt="Stripe Checkout with Netlify functions demo gif" align="center">


From the original netlify demo:
- https://checkout-netlify-serverless.netlify.com
- [Written tutorial](https://www.netlify.com/blog/2020/04/13/learn-how-to-accept-money-on-jamstack-sites-in-38-minutes/)
- [Video lessons on egghead](https://jason.af/egghead/stripe-products)
- Live coding session on [learnwithjason.dev](https://www.learnwithjason.dev/sell-products-on-the-jamstack)


## Features:

- Load products from a JSON product catalogue
- Create Checkout Sessions with AWS Lambda Functions
- Process Stripe webhook events with AWS Lambda Functions to handle fulfillment

## How to run locally

### Prerequisites

- [Node](https://nodejs.org/en/) >= 14
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

Follow the steps below to run locally.

**1. Clone and configure the sample**

```
git clone https://github.com/zoellner/stripe-checkout-lambda-serverless
```

Copy the .env.json.example file into a file named .env.json in the functions folder. For example:

```
cp .env.json.example .env.json
```

You will need a Stripe account in order to run the demo. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development/quickstart#api-keys) to find your API keys.

```
"STRIPE_PUBLISHABLE_KEY": "<replace-with-your-publishable-key>"
"STRIPE_SECRET_KEY": "<replace-with-your-secret-key>"
```

**2. Run AWS Lambda Functions locally:**

You can run the AWS Lambda Functions locally with SAM:

```
npm start
```

Then open [http://localhost:3000/index.html](http://localhost:3000/index.html) in your browser

**3. [Optional] Run a webhook locally:**

If you want to test the `using-webhooks` integration with a local webhook on your machine, you can use the Stripe CLI to easily spin one up.

Make sure to [install the CLI](https://stripe.com/docs/stripe-cli) and [link your Stripe account](https://stripe.com/docs/stripe-cli#link-account).

In a separate tab run

```
stripe listen --forward-to localhost:3000/handle-purchase
```

Or use the shorthand `npm run webhook`

The CLI will print a webhook secret key to the console. Set `STRIPE_WEBHOOK_SECRET` to this value in your .env file.

You should see events logged in the console where the CLI is running.

When you are ready to create a live webhook endpoint, follow our guide in the docs on [configuring a webhook endpoint in the dashboard](https://stripe.com/docs/webhooks/setup#configure-webhook-settings).

### Deploy with AWS SAM
coming soon

## Get support
If you found a bug or want to suggest a new [feature/use case/sample], please [file an issue](../../issues).

If you have questions, comments, or need help with code that is related to Stripe, reach out to them:
- on [Discord](https://stripe.com/go/developer-chat)
- on Twitter at [@StripeDev](https://twitter.com/StripeDev)
- on Stack Overflow at the [stripe-payments](https://stackoverflow.com/tags/stripe-payments/info) tag
- by [email](mailto:support+github@stripe.com)

## Authors

- [zoellner](https://twitter.com/AMZoellner)

In addition [jlengstorf](https://twitter.com/jlengstorf) for the original netlify demo and [thorsten-stripe](https://twitter.com/thorwebdev) from Stripe.
