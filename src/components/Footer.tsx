'use client'

import { usePathname } from 'next/navigation'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons' // Assuming Icons.logo is adaptable
import Link from 'next/link'

const Footer = () => {
  const pathname = usePathname()
  const pathsToMinimize = [
    '/verify-email',
    '/sign-up',
    '/sign-in',
  ]

  return (
    // Use bg-background for the footer background
    <footer className='bg-background flex-grow-0'>
      <MaxWidthWrapper>
        {/* Use border-border for the top border */}
        <div className='border-t border-border'>
          {pathsToMinimize.includes(pathname) ? null : (
            <div className='pb-8 pt-16'>
              <div className='flex justify-center'>
                {/* Logo color can be text-muted-foreground or text-primary for subtlety or emphasis */}
                <Icons.logo className='h-12 w-auto text-muted-foreground' />
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname) ? null : (
            <div>
              <div className='relative flex items-center px-6 py-6 sm:py-8 lg:mt-0'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div
                    aria-hidden='true'
                    // Use bg-secondary or bg-muted for the gradient base, keeping it light and themed
                    className='absolute bg-secondary inset-0 bg-gradient-to-br from-secondary via-background to-muted opacity-75' // Adjusted gradient
                  />
                </div>

                <div className='text-center relative mx-auto max-w-sm'>
                  {/* Use text-foreground for the heading */}
                  <h3 className='font-semibold text-foreground'>
                    Become part of HouseOfReika
                  </h3>
                  {/* text-muted-foreground is already themed */}
                  <p className='mt-2 text-sm text-muted-foreground'>
                    If you&apos;d like to sell unique and high-quality
                    items, you can do so in
                    minutes.{' '}
                    <Link
                      href='/sign-in?as=seller' // Assuming this route exists
                      // Use primary color for the link to make it stand out
                      className='whitespace-nowrap font-medium text-primary hover:text-primary/80'>
                      Get started &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='py-10 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left'>
            {/* text-muted-foreground is already themed */}
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} HouseOfReika. All Rights
              Reserved.
            </p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href='#' // Replace with actual links
                // text-muted-foreground is fine, hover to text-foreground for subtle interaction
                className='text-sm text-muted-foreground hover:text-foreground'>
                Terms
              </Link>
              <Link
                href='#' // Replace with actual links
                className='text-sm text-muted-foreground hover:text-foreground'>
                Privacy Policy
              </Link>
              <Link
                href='#' // Replace with actual links
                className='text-sm text-muted-foreground hover:text-foreground'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer