import { User } from '../payload-types'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { NextRequest } from 'next/server'

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {
  //checks all the cookies and sees if the payload-token cookie name is present , which is the name of the cookie our payload cms sends us when a user logs in.
  const token = cookies.get('payload-token')?.value

  const meRes = await fetch(
    //this is a REST api endpoint automatically generated for us by our payload cms and is used to fetch us our currently logged in user . 
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  )

  const { user } = (await meRes.json()) as {
    user: User | null
  }

  return { user }
}
