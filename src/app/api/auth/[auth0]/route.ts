//api/auth/[auth0]/route.js
import { handleAuth } from '@auth0/nextjs-auth0';

// this allows auth0 to create routes for authentication, including logging in and out
export const GET = handleAuth()