import express, { Router } from 'express';
import Stripe from 'stripe';
import { logSentryError } from '~/lib/sentry';
import { catchErrors, requireSignedIn } from '~/utils/api';
import stripeClient from '~/utils/stripe';

const billingRouter = Router();

billingRouter.get(
  '/create-checkout-session',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const session = await stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: 'price_1KRGwOFTpxe1okE13HfLvFR3', // from stripe dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://obsidiantracker.com/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://obsidiantracker.com/upgrade?cancelled=true`,
    });

    if (!session.url) {
      throw new Error('Can not generate session URL.');
    }

    res.status(200).json({
      status: 'ok',
      url: session.url,
    });
  })
);

billingRouter.get(
  '/create-portal-session',
  requireSignedIn,
  catchErrors(async (req, res) => {
    if (!req.user!.plan.stripeCustomerID) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: req.user!.plan.stripeCustomerID,
      return_url: `https://obsidiantracker.com/account`,
    });

    if (!portalSession.url) {
      throw new Error('Can not generate portal URL.');
    }

    res.status(200).json({
      status: 'ok',
      url: portalSession.url,
    });
  })
);

billingRouter.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  let event = req.body as Stripe.Event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    const signature = req.headers['stripe-signature'];

    try {
      event = stripeClient.webhooks.constructEvent(req.body, signature ?? '', webhookSecret);
    } catch (err) {
      console.log(`Stripe Webhook signature verification failed: `, err.message);
      logSentryError(err);
      return res.status(400).end();
    }
  }

  res.status(200).end();

  let subscription;
  let status;

  switch (event.type) {
    case 'customer.subscription.created':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      console.log(JSON.stringify(subscription));
      // handleSubscriptionCreated(subscription);
      break;
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // handleSubscriptionTrialEnding(subscription);
      break;
    case 'customer.subscription.deleted':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case 'customer.subscription.updated':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // handleSubscriptionUpdated(subscription);
      break;
    default:
      console.log(`Unhandled Stripe webhook event type ${event.type}.`);
  }
});

export default billingRouter;
