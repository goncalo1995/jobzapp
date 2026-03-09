// In production, change this to your actual domain: ['https://winsummit.app']
const allowedOrigins = ['https://jobs.rochanegra.com', 'http://localhost:8081']; //FIX Prod

export function getCorsHeaders(requestOrigin: string | null) {
  const isAllowed = requestOrigin && allowedOrigins.includes(requestOrigin);
  return {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': isAllowed ? requestOrigin : (allowedOrigins.length > 0 ? allowedOrigins[0] : '*'),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}