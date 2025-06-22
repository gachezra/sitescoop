'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, FileText, FileSpreadsheet, Gem } from "lucide-react";
import PaymentModal from './payment-modal';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

type ExportOptionsProps = {
  data: Product[];
};

export default function ExportOptions({ data }: ExportOptionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const { toast } = useToast();

  const handlePremiumExport = (feature: 'PDF' | 'Excel') => {
    setPremiumFeature(feature);
    setIsModalOpen(true);
  };

  const convertToCSV = (dataToConvert: Product[]): string => {
    if (!dataToConvert || dataToConvert.length === 0) return '';
    const headers = Object.keys(dataToConvert[0]);
    const csvRows = [
      headers.join(','), // header row
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
          <CardDescription>Download or email your scraped data in various formats.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Button variant="outline" size="lg" className="flex-col h-24 relative overflow-hidden group" onClick={() => handlePremiumExport('PDF')}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
              <Gem className="h-3 w-3" />
              <span>PREMIUM</span>
            </div>
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <span className="font-semibold">Export as PDF</span>
            <span className="text-xs text-muted-foreground">Full, formatted report</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24 relative overflow-hidden group" onClick={() => handlePremiumExport('Excel')}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                <Gem className="h-3 w-3" />
                <span>PREMIUM</span>
            </div>
            <FileSpreadsheet className="h-8 w-8 mb-2 text-primary" />
            <span className="font-semibold">Export as Excel</span>
            <span className="text-xs text-muted-foreground">Multiple sheets, full data</span>
          </Button>
        </CardContent>
      </Card>
      <PaymentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        feature={premiumFeature}
      />
    </>
  );
}
