// Quick scroll + screenshot to verify the new strip sections
const PW_PATH = 'C:\\Users\\jn\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW_PATH);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

  await page.goto('file:///c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/index.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Scroll to work section
  await page.evaluate(() => document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(1500);

  // Scroll down to see wide + square strips
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/08-strips.png', viewport: { width: 1440, height: 900 } });

  // Also: verify poster counts in each strip
  const mainCount   = await page.locator('#posters .poster').count();
  const wideCount   = await page.locator('#posterWideTrack .poster').count();
  const squareCount = await page.locator('#posterSquareTrack .poster').count();
  console.log(`Main grid: ${mainCount}  Wide (2.35:1): ${wideCount}  Square (1:1): ${squareCount}  Total: ${mainCount + wideCount + squareCount}`);
  console.log('Page errors: ' + errors.length);
  errors.forEach(e => console.log('  ' + e));

  await browser.close();
})();
