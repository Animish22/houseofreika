'use client'

import { User } from '@/payload-types' // Or your defined User type
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu' // These are Shadcn components and should adapt
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth' // Assuming this hook is set up

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button
          variant='ghost' // Ghost variant will use accent colors
          size='sm'
          className='relative text-foreground hover:text-white'> {/* Explicitly set text color for ghost if needed */}
          My account
        </Button>
      </DropdownMenuTrigger>

      {/* DropdownMenuContent from Shadcn should use popover variables from globals.css */}
      <DropdownMenuContent
        className='bg-popover text-popover-foreground w-60 border-border' // Ensure border is applied if not by default
        align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            {/* Text color from popover-foreground */}
            <p className='font-medium text-sm text-popover-foreground'>
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className='bg-border' /> {/* Ensure separator uses border color */}

        {/* DropdownMenuItem from Shadcn should adapt. Links can be primary. */}
        <DropdownMenuItem asChild className='focus:bg-accent focus:text-accent-foreground'>
          <Link href='/sell' className='text-popover-foreground hover:text-primary'>Seller Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={signOut}
          className='cursor-pointer text-popover-foreground hover:text-primary focus:bg-accent focus:text-accent-foreground'>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav