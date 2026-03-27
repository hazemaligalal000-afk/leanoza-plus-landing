import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            // Fetch the entire array of logs (Vercel KV limits returned arrays to length)
            let logs = (await kv.lrange('leanoza_analytics', 0, 3000)) || [];
            return res.status(200).json(logs);
            
        } else if (req.method === 'POST') {
            const ev = req.body;
            // Enrich with request metadata
            ev.ip_country = req.headers['x-vercel-ip-country'] || 'eg';
            ev.ip_address = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '';
            
            // Push event
            await kv.lpush('leanoza_analytics', ev);

            // SPECIAL CASE: If this is an order or lost order, store in a dedicated registry that isn't trimmed
            if (ev.event === 'whatsapp_conversion' || ev.event === 'abandoned_checkout') {
                await kv.lpush('leanoza_orders_archive', ev);
                // Still keep archive to a reasonable limit, say 50000 orders
                await kv.ltrim('leanoza_orders_archive', 0, 50000);
            }

            // Cap analytics log to 3000 events to save storage
            await kv.ltrim('leanoza_analytics', 0, 3000);
            return res.status(200).json({ success: true });
            
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Database Connection Error', details: error.message });
    }
}
