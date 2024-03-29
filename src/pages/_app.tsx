import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../styles/theme";
import NavigationBar from "./components/NavigationBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>CSS Scraper</title>
      </Head>
      <NavigationBar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
