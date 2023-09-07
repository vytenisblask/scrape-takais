import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  let cms = 'Unknown';
  let trackers = 'Unknown';
  let robotsTxt = 'Not Available';

  try {
    const response = await axios.get(url);
    const html = response.data;
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
      const robotsResponse = await axios.get(`${url}/robots.txt`);
      robotsTxt = robotsResponse.data;
    } catch (error) {
      // Handle robots.txt fetch error if needed
    }
    // Extract title using Cheerio
    const title = $('title').text();

    // HTTP headers
    const headers = {
      contentType: response.headers['content-type'],
      cacheControl: response.headers['cache-control'],
      server: response.headers['server'],
    };

    res.status(200).json({ title, cms, trackers, robotsTxt, metaTags, headers });

  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the URL' });
  }
}