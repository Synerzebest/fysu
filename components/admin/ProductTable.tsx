"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { ProductType } from "@/types/product";

type ProductTableProps = {
  products: ProductType[];
  loading: boolean;
  editing: ProductType | null;
  setEditing: (p: ProductType | null) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ProductTable({
  products,
  loading,
  editing,
  setEditing,
  handleDelete,
  handleUpdate,
}: ProductTableProps) {
  return (
    <div className="p-4 sm:p-6 relative top-24">
      <h1 className="text-2xl font-bold mb-6">Catalogue produits</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {/* --- Table Desktop --- */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Prix (€)</th>
                  <th className="p-3">Ajouté le</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <img
                        src={p.product_images?.[0]?.url}
                        alt={p.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3">{p.price.toFixed(2)} €</td>
                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(p)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Cards Mobile --- */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 flex gap-4 items-center"
              >
                <img
                  src={p.product_images?.[0]?.url}
                  alt={p.name}
                  className="w-20 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.category} • {p.gender}
                  </p>
                  <p className="text-sm font-medium">{p.price.toFixed(2)} €</p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(p)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- Modal Edition --- */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg w-[90%] sm:w-full">
          <DialogHeader>
            <DialogTitle>Modifier un produit</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <Label>Nom</Label>
                <Input name="name" defaultValue={editing.name} />
              </div>
              <div>
                <Label>Description</Label>
                <Input name="description" defaultValue={editing.description} />
              </div>
              <div>
                <Label>Détails</Label>
                <Input name="details" defaultValue={editing.details} />
              </div>
              <div>
                <Label>Size Fit</Label>
                <Input name="size_fit" defaultValue={editing.size_fit} />
              </div>
              <div>
                <Label>Prix</Label>
                <Input type="number" name="price" defaultValue={editing.price} />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Input name="category" defaultValue={editing.category} />
              </div>
              <div>
                <Label>Genre</Label>
                <Input name="gender" defaultValue={editing.gender} />
              </div>
              <DialogFooter>
                <Button type="submit">Mettre à jour</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
