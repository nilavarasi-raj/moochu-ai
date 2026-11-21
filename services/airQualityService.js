async function fetchWithRetry(url, label, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000)
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
    // Find city coordinates
    // const geoUrl =
    //     `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const cityAliases = {
        bangalore: 'Bengaluru',
        bombay: 'Mumbai',
        madras: 'Chennai',
        calcutta: 'Kolkata'
    };

    const searchCity =
        cityAliases[city.toLowerCase()] || city;

    const geoUrl =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=10&language=en&format=json`;


    const geoResponse = await fetchWithRetry(geoUrl, 'Geocoding API');

    if (!geoResponse.ok) {
        throw new Error('Location service unavailable');
    }

    const geoData = await geoResponse.json();

    if (!geoData.results?.length) {
        throw new Error('City not found');
    }

    //const location = geoData.results[0];
    const location =
    geoData.results.find(
        item => item.country_code === 'IN'
    ) || geoData.results[0];
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
