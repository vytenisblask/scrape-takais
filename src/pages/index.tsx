import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import BeatLoader from "react-spinners/BeatLoader";

const Container = styled.div<{ $hasResults?: boolean }>`
  display: flex;
  height: 100vh;
  flex-direction: ${props => props.$hasResults ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
`;

const LeftContainer = styled.div<{ $hasResults?: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: ${props => props.$hasResults ? 'flex-start' : 'center'};
  padding: ${props => props.$hasResults ? '20px' : '0'};
`;

const RightContainer = styled.div`
  flex: 2;
  padding: 20px;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const RobotsTxtContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1em;
  margin-top: 1em;
  font-size: 0.8em;
`;

export default function Home() {
    const [url, setUrl] = useState<string>('');
    const [scrapedTitle, setScrapedTitle] = useState<string | null>(null);
    const [cms, setCms] = useState<string | null>(null);
    const [trackers, setTrackers] = useState<string | null>(null);
    const [robotsTxt, setRobotsTxt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [metaTags, setMetaTags] = useState({
        description: null,
        keywords: null,
        author: null
    });

    const [headers, setHeaders] = useState({
        contentType: null,
        cacheControl: null,
        server: null
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        setScrapedTitle(data.title);
        setCms(data.cms);
        setTrackers(data.trackers);
        setRobotsTxt(data.robotsTxt);
        setMetaTags(data.metaTags);
        setHeaders(data.headers);
        setIsLoading(false);
    };

    const containerStyle = {
        flexDirection: !!scrapedTitle ? 'row' : 'column'
    };
    
    const leftContainerStyle = {
        alignItems: !!scrapedTitle ? 'flex-start' : 'center',
        padding: !!scrapedTitle ? '20px' : '0'
    };

    return (
        <Container $hasResults={!!scrapedTitle}>
             <LeftContainer $hasResults={!!scrapedTitle}>
                <Form onSubmit={handleSubmit}>
                    <Input 
                        type="text" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        placeholder="Enter URL to scrape" 
                    />
                    <Button type="submit">Go</Button>
                </Form>
            </LeftContainer>

            <RightContainer>
                {isLoading && <BeatLoader color="#123abc" loading={isLoading} size={15} />}
                {scrapedTitle && <p>Page Title: {scrapedTitle}</p>}
                {cms && <p>CMS Used: {cms}</p>}
                {trackers && <p>Trackers Used: {trackers}</p>}
                {metaTags.description && <p>Meta Description: {metaTags.description}</p>}
                {metaTags.keywords && <p>Meta Keywords: {metaTags.keywords}</p>}
                {metaTags.author && <p>Meta Author: {metaTags.author}</p>}
                {headers.contentType && <p>Content Type: {headers.contentType}</p>}
                {headers.cacheControl && <p>Cache Control: {headers.cacheControl}</p>}
                {headers.server && <p>Server Type: {headers.server}</p>}
                {robotsTxt && (
                    <div>
                        <p>Robots.txt content:</p>
                        <RobotsTxtContainer>
                            <pre>{robotsTxt}</pre>
                        </RobotsTxtContainer>
                    </div>
                )}
            </RightContainer>
        </Container>
    );    
}