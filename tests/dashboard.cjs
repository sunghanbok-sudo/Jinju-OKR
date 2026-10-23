const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true, args:['--no-sandbox']});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = process.env.OKR_URL || 'http://127.0.0.1:8766/';
  try {
    await page.goto(base, {waitUntil:'networkidle'});
    assert.equal(await page.locator('#quarterSelect').inputValue(), '4', 'Root must default to Q4');
    assert.match(await page.title(), /4분기/);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/2026-q4.json')));
    assert.equal(await page.locator('.person-panel').count(), data.people.length);
    for (const [i, person] of data.people.entries()) {
      await page.locator(`#tab${i}`).click();
      const panel = page.locator(`#panel${i}`);
      assert(await panel.isVisible());
      assert.equal(await panel.locator('.objective-card').count(), person.objectives.length);
      for (const [j, objective] of person.objectives.entries()) {
        const card = panel.locator('.objective-card').nth(j);
        assert.equal(await card.locator('.obj-title').textContent(), objective.title);
        for (const [k, kr] of objective.results.entries()) {
          const item = card.locator('.kr-item').nth(k);
          assert.equal(await item.locator('.kr-text').textContent(), kr.title);
          assert.equal(await item.locator('.kr-detail').textContent(), kr.detail);
          assert.equal(await item.getAttribute('data-source-row'), String(kr.row));
          const meta = await item.locator('.kr-meta').textContent();
          assert(meta.includes(kr.kpiLinked ? 'KPI 연계: O' : 'KPI 연계: X'));
          if (kr.kpi) assert(meta.includes(kr.kpi));
          assert.equal(await item.locator('.efficiency').count(), Number(kr.efficiency));
          assert.equal(await item.locator('.innovation').count(), Number(kr.innovation));
        }
      }
    }
    for (const q of ['1','2','3','4']) {
      await Promise.all([page.waitForURL(q === '4' ? '**/index.html' : `**/quarters/q${q}.html`), page.selectOption('#quarterSelect',q)]);
      assert.equal(await page.locator('#quarterSelect').inputValue(),q);
      assert.match(await page.locator('.header-badge').textContent(),new RegExp(`${q}Q`));
      for (let i=0;i<3;i++) {
        await page.locator(`#tab${i}`).click();
        assert(await page.locator(`#panel${i}`).isVisible());
      }
    }
    await page.locator('#kpiToggle').click();
    assert(!(await page.locator('#kpiGrid').isVisible()));
    await page.locator('#kpiToggle').click();
    assert(await page.locator('#kpiGrid').isVisible());
    for (const width of [390,1280]) {
      await page.setViewportSize({width,height:900});
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      if (process.env.SCREENSHOT_DIR) {
        await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR, `okr-${width}.png`),fullPage:true});
      }
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: Q4 source parity, all quarter navigation/person tabs, collapse, mobile/desktop, no JS errors');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
