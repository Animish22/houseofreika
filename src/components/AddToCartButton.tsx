'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/use-cart'
import { Product } from '@/payload-types'

const AddToCartButton = ({
  product,
}: {
  product: Product
}) => {
  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        addItem(product)
        setIsSuccess(true)
      }}
      size='lg'
      variant={isSuccess ? 'secondary' : 'default'}
      className={`w-full transition-all duration-300 font-semibold tracking-wide
        ${isSuccess 
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}>
      {isSuccess ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  )
}

export default AddToCartButton