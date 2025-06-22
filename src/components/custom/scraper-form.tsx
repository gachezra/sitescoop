'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Zap, Shield,Gauge, FileText, Link, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  contentType: z.enum(['text', 'links', 'images'], { required_error: "Please select a content type."}),
});

type ScraperFormProps = {
  onScrape: (values: z.infer<typeof formSchema>) => void;
  isScraping: boolean;
};

export default function ScraperForm({ onScrape, isScraping }: ScraperFormProps) {
  const [scrapedCount, setScrapedCount] = useState(12345);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrapedCount(prev => prev + Math.floor(Math.random() * 5 + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      contentType: "text",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onScrape(values);
  }

  return (
    <div className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl p-6 md:p-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Extract Any Content in Seconds
      </h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        No registration required. Just enter a URL, choose what to extract, and get the raw data you need.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="sr-only">URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        className="pl-10 h-12 text-lg"
                        disabled={isScraping}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isScraping}>
                        <FormControl>
                            <SelectTrigger className="h-12 text-lg">
                                <SelectValue placeholder="Select content type..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="text"><FileText className="inline-block mr-2 h-4 w-4" />All Text</SelectItem>
                            <SelectItem value="links"><Link className="inline-block mr-2 h-4 w-4" />All Links</SelectItem>
                            <SelectItem value="images"><Image className="inline-block mr-2 h-4 w-4" />All Images</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-lg" disabled={isScraping}>
            {isScraping ? 'Extracting...' : 'Extract Now'}
            {!isScraping && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </Form>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-accent" />
              <div>
                  <p className="font-semibold">Fast</p>
                  <p className="text-sm text-muted-foreground">Quick results</p>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-accent" />
              <div>
                  <p className="font-semibold">Secure</p>
                  <p className="text-sm text-muted-foreground">Privacy focused</p>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <Gauge className="h-6 w-6 text-accent" />
              <div>
                  <p className="font-semibold">Sites Today</p>
                  <p className="text-sm text-muted-foreground">{scrapedCount.toLocaleString()}</p>
              </div>
          </div>
           <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M16.24 7.76A6 6 0 0 0 7.76 16.24"/><path d="M12 18a6 6 0 0 1-6-6"/></svg>
              <div>
                  <p className="font-semibold">No Signup</p>
                  <p className="text-sm text-muted-foreground">Start instantly</p>
              </div>
          </div>
      </div>
    </div>
  );
}
