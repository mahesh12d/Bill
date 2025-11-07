import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function RateCardAdmin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the main rate card page which now has management features
    setLocation("/rate-card");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Redirecting to Rate Card Management...</p>
      </div>
    </div>
  );
}
