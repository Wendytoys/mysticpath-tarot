import * as idkitCore from '@worldcoin/idkit-core';

// This ESM-friendly approach imports the module's entire namespace.
// We then find the IDKit class within it, whether it's a named or default export.
const IDKit = idkitCore.IDKit || idkitCore.default;

export async function onRequestPost(context) {
    try {
        // Check if IDKit was loaded successfully before using it.
        if (typeof IDKit !== 'function') {
            const loadedModuleKeys = JSON.stringify(Object.keys(idkitCore));
            throw new Error(`IDKit is not a constructor. Loaded module keys: ${loadedModuleKeys}`);
        }

        const proof = await context.request.json();
        const secret = context.env.WLD_SECRET_KEY;
        const app_id = context.env.WLD_APP_ID;

        if (!secret || !app_id) {
            return new Response(JSON.stringify({
                code: 'missing_secrets',
                detail: 'WLD_APP_ID and WLD_SECRET_KEY must be set in Cloudflare environment.'
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const idkit = new IDKit({
            app_id: app_id,
            action: 'krishna-ji-chat',
        });

        const verifyRes = await idkit.verify(proof, secret);
        
        return new Response(JSON.stringify(verifyRes), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (error) {
        console.error('Verification failed:', error);
        const errorResponse = { 
            code: error.code || 'verification_failed', 
            detail: error.message || 'Proof verification failed.' 
        };
        return new Response(JSON.stringify(errorResponse), { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}