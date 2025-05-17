import express from 'express'
import { WebhookRequest } from './server'
import crypto from 'crypto'
import { stripe } from './lib/stripe'
import type Stripe from 'stripe'
import { getPayloadClient } from './get-payload'
import { Product, User } from './payload-types'
import { Resend } from 'resend'
import * as React from 'react'
import { ReceiptEmailHtml } from './components/emails/ReceiptEmail'
import { ToOwnerEmailHtml } from './components/emails/ToOwnerEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {

  console.log("Stripe Webhook has been started . ");

  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody
  const signature = req.headers['stripe-signature'] || ''

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error
          ? err.message
          : 'Unknown Error'
        }`
      )
  }

  const session = event.data
    .object as Stripe.Checkout.Session

  if (
    !session?.metadata?.userId ||
    !session?.metadata?.orderId
  ) {
    return res
      .status(400)
      .send(`Webhook Error: No user present in metadata`)
  }

  if (event.type === 'checkout.session.completed') {
    const payload = await getPayloadClient()

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    })

    const [user] = await users

    if (!user)
      return res
        .status(404)
        .json({ error: 'No such user exists.' })

    const { docs: orders } = await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    const [order] = await orders

    if (!order)
      return res
        .status(404)
        .json({ error: 'No such order exists.' })


    console.log("Updating Payment to true")

    await payload.update({
      collection: 'orders',
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })
    console.log("done");    // send receipt to customer and notification to owner
    try {
      const orderWithProducts = order as unknown as {
        products: Array<{ product: Product; quantity: number }>
        user: User
      }
      // Send receipt to customer
      await resend.emails.send({
        from: 'House of Reika <support@houseofreika.com>',
        to: [user.email as string],
        subject: 'Thanks for your order! This is your receipt.',
        react: React.createElement(ReceiptEmailHtml, {
          date: new Date(),
          email: user.email as string,
          orderId: session.metadata.orderId as string,
          products: orderWithProducts.products.map(({ product, quantity }) => ({
            ...product,
            quantity
          }))
        })
      });

      // Send notification to owner
      // await resend.emails.send({
      //   from: 'House of Reika <support@houseofreika.com>',
      //   to: ['houseofreika.official@gmail.com'],
      //   subject: `New Order Received from ${session.metadata.customerName}`,
      //   react: React.createElement(ToOwnerEmailHtml, {
      //     customerName: session.metadata.customerName as string,
      //     shippingAddress: session.metadata.shippingAddress as string,
      //     date: new Date(),
      //     orderId: session.metadata.orderId as string,
      // products: orderWithProducts.products.map(({ product }) => ({
      //   ...product,
      //   quantity: orderWithProducts.products.find(p => p.product.id === product.id)?.quantity || 1
      // }))
      //   })
      // });

      res.status(200).json({ message: 'Emails sent successfully' })
    } catch (error) {
      console.error('Error sending emails:', error)
      res.status(500).json({ error })
    }
  }

  return res.status(200).send()
}


// Razorpay webhook handler
export const razorpayWebhookHandler = async (req: express.Request, res: express.Response) => {

  console.log("Razorpay Webhook has been started . ");

  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {

    const body = req.body.toString('utf8');
    
    // Create HMAC
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!);
    hmac.update(body);
    const generatedSignature = hmac.digest('hex');

    console.log('Signatures:', {
      generated: generatedSignature,
      received: signature
    });

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }


    const payload = await getPayloadClient();
    const event = JSON.parse(req.body);
    console.log(event.event , "ok");
    if (event.event === 'payment.captured') {
      console.log("entered")
      const { notes } = event.payload.payment.entity;
      console.log("orderId is " , notes?.orderId);
      if (!notes?.orderId) {
        console.log("Missing orderId in payment notes")
        return res.status(400).json({ error: 'Missing orderId in payment notes' });
      }

      const { docs: orders } = await payload.find({
        collection: 'orders',
        depth: 2,
        where: {
          id: {
            equals: notes.orderId,
          },
        },
      });

      const [order] = orders;

      await payload.update({
        collection: 'orders',
        data: {
          _isPaid: true,
        },
        where: {
          id: {
            equals: notes.orderId,
          },
        },
      });


      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          id: {
            equals: (order.user as User).id,
          },
        },
      });

      const [user] = users;

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log("Sending emails...");

      try {
        const orderWithProducts = order as unknown as {
          products: Array<{ product: Product; quantity: number }>
          user: User
        }

        // Send receipt to customer
        // await resend.emails.send({
        //   from: 'House of Reika <support@houseofreika.com>',
        //   to: [user.email as string],
        //   subject: 'Thanks for your order! This is your receipt.',
        //   react: React.createElement(ReceiptEmailHtml, {
        //     date: new Date(),
        //     email: user.email as string,
        //     orderId: notes.orderId,
        //     products: orderWithProducts.products.map(({ product, quantity }) => ({
        //       ...product,
        //       quantity
        //     }))
        //   })
        // });

        // Send notification to owner
        await resend.emails.send({
          from: 'House of Reika <support@houseofreika.com>',
          to: ['houseofreika.official@gmail.com'],
          subject: `New Order Received from ${order.customerName}`,
          react: React.createElement(ToOwnerEmailHtml, {
            customerName: order.customerName as string,
            shippingAddress: order.shippingAddress as string,
            date: new Date(),
            orderId: notes.orderId,
            products: orderWithProducts.products.map(({ product }) => ({
              ...product,
              quantity: orderWithProducts.products.find(p => p.product.id === product.id)?.quantity || 1
            }))
          })
        });

        console.log("Emails sent successfully");
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
      }

      console.log("done");

    }
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
