'use client';

import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectorMap } from '@/types';
import { Bot, Loader2 } from 'lucide-react';

type SelectorSuggestionsProps = {
  suggestions: SelectorMap;
  onConfirm: (data: SelectorMap) => void;
  isScraping: boolean;
};

export default function SelectorSuggestions({ suggestions, onConfirm, isScraping }: SelectorSuggestionsProps) {
  const { control, handleSubmit } = useForm<SelectorMap>({
    defaultValues: suggestions,
  });

  const onSubmit = (data: SelectorMap) => {
    onConfirm(data);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot /> AI Selector Suggestions</CardTitle>
        <CardDescription>Our AI has suggested these CSS selectors. You can review and edit them before scraping.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(suggestions).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Controller
                name={key as keyof SelectorMap}
                control={control}
                render={({ field }) => (
                  <Input id={key} {...field} disabled={isScraping} className="font-mono"/>
                )}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto" disabled={isScraping}>
            {isScraping ? (
                <>
                    <Loader2 className="animate-spin mr-2" /> Scraping...
                </>
            ) : "Scrape with these selectors" }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
