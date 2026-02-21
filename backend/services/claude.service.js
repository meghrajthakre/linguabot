import axios from 'axios';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_ENDPOINT = process.env.CLAUDE_ENDPOINT || 'https://api.anthropic.com/v1/complete';

// Wrapper to generate a response from Claude. Send prompt + context.
export async function generateResponse(prompt, context = '') {
    if (!CLAUDE_API_KEY) throw new Error('CLAUDE_API_KEY not configured');

    // Build a simple prompt merging context and user prompt
    const input = `${context}\n\nUser: ${prompt}\nAI:`;

    try {
        const res = await axios.post(
            CLAUDE_ENDPOINT,
            {
                model: 'claude-2',
                prompt: input,
                max_tokens_to_sample: 1000,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CLAUDE_API_KEY}`,
                },
            }
        );

        // Some Claude endpoints return text in different shapes; we defensively parse
        const text = res?.data?.completion || res?.data?.text || res?.data?.output || '';
        return text;
    } catch (err) {
        throw new Error(`Claude API error: ${err.message}`);
    }
}
