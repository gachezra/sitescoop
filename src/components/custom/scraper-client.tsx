'use client';

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/custom/header";
import ScraperForm from "@/components/custom/scraper-form";
import ProgressIndicator from "@/components/custom/progress-indicator";
import { extractContent, performDataCleaning } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { ScrapedData, ContentType } from "@/app/actions";
import ResultsView from "./results-view";
import ExportOptions from "./export-options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

type ScraperState = 'idle' | 'scraping' | 'results' | 'error';

export default function ScraperClient() {
  const [state, setState] = useState<ScraperState>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCleaning, setIsCleaning] = useState(false);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  const { toast } = useToast();

  const allTables = useMemo(() => {
    if (scrapedData?.contentType === 'tables' && Array.isArray(scrapedData.data)) {
      return scrapedData.data as string[][][];
    }
    return [];
  }, [scrapedData]);

  // When new table data arrives, select all tables by default
  useEffect(() => {
    if (scrapedData?.contentType === 'tables') {
      const allTableIndexes = Array.from({ length: allTables.length }, (_, i) => i);
      setSelectedTables(allTableIndexes);
    } else {
      setSelectedTables([]);
    }
  }, [scrapedData, allTables]);


  const dataToExport = useMemo(() => {
    if (scrapedData?.contentType === 'tables') {
      return allTables.filter((_, index) => selectedTables.includes(index));
    }
    return scrapedData?.data;
  }, [scrapedData, allTables, selectedTables]);


  const handleScrape = async ({ url, contentType }: { url: string, contentType: ContentType }) => {
    setState('scraping');
    setProgress(0);
    setStatusMessage("Initializing extraction engine...");
    setScrapedData(null);
    setErrorMessage('');
    setSelectedTables([]);

    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 95));
    }, 300);

    try {
      setStatusMessage("Fetching page and extracting content...");
      const result = await extractContent(url, contentType);
      clearInterval(progressInterval);

      if (result.error) {
        setErrorMessage(result.error);
        setState('error');
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: result.error,
        });
        return;
      }
      
      if(result.data) {
        setScrapedData(result.data);
        setProgress(100);
        setStatusMessage("Extraction complete!");
        setState('results');
      } else {
        setErrorMessage("Extraction finished, but returned no data.");
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
        title: "Extraction Failed",
        description: message,
      });
    }
  };

  const handleCleanData = async () => {
    if (!scrapedData) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: "There is no data to clean.",
        });
        return;
    }

    setIsCleaning(true);
    toast({
        title: "AI Cleaning in Progress",
        description: "Please wait while our AI cleans your data...",
    });

    try {
        const dataForCleaning = { ...scrapedData, data: dataToExport };
        const result = await performDataCleaning(dataForCleaning);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Cleaning Failed",
                description: result.error,
            });
        } else if (result.cleanedData) {
            // Create a new data object that respects the original structure
            let updatedData;
            if (scrapedData.contentType === 'tables') {
                 // The AI returns cleaned data for the selection. We need to merge it back
                 // into the full dataset for consistent state representation.
                 const cleanedTables = result.cleanedData as string[][][];
                 let cleanedIndex = 0;
                 updatedData = allTables.map((originalTable, index) => {
                    if (selectedTables.includes(index)) {
                        return cleanedTables[cleanedIndex++];
                    }
                    return originalTable;
                 });
            } else {
                updatedData = result.cleanedData;
            }

            setScrapedData({ ...scrapedData, data: updatedData });
            toast({
                title: "Data Cleaned Successfully!",
                description: "The results have been updated.",
                className: 'bg-green-500 text-white',
            });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Cleaning Failed",
            description: message,
        });
    } finally {
        setIsCleaning(false);
    }
  };
    
  const handleStartNewScrape = () => {
    setState('idle');
    setScrapedData(null);
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
  };

  const isProcessing = state === 'scraping' || isCleaning;

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

            {state === 'results' && scrapedData && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <ResultsView
                        scrapedData={scrapedData} 
                        onNewScrape={handleStartNewScrape}
                        isProcessing={isProcessing}
                        selectedTables={selectedTables}
                        onSelectedTablesChange={setSelectedTables}
                        allTables={allTables}
                        filteredTableData={dataToExport}
                    />
                    <ExportOptions 
                      scrapedData={scrapedData}
                      dataToExport={dataToExport}
                      onCleanData={handleCleanData}
                      isCleaning={isCleaning}
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
