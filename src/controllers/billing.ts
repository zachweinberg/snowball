import { PlanType, User } from '@zachweinberg/obsidian-schema';
import express, { Router } from 'express';
import Stripe from 'stripe';
import { logSentryError } from '~/lib/sentry';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { updateDocument } from '~/utils/db';
import stripeClient from '~/utils/stripe';

const billingRouter = Router();

const PRODUCT_PRICE_ID = 'price_1KSSprFTpxe1okE1qtpqo6Z1'; // from stripe dashboard

billingRouter.get(
  '/create-checkout-session',
  express.json({ limit: '5mb' }),
  requireSignedIn,
  catchErrors(async (req, res) => {
    const session = await stripeClient.checkout.sessions.create({
      metadata: {
        obsidianUserID: req.user!.id,
      },
      customer: req.user!.plan.stripeCustomerID ?? undefined,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: PRODUCT_PRICE_ID,
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
  '/session',
  express.json({ limit: '5mb' }),
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { sessionID } = req.query as { sessionID: string };

    const session = await stripeClient.checkout.sessions.retrieve(sessionID);

    if (!session) {
      return res.status(404).end();
    }

    console.log(JSON.stringify(session));

    res.status(200).json({
      status: 'ok',
    });
  })
);

billingRouter.get(
  '/create-portal-session',
  express.json({ limit: '5mb' }),
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

billingRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  catchErrors(async (req, res) => {
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

    // let subscription;
    let status;

    switch (event.type) {
      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);

        const userDataToSet: Partial<User> = {
          plan: {
            planUpdatedAt: new Date(),
            stripeCustomerID: subscription.customer as string,
            stripeSubscriptionID: subscription.id,
            type: PlanType.PREMIUM,
          },
        };

        const userID = subscription.metadata.obsidianUserID;

        await updateDocument('users', userID, userDataToSet);

        break;
      // case 'customer.subscription.trial_will_end':
      //   const subscription = event.data.object;
      //   status = subscription.status;
      //   console.log(`Subscription status is ${status}.`);
      //   // handleSubscriptionTrialEnding(subscription);
      //   break;
      // case 'customer.subscription.deleted':
      //   const subscription = event.data.object;
      //   status = subscription.status;
      //   console.log(`Subscription status is ${status}.`);
      //   // handleSubscriptionDeleted(subscriptionDeleted);
      //   break;
      // case 'customer.subscription.updated':
      //   const subscription = event.data.object;
      //   status = subscription.status;
      //   console.log(`Subscription status is ${status}.`);
      //   // handleSubscriptionUpdated(subscription);
      //   break;
      default:
        console.log(`Unhandled Stripe webhook event type ${event.type}.`);
    }
  })
);

export default billingRouter;
