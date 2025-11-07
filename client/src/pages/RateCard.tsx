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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Printer, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RateCardHeader from "@/components/RateCardHeader";
import RateCardTable from "@/components/RateCardTable";
import RateCardNotes from "@/components/RateCardNotes";

interface RateCardItem {
  id: number;
  srNo: number;
  description: string;
  laborWork: string;
  materialSpecs: string;
  rateWithMaterial: string;
  displayOrder: number;
}

export default function RateCard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<RateCardItem | null>(null);
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    srNo: 0,
    description: "",
    laborWork: "",
    materialSpecs: "",
    rateWithMaterial: "",
    displayOrder: 0,
  });

  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<RateCardItem[]>({
    queryKey: ["/api/rate-card"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/rate-card", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: "Rate card item created",
        description: "The item has been added to the rate card.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/rate-card/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      setEditItem(null);
      setIsFormOpen(false);
      resetForm();
      toast({
        title: "Rate card item updated",
        description: "The item has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/rate-card/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      setDeleteConfirm(null);
      toast({
        title: "Rate card item deleted",
        description: "The item has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      srNo: 0,
      description: "",
      laborWork: "",
      materialSpecs: "",
      rateWithMaterial: "",
      displayOrder: 0,
    });
  };

  const handleCreate = () => {
    resetForm();
    setEditItem(null);
    setFormData({
      srNo: (items?.length || 0) + 1,
      description: "",
      laborWork: "",
      materialSpecs: "",
      rateWithMaterial: "",
      displayOrder: (items?.length || 0) + 1,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: RateCardItem) => {
    setEditItem(item);
    setFormData({
      srNo: item.srNo,
      description: item.description,
      laborWork: item.laborWork,
      materialSpecs: item.materialSpecs,
      rateWithMaterial: item.rateWithMaterial,
      displayOrder: item.displayOrder,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.laborWork || !formData.materialSpecs || !formData.rateWithMaterial) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading rate card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Rate Card Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your electrical services pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPrintPreview(true)}
            className="gap-2"
            data-testid="button-preview"
          >
            <Eye className="w-4 h-4" />
            Preview & Print
          </Button>
          <Button onClick={handleCreate} className="gap-2" data-testid="button-create">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Card Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-20">Sr. No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32">Labor Work</TableHead>
                  <TableHead className="w-48">Material Specs</TableHead>
                  <TableHead className="w-40">Rate with Material</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No rate card items found. Click "Add Item" to create your first entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                      <TableCell className="font-medium">{item.srNo}</TableCell>
                      <TableCell className="max-w-md">{item.description}</TableCell>
                      <TableCell>{item.laborWork}</TableCell>
                      <TableCell className="text-sm">{item.materialSpecs}</TableCell>
                      <TableCell className="font-semibold">{item.rateWithMaterial}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(item.id)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) {
          setEditItem(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-form-title">
              {editItem ? "Edit Rate Card Item" : "Add New Rate Card Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="srNo">Sr. No.</Label>
                <Input
                  id="srNo"
                  type="number"
                  value={formData.srNo}
                  onChange={(e) => setFormData({ ...formData, srNo: parseInt(e.target.value) || 0 })}
                  required
                  data-testid="input-sr-no"
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  required
                  data-testid="input-display-order"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                placeholder="e.g., Standard Lighting/Fan Point Fitting & Wiring"
                data-testid="input-description"
              />
            </div>
            <div>
              <Label htmlFor="laborWork">Labor Work (Per Point)</Label>
              <Input
                id="laborWork"
                value={formData.laborWork}
                onChange={(e) => setFormData({ ...formData, laborWork: e.target.value })}
                required
                placeholder="e.g., ₹250 or -"
                data-testid="input-labor-work"
              />
            </div>
            <div>
              <Label htmlFor="materialSpecs">Material Specifications</Label>
              <Textarea
                id="materialSpecs"
                value={formData.materialSpecs}
                onChange={(e) => setFormData({ ...formData, materialSpecs: e.target.value })}
                required
                rows={2}
                placeholder="e.g., Vinay Adora Switches, Polycab/Patel Wires/Cables"
                data-testid="input-material-specs"
              />
            </div>
            <div>
              <Label htmlFor="rateWithMaterial">Rate with Material (Per Point)</Label>
              <Input
                id="rateWithMaterial"
                value={formData.rateWithMaterial}
                onChange={(e) => setFormData({ ...formData, rateWithMaterial: e.target.value })}
                required
                placeholder="e.g., ₹750 or -"
                data-testid="input-rate-with-material"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editItem ? (
                  "Update Item"
                ) : (
                  "Create Item"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={isPrintPreview} onOpenChange={setIsPrintPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Rate Card Preview</DialogTitle>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6" id="print-preview">
            <RateCardHeader />
            <RateCardTable items={items} />
            <RateCardNotes />
            <footer className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>Mahesh Electrical Engineers - Quality Electrical Solutions</p>
            </footer>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this rate card item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
