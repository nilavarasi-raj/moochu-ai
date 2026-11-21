
# Moochu AI – Clean Air Companion

**Breathe Better. Live Better.**

## Live Demo

Moochu AI is deployed on Render and can be accessed online.

Live Application:
https://moochu-ai.onrender.com

GitHub Repository:
https://github.com/nilavarasi-raj/moochu-ai

## Project Overview

Moochu AI is an AI-powered urban air quality monitoring
web application that helps users understand air pollution
levels and make informed everyday decisions.

The application combines air quality data with
AI-generated personalized recommendations to promote
health awareness and sustainable living.

## Problem Statement

Air pollution is a growing environmental concern.
Many people lack awareness of local air quality levels
and the preventive measures they can take.

Moochu AI bridges this gap by presenting air quality
information in a simple, accessible and actionable format.

## Key Features

- City-based air quality search
- Air Quality Index (AQI) monitoring
- AQI category classification
- PM2.5 and PM10 pollutant information
- Air quality data source and last updated time
- AI-powered recommendations
- Invalid city and empty input validation
- Server connectivity error handling
- Responsive and mobile-friendly interface

## AI-Powered Recommendations

Moochu AI uses Google Gemini AI to generate
recommendations across four categories:

1. Indoor Air Care
2. Green Commute
3. Family Safety
4. Environmental Impact

Recommendations are generated based on the selected
city and its air quality conditions.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| AI Integration | Google Gemini API |
| Air Quality Data | Open-Meteo API |
| Test Automation | Playwright |
| Version Control | Git and GitHub |
| Development IDE | Visual Studio Code |
| Geocoding | OpenStreetMap Nominatim API |
| Cloud Deployment | Render |

## Project Structure

```text
moochu-ai/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── services/
│   ├── airQualityService.js
│   └── geminiService.js
├── tests/
│   └── moochu.spec.js
├── .env.example
├── .gitignore
├── listModels.js
├── package.json
├── package-lock.json
├── playwright.config.js
├── README.md
├── server.js
└── testGemini.js
```

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Google Gemini API key

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root using
`.env.example` as a reference.

```env
GEMINI_API_KEY=your_api_key_here
```

Never share or commit your actual API key.

### Step 3: Start the Application

```bash
npm start
```

### Step 4: Open the Application

Open the following URL in your browser:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Server health check |
| GET | /api/air-quality?city=Chennai | Retrieve air quality data |
| GET | /api/recommendations?city=Chennai | Generate AI recommendations |

## Test Automation

Moochu AI includes automated functional, API,
validation and responsive UI testing using Playwright.

### Install Playwright Browser

```bash
npx playwright install chromium
```

### Execute Automated Tests

```bash
npx playwright test
```

### View HTML Test Report

```bash
npx playwright show-report
```

### Test Coverage

| Test ID | Test Scenario | Result |
|---|---|---|
| TC001 | Verify application title | Passed |
| TC002 | Verify application heading | Passed |
| TC003 | Verify server health API | Passed |
| TC004 | Verify Chennai air quality | Passed |
| TC005 | Verify Delhi air quality | Passed |
| TC006 | Verify Mumbai air quality | Passed |
| TC007 | Verify invalid city validation | Passed |
| TC008 | Verify empty city validation | Passed |
| TC009 | Verify AI recommendation cards | Passed |
| TC010 | Verify mobile viewport responsiveness | Passed |

### Test Execution Summary

- Total Test Cases: 10
- Passed: 10
- Failed: 0
- Pass Percentage: 100%
- Browser: Chromium
- Mobile Testing: Viewport simulation

Results reflect the recorded test execution.
Live API availability may affect subsequent executions.

## Security and Privacy

- API keys are managed through environment variables.
- The `.env` file is excluded from Git tracking.
- AI requests are handled through the backend.
- Generated reports and dependencies are excluded
  from version control.

## Environmental and Social Impact

- Improves awareness of urban air pollution.
- Encourages informed outdoor activity decisions.
- Promotes environmentally responsible commuting.
- Supports family health and air quality awareness.

## Future Enhancements

- GPS-based location detection
- Multilingual recommendations
- Air quality alerts and notifications
- Historical air quality trends
- Voice-assisted interaction

## Disclaimer

Air quality values are based on available modelled data
and may differ from local monitoring stations.

AI-generated recommendations are for general
informational purposes and are not a substitute
for professional medical advice.

## Acknowledgements

- Open-Meteo
- Google Gemini AI
- Playwright
- PromptWars Hackathon

---

**Moochu AI – Breathe Better. Live Better.**
