'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { cn, formatPrice } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { PRODUCT_CATEGORIES } from '@/config'
import { Check, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const Page = () => {
  const { items, removeItem, clearCart, updateQuantity } = useCart()
  const router = useRouter()
  
  const [customerName, setCustomerName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')

  const cartItems = items.map(({ product, quantity }) => ({
    productId: product.id,
    quantity: quantity
  }))
  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ orderId , razorpayOrderId, amount, key }) => {
        if (razorpayOrderId) {
          const options = {
            key: key,
            amount: amount,
            currency: "INR",
            name: "House of Reika",
            description: "Shopping Cart Checkout",
            order_id: razorpayOrderId,
            handler: function (response: any) {
              // Handle successful payment
              router.push(`/thank-you?orderId=${orderId}`);
            },
            prefill: {
              name: customerName,
            },
            notes: {
              address: shippingAddress
            },
            theme: {
              color: "#2563eb"
            }
          };

          const razorpayWindow = new (window as any).Razorpay(options);
          razorpayWindow.open();
        }
      }
    })

  const isFormValid = () => {
    return customerName.trim() !== '' && shippingAddress.trim() !== '' && items.length > 0
  }

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce(
    (total, { product, quantity }) => total + (product.price * quantity),
    0
  )

  const fee = 1

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Shopping Cart
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            })}>
            <h2 className='sr-only'>
              Items in your shopping cart
            </h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <div
                  aria-hidden='true'
                  className='relative mb-4 h-40 w-40 text-muted-foreground'>
                  <Image
                    src='/hippo-empty-cart.png'
                    fill
                    loading='eager'
                    alt='empty shopping cart hippo'
                  />
                </div>
                <h3 className='font-semibold text-2xl'>
                  Your cart is empty
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}>
              {isMounted &&
                items.map(({ product, quantity }) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === product.category
                  )?.label

                  const { image } = product.images[0]

                  return (
                    <li
                      key={product.id}
                      className='flex py-6 sm:py-10'>
                      <div className='flex-shrink-0'>
                        <div className='relative h-24 w-24'>
                          {typeof image !== 'string' && (
                            <Image
                              fill
                              src={image.url as string}
                              alt='product image'
                              className='h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48'
                            />
                          )}
                        </div>
                      </div>

                      <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                        <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                          <div>
                            <div className='flex justify-between'>
                              <h3 className='text-sm'>
                                <Link
                                  href={`/product/${product.id}`}
                                  className='font-medium text-gray-700 hover:text-gray-800'>
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className='mt-1 flex text-sm'>
                              <p className='text-muted-foreground'>
                                Category: {label}
                              </p>
                            </div>

                            <div className='mt-1 flex items-center space-x-2'>
                              <p className='text-sm font-medium text-gray-900'>
                                {formatPrice(product.price)} × {quantity}
                              </p>
                              <p className='text-sm font-medium text-gray-900'>
                                = {formatPrice(product.price * quantity)}
                              </p>
                            </div>

                            <div className='mt-2 flex items-center space-x-2'>
                              <p className='text-sm text-gray-500'>
                                Quantity: {quantity}
                              </p>
                              <div className='flex items-center space-x-2'>
                                <Button
                                  onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                                  variant='outline'
                                  size='sm'
                                  className='h-7 w-7 p-0'
                                >
                                  -
                                </Button>
                                <span className='text-sm'>{quantity}</span>
                                <Button
                                  onClick={() => updateQuantity(product.id, quantity + 1)}
                                  variant='outline'
                                  size='sm'
                                  className='h-7 w-7 p-0'
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                            <div className='absolute right-0 top-0'>
                              <Button
                                aria-label='remove product'
                                onClick={() => removeItem(product.id)}
                                variant='ghost'>
                                <X
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className='mt-4 flex space-x-2 text-sm text-gray-700'>
                          <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>

          <section className='mt-8 lg:col-span-7'>
            <div className='rounded-lg bg-gray-50 px-4 py-6 sm:p-6'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Shipping Information
              </h2>
              <div className='space-y-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                    Full Name
                  </label>
                  <Input
                    id='name'
                    type='text'
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder='Enter your full name'
                    className='mt-1'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                    Shipping Address
                  </label>
                  <Textarea
                    id='address'
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder='Enter your complete shipping address'
                    className='mt-1'
                    required
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>
              Order summary
            </h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Subtotal</p>
                <p className='text-sm font-medium text-gray-900'>
                  {formatPrice(cartTotal)}
                </p>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span>Flat Transaction Fee</span>
                </div>
                <div className='text-sm font-medium text-gray-900'>
                  {formatPrice(fee)}
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>
                  Order Total
                </div>
                <div className='text-base font-medium text-gray-900'>
                  {formatPrice(cartTotal + fee)}
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                disabled={!isFormValid() || isLoading}
                onClick={() =>
                  createCheckoutSession({
                    items: cartItems,
                    customerName,
                    shippingAddress,
                  })
                }
                className='w-full'
                size='lg'>
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-1.5' />
                ) : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page