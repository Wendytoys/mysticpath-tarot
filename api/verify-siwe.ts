// This is a Vercel-style serverless function.
// It will live at the /api/verify-siwe endpoint.

import { verifySiweMessage, MiniAppWalletAuthSuccessPayload } from '@worldcoin/minikit-js';

// This is a placeholder for a secure session management solution.
// In a real app, you would use a library like `iron-session` or `next-auth`.
const sessions: Record<string, { nonce: string; user?: MiniAppWalletAuthSuccessPayload }> = {};

export async function POST(request: Request): Promise<Response> {
  try {
    const { payload, nonce } = await request.json();

    // NOTE: In a real app, you would get the nonce from a secure, HttpOnly cookie
    // that was set when the /api/nonce endpoint was called.
    // For this example, we'll pass it in the body and manage a simple session store.

    const verification = await verifySiweMessage(payload, nonce);

    if (verification.isValid) {
      console.log('SIWE verification successful:', verification);
      // Here you would typically create a user session, set a cookie, etc.
      // For now, we'll just confirm success.
      return new Response(JSON.stringify({ success: true, user: payload }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.warn('SIWE verification failed:', verification);
      return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in SIWE verification:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
