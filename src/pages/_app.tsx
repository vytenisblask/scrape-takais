import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../styles/theme";
import NavigationBar from "../pages/components/NavigationBar"; // Import the component

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <title>Scrape-a-roonie</title>
        </Head>
        <NavigationBar /> {/* Include the NavigationBar */}
        <Component {...pageProps} />
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
