import { useState, FormEvent } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.light};
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
  max-height: 300px; // Set a maximum height
  overflow-y: auto; // Enable vertical scrolling
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
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
  
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
    };
  
    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Enter URL to scrape" 
          />
          <Button type="submit">Go</Button>
        </Form>
        {scrapedTitle && <p>Scraped Title: {scrapedTitle}</p>}
        {cms && <p>CMS Used: {cms}</p>}
        {trackers && <p>Trackers Used: {trackers}</p>}
        {robotsTxt && (
  <div>
    <p>Robots.txt:</p>
    <RobotsTxtContainer>
      <pre>{robotsTxt}</pre>
    </RobotsTxtContainer>
  </div>
)}
      </Container>
    );
  }