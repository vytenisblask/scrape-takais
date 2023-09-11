# Web Scraper with Next.js

This is a simple web scraper built using Next.js that fetches and displays various details about a given URL.

You can check out [the app here](https://scrape.takais.lt) - your feedback and contributions are welcome!

## Features

- Retrieves the page title of the provided URL.
- Identifies the Content Management System (CMS) being used.
- Detects specific web trackers on the page.
- Fetches and beautifies raw CSS from the provided URL.
- Displays the aforementioned data in a clean and organized manner.

## Tech Stack

- **Frontend**: Next.js with React
- **Styling**: Styled-components
- **Web Scraping**: Cheerio for parsing and data extraction.
- **Data Fetching**: Built-in `fetch` function in Next.js.
- **Utilities**: Various utility libraries such as `normalize-url`, `is-url`, and `is-present` for data processing and validation.

---