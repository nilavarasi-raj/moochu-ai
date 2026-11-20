const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 60000,
    fullyParallel: false,
    workers: 1,
    retries: 0,

    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],

    use: {
        baseURL: 'http://localhost:3000',
        browserName: 'chromium',
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    },

    webServer: {
        command: 'npm start',
        url: 'http://localhost:3000/api/health',
        reuseExistingServer: true,
        timeout: 30000
    }
});