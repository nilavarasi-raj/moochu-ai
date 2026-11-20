
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 30000
    }
});
async function testGemini() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: 'Say hello to Moochu AI in one sentence.'
        });

        console.log('Gemini API connection successful!');
        console.log(response.text);

    } catch (error) {
        console.error('Gemini API connection failed:');
        console.error(error.message);
    }
}

testGemini();
