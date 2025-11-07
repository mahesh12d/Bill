import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { numberToWords } from "@/lib/numberToWords";
import type { BillLineItem } from "@shared/schema";

const formSchema = z.object({
  billNo: z.string().min(1, "Bill number is required"),
  date: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer name is required"),
});

interface BillFormProps {
  initialData?: {
    billNo: string;
    date: string;
    customerName: string;
    lineItems: BillLineItem[];
  };
  onSubmit: (data: {
    billNo: string;
    date: string;
    customerName: string;
    lineItems: BillLineItem[];
    total: number;
    amountInWords: string;
  }) => void;
  onCancel?: () => void;
}

const RATE_CARD_SERVICES = [
  { description: "Standard Lighting/Fan Point Fitting & Wiring", rate: 750 },
  { description: "Computer/Power Board Wiring Point", rate: 600 },
  { description: "A.C. (Air Conditioner) Power Point", rate: 900 },
  { description: "Ceiling Fan Fitting (Labor Only)", rate: 150 },
  { description: "Ceiling Fan Fitting with Dimmer", rate: 500 },
  { description: "Fan Down Hook/J-Hook Fitting", rate: 250 },
  { description: "Dome/LED Light Fitting (Labor Only)", rate: 100 },
  { description: "Custom Service", rate: 0 },
];

export default function BillForm({ initialData, onSubmit, onCancel }: BillFormProps) {
  const [lineItems, setLineItems] = useState<BillLineItem[]>(
    initialData?.lineItems || []
  );
  const [currentItem, setCurrentItem] = useState({
    description: "",
    qty: 1,
    rate: 0,
    customDescription: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      billNo: initialData?.billNo || "",
      date: initialData?.date || new Date().toISOString().split("T")[0],
      customerName: initialData?.customerName || "",
    },
  });

  // Sync line items and form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setLineItems(initialData.lineItems || []);
      form.reset({
        billNo: initialData.billNo || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        customerName: initialData.customerName || "",
      });
    }
  }, [initialData, form]);

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const amountInWords = numberToWords(total);

  const handleAddItem = () => {
    const description = currentItem.description === "Custom Service" 
      ? currentItem.customDescription 
      : currentItem.description;
    
    if (!description || currentItem.qty <= 0 || currentItem.rate <= 0) {
      return;
    }

    const newItem: BillLineItem = {
      srNo: lineItems.length + 1,
      description,
      qty: currentItem.qty,
      rate: currentItem.rate,
      amount: currentItem.qty * currentItem.rate,
    };

    setLineItems([...lineItems, newItem]);
    setCurrentItem({
      description: "",
      qty: 1,
      rate: 0,
      customDescription: "",
    });
  };

  const handleRemoveItem = (srNo: number) => {
    const updated = lineItems
      .filter((item) => item.srNo !== srNo)
      .map((item, index) => ({ ...item, srNo: index + 1 }));
    setLineItems(updated);
  };

  const handleServiceChange = (value: string) => {
    const service = RATE_CARD_SERVICES.find((s) => s.description === value);
    if (service) {
      setCurrentItem({
        ...currentItem,
        description: value,
        rate: service.rate,
      });
    }
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    if (lineItems.length === 0) {
      return;
    }

    onSubmit({
      ...values,
      lineItems,
      total,
      amountInWords,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bill Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="billNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill No.</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-bill-no" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-bill-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>M/s. (Customer Name)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-customer-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <Label>Service / Description</Label>
                <Select
                  value={currentItem.description}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder="Select service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {RATE_CARD_SERVICES.map((service) => (
                      <SelectItem key={service.description} value={service.description}>
                        {service.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentItem.description === "Custom Service" && (
                <div className="md:col-span-5">
                  <Label>Custom Description</Label>
                  <Input
                    value={currentItem.customDescription}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, customDescription: e.target.value })
                    }
                    placeholder="Enter custom description"
                    data-testid="input-custom-description"
                  />
                </div>
              )}

              <div className={currentItem.description === "Custom Service" ? "md:col-span-2" : "md:col-span-2"}>
                <Label>Qty</Label>
                <Input
                  type="number"
                  min="1"
                  value={currentItem.qty}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 1 })
                  }
                  data-testid="input-qty"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Rate (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={currentItem.rate}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, rate: parseFloat(e.target.value) || 0 })
                  }
                  data-testid="input-rate"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="text"
                  value={(currentItem.qty * currentItem.rate).toFixed(2)}
                  readOnly
                  className="bg-muted"
                  data-testid="text-item-amount"
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full"
                  data-testid="button-add-item"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {lineItems.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="w-16">Sr. No.</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24 text-center">Qty</TableHead>
                      <TableHead className="w-32 text-center">Rate (₹)</TableHead>
                      <TableHead className="w-32 text-center">Amount (₹)</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.srNo} data-testid={`row-item-${item.srNo}`}>
                        <TableCell className="text-center">{item.srNo}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{item.qty}</TableCell>
                        <TableCell className="text-center">{item.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.srNo)}
                            data-testid={`button-remove-${item.srNo}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted font-semibold">
                      <TableCell colSpan={4} className="text-right">
                        TOTAL
                      </TableCell>
                      <TableCell className="text-center" data-testid="text-total-amount">
                        ₹{total.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            {lineItems.length > 0 && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Amount in Words:</p>
                <p className="text-sm text-muted-foreground" data-testid="text-amount-words">
                  {amountInWords}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={lineItems.length === 0}
            data-testid="button-save-bill"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Bill
          </Button>
        </div>
      </form>
    </Form>
  );
}
