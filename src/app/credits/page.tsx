import Header from "@/components/custom/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";
import Link from "next/link";

export default function CreditsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-lg border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="text-primary" />
                Premium Features & Credits
              </CardTitle>
              <CardDescription>
                Unlock powerful features to supercharge your data extraction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SiteScoop offers advanced exporting options like PDF and Excel for our premium users. These features allow for beautifully formatted reports and deeper data analysis.
              </p>
              <p>
                Currently, premium features can be unlocked on a per-use basis directly from the results page. We are working on a credit-based system to provide more flexibility and value in the future.
              </p>
              <div className="pt-4">
                <Link href="/" passHref>
                  <Button className="w-full">
                    Start a New Scrape
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
