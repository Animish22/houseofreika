import { NextRequest, NextResponse } from 'next/server'
import { getServerSideUser } from './lib/payload-utils'

export async function middleware(req: NextRequest) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  const response = NextResponse.next()

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', '*')
  response.headers.set('Access-Control-Allow-Headers', '*')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  const { nextUrl, cookies } = req
  const { user } = await getServerSideUser(cookies)

  if (user && ['/sign-in', '/sign-up'].includes(nextUrl.pathname)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|static|images|favicon.ico).*)'],
}