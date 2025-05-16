// app/api/trpc/[trpc]/route.ts (or similar)

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc/index'; // Adjust import path as needed
import { NextRequest } from 'next/server'; // Import NextRequest

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}), 
    responseMeta: () => {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, POST, PATCH , DELETE ,  OPTIONS', 
          'Access-Control-Allow-Headers': 'Content-Type, Authorization', 
        },
      };
    },
  });

// Handle GET and POST requests for tRPC
export { handler as GET, handler as POST };

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');

  // Basic CORS headers for preflight
  const headers = {
    'Access-Control-Allow-Origin': '*', // <--- REPLACE with your ACTUAL frontend origin(s)
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    // Add other headers if needed, e.g., 'Access-Control-Allow-Credentials': 'true',
  };

  // Respond to preflight request
  return new Response(null, { status: 204, headers }); // Use 204 No Content for preflight success
}