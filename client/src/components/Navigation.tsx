import { Link, useLocation } from "wouter";
import { Zap, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  return (
    <header className="border-b bg-card print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 bg-transparent border-0 cursor-pointer"
            data-testid="link-home"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-foreground text-left">Mahesh Electrical</div>
              <div className="text-xs text-muted-foreground text-left">Engineers</div>
            </div>
          </button>

          <nav className="flex items-center gap-2">
            <Button
              variant={location === "/rate-card" || location === "/" ? "default" : "ghost"}
              size="default"
              className="gap-2"
              onClick={() => setLocation("/rate-card")}
              data-testid="link-rate-card"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Rate Card</span>
            </Button>
            <Button
              variant={location === "/bills" ? "default" : "ghost"}
              size="default"
              className="gap-2"
              onClick={() => setLocation("/bills")}
              data-testid="link-bills"
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Bills</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
