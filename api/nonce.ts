// This is a Vercel-style serverless function.
// It will live at the /api/nonce endpoint.

// We are not using the @vercel/node package to keep it platform-agnostic.
// A modern Node.js environment (like on Vercel/Cloudflare) provides Request and Response.

export async function GET(request: Request): Promise<Response> {
  try {
    // As per worlddoc.txt, generate a random nonce.
    const nonce = crypto.randomUUID().replace(/-/g, '');

    // In a real SIWE implementation, you would store this nonce in a secure, HttpOnly cookie
    // or a temporary database entry associated with the user's session to verify it later.
    // For now, we are just returning it to the client.

    return new Response(JSON.stringify({ nonce }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Important: Do not cache the nonce
      },
    });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate nonce' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
