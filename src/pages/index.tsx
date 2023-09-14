import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import BeatLoader from "react-spinners/BeatLoader";

// Main container style
const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

// Left container which contains Form, BasicInfo, and RobotsTxt
const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  @media (max-width: 600px) {
    padding: 10px 0;
  }
`;

// Form styling
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
`;

// Input styling
const Input = styled.input`
  padding: 8px;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
`;

// Button styling
const Button = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0077cc;
  }

  &:active {
    background-color: #0055aa;
  }
`;

// Basic Info and RobotsTxt containers
const InfoContainer = styled.div`
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1em;
  margin-top: 1em;
  font-size: 0.8em;
`;

// Right container which contains CSS data
const RightContainer = styled.div`
  flex: 2;
  padding: 20px;
  overflow-y: auto;
`;

// CSS container
const CssContainer = styled.div`
  max-height: calc(100vh - 150px); // Account for padding
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1em;
  font-size: 0.8em;
  white-space: pre-wrap;  // Preserve white space and new lines
`;

// Loader style
const LoaderContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Home() {
    const [url, setUrl] = useState<string>('');
    const [scrapedTitle, setScrapedTitle] = useState<string>('');
    const [cms, setCms] = useState<string>('');
    const [trackers, setTrackers] = useState<string>('');
    const [robotsTxt, setRobotsTxt] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [cssData, setCssData] = useState<string>('');
    const [metaTags, setMetaTags] = useState<{ description?: string, keywords?: string, author?: string }>({});
    const [headers, setHeaders] = useState<{ contentType?: string, cacheControl?: string, server?: string }>({});
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');  // Reset any previous errors

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data.');
            }

            const data = await response.json();
            setScrapedTitle(data.title || '');
            setCms(data.cms || '');
            setTrackers(data.trackers || '');
            setRobotsTxt(data.robotsTxt || '');
            setMetaTags(data.metaTags || {});
            setHeaders(data.headers || {});
            setCssData(data.css || '');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }   finally {
            setIsLoading(false);
        }
    };

    const hasBasicInfo = () => {
        return scrapedTitle || cms || trackers || metaTags?.description || metaTags?.keywords || metaTags?.author || headers?.contentType || headers?.cacheControl || headers?.server;
    };    

    return (
        <Container>
        <LeftContainer>
            <Form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="Enter URL to scrape" 
                />
                <Button type="submit">Go</Button>
            </Form>
            {hasBasicInfo() && (
                <InfoContainer>
                    <h4>Basic info:</h4>
                    {scrapedTitle && <p>Page Title: {scrapedTitle}</p>}
                    {cms && <p>CMS Used: {cms}</p>}
                    {trackers && <p>Trackers Used: {trackers}</p>}
                </InfoContainer>
            )}
            {robotsTxt && (
                <InfoContainer>
                    <h4>Robots.txt content:</h4>
                    <pre>{robotsTxt}</pre>
                </InfoContainer>
            )}
        </LeftContainer>

            <RightContainer>
                {cssData && (
                    <div>
                        <h4>Raw CSS:</h4>
                        <CssContainer>
                            {cssData}
                        </CssContainer>
                    </div>
                )}
            </RightContainer>

            {isLoading && 
                <LoaderContainer>
                    <BeatLoader color="#123abc" loading={isLoading} size={15} />
                </LoaderContainer>
            }
            {error && <p style={{ color: 'red', position: 'absolute', bottom: 10, left: 10 }}>{error}</p>}
        </Container>
    );
}