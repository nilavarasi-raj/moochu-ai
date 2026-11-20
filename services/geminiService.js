const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 30000
    }
});

async function getAIRecommendations(airData) {

    const prompt = `
You are Moochu AI, an urban air quality assistant.

Current air quality information:
City: ${airData.city}
Country: ${airData.country}
US AQI: ${airData.aqi}
PM2.5: ${airData.pm25 ?? 'Unavailable'}
PM10: ${airData.pm10 ?? 'Unavailable'}

Based on this information, provide practical
recommendations in the following categories:

1. Indoor Air Care
2. Green Commute
3. Family Safety
4. Environmental Impact

Provide short, clear and actionable suggestions.
Give a maximum of two sentences per category.
Use plain text only.
Do not use Markdown, asterisks or bold formatting.
Use numbered category headings.
Do not include introductory or closing messages.
Do not invent missing pollution data.
Do not provide medical diagnoses.
Do not guarantee that outdoor activities are completely safe.
Avoid absolute claims about health risks.
Provide precautionary advice for sensitive groups.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: prompt
        });

        return response.text ||
            'AI recommendations are currently unavailable.';

    } catch (error) {
        console.error('Gemini API Error:', error.message);

        return 'AI recommendations are temporarily unavailable. Please try again later.';
    }
}

module.exports = { getAIRecommendations };