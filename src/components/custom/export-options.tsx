'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, FileText, FileSpreadsheet, Gem, Sparkles, Loader2 } from "lucide-react";
import PaymentModal from './payment-modal';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

type ExportOptionsProps = {
  data: Product[];
  onCleanData: () => Promise<void>;
  isCleaning: boolean;
};

export default function ExportOptions({ data, onCleanData, isCleaning }: ExportOptionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePremiumAction = (feature: string, action: string) => {
    setPremiumFeature(feature);
    setActionToConfirm(action);
    setIsModalOpen(true);
  };

  const handleSuccessfulPayment = () => {
    setIsModalOpen(false); 
    if (actionToConfirm === 'clean') {
      onCleanData(); 
    } else if (actionToConfirm === 'pdf') {
      toast({
        title: 'Payment Successful!',
        description: `You have unlocked PDF export. Your download will start shortly.`,
        className: 'bg-green-500 text-white',
      });
    } else if (actionToConfirm === 'excel') {
      toast({
        title: 'Payment Successful!',
        description: `You have unlocked Excel export. Your download will start shortly.`,
        className: 'bg-green-500 text-white',
      });
    }
    setActionToConfirm(null);
  };

  const convertToCSV = (dataToConvert: Product[]): string => {
    if (!dataToConvert || dataToConvert.length === 0) return '';
    const headers = Object.keys(dataToConvert[0]);
    const csvRows = [
      headers.join(','), 
      ...dataToConvert.map(row =>
        headers.map(fieldName =>
          JSON.stringify(row[fieldName as keyof Product] || '', (key, value) =>
            value === null ? '' : value
          )
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const handleDownloadCsv = () => {
    const csvData = convertToCSV(data.slice(0, 100));
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sitescoop_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: 'Download Started',
        description: 'Your CSV file is being downloaded.',
    });
  };

  const handleEmailCsv = () => {
     toast({
        title: 'Email Client Opening',
        description: 'A new email draft will be created with your data.',
    });
    const subject = encodeURIComponent("Scraped Data from SiteScoop");
    const body = encodeURIComponent(
        `Here is the data you scraped, with SiteScoop branding.\n\n${convertToCSV(data.slice(0,10))}\n\n... and more.\n\nUnlock full data exports with SiteScoop Premium!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Export Your Data</CardTitle>
          <CardDescription>Download, email, or clean your scraped data.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Free Options */}
          <Button variant="outline" size="lg" className="flex-col h-24" onClick={handleDownloadCsv}>
            <Download className="h-8 w-8 mb-2" />
            <span className="font-semibold">Download CSV</span>
            <span className="text-xs text-muted-foreground">First 100 rows</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24" onClick={handleEmailCsv}>
            <Mail className="h-8 w-8 mb-2" />
            <span className="font-semibold">Email CSV</span>
            <span className="text-xs text-muted-foreground">With SiteScoop branding</span>
          </Button>

          {/* Premium Options */}
          <Button variant="outline" size="lg" className="flex-col h-24 relative overflow-hidden group" onClick={() => handlePremiumAction('PDF Export', 'pdf')}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
              <Gem className="h-3 w-3" />
              <span>PREMIUM</span>
            </div>
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <span className="font-semibold">Export as PDF</span>
            <span className="text-xs text-muted-foreground">Full, formatted report</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24 relative overflow-hidden group" onClick={() => handlePremiumAction('Excel Export', 'excel')}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                <Gem className="h-3 w-3" />
                <span>PREMIUM</span>
            </div>
            <FileSpreadsheet className="h-8 w-8 mb-2 text-primary" />
            <span className="font-semibold">Export as Excel</span>
            <span className="text-xs text-muted-foreground">Multiple sheets, full data</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-col h-24 relative overflow-hidden group" 
            onClick={() => handlePremiumAction('AI Data Cleaning', 'clean')}
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
        feature={premiumFeature}
        onSuccessfulPayment={handleSuccessfulPayment}
      />
    </>
  );
}
