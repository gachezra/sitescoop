'use client';

import { useState } from "react";
import Header from "@/components/custom/header";
import ScraperForm from "@/components/custom/scraper-form";
import ProgressIndicator from "@/components/custom/progress-indicator";
import SelectorSuggestions from "@/components/custom/selector-suggestions";
import { getScrapingSuggestions, getSummary, scrapeWebsite } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Product, SelectorMap } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./data-table-columns";
import ExportOptions from "./export-options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

type ScraperState = 'idle' | 'suggesting' | 'selecting' | 'scraping' | 'results' | 'error';

export default function ScraperClient() {
  const [state, setState] = useState<ScraperState>("idle");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [suggestedSelectors, setSuggestedSelectors] = useState<SelectorMap | null>(null);
  const [scrapedData, setScrapedData] = useState<Product[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState("");

  const { toast } = useToast();

  const handleGetSuggestions = async (scrapeUrl: string) => {
    setUrl(scrapeUrl);
    setState('suggesting');
    setProgress(0);
    setStatusMessage("Initializing scraping engine...");
    setScrapedData([]);
    setSuggestedSelectors(null);
    setSummary('');
    setErrorMessage('');

    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
    }, 500);

    try {
      setStatusMessage("Fetching page content...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage("Analyzing page and getting AI suggestions...");
      const selectors = await getScrapingSuggestions(scrapeUrl);
      clearInterval(progressInterval);
      setProgress(100);

      if (selectors) {
        setSuggestedSelectors(selectors);
        setState('selecting');
      } else {
        setErrorMessage("Could not get AI suggestions for this URL. It might be protected or inaccessible. Please try another URL.");
        setState('error');
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to generate CSS selectors.",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      setErrorMessage("An unexpected error occurred while fetching suggestions.");
      setState('error');
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: "An unexpected error occurred during scraping.",
      });
    }
  };

  const handleConfirmAndScrape = async (selectors: SelectorMap) => {
    setState('scraping');
    setStatusMessage("Extracting data with selected selectors...");
    setProgress(0);
    setSuggestedSelectors(selectors); // Store edited selectors

    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 90));
    }, 400);

    try {
        const data = await scrapeWebsite(url, selectors);
        clearInterval(progressInterval);

        if (data.length === 0) {
            setErrorMessage("Scraping completed, but no data was found with the provided selectors. You can go back and adjust them.");
            setState('error'); 
            return;
        }

        setScrapedData(data);
        
        setStatusMessage("Generating AI summary...");
        const dataSummary = await getSummary(JSON.stringify(data.slice(0, 5)), url);
        setSummary(dataSummary);

        setProgress(100);
        setStatusMessage("Scraping complete!");
        setState('results');

    } catch (error) {
        clearInterval(progressInterval);
        console.error("Scraping error:", error);
        setErrorMessage("An error occurred during the final scraping process.");
        setState('error');
    }
  };
    
  const handleStartNewScrape = () => {
    setState('idle');
    setScrapedData([]);
    setSuggestedSelectors(null);
    setUrl("");
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
  };

  const isProcessing = ['suggesting', 'scraping'].includes(state);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="space-y-8">
            <ScraperForm onScrape={handleGetSuggestions} isScraping={isProcessing} />

            {state === 'error' && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        {errorMessage}
                        <div>
                        {suggestedSelectors && (
                             <Button variant="link" onClick={() => setState('selecting')} className="p-0 h-auto ml-2">Adjust Selectors</Button>
                        )}
                        <Button variant="link" onClick={handleStartNewScrape} className="p-0 h-auto ml-2">Try Again</Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {(state === 'suggesting' || state === 'scraping') && (
                <ProgressIndicator progress={progress} message={statusMessage} />
            )}

            {state === 'selecting' && suggestedSelectors && (
                <SelectorSuggestions 
                    suggestions={suggestedSelectors} 
                    onConfirm={handleConfirmAndScrape}
                    isScraping={state === 'scraping'}
                />
            )}

            {state === 'results' && scrapedData.length > 0 && (
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
