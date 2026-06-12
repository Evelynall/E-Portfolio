// Detailed scroll-through to see all three poster sections
const PW_PATH = 'C:\\Users\\jn\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PW_PATH);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => console.log('ERR:', e.message));
  page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERR:', msg.text()); });

  await page.goto('file:///c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/index.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Take 3 screenshots at different scroll positions to show all sections
  // 1. Main grid
  await page.evaluate(() => document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/s1-grid.png', viewport: { width: 1440, height: 900 } });

  // 2. Wide strip
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2.5));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/s2-wide.png', viewport: { width: 1440, height: 900 } });

  // 3. Square strip
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'c:/Tools/Elements/Evelynall/OpenBento_Data/test/portfolio/s3-square.png', viewport: { width: 1440, height: 900 } });

  // Also check: get bounding rects of each strip
  const positions = await page.evaluate(() => {
    const work = document.getElementById('work');
    const wide = document.getElementById('posterWide');
    const square = document.getElementById('posterSquare');
    return {
      workTop: work.getBoundingClientRect().top + window.scrollY,
      wideTop: wide ? wide.getBoundingClientRect().top + window.scrollY : 'not found',
      squareTop: square ? square.getBoundingClientRect().top + window.scrollY : 'not found',
      viewH: window.innerHeight
    };
  });
  console.log('Scroll positions:', JSON.stringify(positions));

  await browser.close();
})();
