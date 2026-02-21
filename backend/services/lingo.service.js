import axios from 'axios';

const LINGO_API_KEY = process.env.LINGO_API_KEY;
const LINGO_ENDPOINT = process.env.LINGO_ENDPOINT || 'https://api.lingo.dev/translate';

// Simple translate wrapper. Returns translated text or original text on failure.
export async function translate(text, targetLanguage = 'en') {
    if (!LINGO_API_KEY) {
        // graceful fallback: return original text
        return text;
    }

    try {
        const res = await axios.post(
            LINGO_ENDPOINT,
            { text, target: targetLanguage },
            { headers: { Authorization: `Bearer ${LINGO_API_KEY}` } }
        );
        return res?.data?.translated || res?.data?.translation || text;
    } catch (err) {
        // On error, return original text
        return text;
    }
}
