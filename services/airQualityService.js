async function fetchWithRetry(url, label, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000),
                headers: {
                    'User-Agent': 'MoochuAI/1.0 (+https://moochu-ai.onrender.com)'
            }
        });

            if (response.status === 429 || response.status >= 500) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error(
                `${label} attempt ${attempt}/${retries} failed:`,
                error.message,
                'cause:',
                error.cause?.message || 'unknown'
            );

            if (attempt === retries) {
                throw error;
            }

            await new Promise(resolve =>
                setTimeout(resolve, attempt * 1000)
            );
        }
    }
}

async function getAirQuality(city) {
    
    const cityAliases = {
        bangalore: 'Bengaluru',
        bombay: 'Mumbai',
        madras: 'Chennai',
        calcutta: 'Kolkata'
    };

    const searchCity =
        cityAliases[city.toLowerCase()] || city;

    const geoUrl =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchCity)}&format=json&addressdetails=1&limit=10`;

    const geoResponse = await fetchWithRetry(
        geoUrl,
        'Nominatim Geocoding API'
    );

    if (!geoResponse.ok) {
        throw new Error('Location service unavailable');
    }

    const geoData = await geoResponse.json();

    if (!Array.isArray(geoData) || geoData.length === 0) {
        throw new Error('City not found');
    }

    const selectedLocation =
        geoData.find(item => item.address?.country_code === 'in') ||
        geoData[0];

    const location = {
        name: selectedLocation.name ||
            selectedLocation.display_name.split(',')[0],
        country: selectedLocation.address?.country,
        latitude: Number(selectedLocation.lat),
        longitude: Number(selectedLocation.lon)
    };
    // Get air quality data
    const airUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,pm2_5,pm10&timezone=auto`;

    const airResponse = await fetchWithRetry(airUrl, 'Air Quality API');

    if (!airResponse.ok) {
        throw new Error('Air quality service unavailable');
    }

    const airData = await airResponse.json();

    if (!Number.isFinite(airData.current?.us_aqi)) {
        console.error(
            'Invalid AQI response:',
            JSON.stringify({
                city: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                current: airData.current,
                error: airData.error,
                reason: airData.reason
            })
        );

        throw new Error('Air quality data unavailable');
    }

    return {
        city: location.name,
        country: location.country,
        aqi: airData.current.us_aqi,
        pm25: airData.current.pm2_5,
        pm10: airData.current.pm10,
        time: airData.current.time,
        scale: 'US AQI',
        source: 'Open-Meteo (CAMS)'
    };
}

module.exports = { getAirQuality };
