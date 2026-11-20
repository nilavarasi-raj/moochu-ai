const { test, expect } = require('@playwright/test');

// TC001 - Verify Application Title
test('TC001 - Verify application title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(
        'Moochu AI | Clean Air Companion'
    );
});

// TC002 - Verify Application Heading
test('TC002 - Verify application heading', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', {
            name: 'Moochu AI',
            exact: true
        })
    ).toBeVisible();
});

// TC003 - Verify Health Check API
test('TC003 - Verify health check API', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.status).toBe('success');
    expect(data.message).toBe('Moochu AI server is running');
});

// TC004 - Verify Chennai AQI
test('TC004 - Verify Chennai AQI', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('Chennai');
    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    await expect(page.locator('#status'))
        .toContainText('Air quality for Chennai', {
            timeout: 30000
        });

    await expect(page.locator('#aqi'))
        .toHaveText(/^\d+$/);

    await expect(page.locator('#pm25'))
        .not.toHaveText('--');

    await expect(page.locator('#pm10'))
        .not.toHaveText('--');
});

// TC005 - Verify Delhi AQI
test('TC005 - Verify Delhi AQI', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('Delhi');
    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    await expect(page.locator('#status'))
        .toContainText('Air quality for Delhi', {
            timeout: 30000
        });

    await expect(page.locator('#aqi'))
        .toHaveText(/^\d+$/);
});

// TC006 - Verify Mumbai AQI
test('TC006 - Verify Mumbai AQI', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('Mumbai');
    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    await expect(page.locator('#status'))
        .toContainText('Air quality for Mumbai', {
            timeout: 30000
        });

    await expect(page.locator('#aqi'))
        .toHaveText(/^\d+$/);
});

// TC007 - Verify Invalid City
test('TC007 - Verify invalid city', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('xyzabc123');

    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    await expect(page.locator('#status'))
        .toHaveText('City not found', {
            timeout: 30000
        });

    await expect(page.locator('#aqi'))
        .toHaveText('--');

    await expect(page.locator('#recommendations'))
        .toHaveText('Search for a city to get AI recommendations.');
});

// TC008 - Verify Empty City Validation
test('TC008 - Verify empty city validation', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('');

    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    await expect(page.locator('#status'))
        .toHaveText('Please enter a city name.');

    await expect(page.locator('#aqi'))
        .toHaveText('--');

    await expect(page.locator('#city'))
        .toBeFocused();
});

// TC009 - Verify AI Recommendation Cards
test('TC009 - Verify AI recommendation cards', async ({ page }) => {
    await page.goto('/');

    await page.locator('#city').fill('Chennai');

    await page.getByRole('button', {
        name: 'Check Air Quality'
    }).click();

    const cards = page.locator(
        '#recommendations .recommendation-card'
    );

    await expect(cards).toHaveCount(4, {
        timeout: 45000
    });

    await expect(cards.nth(0))
        .toContainText('Indoor Air Care');

    await expect(cards.nth(1))
        .toContainText('Green Commute');

    await expect(cards.nth(2))
        .toContainText('Family Safety');

    await expect(cards.nth(3))
        .toContainText('Environmental Impact');
});

// TC010 - Verify Mobile Responsiveness
test('TC010 - Verify mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({
        width: 390,
        height: 844
    });

    await page.goto('/');

    await expect(page.locator('#city'))
        .toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Check Air Quality'
    })).toBeVisible();

    await expect(page.locator('.pollutant-grid'))
        .toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth >
            window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
});