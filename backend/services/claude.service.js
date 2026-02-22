import axios from 'axios';

export async function generateResponse(prompt, context = '') {
    const GROK_API_KEY = process.env.GROK_API_KEY;
    const GROK_ENDPOINT = process.env.GROK_ENDPOINT || 'https://api.x.ai/v1/chat/completions';

    if (!GROK_API_KEY) throw new Error('GROK_API_KEY not configured');

    try {
        const res = await axios.post(
            GROK_ENDPOINT,
            {
                model: "grok-1",
                messages: [
                    { role: "system", content: context || "You are a helpful AI assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROK_API_KEY}`
                }
            }
        );

        return res?.data?.choices?.[0]?.message?.content || '';

    } catch (err) {
        throw new Error(`Grok API error: ${err.response?.data?.error || err.message}`);
    }
}