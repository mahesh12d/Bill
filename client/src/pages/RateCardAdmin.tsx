import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RateItem } from "@/components/RateCardTable";

interface RateItemWithId extends RateItem {
  id: number;
}

export default function RateCardAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RateItemWithId | null>(null);
  const [formData, setFormData] = useState({
    srNo: 0,
    description: "",
    laborWork: "",
    materialSpecs: "",
    rateWithMaterial: "",
    displayOrder: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<RateItemWithId[]>({
    queryKey: ["/api/rate-card"],
    queryFn: async () => {
      const response = await fetch("/api/rate-card");
      if (!response.ok) throw new Error("Failed to fetch rate card items");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/rate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Rate card item created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const response = await fetch(`/api/rate-card/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingItem(null);
      toast({ title: "Success", description: "Rate card item updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/rate-card/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-card"] });
      toast({ title: "Success", description: "Rate card item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: RateItemWithId) => {
    setEditingItem(item);
    setFormData({
      srNo: item.srNo,
      description: item.description,
      laborWork: item.laborWork,
      materialSpecs: item.materialSpecs,
      rateWithMaterial: item.rateWithMaterial,
      displayOrder: item.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingItem(null);
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Rate Card</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, or remove rate card items
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Rate Card Item" : "Add New Rate Card Item"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the rate card item
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="srNo">Sr. No.</Label>
                  <Input
                    id="srNo"
                    type="number"
                    value={formData.srNo}
                    onChange={(e) =>
                      setFormData({ ...formData, srNo: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="laborWork">Labor Work (Per Point)</Label>
                <Input
                  id="laborWork"
                  value={formData.laborWork}
                  onChange={(e) =>
                    setFormData({ ...formData, laborWork: e.target.value })
                  }
                  placeholder="e.g., ₹250 or -"
                  required
                />
              </div>
              <div>
                <Label htmlFor="materialSpecs">Material Specs</Label>
                <Textarea
                  id="materialSpecs"
                  value={formData.materialSpecs}
                  onChange={(e) =>
                    setFormData({ ...formData, materialSpecs: e.target.value })
                  }
                  required
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="rateWithMaterial">
                  Rate with Material (Per Point)
                </Label>
                <Input
                  id="rateWithMaterial"
                  value={formData.rateWithMaterial}
                  onChange={(e) =>
                    setFormData({ ...formData, rateWithMaterial: e.target.value })
                  }
                  placeholder="e.g., ₹750 or -"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Labor</TableHead>
              <TableHead>Material Specs</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.srNo}</TableCell>
                <TableCell className="max-w-md truncate">{item.description}</TableCell>
                <TableCell>{item.laborWork}</TableCell>
                <TableCell className="max-w-xs truncate">{item.materialSpecs}</TableCell>
                <TableCell>{item.rateWithMaterial}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
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
    </div>
  );
}
