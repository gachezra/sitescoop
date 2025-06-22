'use client';

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProgressIndicatorProps = {
  progress: number;
  message: string;
};

export default function ProgressIndicator({ progress, message }: ProgressIndicatorProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle>Scraping in Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
            <Progress value={progress} className="w-full h-3" />
            <span className="text-lg font-semibold tabular-nums">{Math.round(progress)}%</span>
        </div>
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
}
