import { useState, useMemo } from "react";
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
import { Plus, Trash2, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RateCard, RateCardItem } from "@shared/schema";

export default function RateCards() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRateCardId, setSelectedRateCardId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newRateCardName, setNewRateCardName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<RateCardItem | null>(null);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    srNo: 0,
    description: "",
    laborWork: "",
    materialSpecs: "",
    rateWithMaterial: "",
    displayOrder: 0,
  });

  const { toast } = useToast();

  const { data: rateCards = [], isLoading } = useQuery<RateCard[]>({
    queryKey: ["/api/rate-cards"],
  });

  const selectedRateCard = useMemo(
    () => rateCards.find((card) => card.id === selectedRateCardId) || null,
    [rateCards, selectedRateCardId]
  );

  const createRateCardMutation = useMutation({
    mutationFn: async (name: string) => {
      const today = new Date().toISOString().split("T")[0];
      return await apiRequest("POST", "/api/rate-cards", {
        name,
        createdDate: today,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-cards"] });
      setIsCreateDialogOpen(false);
      setNewRateCardName("");
      toast({
        title: "Rate card created",
        description: "A new rate card has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create rate card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteRateCardMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/rate-cards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-cards"] });
      if (selectedRateCardId === deleteConfirm) {
        setSelectedRateCardId(null);
      }
      setDeleteConfirm(null);
      toast({
        title: "Rate card deleted",
        description: "The rate card has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete rate card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!selectedRateCard) throw new Error("No rate card selected");
      return await apiRequest("POST", `/api/rate-cards/${selectedRateCard.id}/items`, {
        ...data,
        rateCardId: selectedRateCard.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-cards"] });
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

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      if (!selectedRateCard) throw new Error("No rate card selected");
      return await apiRequest("PUT", `/api/rate-cards/${selectedRateCard.id}/items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-cards"] });
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

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!selectedRateCard) throw new Error("No rate card selected");
      return await apiRequest("DELETE", `/api/rate-cards/${selectedRateCard.id}/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rate-cards"] });
      setDeleteItemConfirm(null);
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

  const handleCreateRateCard = () => {
    if (newRateCardName.trim()) {
      createRateCardMutation.mutate(newRateCardName.trim());
    }
  };

  const handleOpenCreateItemForm = () => {
    resetForm();
    setEditItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditItemForm = (item: RateCardItem) => {
    setFormData({
      srNo: item.srNo,
      description: item.description,
      laborWork: item.laborWork,
      materialSpecs: item.materialSpecs,
      rateWithMaterial: item.rateWithMaterial,
      displayOrder: item.displayOrder,
    });
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleSubmitForm = () => {
    if (editItem) {
      updateItemMutation.mutate({ id: editItem.id, data: formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  if (selectedRateCard) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedRateCardId(null)}
              className="mb-2"
              data-testid="button-back-to-list"
            >
              ← Back to Rate Cards
            </Button>
            <h1 className="text-3xl font-semibold" data-testid="text-rate-card-name">
              {selectedRateCard.name}
            </h1>
            <p className="text-muted-foreground">
              Manage items in this rate card
            </p>
          </div>
          <Button
            onClick={handleOpenCreateItemForm}
            data-testid="button-add-item"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rate Card Items</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRateCard.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No items in this rate card yet</p>
                <Button onClick={handleOpenCreateItemForm} data-testid="button-add-first-item">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr. No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Labor Work</TableHead>
                    <TableHead>Material Specs</TableHead>
                    <TableHead>Rate with Material</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRateCard.items
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((item) => (
                    <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                      <TableCell data-testid={`text-srno-${item.id}`}>{item.srNo}</TableCell>
                      <TableCell data-testid={`text-description-${item.id}`}>{item.description}</TableCell>
                      <TableCell data-testid={`text-labor-${item.id}`}>{item.laborWork}</TableCell>
                      <TableCell data-testid={`text-materials-${item.id}`}>{item.materialSpecs}</TableCell>
                      <TableCell data-testid={`text-rate-${item.id}`}>{item.rateWithMaterial}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenEditItemForm(item)}
                            data-testid={`button-edit-item-${item.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteItemConfirm(item.id)}
                            data-testid={`button-delete-item-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit" : "Add"} Rate Card Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="srNo">Sr. No.</Label>
                  <Input
                    id="srNo"
                    type="number"
                    value={formData.srNo}
                    onChange={(e) => setFormData({ ...formData, srNo: parseInt(e.target.value) })}
                    data-testid="input-srno"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    data-testid="input-display-order"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-description"
                />
              </div>
              <div>
                <Label htmlFor="laborWork">Labor Work</Label>
                <Input
                  id="laborWork"
                  value={formData.laborWork}
                  onChange={(e) => setFormData({ ...formData, laborWork: e.target.value })}
                  data-testid="input-labor-work"
                />
              </div>
              <div>
                <Label htmlFor="materialSpecs">Material Specs</Label>
                <Input
                  id="materialSpecs"
                  value={formData.materialSpecs}
                  onChange={(e) => setFormData({ ...formData, materialSpecs: e.target.value })}
                  data-testid="input-material-specs"
                />
              </div>
              <div>
                <Label htmlFor="rateWithMaterial">Rate with Material</Label>
                <Input
                  id="rateWithMaterial"
                  value={formData.rateWithMaterial}
                  onChange={(e) => setFormData({ ...formData, rateWithMaterial: e.target.value })}
                  data-testid="input-rate"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  data-testid="button-cancel-item"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitForm}
                  data-testid="button-save-item"
                >
                  {editItem ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteItemConfirm !== null} onOpenChange={() => setDeleteItemConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete-item">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteItemConfirm && deleteItemMutation.mutate(deleteItemConfirm)}
                data-testid="button-confirm-delete-item"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Rate Card Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage electrical services rate cards
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          data-testid="button-create-rate-card"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Rate Card
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading rate cards...</p>
          </CardContent>
        </Card>
      ) : rateCards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No rate cards created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-rate-card">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Rate Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Rate Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateCards.map((rateCard) => (
                  <TableRow key={rateCard.id} data-testid={`row-rate-card-${rateCard.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${rateCard.id}`}>
                      {rateCard.name}
                    </TableCell>
                    <TableCell data-testid={`text-date-${rateCard.id}`}>
                      {rateCard.createdDate}
                    </TableCell>
                    <TableCell data-testid={`text-count-${rateCard.id}`}>
                      {rateCard.items.length} items
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedRateCardId(rateCard.id)}
                          data-testid={`button-view-${rateCard.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(rateCard.id)}
                          data-testid={`button-delete-${rateCard.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Rate Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ratecardName">Rate Card Name</Label>
              <Input
                id="ratecardName"
                placeholder="e.g., Standard Rate Format 2025"
                value={newRateCardName}
                onChange={(e) => setNewRateCardName(e.target.value)}
                data-testid="input-rate-card-name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                data-testid="button-cancel-create"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRateCard}
                disabled={!newRateCardName.trim()}
                data-testid="button-submit-create"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rate Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rate card and all its items? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deleteRateCardMutation.mutate(deleteConfirm)}
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
