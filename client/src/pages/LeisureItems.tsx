import { useQuery } from "@tanstack/react-query";
import type { LeisureItem } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeisureItems() {
  const { data: items, isLoading } = useQuery<LeisureItem[]>({
    queryKey: ["/api/leisure-items"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Leisure Format</CardTitle>
            <CardDescription>Loading service rates...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Leisure Format</CardTitle>
          <CardDescription>Standard electrical services rates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20" data-testid="header-sr-no">Sr. No</TableHead>
                <TableHead data-testid="header-description">Description</TableHead>
                <TableHead data-testid="header-labour-work">Labour Work</TableHead>
                <TableHead data-testid="header-material-specs">Material Specs</TableHead>
                <TableHead data-testid="header-rate">Rate with Material</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.id} data-testid={`row-leisure-item-${item.id}`}>
                  <TableCell data-testid={`text-sr-no-${item.id}`}>{item.srNo}</TableCell>
                  <TableCell data-testid={`text-description-${item.id}`}>{item.description}</TableCell>
                  <TableCell data-testid={`text-labour-work-${item.id}`}>{item.laborWork}</TableCell>
                  <TableCell data-testid={`text-material-specs-${item.id}`}>{item.materialSpecs}</TableCell>
                  <TableCell data-testid={`text-rate-${item.id}`}>{item.rateWithMaterial}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
