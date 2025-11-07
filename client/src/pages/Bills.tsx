import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Eye, Printer, Trash2 } from "lucide-react";
import BillForm from "@/components/BillForm";
import BillPrint from "@/components/BillPrint";
import { useToast } from "@/hooks/use-toast";
import type { Bill } from "@shared/schema";

export default function Bills() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: nextBillData } = useQuery<{ billNo: string }>({
    queryKey: ["/api/bills-next-number"],
  });

  const createBillMutation = useMutation({
    mutationFn: async (billData: any) => {
      return await apiRequest("POST", "/api/bills", billData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bills-next-number"] });
      setIsFormOpen(false);
      toast({
        title: "Bill created successfully",
        description: "The bill has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/bills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      setEditBill(null);
      toast({
        title: "Bill updated successfully",
        description: "The bill has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteBillMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/bills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      setDeleteConfirm(null);
      toast({
        title: "Bill deleted",
        description: "The bill has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBill = (billData: any) => {
    createBillMutation.mutate(billData);
  };

  const handleUpdateBill = (billData: any) => {
    if (editBill) {
      updateBillMutation.mutate({ id: editBill.id, data: billData });
    }
  };

  const handlePrintBill = (bill: Bill) => {
    setViewBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDeleteBill = (id: string) => {
    deleteBillMutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Bills Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage customer bills
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="print:hidden"
          data-testid="button-create-bill"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Bill
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading bills...</p>
          </CardContent>
        </Card>
      ) : bills.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No bills created yet</p>
            <Button onClick={() => setIsFormOpen(true)} data-testid="button-create-first-bill">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Bill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.id} data-testid={`row-bill-${bill.billNo}`}>
                      <TableCell className="font-medium">{bill.billNo}</TableCell>
                      <TableCell>
                        {new Date(bill.date).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{bill.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewBill(bill)}
                            data-testid={`button-view-${bill.billNo}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditBill(bill)}
                            data-testid={`button-edit-${bill.billNo}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrintBill(bill)}
                            data-testid={`button-print-${bill.billNo}`}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(bill.id)}
                            data-testid={`button-delete-${bill.billNo}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Bill Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Bill</DialogTitle>
          </DialogHeader>
          <BillForm
            initialData={{
              billNo: nextBillData?.billNo || "1",
              date: new Date().toISOString().split("T")[0],
              customerName: "",
              lineItems: [],
            }}
            onSubmit={handleCreateBill}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Bill Dialog */}
      {editBill && (
        <Dialog open={!!editBill} onOpenChange={() => setEditBill(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Bill #{editBill.billNo}</DialogTitle>
            </DialogHeader>
            <BillForm
              initialData={{
                billNo: editBill.billNo,
                date: editBill.date,
                customerName: editBill.customerName,
                lineItems: editBill.lineItems,
              }}
              onSubmit={handleUpdateBill}
              onCancel={() => setEditBill(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View/Print Bill Dialog */}
      {viewBill && (
        <Dialog open={!!viewBill} onOpenChange={() => setViewBill(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bill #{viewBill.billNo}</DialogTitle>
            </DialogHeader>
            <BillPrint bill={viewBill} />
            <div className="flex justify-end gap-2 mt-4 print:hidden">
              <Button
                variant="outline"
                onClick={() => setViewBill(null)}
                data-testid="button-close-preview"
              >
                Close
              </Button>
              <Button
                onClick={() => handlePrintBill(viewBill)}
                data-testid="button-print-preview"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteBill(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden print view */}
      {viewBill && (
        <div className="hidden print:block">
          <BillPrint bill={viewBill} />
        </div>
      )}
    </div>
  );
}
