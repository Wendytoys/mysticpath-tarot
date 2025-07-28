// This is a Vercel-style serverless function.
// It will live at the /api/verify-proof endpoint.

import { verifyCloudProof, ISuccessResult } from '@worldcoin/minikit-js';

export async function POST(request: Request): Promise<Response> {
  try {
    const { payload, action, signal } = await request.json();

    // The app_id should be stored as a secure environment variable
    const app_id = process.env.WLD_APP_ID as `app_${string}`;
    if (!app_id) {
      throw new Error('App ID is not set in environment variables.');
    }

    console.log('Verifying proof with Worldcoin cloud...');
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal);

    if (verifyRes.success) {
      console.log('Proof verification successful:', verifyRes);
      // Here you would typically update the user's status in your database
      // to mark them as verified for this action.
      return new Response(JSON.stringify({ success: true, ...verifyRes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.warn('Proof verification failed:', verifyRes);
      return new Response(JSON.stringify({ success: false, ...verifyRes }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in proof verification:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
