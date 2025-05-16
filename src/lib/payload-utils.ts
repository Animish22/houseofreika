import { User } from '../payload-types'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { NextRequest } from 'next/server'

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {
  try {
    const token = cookies.get('payload-token')?.value

    if (!token) {
      return { user: null }
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error('Server URL is not configured')
    }

    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
        cache: 'no-store',
      }
    )

    if (!meRes.ok) {
      throw new Error(`Failed to fetch user: ${meRes.statusText}`)
    }

    const { user } = (await meRes.json()) as {
      user: User | null
    }

    return { user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { user: null }
  }
}