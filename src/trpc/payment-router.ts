import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import type Stripe from 'stripe'

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number()
      })),
      // productIds: z.array(z.string()) ,
      customerName: z.string(),
      shippingAddress: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      console.log("Started");
      let { items, customerName, shippingAddress } = input

      if (items.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: items.map(item => item.productId),
          },
        },
      })

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
      })
      
      console.log(`Id - ${order.id} yeh hai bhai aur order - ${order}`)

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        []

      filteredProducts.forEach((product) => {
        const cartItem = items.find(item => item.productId === product.id)
        if (cartItem) {
          line_items.push({
            price: product.priceId!,
            quantity: cartItem.quantity,
          })
        }
      })

      line_items.push({
        price: 'price_1OYRd4SHkqW8GAiHQLZ9lmvf',
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })

      try {
        const stripeSession =
          await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
            payment_method_types: ['card'],
            mode: 'payment',
            metadata: {
              userId: user.id,
              orderId: order.id,
              customerName,
              shippingAddress
            },
            line_items,
          })
        // console.log(stripeSession.url)
        return { url: stripeSession.url }
      } catch (err) {
        console.log(err)
        return { url: null }
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input
      console.log("Polling Order Status");
      console.log(orderId);

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),
})
