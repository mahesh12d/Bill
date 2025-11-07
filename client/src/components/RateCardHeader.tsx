import { Zap } from "lucide-react";

export default function RateCardHeader() {
  return (
    <div className="border-b py-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-md">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-company-name">
            Mahesh Electrical Engineers
          </h1>
        </div>
      </div>
      <p className="text-sm text-muted-foreground ml-[52px]" data-testid="text-subtitle">
        Standard Rate Format (2025)
      </p>
    </div>
  );
}
