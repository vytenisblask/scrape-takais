import { useState, FormEvent } from "react";
import {
  Container,
  Box,
  Input,
  Button,
  Text,
  VStack,
  useColorModeValue,
  Heading,
  Divider,
  Code,
  IconButton,
  useClipboard,
  Tooltip,
} from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";
import { CopyIcon } from "@chakra-ui/icons";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [scrapedTitle, setScrapedTitle] = useState<string>("");
  const [cms, setCms] = useState<string>("");
  const [trackers, setTrackers] = useState<string>("");
  const [robotsTxt, setRobotsTxt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [cssData, setCssData] = useState<string>("");
  const [metaTags, setMetaTags] = useState<{
    description?: string;
    keywords?: string;
    author?: string;
  }>({});
  const [headers, setHeaders] = useState<{
    contentType?: string;
    cacheControl?: string;
    server?: string;
  }>({});
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset any previous errors

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();
      setScrapedTitle(data.title || "");
      setCms(data.cms || "");
      setTrackers(data.trackers || "");
      setRobotsTxt(data.robotsTxt || "");
      setMetaTags(data.metaTags || {});
      setHeaders(data.headers || {});
      setCssData(data.css || "");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasBasicInfo = () => {
    return (
      scrapedTitle ||
      cms ||
      trackers ||
      metaTags?.description ||
      metaTags?.keywords ||
      metaTags?.author ||
      headers?.contentType ||
      headers?.cacheControl ||
      headers?.server
    );
  };

  const { hasCopied, onCopy } = useClipboard(cssData);

  return (
    <Container maxW="container.xl" p={4}>
      <Box display={{ base: "block", md: "flex" }}>
        <VStack flex="1" p={4} spacing={4}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to scrape"
                borderColor={useColorModeValue("gray.300", "gray.700")}
              />
              <Button colorScheme="blue" type="submit">
                Scrape It
              </Button>
            </VStack>
          </form>

          {hasBasicInfo() && (
            <Box
              border="1px"
              borderColor="gray.300"
              p={4}
              borderRadius="md"
              overflowY="auto"
            >
              <Heading as="h4" size="md">
                Basic info:
              </Heading>
              {scrapedTitle && <Text>Page Title: {scrapedTitle}</Text>}
              {cms && <Text>CMS Used: {cms}</Text>}
              {trackers && <Text>Trackers Used: {trackers}</Text>}
            </Box>
          )}

          {robotsTxt && (
            <Box
              border="1px"
              borderColor="gray.300"
              p={4}
              borderRadius="md"
              overflowY="auto"
            >
              <Heading as="h4" size="md">
                Robots.txt content:
              </Heading>
              <Divider my={2} />
              <Text as="pre">{robotsTxt}</Text>
            </Box>
          )}
        </VStack>

        <Box flex="2" p={4} overflowY="auto">
          {cssData && (
            <Box>
              <Heading
                as="h4"
                size="md"
                mb={2}
                display="flex"
                alignItems="center"
              >
                Raw CSS
                <Tooltip label={hasCopied ? "Copied!" : "Copy to Clipboard"}>
                  <IconButton
                    aria-label="Copy CSS"
                    icon={<CopyIcon />}
                    onClick={onCopy}
                    ml={2}
                    size="sm"
                  />
                </Tooltip>
              </Heading>
              <Box
                border="1px"
                borderColor="gray.300"
                p={4}
                borderRadius="md"
                overflowY="auto"
                maxHeight="calc(100vh - 150px)"
              >
                <pre>
                  <Code whiteSpace="pre-wrap">{cssData}</Code>
                </pre>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {isLoading && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <BeatLoader color="#123abc" loading={isLoading} size={15} />
        </Box>
      )}
      {error && (
        <Text color="red" position="absolute" bottom={10} left={10}>
          {error}
        </Text>
      )}
    </Container>
  );
}
