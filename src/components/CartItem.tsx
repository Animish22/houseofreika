import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/payload-types'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

const CartItem = ({ product }: { product: Product }) => {
  const { image } = product.images[0]

  const { removeItem } = useCart()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  return (
    <div className='space-y-3 py-4 border-b border-border'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative aspect-square h-20 w-20 min-w-fit overflow-hidden rounded-md shadow-md'>
            {typeof image !== 'string' && image.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className='absolute object-cover hover:scale-105 transition-transform duration-200'
              />
            ) : (
              <div className='flex h-full items-center justify-center bg-secondary'>
                <ImageIcon
                  aria-hidden='true'
                  className='h-6 w-6 text-muted-foreground'
                />
              </div>
            )}
          </div>

          <div className='flex flex-col self-start'>
            <span className='line-clamp-1 text-base font-semibold mb-1 text-foreground'>
              {product.name}
            </span>

            <span className='line-clamp-1 text-sm capitalize text-muted-foreground'>
              {label}
            </span>

            <div className='mt-4 text-sm'>
              <button
                onClick={() => removeItem(product.id)}
                className='flex items-center gap-1 text-primary hover:text-primary/80 transition-colors'>
                <X className='w-4 h-4' />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-1'>
          <span className='ml-auto line-clamp-1 text-base font-bold text-primary'>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem