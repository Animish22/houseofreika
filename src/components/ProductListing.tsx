'use client'

import { Product } from '@/payload-types'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton' // Shadcn UI Skeleton
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/config'
import ImageSlider from './ImageSlider' // Assuming ImageSlider is themed or neutral

interface ProductListingProps {
  product: Product | null
  index: number
}

const ProductListing = ({
  product,
  index,
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  const validUrls = product.images
    .map(({ image }) =>
      typeof image === 'string' ? image : image.url
    )
    .filter(Boolean) as string[]

  if (isVisible && product) {
    return (
      <Link
        className={cn(
          'invisible h-full w-full cursor-pointer group/main rounded-lg overflow-hidden flex flex-col', // Added rounded-lg, overflow-hidden, and flex structure
          {
            'visible animate-in fade-in-5': isVisible,
          },
          'bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out' // Added card background and hover shadow
        )}
        href={`/product/${product.id}`}>
        {/* Assuming ImageSlider takes full width of its parent */}
        <ImageSlider urls={validUrls} />

        <div className='p-4 flex flex-col flex-grow'> {/* Added padding and flex-grow for text content */}
          <h3 className='mt-2 font-medium text-sm text-foreground'> {/* Adjusted margin-top */}
            {product.name}
          </h3>
          <p className='mt-1 text-xs text-muted-foreground'> {/* Made category label smaller */}
            {label}
          </p>
          <div className='flex-grow'></div> {/* Spacer to push price to the bottom if cards have different text heights */}
          <p className='mt-2 font-semibold text-md text-primary'> {/* Price styling with primary color */}
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    )
  }
  // Fallback, though the initial check should catch this.
  return <ProductPlaceholder />
}

const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col w-full bg-card rounded-lg overflow-hidden p-4'> {/* Added card styling */}
      <div className='relative bg-muted aspect-square w-full overflow-hidden rounded-md'> {/* Use muted for skeleton bg */}
        <Skeleton className='h-full w-full' />
      </div>
      <Skeleton className='mt-4 w-2/3 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-full h-3 rounded-lg' /> {/* Adjusted skeleton lines */}
      <Skeleton className='mt-2 w-1/2 h-5 rounded-lg' /> {/* Adjusted skeleton lines */}
    </div>
  )
}

export default ProductListing