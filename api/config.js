import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    try {
        if (req.method === 'GET') {
            const config = (await kv.get('lean_config')) || {};
            return res.status(200).json(config);
            
        } else if (req.method === 'POST') {
            const config = req.body;
            await kv.set('lean_config', config);
            return res.status(200).json({ success: true, message: 'Cloud Config Saved!' });
            
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Database Connection Error. Please verify KV_REST_API_URL and KV_REST_API_TOKEN in Vercel.', details: error.message });
    }
}
