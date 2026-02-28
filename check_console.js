const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        page.on('console', msg => {
            console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text());
        });

        page.on('pageerror', error => {
            console.log('BROWSER PAGE ERROR:', error.message);
        });

        console.log('Navigating to http://localhost:5173/ ...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

        await browser.close();
        console.log('Done scanning.');
    } catch (e) {
        console.error('Script Error:', e);
        process.exit(1);
    }
})();
