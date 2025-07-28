
import { verifyCloudProof } from '@worldcoin/minikit-js';

export async function onRequestPost(context) {
    try {
        // The frontend will send the proof payload, action, and signal
        const { payload, action, signal } = await context.request.json();
        
        // Get the App ID from Cloudflare's environment variables
        const app_id = context.env.WLD_APP_ID;

        if (!app_id) {
            return new Response(JSON.stringify({
                code: 'missing_app_id',
                detail: 'WLD_APP_ID must be set in the Cloudflare environment.'
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // Call the verifyCloudProof function with the data from the frontend
        const verifyRes = await verifyCloudProof(payload, app_id, action, signal);

        if (verifyRes.success) {
            // On success, return the successful response
            return new Response(JSON.stringify(verifyRes), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            });
        } else {
            // On failure, return the error response from Worldcoin's servers
            console.error("Cloud proof verification failed:", verifyRes);
            return new Response(JSON.stringify(verifyRes), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

    } catch (error) {
        // Handle any unexpected errors in the function itself
        console.error('Verification function handler failed:', error);
        const errorResponse = { 
            code: 'handler_error', 
            detail: error.message || 'An unexpected error occurred.' 
        };
        return new Response(JSON.stringify(errorResponse), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
