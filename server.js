
require('dotenv').config();

const express = require('express');
const path = require('path');
const { getAirQuality } = require('./services/airQualityService');
const { getAIRecommendations } = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Moochu AI server is running'
    });
});

// Air Quality API
app.get('/api/air-quality', async (req, res) => {
    const city = req.query.city;

    if (typeof city !== 'string' ||
        !city.trim() || city.length > 100) {
        return res.status(400).json({
            error: 'Please enter a valid city name'
        });
    }

    try {
        const data = await getAirQuality(city.trim());

        res.status(200).json(data);

    }  catch (error) {
        console.error('Air Quality Error:', error.message);

        const notFound = error.message === 'City not found';

        res.status(notFound ? 404 : 502).json({
            error: notFound
                ? 'City not found'
                : 'Air quality data unavailable'
        });
    }
});

// AI Recommendations API
app.get('/api/recommendations', async (req, res) => {

    const city = req.query.city;

    if (typeof city !== 'string' ||
        !city.trim() || city.length > 100) {

        return res.status(400).json({
            error: 'Please enter a valid city name'
        });
    }

    try {
        const airData = await getAirQuality(city.trim());

        const recommendations =
            await getAIRecommendations(airData);

        res.status(200).json({
            city: airData.city,
            aqi: airData.aqi,
            recommendations
        });

    } catch (error) {

        console.error('Recommendations Error:', error.message);

        res.status(error.message === 'City not found' ? 404 : 502).json({
            error: error.message === 'City not found'
                ? 'City not found'
                : 'Unable to generate recommendations'
        });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Moochu AI running at http://localhost:${PORT}`);
});

app.get('/api/test-geocoding', async (req, res) => {
    try {
        const response = await fetch(
            'https://nominatim.openstreetmap.org/search?q=Chennai%2C%20India&format=json&limit=1',
            {
                headers: {
                    'User-Agent': 'MoochuAI/1.0 (development connectivity test)'
                },
                signal: AbortSignal.timeout(10000)
            }
        );

        res.status(response.status).json({
            provider: 'Nominatim',
            status: response.status,
            reachable: response.ok
        });
    } catch (error) {
        res.status(502).json({
            provider: 'Nominatim',
            error: error.message,
            cause: error.cause?.message || 'unknown'
        });
    }
});
