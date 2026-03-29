import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "../App";
import { usePlaceOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onSuccess: () => void;
}

export default function CheckoutModal({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const placeOrder = usePlaceOrder();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      const order = await placeOrder.mutateAsync({
        customerName: name,
        customerEmail: email,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: BigInt(item.quantity),
        })),
      });
      setOrderId(order.id);
      setSubmitted(true);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      if (submitted) onSuccess();
      setSubmitted(false);
      setName("");
      setEmail("");
      setOrderId("");
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent data-ocid="checkout.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div
            data-ocid="checkout.success_state"
            className="text-center py-8 space-y-3"
          >
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <h3 className="font-semibold text-lg">Order Confirmed!</h3>
            <p className="text-muted-foreground text-sm">
              Thank you, {name}! Your order has been placed.
            </p>
            <p className="text-muted-foreground text-xs">
              Order ID: <span className="font-mono font-medium">{orderId}</span>
            </p>
            <Button
              data-ocid="checkout.close_button"
              className="w-full bg-primary text-primary-foreground mt-4"
              onClick={() => handleClose(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order summary */}
            <div className="bg-muted rounded-lg p-3 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    $
                    {(
                      (Number(item.product.price) * item.quantity) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout-name">Full Name</Label>
              <Input
                id="checkout-name"
                data-ocid="checkout.input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout-email">Email Address</Label>
              <Input
                id="checkout-email"
                data-ocid="checkout.input"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              data-ocid="checkout.submit_button"
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={placeOrder.isPending}
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
