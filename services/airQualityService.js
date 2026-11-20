
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


    const geoResponse = await fetch(geoUrl);

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

    const airResponse = await fetch(airUrl);

    if (!airResponse.ok) {
        throw new Error('Air quality service unavailable');
    }

    const airData = await airResponse.json();

    if (!Number.isFinite(airData.current?.us_aqi)) {
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
