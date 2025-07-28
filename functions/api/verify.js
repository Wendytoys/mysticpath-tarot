
// We are using require here because @worldcoin/idkit-core is a CommonJS module
const { IDKit } = require('@worldcoin/idkit-core');

export async function onRequestPost(context) {
    try {
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
