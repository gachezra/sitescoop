'use client';

import { useState } from "react";
import Header from "@/components/custom/header";
import ScraperForm from "@/components/custom/scraper-form";
import ProgressIndicator from "@/components/custom/progress-indicator";
import { performScrape } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./data-table-columns";
import ExportOptions from "./export-options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

type ScraperState = 'idle' | 'scraping' | 'results' | 'error';

export default function ScraperClient() {
  const [state, setState] = useState<ScraperState>("idle");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [scrapedData, setScrapedData] = useState<Product[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState("");

  const { toast } = useToast();

  const handleScrape = async (scrapeUrl: string) => {
    setUrl(scrapeUrl);
    setState('scraping');
    setProgress(0);
    setStatusMessage("Initializing scraping engine...");
    setScrapedData([]);
    setSummary('');
    setErrorMessage('');

    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 95));
    }, 500);

    try {
      setStatusMessage("Fetching page and analyzing content with AI...");
      const result = await performScrape(scrapeUrl);
      clearInterval(progressInterval);

      if (result.error) {
        setErrorMessage(result.error);
        setState('error');
        toast({
          variant: "destructive",
          title: "Scraping Failed",
          description: result.error,
        });
        return;
      }
      
      if(result.data && result.summary) {
        setScrapedData(result.data);
        setSummary(result.summary);
        setProgress(100);
        setStatusMessage("Scraping complete!");
        setState('results');
      } else {
        setErrorMessage("Scraping finished, but returned no data or summary.");
        setState('error');
      }

    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setErrorMessage(message);
      setState('error');
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: message,
      });
    }
  };
    
  const handleStartNewScrape = () => {
    setState('idle');
    setScrapedData([]);
    setUrl("");
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
  };

  const isProcessing = state === 'scraping';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="space-y-8">
            <ScraperForm onScrape={handleScrape} isScraping={isProcessing} />

            {state === 'error' && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        {errorMessage}
                        <div>
                          <Button variant="link" onClick={handleStartNewScrape} className="p-0 h-auto ml-2">Try Again</Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {state === 'scraping' && (
                <ProgressIndicator progress={progress} message={statusMessage} />
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
