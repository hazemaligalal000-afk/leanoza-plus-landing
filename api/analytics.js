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
            // Push event
            await kv.lpush('leanoza_analytics', ev);
            // Cap to 3000 events to save storage
            await kv.ltrim('leanoza_analytics', 0, 3000);
            return res.status(200).json({ success: true });
            
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Database Connection Error', details: error.message });
    }
}
