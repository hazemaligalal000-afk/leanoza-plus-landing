import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            // Get order statuses and viewed IDs from a hash or separate keys
            const [statuses, viewed] = await Promise.all([
                kv.get('leanoza_order_statuses') || {},
                kv.get('leanoza_viewed_orders') || []
            ]);
            return res.status(200).json({ statuses, viewed });
            
        } else if (req.method === 'POST') {
            const { type, data } = req.body;
            
            if (type === 'status_update') {
                const statuses = (await kv.get('leanoza_order_statuses')) || {};
                statuses[data.ts] = data.status;
                await kv.set('leanoza_order_statuses', statuses);
                return res.status(200).json({ success: true });
                
            } else if (type === 'mark_viewed') {
                const viewed = (await kv.get('leanoza_viewed_orders')) || [];
                if (!viewed.includes(data.ts)) {
                    viewed.push(data.ts);
                    // Keep viewed history reasonably sized
                    if (viewed.length > 500) viewed.shift();
                    await kv.set('leanoza_viewed_orders', viewed);
                }
                return res.status(200).json({ success: true });
            }
            
            return res.status(400).json({ error: 'Invalid type' });
            
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Database Connection Error', details: error.message });
    }
}
