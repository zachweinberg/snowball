import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import stripeClient from '~/utils/stripe';

const billingRouter = Router();

billingRouter.get(
  '/create-checkout-session',
  requireSignedIn,
  catchErrors(async (req, res) => {
    // if we ever add more products/prices, maybe we cant use index 0!
    const session = await stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: 'price_1KRGwOFTpxe1okE13HfLvFR3',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://obsidiantracker.com/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://obsidiantracker.com/upgrade?canceled=true`,
    });

    if (!session.url) {
      throw new Error("Can't generate session URL");
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
    // if (!req.user!.plan.stripeCustomerID) {
    //   return res.status(401).json({ status: 'error', error: 'Invalid.' });
    // }

    const portalSession = await stripeClient.billingPortal.sessions.create({
      //   customer: req.user!.plan.stripeCustomerID,
      customer: 'cus_L7W0Xn0ia1dluc',
      return_url: `https://obsidiantracker.com/account`,
    });

    if (!portalSession.url) {
      throw new Error("Can't generate portal URL");
    }

    res.status(200).json({
      status: 'ok',
      url: portalSession.url,
    });
  })
);

export default billingRouter;
