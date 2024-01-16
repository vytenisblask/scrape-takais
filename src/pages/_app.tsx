import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'styled-components'; // Only if you still need styled-components
import type { AppProps } from 'next/app';
import Head from 'next/head';
import theme from '../styles/theme'; // Your custom theme for styled-components

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <ChakraProvider>
        <ThemeProvider theme={theme}> {/* Optional: If you still use styled-components */}
          <Head>
            <title>Scrape-a-roonie</title>
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </ChakraProvider>
    );
}

export default MyApp;
