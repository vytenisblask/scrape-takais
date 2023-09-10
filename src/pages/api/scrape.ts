import { NextApiRequest, NextApiResponse } from 'next';
import cheerio from 'cheerio';  
import cssBeautify from 'js-beautify';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  let cms = 'Unknown';
  let trackers = 'Unknown';
  let robotsTxt = 'Not Available';
  let mainResponseHeaders;
  let browser;

  try {
    console.log("Launching Puppeteer...");

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    console.log("Puppeteer launched!");

    const page = await browser.newPage();

    // Listen to the response of the main page to capture its headers
    page.on('response', async (response) => {
        if (response.url() === url) {
            mainResponseHeaders = response.headers();
        }
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();

    const $ = cheerio.load(html);

    // Meta tags using Cheerio
    const metaTags = {
      description: $('meta[name="description"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content'),
      author: $('meta[name="author"]').attr('content'),
    };

    // Identify CMS by looking for specific keywords or tags
    if (html.includes('wp-content')) {
      cms = 'WordPress';
    } else if (html.includes('media/com_')) {
      cms = 'Joomla';
    } else if (html.includes('drupal.js') || html.includes('drupal.min.js')) {
      cms = 'Drupal';
    } else if (html.includes('skin/frontend/') || html.includes('js/mage/')) {
      cms = 'Magento';
    } else if (html.includes('cdn.shopify.com')) {
      cms = 'Shopify';
    }

    // Initialize an array to hold trackers
    let detectedTrackers: string[] = [];

    // Identify trackers by looking for specific script sources or variables
    if (html.includes('google-analytics.com') || html.includes('gtag(')) {
      detectedTrackers.push('Google Analytics');
    }

    if (html.includes('googletagmanager.com')) {
      detectedTrackers.push('Google Tag Manager');
    }

    if (html.includes('facebook.net/en_US/fbevents.js')) {
      detectedTrackers.push('Facebook Pixel');
    }

    if (html.includes('hotjar.com')) {
      detectedTrackers.push('Hotjar');
    }

    // Convert the array to a comma-separated string
    trackers = detectedTrackers.join(', ');

    // Fetch robots.txt
    try {
      await page.goto(`${url}/robots.txt`, { waitUntil: 'networkidle2' });
      robotsTxt = await page.content(); // or page.text() to get just the text without HTML tags
    } catch (error) {
      // Handle robots.txt fetch error if needed
    }

    // Extract title using Cheerio
    const title = $('title').text();

    // HTTP headers using the captured headers from the main page request
    let mainResponseHeaders: any = {};
    const headers = {
      contentType: mainResponseHeaders['content-type'],
      cacheControl: mainResponseHeaders['cache-control'],
      server: mainResponseHeaders['server'],
    }; 
   // Step 1: Extract the CSS URLs from the HTML using Cheerio
   const cssUrls: string[] = [];
   $('link[rel="stylesheet"]').each((index, element) => {
     const cssUrl = $(element).attr('href');
     if (cssUrl) {
       cssUrls.push(cssUrl);
     }
   });

   // Step 2: Fetch the content of the CSS URLs using Puppeteer
   let allCSS = '';
   for (const cssUrl of cssUrls) {
     try {
       const cssResponse = await page.goto(cssUrl); // Using Puppeteer to fetch CSS
       if (cssResponse) {
         allCSS += await cssResponse.text();
       }
     } catch (error) {
       // Handle CSS fetch error here
     }
   }

   // Step 3 & 4: Beautify the combined CSS
   const beautifiedCSS = cssBeautify(allCSS);

   res.status(200).json({ title, cms, trackers, robotsTxt, metaTags, headers, css: beautifiedCSS });

  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: `Failed to scrape the URL: ${(error as Error).message}` });
  } finally {
    // Ensure the browser instance is closed
    if (browser) {
      await browser.close();
    }
  }
}