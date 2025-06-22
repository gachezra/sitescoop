'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import type { ScrapedData } from "@/app/actions";

type ResultsViewProps = {
  scrapedData: ScrapedData;
  onNewScrape: () => void;
  isProcessing?: boolean;
};

export default function ResultsView({ scrapedData, onNewScrape, isProcessing }: ResultsViewProps) {
  const { contentType, data, url } = scrapedData;

  const renderContent = () => {
    switch (contentType) {
      case 'text':
        return (
          <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-md max-h-[500px] overflow-auto">
            {data}
          </pre>
        );
      case 'links':
        return (
          <div className="max-h-[500px] overflow-auto space-y-2 p-1">
            <ul className="list-disc list-inside space-y-1">
              {(data as string[]).map((link, index) => {
                let absoluteLink = link;
                try {
                  // Link should already be absolute from the action, but this is a fallback.
                  absoluteLink = new URL(link, url).href;
                } catch (e) {
                  // keep original if invalid
                }
                return (
                  <li key={index}>
                    <a href={absoluteLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                      {absoluteLink}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case 'images':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[500px] overflow-auto p-1">
            {(data as string[]).map((imgSrc, index) => {
                let absoluteSrc = imgSrc;
                try {
                    // Src should already be absolute from the action, but this is a fallback.
                    absoluteSrc = new URL(imgSrc, url).href;
                } catch(e) {
                    // keep original
                }
                return (
                    <div key={index} className="relative aspect-square bg-muted/50 rounded-md">
                        <Image
                            src={absoluteSrc}
                            alt={`Scraped image ${index + 1}`}
                            fill
                            className="rounded-md object-cover"
                            unoptimized // Required since we can't know the remote hostnames in next.config.js
                            data-ai-hint="scraped image"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                )
            })}
          </div>
        );
      case 'tables':
        return (
          <div className="max-h-[600px] overflow-y-auto space-y-6 p-1">
            {(data as string[][][]).map((table, tableIndex) => (
              <div key={tableIndex} className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm table-auto">
                  <tbody>
                    {table.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-b-0 bg-white/5 even:bg-white/10">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 align-top border-r last:border-r-0">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        );
      default:
        return <p>Unsupported content type.</p>;
    }
  };

  const getTitle = () => {
    switch(contentType) {
        case 'text': return "Extracted Text Content";
        case 'links': return "Extracted Links";
        case 'images': return "Extracted Images";
        case 'tables': return "Extracted Tables";
        default: return "Extraction Results"
    }
  }

  const getDescription = () => {
     switch(contentType) {
        case 'text': return `Found ${data.length.toLocaleString()} characters.`;
        case 'links': return `Found ${(data as string[]).length.toLocaleString()} links.`;
        case 'images': return `Found ${(data as string[]).length.toLocaleString()} images.`;
        case 'tables': return `Found ${(data as string[][][]).length.toLocaleString()} tables.`;
        default: return "Your extracted data is ready."
    }
  }

  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <Button onClick={onNewScrape} variant="outline" disabled={isProcessing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Scrape
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
