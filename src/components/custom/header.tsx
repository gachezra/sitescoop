import { Rocket, LifeBuoy, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
                    <Rocket className="w-7 h-7 text-primary" />
                    <h1 className="text-2xl font-bold">SiteScoop</h1>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/credits" passHref>
                        <Button variant="ghost" size="sm">
                            <Gem className="mr-2 h-4 w-4" />
                            Credits
                        </Button>
                    </Link>
                    <Link href="/help" passHref>
                        <Button variant="ghost" size="sm">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Help
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </header>
  );
}
