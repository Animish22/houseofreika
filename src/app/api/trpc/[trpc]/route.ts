import { appRouter } from '@/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}),
    onError: ({ error }) => {
      if (error.code === 'UNAUTHORIZED') {
        console.log('Unauthorized request')
      }
      console.error('Error:', error)
    },
  })
}

export { handler as GET, handler as POST }
