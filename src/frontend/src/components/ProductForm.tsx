import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateProduct, useUpdateProduct } from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";
import type { Product } from "../types";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export default function ProductForm({
  open,
  onOpenChange,
  product,
}: ProductFormProps) {
  const isEdit = !!product;
  const storageClient = useStorageClient();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceStr, setPriceStr] = useState(
    product ? (Number(product.price) / 100).toFixed(2) : "",
  );
  const [stockStr, setStockStr] = useState(
    product ? product.stock.toString() : "",
  );
  const [imageId, setImageId] = useState(product?.imageId ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = (p?: Product | null) => {
    setName(p?.name ?? "");
    setDescription(p?.description ?? "");
    setPriceStr(p ? (Number(p.price) / 100).toFixed(2) : "");
    setStockStr(p ? p.stock.toString() : "");
    setImageId(p?.imageId ?? "");
    setUploadProgress(0);
  };

  const handleOpen = (v: boolean) => {
    if (v) resetForm(product);
    onOpenChange(v);
  };

  const handleImageUpload = async (file: File) => {
    if (!storageClient) {
      toast.error("Storage not ready");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setUploadProgress(pct),
      );
      setImageId(hash);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = BigInt(Math.round(Number.parseFloat(priceStr) * 100));
    const stock = BigInt(Number.parseInt(stockStr, 10));

    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name,
          description,
          price,
          stock,
          imageId,
        });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync({
          name,
          description,
          price,
          stock,
          imageId,
        });
        toast.success("Product created!");
      }
      onOpenChange(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  const triggerFileInput = () => fileRef.current?.click();

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent data-ocid="product_form.dialog" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pf-name">Name *</Label>
            <Input
              id="pf-name"
              data-ocid="product_form.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-desc">Description</Label>
            <Textarea
              id="pf-desc"
              data-ocid="product_form.textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-price">Price (USD) *</Label>
              <Input
                id="pf-price"
                data-ocid="product_form.input"
                type="number"
                step="0.01"
                min="0"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-stock">Stock *</Label>
              <Input
                id="pf-stock"
                data-ocid="product_form.input"
                type="number"
                min="0"
                step="1"
                value={stockStr}
                onChange={(e) => setStockStr(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <button
              type="button"
              data-ocid="product_form.dropzone"
              className="w-full border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={triggerFileInput}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleImageUpload(file);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {uploading ? (
                <div
                  data-ocid="product_form.loading_state"
                  className="flex flex-col items-center gap-2"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </span>
                </div>
              ) : imageId ? (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground break-all">
                    Image uploaded ✓
                  </span>
                  <span className="text-xs text-muted-foreground font-mono truncate max-w-full">
                    {imageId.slice(0, 30)}...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click or drag image here
                  </span>
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="product_form.cancel_button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="product_form.submit_button"
              className="bg-primary text-primary-foreground"
              disabled={isPending || uploading}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
