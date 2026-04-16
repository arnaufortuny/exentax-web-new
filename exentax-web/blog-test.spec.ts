import { test, expect } from '@playwright/test';

test('verify blog article content and network requests', async ({ page }) => {
  const baseUrl = 'http://localhost:5000';
  
  // 1. & 2. English article and dynamic chunk request
  console.log('Navigating to English article...');
  
  let chunkRequested = false;
  page.on('request', request => {
    if (request.url().match(/blog-en-llc-estados-unidos-guia-completa-2026.*\.js/)) {
      chunkRequested = true;
      console.log('Dynamic chunk requested:', request.url());
    }
  });

  await page.goto(`${baseUrl}/en/blog/llc-united-states-complete-guide-2026`);
  
  // Check for "LLC" and character count > 5000
  const bodyText = await page.innerText('body');
  expect(bodyText).toContain('LLC');
  console.log('Body text length (EN):', bodyText.length);
  expect(bodyText.length).toBeGreaterThan(5000);
  
  // Check for dynamic chunk request
  expect(chunkRequested).toBe(true);

  // 3. Spanish article
  console.log('Navigating to Spanish article...');
  await page.goto(`${baseUrl}/es/blog/llc-estados-unidos-guia-completa-2026`);
  const bodyTextEs = await page.innerText('body');
  // Check for some Spanish content
  expect(bodyTextEs).toContain('LLC');
  // Just a simple check for Spanish word "guía" or similar if possible, 
  // but usually "LLC" is common. Let's check for "Estados Unidos"
  expect(bodyTextEs).toContain('Estados Unidos');
  console.log('Spanish article loaded successfully.');

  // 4. French article
  console.log('Navigating to French article...');
  await page.goto(`${baseUrl}/fr/blog/llc-etats-unis-guide-complet-2026`);
  const bodyTextFr = await page.innerText('body');
  expect(bodyTextFr).toContain('LLC');
  expect(bodyTextFr).toContain('États-Unis');
  console.log('French article loaded successfully.');
});
