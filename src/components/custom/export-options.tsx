'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, FileText, FileSpreadsheet, Gem } from "lucide-react";
import PaymentModal from './payment-modal';

export default function ExportOptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');

  const handlePremiumExport = (feature: 'PDF' | 'Excel') => {
    setPremiumFeature(feature);
    setIsModalOpen(true);
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
          <Button variant="outline" size="lg" className="flex-col h-24">
            <Download className="h-8 w-8 mb-2" />
            <span className="font-semibold">Download CSV</span>
            <span className="text-xs text-muted-foreground">First 100 rows</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-24">
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
