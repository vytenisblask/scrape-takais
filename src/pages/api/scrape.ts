import { NextApiRequest, NextApiResponse } from 'next';
import cheerio from 'cheerio';  
import cssBeautify from 'cssbeautify';
import getCss from 'get-css';
import isUrl from 'is-url';
import isPresent from 'is-present';
import normalizeUrl from 'normalize-url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  
  let cms = 'Unknown';
  let trackers = 'Unknown';
  let robotsTxt = 'Not Available'; // Note: This won't be fetched in the current setup

  const fullUrl = url && normalizeUrl(url, { stripAuthentication: false });

  if (!isPresent(fullUrl) || !isUrl(fullUrl)) {
    return res.status(406).json({
      error: 'unacceptable',
      message: 'Url is invalid',
    });
  }

  try {
    const cssResponse = await getCss(fullUrl);
    const html = cssResponse.css;
    const $ = cheerio.load(html);

    // Identify CMS by looking for specific keywords or tags
    // Note: These checks might not be effective on CSS content alone, but we're retaining them for now
    const cmsCheckers = {
      'wp-content': 'WordPress',
      'media/com_': 'Joomla',
      'drupal.js': 'Drupal',
      'drupal.min.js': 'Drupal',
      'skin/frontend/': 'Magento',
      'js/mage/': 'Magento',
      'cdn.shopify.com': 'Shopify'
    };

    for (const [key, value] of Object.entries(cmsCheckers)) {
      if (html.includes(key)) {
        cms = value as string;
        break;
      }
    }

    // Identify trackers
    const trackerCheckers = {
      'google-analytics.com': 'Google Analytics',
      'gtag(': 'Google Analytics',
      'googletagmanager.com': 'Google Tag Manager',
      'facebook.net/en_US/fbevents.js': 'Facebook Pixel',
      'hotjar.com': 'Hotjar'
    };

    let detectedTrackers: string[] = [];
    for (const [key, value] of Object.entries(trackerCheckers)) {
      if (html.includes(key)) {
        detectedTrackers.push(value as string);
      }
    }
    trackers = detectedTrackers.join(', ');

    // Beautify the CSS
    const beautifiedCSS = cssBeautify(html);

    res.status(200).json({ cms, trackers, robotsTxt, css: beautifiedCSS });

  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: `Failed to scrape the URL: ${(error as Error).message}` });
  }
}