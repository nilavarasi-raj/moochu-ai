
const form = document.getElementById('air-quality-form');
const cityInput = document.getElementById('city');
const statusText = document.getElementById('status');
const aqiText = document.getElementById('aqi');
const categoryText = document.getElementById('aqi-category');
const submitButton = form.querySelector('button');

const pm25Text = document.getElementById('pm25');
const pm10Text = document.getElementById('pm10');
const sourceText = document.getElementById('data-source');
const updatedText = document.getElementById('last-updated');
const recommendationsText = document.getElementById('recommendations');


// US AQI Classification
function getAQICategory(aqi) {
    if (aqi <= 50) {
        return { name: 'Good', color: '#15803d' };
    }

    if (aqi <= 100) {
        return { name: 'Moderate', color: '#a16207' };
    }

    if (aqi <= 150) {
        return {
            name: 'Unhealthy for Sensitive Groups',
            color: '#c2410c'
        };
    }

    if (aqi <= 200) {
        return { name: 'Unhealthy', color: '#dc2626' };
    }

    if (aqi <= 300) {
        return { name: 'Very Unhealthy', color: '#9333ea' };
    }

    return { name: 'Hazardous', color: '#881337' };
}

// Reset Previous Results
function resetResults(message = 'Data unavailable') {
    aqiText.textContent = '--';
    aqiText.style.color = '';
    categoryText.textContent = message;

    pm25Text.textContent = '--';
    pm10Text.textContent = '--';
    sourceText.textContent = '--';
    updatedText.textContent = '--';
    recommendationsText.textContent = 'Search for a city to get AI recommendations.';
}

// Render AI Recommendation Cards
function renderRecommendations(recommendations) {

    recommendationsText.replaceChildren();

    const icons = {
        'Indoor Air Care': '🏠',
        'Green Commute': '🚌',
        'Family Safety': '🛡️',
        'Environmental Impact': '🌱'
    };

    const sections = recommendations
        .trim()
        .split(/(?:^|\n)\s*\d+\.\s*/)
        .filter(section => section.trim());

    sections.forEach(section => {

        const lines = section.trim().split('\n');

        const title = lines.shift()
            .replace(/\*/g, '')
            .replace(/:$/, '')
            .trim();

        const description = lines.join('\n').trim();

        if (!description) {
            const paragraph = document.createElement('p');
            paragraph.textContent = section;
            recommendationsText.appendChild(paragraph);
            return;
        }

        const card = document.createElement('article');
        card.className = 'recommendation-card';

        const heading = document.createElement('h3');
        heading.className = 'recommendation-title';

        heading.textContent =
            `${icons[title] || '💡'} ${title}`;

        const content = document.createElement('p');
        content.textContent = description;

        card.appendChild(heading);
        card.appendChild(content);

        recommendationsText.appendChild(card);
    });
}
// Fetch AI Recommendations
async function loadAIRecommendations(city) {

    recommendationsText.textContent =
        'Generating AI recommendations...';

    try {
        const response = await fetch(
            `/api/recommendations?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'Unable to generate recommendations'
            );
        }

        renderRecommendations(
            data.recommendations ||
            'AI recommendations are currently unavailable.'
        );

    } catch (error) {

        recommendationsText.textContent =
            'AI recommendations are temporarily unavailable. Please try again later.';

        console.error('AI Recommendations Error:', error.message);
    }
}

// Empty Input Validation
cityInput.addEventListener('invalid', () => {
    statusText.textContent = 'Please enter a city name.';
    resetResults('Search for a city to get started.');
});

// Form Submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusText.textContent = 'Please enter a city name.';
        resetResults('Search for a city to get started.');
        return;
    }

    statusText.textContent = 'Fetching air quality data...';
    submitButton.disabled = true;
    cityInput.disabled = true;

    resetResults('Loading...');

    try {
        const response = await fetch(
            `/api/air-quality?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        if (!Number.isFinite(data.aqi) || data.aqi < 0) {
            throw new Error('Air quality data unavailable');
        }

        const category = getAQICategory(data.aqi);

        // Display AQI
        aqiText.textContent = data.aqi;
        aqiText.style.color = category.color;

        categoryText.textContent =
            `${category.name} | ${data.scale}`;

        // Display Pollution Details
        pm25Text.textContent = data.pm25 ?? '--';
        pm10Text.textContent = data.pm10 ?? '--';

        sourceText.textContent = data.source ?? '--';

        updatedText.textContent = data.time
            ? data.time.replace('T', ' ')
            : '--';

        // Display Location
        statusText.textContent =
            `Air quality for ${data.city}, ${data.country}`;

        // Display AI Recommendations
        await loadAIRecommendations(city);
    } catch (error) {
        statusText.textContent =
            error.message === 'Failed to fetch'
                ? 'Unable to connect to the server. Please try again later.'
                : error.message;    
        resetResults();

    } finally {
        submitButton.disabled = false;
        cityInput.disabled = false;
    }
});
