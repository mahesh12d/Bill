import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface RateItem {
  srNo: number;
  description: string;
  laborWork: string;
  materialSpecs: string;
  rateWithMaterial: string;
}

interface RateCardTableProps {
  items: RateItem[];
}

export default function RateCardTable({ items }: RateCardTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-primary-foreground font-semibold w-20">
              Sr. No.
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold">
              Description
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold w-40">
              Labor Work (Per Point)
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold">
              Material Specs
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold w-48">
              Rate with Material (Per Point)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.srNo}
              className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}
              data-testid={`row-service-${item.srNo}`}
            >
              <TableCell className="font-medium text-center" data-testid={`text-srno-${item.srNo}`}>
                {item.srNo}
              </TableCell>
              <TableCell data-testid={`text-description-${item.srNo}`}>
                {item.description}
              </TableCell>
              <TableCell className="text-center" data-testid={`text-labor-${item.srNo}`}>
                {item.laborWork}
              </TableCell>
              <TableCell data-testid={`text-materials-${item.srNo}`}>
                {item.materialSpecs}
              </TableCell>
              <TableCell className="font-semibold text-center" data-testid={`text-rate-${item.srNo}`}>
                {item.rateWithMaterial}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
