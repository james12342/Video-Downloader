var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

(async () => {
  const results = await google.scrape('apple', 200);
  console.log('results', results);
})();