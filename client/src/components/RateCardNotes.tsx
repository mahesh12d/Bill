import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RateCardNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Notes on Materials & Scope:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2" data-testid="text-note-heading-materials">
            Material Basis:
          </h3>
          <p className="text-sm text-muted-foreground">
            Material brands (Vinay Adora for switches/sockets, Polycab/Patel for cables/wires) are based on standard quality. Equivalent brands may be substituted with client approval.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2" data-testid="text-note-heading-warranty">
            Warranty:
          </h3>
          <p className="text-sm text-muted-foreground">
            Labor work is typically covered under a standard warranty period, subject to normal wear and tear. Material warranty as per manufacturer specifications.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2" data-testid="text-note-heading-exclusions">
            Exclusions:
          </h3>
          <p className="text-sm text-muted-foreground">
            Rates do not include civil work (cutting/patching), or major fan fixtures (unless specified). Distribution Board rates are quoted separately based on load.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2" data-testid="text-note-heading-gst">
            GST:
          </h3>
          <p className="text-sm text-muted-foreground">
            All rates are exclusive of GST (@ Servicetax) which will be added as applicable.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
