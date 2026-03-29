import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteProduct,
  useFulfillOrder,
  useIsAdmin,
  useOrders,
  useProducts,
} from "../hooks/useQueries";
import type { Product } from "../types";
import ProductForm from "./ProductForm";

interface AdminPanelProps {
  onNavigateStore: () => void;
}

export default function AdminPanel({ onNavigateStore }: AdminPanelProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: orders = [], isLoading: loadingOrders } = useOrders();
  const deleteProduct = useDeleteProduct();
  const fulfillOrder = useFulfillOrder();

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [secretToken, setSecretToken] = useState("");
  const [initializingAdmin, setInitializingAdmin] = useState(false);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleInitializeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !secretToken.trim()) return;
    setInitializingAdmin(true);
    try {
      await (actor as any)._initializeAccessControlWithSecret(secretToken);
      toast.success("Admin access initialized!");
    } catch {
      toast.error("Failed to initialize admin access");
    } finally {
      setInitializingAdmin(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleFulfillOrder = async (id: string) => {
    try {
      await fulfillOrder.mutateAsync(id);
      toast.success("Order marked as fulfilled");
    } catch {
      toast.error("Failed to fulfill order");
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            data-ocid="admin.link"
            variant="ghost"
            size="sm"
            onClick={onNavigateStore}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Button>
          <div className="w-px h-5 bg-border" />
          <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
        </div>
        {isLoggedIn ? (
          <Button
            data-ocid="admin.secondary_button"
            variant="outline"
            size="sm"
            onClick={clear}
          >
            Sign Out
          </Button>
        ) : null}
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="max-w-sm mx-auto mt-16 text-center space-y-4">
            <Package className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-xl font-bold">Admin Login</h2>
            <p className="text-muted-foreground text-sm">
              Sign in with Internet Identity to access the admin panel.
            </p>
            <Button
              data-ocid="admin.primary_button"
              className="w-full bg-primary text-primary-foreground"
              onClick={() => login()}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        )}

        {/* Logged in but checking admin */}
        {isLoggedIn && checkingAdmin && (
          <div
            data-ocid="admin.loading_state"
            className="flex items-center justify-center mt-16 gap-2 text-muted-foreground"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking permissions...</span>
          </div>
        )}

        {/* Logged in but NOT admin */}
        {isLoggedIn && !checkingAdmin && !isAdmin && (
          <div className="max-w-sm mx-auto mt-16 space-y-6">
            <div
              data-ocid="admin.error_state"
              className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center"
            >
              <p className="font-semibold text-destructive">Access Denied</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your account does not have admin privileges.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">First-time setup?</p>
              <p className="text-xs text-muted-foreground">
                Enter the admin secret token to initialize your account as
                admin.
              </p>
              <form onSubmit={handleInitializeAdmin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="secret-token">Secret Token</Label>
                  <Input
                    id="secret-token"
                    data-ocid="admin.input"
                    type="password"
                    value={secretToken}
                    onChange={(e) => setSecretToken(e.target.value)}
                    placeholder="Enter admin secret token"
                    required
                  />
                </div>
                <Button
                  data-ocid="admin.submit_button"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                  disabled={initializingAdmin}
                >
                  {initializingAdmin ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Initialize Admin Access"
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Admin dashboard */}
        {isLoggedIn && !checkingAdmin && isAdmin && (
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList
              data-ocid="admin.tab"
              className="grid w-full max-w-xs grid-cols-2"
            >
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Products tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Products ({products.length})
                </h2>
                <Button
                  data-ocid="admin.primary_button"
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={openAddForm}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {loadingProducts ? (
                <div
                  data-ocid="admin.loading_state"
                  className="flex items-center justify-center py-12 gap-2 text-muted-foreground"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div
                  data-ocid="admin.empty_state"
                  className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg"
                >
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No products yet</p>
                  <p className="text-sm">
                    Add your first product to get started
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, idx) => (
                        <TableRow
                          key={product.id}
                          data-ocid={`admin.row.${idx + 1}`}
                        >
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {product.description || "—"}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${(Number(product.price) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 0n ? "secondary" : "destructive"
                              }
                            >
                              {product.stock.toString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                data-ocid={`admin.edit_button.${idx + 1}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditForm(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    data-ocid={`admin.delete_button.${idx + 1}`}
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent data-ocid="admin.dialog">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete &quot;
                                      {product.name}&quot;. This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-ocid="admin.cancel_button">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      data-ocid="admin.confirm_button"
                                      className="bg-destructive text-destructive-foreground"
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Orders tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Orders ({orders.length})</h2>
              </div>

              {loadingOrders ? (
                <div
                  data-ocid="admin.loading_state"
                  className="flex items-center justify-center py-12 gap-2 text-muted-foreground"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div
                  data-ocid="admin.empty_state"
                  className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg"
                >
                  <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No orders yet</p>
                  <p className="text-sm">
                    Orders will appear here once customers purchase
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, idx) => (
                        <TableRow
                          key={order.id}
                          data-ocid={`admin.row.${idx + 1}`}
                        >
                          <TableCell className="font-medium">
                            {order.customerName}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {order.customerEmail}
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.fulfilled ? "secondary" : "outline"
                              }
                              className={`gap-1 ${
                                order.fulfilled
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                  : ""
                              }`}
                            >
                              {order.fulfilled ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Fulfilled
                                </>
                              ) : (
                                "Pending"
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(
                              Number(order.createdAt) / 1_000_000,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {!order.fulfilled && (
                              <Button
                                data-ocid={`admin.secondary_button.${idx + 1}`}
                                size="sm"
                                variant="outline"
                                className="text-xs gap-1"
                                onClick={() => handleFulfillOrder(order.id)}
                                disabled={fulfillOrder.isPending}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Mark Fulfilled
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <ProductForm
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={editingProduct}
      />
    </div>
  );
}
