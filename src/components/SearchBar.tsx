'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  initialQuery: string
}

export const SearchBar = ({ initialQuery }: SearchBarProps) => {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        router.push(`/products?search=${query}`)
      } else {
        router.push('/products')
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, router])

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder='Search products...'
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className='pl-9 w-full md:w-[300px]'
      />
    </div>
  )
}