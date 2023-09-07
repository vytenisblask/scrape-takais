import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app';
import GlobalStyles from '../styles/GlobalStyles';
import theme from '../styles/theme';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <ThemeProvider theme={theme}>
        <Head>
          <title>Scrape-a-roonie</title>
        </Head>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
  

export default MyApp;
