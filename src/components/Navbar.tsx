import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons' // Assuming Icons.logo is adaptable or a multi-color SVG
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { getServerSideUser } from '@/lib/payload-utils'
import { cookies } from 'next/headers'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'
import Image from 'next/image'

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)

  return (
    // Use bg-background for the main navbar background
    <div className='bg-background sticky z-50 top-0 inset-x-0 h-16'>
      {/* Use bg-background for the header background */}
      <header className='relative bg-background'>
        <MaxWidthWrapper>
          {/* Use border-border for the bottom border */}
          <div className='border-b border-border'>
            <div className='flex h-16 items-center'>
              <MobileNav />

              <div className='ml-4 flex lg:ml-0'>
                <Link href='/'>
                  {/* Ensure Icons.logo is themed appropriately or is a neutral/multi-color design */}
                  {/* <Icons.logo className='h-10 w-10 text-primary' /> Example: Forcing primary color if it's a single-color SVG */}
                  <Image
                    src='/hr.png' 
                    alt='Logo'
                    width={40} 
                    height={40} 
                    className='h-10 w-10 text-primary'
                    />
                </Link>
              </div>

              <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                <NavItems />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  {user ? null : (
                    <Link
                      href='/sign-in'
                      className={buttonVariants({
                        variant: 'ghost', // Ghost buttons will use accent colors from CSS variables
                      })}>
                      Sign in
                    </Link>
                  )}

                  {user ? null : (
                    // Use bg-border for the separator
                    <span
                      className='h-6 w-px bg-border'
                      aria-hidden='true'
                    />
                  )}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href='/sign-up'
                      className={buttonVariants({
                        variant: 'ghost',
                      })}>
                      Create account
                    </Link>
                  )}

                  {user ? (
                    // Use bg-border for the separator
                    <span
                      className='h-6 w-px bg-border'
                      aria-hidden='true'
                    />
                  ) : null}

                  {user ? null : (
                    <div className='flex lg:ml-6'>
                      {/* Use bg-border for the separator */}
                      <span
                        className='h-6 w-px bg-border'
                        aria-hidden='true'
                      />
                    </div>
                  )}

                  <div className='ml-4 flow-root lg:ml-6'>
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}

export default Navbar