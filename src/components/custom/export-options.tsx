'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Sparkles, Loader2, Gem, FileJson } from "lucide-react";
import PaymentModal from './payment-modal';
import { useToast } from '@/hooks/use-toast';
import type { ScrapedData } from '@/app/actions';

type ExportOptionsProps = {
  scrapedData: ScrapedData;
  dataToExport: any;
  onCleanData: () => Promise<void>;
  isCleaning: boolean;
};

export default function ExportOptions({ scrapedData, dataToExport, onCleanData, isCleaning }: ExportOptionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCleanAction = () => {
    setIsModalOpen(true);
  };

  const handleSuccessfulPayment = () => {
    setIsModalOpen(false); 
    onCleanData(); 
  };

  const handleDownload = (format: 'csv' | 'json') => {
    const { contentType } = scrapedData;
    let fileContent: string;
    let fileExtension: string;
    let mimeType: string;

    if (format === 'json') {
      fileContent = JSON.stringify(dataToExport, null, 2);
      fileExtension = 'json';
      mimeType = 'application/json;charset=utf-8;';
    } else { // format === 'csv'
      if (contentType === 'tables') {
        const tables = dataToExport as string[][][];
        fileContent = tables.map(table => 
          table.map(row => 
            row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
          ).join('\n')
        ).join('\n\n');
        fileExtension = 'csv';
        mimeType = 'text/csv;charset=utf-8;';
      } else if (Array.isArray(scrapedData.data)) {
        fileContent = scrapedData.data.join('\n');
        fileExtension = 'csv';
        mimeType = 'text/csv;charset=utf-8;';
      } else {
        fileContent = String(scrapedData.data);
        fileExtension = 'txt';
        mimeType = 'text/plain;charset=utf-8;';
      }
    }

    const timestamp = Date.now();
    const blob = new Blob([fileContent], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `SiteScoop_doc${timestamp}.${fileExtension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: 'Download Started',
        description: `Your ${fileExtension.toUpperCase()} file is being downloaded.`,
    });
  };

  const handleEmail = () => {
     toast({
        title: 'Email Client Opening',
        description: 'A new email draft will be created with your data.',
    });
    const subject = encodeURIComponent("Extracted Data from SiteScoop");
    
    // Use the potentially filtered data for the email body
    let bodyText: string;
    if (scrapedData.contentType === 'tables') {
      const tables = dataToExport as string[][][];
      bodyText = tables.map(table => 
        table.map(row => row.join('\t')).join('\n')
      ).join('\n\n---\n\n');
    } else if (Array.isArray(dataToExport)) {
        bodyText = dataToExport.join('\n');
    } else {
        bodyText = String(dataToExport);
    }
    
    const body = encodeURIComponent(
        `Here is the data you extracted with SiteScoop:\n\n${bodyText.substring(0, 1500)}...\n\nGet full, cleaned data with SiteScoop!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Download, email, or use AI to clean your extracted data.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" size="lg" className="flex-col h-24" onClick={() => handleDownload('csv')}>
            <Download className="h-8 w-8 mb-2" />
            <span className="font-semibold">Download CSV</span>
            <span className="text-xs text-muted-foreground">.{scrapedData.contentType === 'text' ? 'txt' : 'csv'} file</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24" onClick={() => handleDownload('json')}>
            <FileJson className="h-8 w-8 mb-2" />
            <span className="font-semibold">Download JSON</span>
            <span className="text-xs text-muted-foreground">.json file</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24" onClick={handleEmail}>
            <Mail className="h-8 w-8 mb-2" />
            <span className="font-semibold">Email Data</span>
            <span className="text-xs text-muted-foreground">Share via email client</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-col h-24 relative overflow-hidden group" 
            onClick={handleCleanAction}
            disabled={isCleaning}
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
              <Gem className="h-3 w-3" />
              <span>PREMIUM</span>
            </div>
            {isCleaning ? <Loader2 className="h-8 w-8 mb-2 animate-spin text-primary" /> : <Sparkles className="h-8 w-8 mb-2 text-primary" />}
            <span className="font-semibold">{isCleaning ? 'Cleaning...' : 'Clean with AI'}</span>
            <span className="text-xs text-muted-foreground">Remove noise & format</span>
          </Button>
        </CardContent>
      </Card>
      <PaymentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        feature="AI Data Cleaning"
        onSuccessfulPayment={handleSuccessfulPayment}
      />
    </>
  );
}
