import { Rocket, LifeBuoy, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Rocket className="w-7 h-7 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">SiteScoop</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Gem className="mr-2 h-4 w-4" />
                        Credits
                    </Button>
                    <Button variant="ghost" size="sm">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Help
                    </Button>
                </div>
            </div>
        </div>
    </header>
  );
}
