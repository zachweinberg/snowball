import { Router } from 'express';
import Stripe from 'stripe';
import { catchErrors } from '~/utils/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
  typescript: true,
});

const subscriptionsRouter = Router();

subscriptionsRouter.post(
  '/create-checkout-sesssion',
  catchErrors(async (req, res) => {
    const { lookupKey } = req.body;

    const prices = await stripe.prices.list({ expand: ['data.product'] });

    console.log(prices);

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      mode: 'subscription',
      success_url: 'https://obsidiantracker.com/subscriptions/success',
      cancel_url: 'https://obsidiantracker.com/subscriptions/cancel',
      automatic_tax: { enabled: true },
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
    });

    res.status(200).json(session);
  })
);

export default subscriptionsRouter;
