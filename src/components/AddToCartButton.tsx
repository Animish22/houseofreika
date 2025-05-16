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
  const { addItem, items, updateQuantity } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  const handleAddToCart = () => {
    const existingItem = items.find(item => item.product.id === product.id)

    if (existingItem) {
      if(existingItem.quantity === product.stockAvailable)
      {
        alert(`You cannot add more than ${product.stockAvailable} items of this product to the cart`)
        return
      }
      else
      {
        updateQuantity(product.id, existingItem.quantity + 1)
      }
    } else {
      addItem(product)
    }
    setIsSuccess(true)
  }

  return (
    <>
    <Button
      onClick={handleAddToCart}
      disabled={product.stockAvailable <= 0}
      size='lg'
      variant={isSuccess ? 'secondary' : 'default'}
      className={`w-full transition-all duration-300 font-semibold tracking-wide
        ${isSuccess
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}>
      {product.stockAvailable <= 0 ? 'No Stock Left For this item' : (isSuccess ? 'Added to Cart ✓' : 'Add to Cart')}
    </Button>
      {product.stockAvailable > 0 && product.stockAvailable < 10 &&
        <span className="block text-xs text-amber-500 font-medium mt-1">
          Only {product.stockAvailable} {product.stockAvailable === 1 ? 'item' :  'items'} left in stock!
        </span>
      }
    </>
  )
}

export default AddToCartButton