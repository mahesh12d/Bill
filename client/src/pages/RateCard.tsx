import RateCardHeader from "@/components/RateCardHeader";
import RateCardTable from "@/components/RateCardTable";
import RateCardNotes from "@/components/RateCardNotes";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import type { RateItem } from "@/components/RateCardTable";
import { useQuery } from "@tanstack/react-query";

export default function RateCard() {
  const { data: rateItems, isLoading, error } = useQuery<RateItem[]>({
    queryKey: ["/api/rate-card"],
    queryFn: async () => {
      const response = await fetch("/api/rate-card");
      if (!response.ok) {
        throw new Error("Failed to fetch rate card items");
      }
      return response.json();
    },
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading rate card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading rate card</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <RateCardHeader />
          <Button
            onClick={handlePrint}
            variant="outline"
            size="default"
            className="print:hidden flex items-center gap-2"
            data-testid="button-print"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        <RateCardTable items={rateItems || []} />

        <RateCardNotes />

        <footer className="text-center text-sm text-muted-foreground pt-4 border-t print:block">
          <p data-testid="text-footer">
            Mahesh Electrical Engineers - Quality Electrical Solutions
          </p>
        </footer>
      </div>

      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
