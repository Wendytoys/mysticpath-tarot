export async function onRequestPost(context) {
    try {
        const { payload, action, signal } = await context.request.json();
        
        const app_id = context.env.WLD_APP_ID;
        const secret_key = context.env.WLD_SECRET_KEY;

        if (!app_id || !secret_key) {
            return new Response(JSON.stringify({
                code: 'missing_secrets',
                detail: 'WLD_APP_ID and WLD_SECRET_KEY must be set in Cloudflare environment.'
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // Construct the request body for Worldcoin's API
        const requestBody = {
            action: action,
            signal: signal,
            merkle_root: payload.merkle_root,
            nullifier_hash: payload.nullifier_hash,
            proof: payload.proof,
            verification_level: payload.verification_level,
        };

        // Manually fetch the Worldcoin verification API
        const apiResponse = await fetch(`https://developer.worldcoin.org/api/v1/verify/${app_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secret_key}`
            },
            body: JSON.stringify(requestBody)
        });

        const verifyRes = await apiResponse.json();

        if (apiResponse.ok) {
            // Verification was successful
            return new Response(JSON.stringify(verifyRes), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            });
        } else {
            // Verification failed, forward the error from Worldcoin's API
            console.error("Worldcoin API verification failed:", verifyRes);
            return new Response(JSON.stringify(verifyRes), { 
                status: apiResponse.status, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

    } catch (error) {
        console.error('Verification function handler failed:', error);
        return new Response(JSON.stringify({ code: 'handler_error', detail: error.message }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}