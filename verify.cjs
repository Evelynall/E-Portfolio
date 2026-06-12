// Verify the portfolio page: take full-page screenshot + check console errors
const path = require('path');
const PW_PATH = 'C:\\Users\\jn\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW_PATH);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  const failed = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text());
  });
  page.on('requestfailed', req => failed.push(req.url() + ' - ' + (req.failure()?.errorText || 'unknown')));

  const url = 'file:///c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/index.html';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // Check counts
  const posterCount = await page.locator('.poster').count();
  const videoCount  = await page.locator('.video').count();

  // Screenshot 1: hero (top)
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/01-hero.png' });

  // Screenshot 2: posters (scroll to work section)
  await page.evaluate(() => document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/02-posters.png' });

  // Screenshot 3: videos
  await page.evaluate(() => document.getElementById('video').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/03-videos.png' });

  // Screenshot 4: about + contact
  await page.evaluate(() => document.getElementById('about').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/04-about.png' });

  // Screenshot 5: filter interaction - click "Reels" only
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.click('button[data-filter="video"]');
  await page.waitForTimeout(700);
  await page.evaluate(() => document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/05-filter-reels.png' });

  // Screenshot 6: hover a poster (lightbox test) - click first visible poster
  await page.evaluate(() => {
    document.querySelector('button[data-filter="all"]').click();
    document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.locator('.poster').first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/06-lightbox.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Full page screenshot
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/00-full.png', fullPage: true });

  await browser.close();

  console.log('---');
  console.log('Posters rendered: ' + posterCount);
  console.log('Videos  rendered: ' + videoCount);
  console.log('Page errors: ' + errors.length);
  errors.forEach(e => console.log('  ' + e));
  console.log('Failed requests (count): ' + failed.length);
  if (failed.length) failed.slice(0, 8).forEach(f => console.log('  ' + f));
})();
