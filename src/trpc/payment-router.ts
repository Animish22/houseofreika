import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import { razorpay, formatAmountForRazorpay } from '../lib/razorpay'
import type Stripe from 'stripe'
import crypto from 'crypto'
import { Product } from '../payload-types'

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number()
      })),
      customerName: z.string(),
      shippingAddress: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      console.log("Started");
      let { items, customerName, shippingAddress } = input

      if (items.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: items.map(item => item.productId),
          },
        },
      });

      const filteredProducts = products.filter((prod) =>
        Boolean(prod.priceId)
      )

      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => ({
            product: prod.id,
            quantity: items.find(item => item.productId === prod.id)?.quantity || 1
          })),
          user: user.id,
          customerName,
          shippingAddress
        },
      });

      console.log(`Id - ${order.id} yeh hai bhai aur order - ${order}`)

      try {
        // Calculate total amount

        const amount: number = filteredProducts.reduce<number>(
          (acc, product) => {
            const item = items.find(i => i.productId === product.id);
            const quantity = item?.quantity || 1;
            const price = product.price as number ;
            return acc + (price * quantity);
          },
          0 
        );

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
          amount: formatAmountForRazorpay(amount),
          currency: 'INR',
          receipt: order.id.toString(),
          notes: {
            userId: user.id,
            orderId: order.id.toString(),
            customerName,
            shippingAddress
          }
        }) as RazorpayOrder;

        return {
          orderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: formatAmountForRazorpay(amount),
          key: process.env.RAZORPAY_KEY_ID!
        };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create payment session'
        });
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;
      console.log("Polling Order Status");
      console.log(orderId);

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
