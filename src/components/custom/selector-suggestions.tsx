'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type SelectorSuggestionsProps = {
  selectors: string[];
};

export default function SelectorSuggestions({ selectors }: SelectorSuggestionsProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle>AI Selector Suggestions</CardTitle>
        <CardDescription>Our AI has identified these CSS selectors to extract data.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {selectors.map((selector, index) => (
            <li key={index} className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <code className="text-sm text-foreground font-mono">{selector}</code>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
