'use client';

import { useState, useEffect } from "react";
import Header from "@/components/custom/header";
import ScraperForm from "@/components/custom/scraper-form";
import ProgressIndicator from "@/components/custom/progress-indicator";
import SelectorSuggestions from "@/components/custom/selector-suggestions";
import { getScrapingSuggestions, getSummary } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./data-table-columns";
import ExportOptions from "./export-options";

// Mock data to simulate scraped results
const mockProducts: Product[] = [
    { id: '1', name: 'Smartwatch Series 7', price: 199.99, rating: 4.5, imageUrl: 'https://placehold.co/100x100.png' },
    { id: '2', name: 'Wireless Headphones Pro', price: 89.99, rating: 4.8, imageUrl: 'https://placehold.co/100x100.png' },
    { id: '3', name: '4K Ultra HD Webcam', price: 120.00, rating: 4.6, imageUrl: 'https://placehold.co/100x100.png' },
    { id: '4', name: 'Mechanical Keyboard', price: 150.50, rating: 4.9, imageUrl: 'https://placehold.co/100x100.png' },
    { id: '5', name: 'Ergonomic Mouse', price: 75.00, rating: 4.7, imageUrl: 'https://placehold.co/100x100.png' },
];

export default function ScraperClient() {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [suggestedSelectors, setSuggestedSelectors] = useState<string[]>([]);
  const [scrapedData, setScrapedData] = useState<Product[]>([]);
  const [summary, setSummary] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScraping) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isScraping]);

  const handleScrape = async (scrapeUrl: string) => {
    setUrl(scrapeUrl);
    setIsScraping(true);
    setProgress(0);
    setStatusMessage("Initializing scraping engine...");
    setScrapedData([]);
    setSuggestedSelectors([]);
    setSummary('');

    try {
      setStatusMessage("Analyzing page structure...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatusMessage("Getting AI selector suggestions...");
      const selectors = await getScrapingSuggestions(scrapeUrl);
      if (selectors.length > 0) {
        setSuggestedSelectors(selectors);
      } else {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not get AI suggestions. Using default selectors.",
        });
        setSuggestedSelectors(['.product-item', '.product-title', '.product-price']);
      }
      
      setStatusMessage("Extracting data...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatusMessage("Cleaning and formatting data...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScrapedData(mockProducts);
      
      setStatusMessage("Generating summary...");
      const dataSummary = await getSummary(JSON.stringify(mockProducts), scrapeUrl);
      setSummary(dataSummary);


      setProgress(100);
      setStatusMessage("Scraping complete!");

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: "An unexpected error occurred during scraping.",
      });
      setStatusMessage("Error occurred.");
    } finally {
        // Keep the results on screen
    }
  };
    
  const handleStartNewScrape = () => {
    setIsScraping(false);
    setScrapedData([]);
    setSuggestedSelectors([]);
    setUrl("");
    setProgress(0);
    setStatusMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="space-y-8">
            <ScraperForm onScrape={handleScrape} isScraping={isScraping} />

            {isScraping && !scrapedData.length && (
                <ProgressIndicator progress={progress} message={statusMessage} />
            )}

            {suggestedSelectors.length > 0 && !scrapedData.length && isScraping && (
                <SelectorSuggestions selectors={suggestedSelectors} />
            )}

            {scrapedData.length > 0 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <DataTable 
                        columns={columns} 
                        data={scrapedData} 
                        summary={summary} 
                        onNewScrape={handleStartNewScrape}
                    />
                    <ExportOptions />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
