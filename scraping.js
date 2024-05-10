const puppeteer = require('puppeteer-core');

const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_dc3af480-zone-scraping_browser-country-us:jsdsibddt52l@brd.superproxy.io:9222';

async function main() {
    const browser = await puppeteer.connect({browserWSEndpoint: SBR_WS_ENDPOINT});
    const page = await browser.newPage();
    await page.goto('https://markets.ft.com/data/commodities/tearsheet/summary?c=WTI+Crude+Oil');

    const element = await page.$('div[data-f2-app-id="mod-commodities-performance"]');
    if (element) {
        await element.screenshot({ path: '/screen/part_of_page.png' });
        console.log('Screenshot of the specific part is taken.');
    } else {
        console.log('The specific part was not found.');
    }
    await browser.close();
}

main().catch(err => {
    console.error(err.stack || err);
    process.exit(1);
});
