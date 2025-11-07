import RateCardHeader from "@/components/RateCardHeader";
import RateCardTable from "@/components/RateCardTable";
import RateCardNotes from "@/components/RateCardNotes";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { RateItem } from "@/components/RateCardTable";

const rateItems: RateItem[] = [
  {
    srNo: 1,
    description: "Standard Lighting/Fan Point Fitting & Wiring (Tube Light, Fan, Light Point)",
    laborWork: "₹250",
    materialSpecs: "Vinay Adora Switches, Polycab/Patel Wires/Cables",
    rateWithMaterial: "₹750",
  },
  {
    srNo: 2,
    description: "Computer/Power Board Wiring Point (1 Point)",
    laborWork: "₹200",
    materialSpecs: "Vinay Adora Switches, Polycab/Patel Wires/Cables",
    rateWithMaterial: "₹600",
  },
  {
    srNo: 3,
    description: "A.C. (Air Conditioner) Power Point",
    laborWork: "₹300",
    materialSpecs: "Heavy Duty Wire/Socket, MCB",
    rateWithMaterial: "₹900",
  },
  {
    srNo: 4,
    description: "Ceiling Fan Fitting (Labor Only)",
    laborWork: "₹150",
    materialSpecs: "-",
    rateWithMaterial: "-",
  },
  {
    srNo: 5,
    description: "Ceiling Fan Fitting with Dimmer (Supply & Install)",
    laborWork: "-",
    materialSpecs: "Supply of Standard Dimmer/Regulator",
    rateWithMaterial: "₹500",
  },
  {
    srNo: 6,
    description: "Fan Down Hook/J-Hook Fitting (Supply & Install)",
    laborWork: "-",
    materialSpecs: "Supply of Standard J-Hook/Down Rod Set",
    rateWithMaterial: "₹250",
  },
  {
    srNo: 7,
    description: "Dome/LED Light Fitting (Labor Only)",
    laborWork: "₹100",
    materialSpecs: "-",
    rateWithMaterial: "-",
  },
  {
    srNo: 8,
    description: "Distribution Board (DB) Point/Wiring",
    laborWork: "Quoted Separately",
    materialSpecs: "Based on Circuit Load & Size",
    rateWithMaterial: "Quoted Separately",
  },
];

export default function RateCard() {
  const handlePrint = () => {
    window.print();
  };

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

        <RateCardTable items={rateItems} />

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
