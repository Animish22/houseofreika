'use client'

import { PRODUCT_CATEGORIES } from '@/config'
import { Button } from './ui/button' // Shadcn UI Button
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type Category = (typeof PRODUCT_CATEGORIES)[number]

interface NavItemProps {
  category: Category
  handleOpen: () => void
  close: () => void
  isOpen: boolean
  isAnyOpen: boolean
}

const NavItem = ({
  isAnyOpen,
  category,
  handleOpen,
  close,
  isOpen,
}: NavItemProps) => {
  return (
    <div className='flex'>
      <div className='relative flex items-center'>
        <Button
          className='gap-1.5 text-foreground data-[state=open]:text-accent-foreground' // Ensure base text is foreground, active state uses accent-foreground
          onClick={handleOpen}
          variant={isOpen ? 'secondary' : 'ghost'} // Secondary variant for open, ghost for default
        >
          {category.label}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-all text-muted-foreground', // Icon color
              {
                '-rotate-180': isOpen,
              }
            )}
          />
        </Button>
      </div>

      {isOpen ? (
        <div
          onClick={() => close()} // Ensure this closes the NavItem correctly
          className={cn(
            'absolute inset-x-0 top-full text-sm text-popover-foreground', // Base text for dropdown content
            {
              'animate-in fade-in-10 slide-in-from-top-5': !isAnyOpen,
            }
          )}>
          {/* Shadow and background for the dropdown panel */}
          <div
            className='absolute inset-0 top-1/2 bg-popover shadow-lg' // Use popover background
            aria-hidden='true'
          />

          <div className='relative bg-popover border-t border-border'> {/* Use popover background and add top border */}
            <div className='mx-auto max-w-7xl px-8'>
              <div className='grid grid-cols-4 gap-x-8 gap-y-10 py-16'>
                <div className='col-span-4 col-start-1 grid grid-cols-3 gap-x-8'>
                  {category.featured.map((item) => (
                    <div
                      onClick={close} // Ensure clicking an item closes the dropdown
                      key={item.name}
                      className='group relative text-base sm:text-sm'>
                      {/* Background for featured item images */}
                      <div className='relative aspect-video overflow-hidden rounded-lg bg-muted group-hover:opacity-75'>
                        <Image
                          src={item.imageSrc}
                          alt={item.name} // More descriptive alt text
                          fill
                          className='object-cover object-center'
                        />
                      </div>

                      <Link
                        href={item.href}
                        className='mt-6 block font-medium text-popover-foreground hover:text-primary'> {/* Link styling */}
                        {item.name}
                      </Link>
                      <p
                        className='mt-1 text-sm text-primary hover:underline' // "Shop now" styling
                        aria-hidden='true'>
                        Shop now
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NavItem