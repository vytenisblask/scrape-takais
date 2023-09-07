import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  let cms = 'Unknown';
  let trackers = 'Unknown';
  let robotsTxt = 'Not Available';

  try {
    // Scrape the main page for title and other info
    const response = await axios.get(url);
    const html = response.data;

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

    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'No title found';

    res.status(200).json({ title, cms, trackers, robotsTxt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the URL' });
  }
}
