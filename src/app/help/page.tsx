import Header from "@/components/custom/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I start scraping a website?",
      answer: "Simply paste the URL of the website you want to scrape into the input field on the homepage and click 'Scrape Now'. Our AI will analyze the page and suggest CSS selectors for you."
    },
    {
      question: "What are CSS selectors?",
      answer: "CSS selectors are patterns used to select elements on a webpage. In SiteScoop, we use them to identify the exact data you want to extract (e.g., product names, prices)."
    },
    {
      question: "Can I edit the AI-suggested selectors?",
      answer: "Yes! After the AI suggests selectors, you will be presented with a form where you can review and edit each selector to ensure accuracy before the final scrape."
    },
    {
      question: "What if the scraper doesn't find any data?",
      answer: "This can happen if the selectors are incorrect or the website structure is complex. You'll get an error message with an option to go back and adjust the selectors. Try to find a common parent 'container' for the items you want to scrape, and then find selectors for individual fields relative to that container."
    },
    {
        question: "What formats can I export data in?",
        answer: "You can download your data as a CSV for free. We also offer premium export options like formatted PDF reports and multi-sheet Excel files, which can be unlocked from the results page."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="text-primary" />
                Help & FAQ
              </CardTitle>
              <CardDescription>
                Find answers to common questions about using SiteScoop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
