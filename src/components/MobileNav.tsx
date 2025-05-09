'use client'

import { PRODUCT_CATEGORIES } from '@/config' // Assuming PRODUCT_CATEGORIES is defined
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { Icons } from './Icons' // If you have a specific logo for mobile nav

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  if (!isOpen)
    return (
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        // Use text-foreground or text-muted-foreground for the icon
        className='lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-foreground hover:text-primary'>
        <Menu className='h-6 w-6' aria-hidden='true' />
      </button>
    )

  return (
    <div>
      <div className='relative z-40 lg:hidden'>
        {/* Overlay can remain dark for contrast */}
        <div className='fixed inset-0 bg-black bg-opacity-25' />
      </div>

      <div className='fixed overflow-y-scroll overscroll-y-none inset-0 z-50 flex'>
        <div className='w-4/5'>
          {/* Use bg-background for the nav panel */}
          <div className='relative flex w-full max-w-sm flex-col overflow-y-auto bg-background pb-12 shadow-xl'>
            <div className='flex px-4 pb-2 pt-5'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                // Use text-foreground or text-muted-foreground for the icon
                className='relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-foreground hover:text-primary'>
                <X className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>

            {/* Optional: Mobile Nav Logo
            <div className="px-4 py-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Icons.logo className="h-8 w-auto text-primary" />
              </Link>
            </div>
            */}

            <div className='mt-2'>
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li
                    key={category.label}
                    className='space-y-6 px-4 pb-6 pt-6'> {/* Adjusted padding */}
                    {/* Use border-border */}
                    <div className='border-b border-border'>
                      <div className='-mb-px flex'>
                        {/* Use text-foreground for category labels */}
                        <p className='border-transparent text-foreground flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium'>
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-8 gap-x-4'> {/* Adjusted gap */}
                      {category.featured.map((item) => (
                        <div
                          key={item.name}
                          className='group relative text-sm'>
                          {/* Use bg-muted or bg-secondary for image background */}
                          <div className='relative aspect-square overflow-hidden rounded-lg bg-muted group-hover:opacity-75'>
                            <Image
                              fill
                              src={item.imageSrc}
                              alt={item.name} // Use item name for alt text
                              className='object-cover object-center'
                            />
                          </div>
                          <Link
                            href={item.href}
                            onClick={() => closeOnCurrent(item.href)}
                            // Use text-foreground for item names, hover to primary
                            className='mt-4 block font-medium text-foreground hover:text-primary'>
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use border-border for the top border of this section */}
            <div className='space-y-6 border-t border-border px-4 py-6'>
              <div className='flow-root'>
                <Link
                  onClick={() => closeOnCurrent('/sign-in')}
                  href='/sign-in'
                  // Use text-foreground, hover to primary
                  className='-m-2 block p-2 font-medium text-foreground hover:text-primary'>
                  Sign in
                </Link>
              </div>
              <div className='flow-root'>
                <Link
                  onClick={() => closeOnCurrent('/sign-up')}
                  href='/sign-up'
                  // Use text-foreground, hover to primary
                  className='-m-2 block p-2 font-medium text-foreground hover:text-primary'>
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav