'use client'

import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RazorpayOptions, RazorpayResponse } from '@/lib/types'

interface PaymentStatusProps {
  orderEmail: string
  orderId: string
  isPaid: boolean
  razorpayOrderId?: string
  amount?: number
  key?: string
}

const PaymentStatus = ({
  orderEmail,
  orderId,
  isPaid,
  razorpayOrderId,
  amount,
  key,
}: PaymentStatusProps) => {
  const router = useRouter()

  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) =>
        data?.isPaid ? false : 1000,
    }
  )

  useEffect(() => {
    if (razorpayOrderId && amount && key && !isPaid) {
      const options: RazorpayOptions = {
        key,
        amount,
        currency: "INR",
        name: "House of Reika",
        description: "Payment for your order",
        image: `${process.env.NEXT_PUBLIC_SERVER_URL}/hr.png`,
        order_id: razorpayOrderId,
        handler: function (response: RazorpayResponse) {
          // Payment successful
          router.refresh()
        },
        prefill: {
          name: "",
          email: orderEmail,
          contact: ""
        },
        notes: {
          orderId: orderId,
          userId: "", // This will be handled server-side
          customerName: "",
          shippingAddress: ""
        },
        theme: {
          color: "#BE123C"
        }
      }

      const razorpayScript = document.createElement('script')
      razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(razorpayScript)

      razorpayScript.onload = () => {
        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      }

      return () => {
        document.body.removeChild(razorpayScript)
      }
    }
  }, [razorpayOrderId, amount, key, isPaid, orderEmail, orderId, router])

  useEffect(() => {
    if (data?.isPaid) router.refresh()
  }, [data?.isPaid, router])

  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
      <div>
        <p className='font-medium text-gray-900'>
          Shipping To
        </p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className='font-medium text-gray-900'>
          Order Status
        </p>
        <p className={isPaid ? 'text-primary' : 'text-muted-foreground'}>
          {isPaid
            ? 'Payment successful'
            : 'Pending payment'}
        </p>
      </div>
    </div>
  )
}

export default PaymentStatus
