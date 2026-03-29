import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CartItem } from "../App";
import CheckoutModal from "./CheckoutModal";

interface CartSheetProps {
  cart: CartItem[];
  onUpdateCartItem: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export default function CartSheet({
  cart,
  onUpdateCartItem,
  onClearCart,
}: CartSheetProps) {
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            data-ocid="cart.open_modal_button"
            variant="outline"
            size="sm"
            className="relative border-border hover:bg-accent"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          data-ocid="cart.sheet"
          className="w-full sm:max-w-md flex flex-col"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({cartCount} items)
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <div
                data-ocid="cart.empty_state"
                className="text-center text-muted-foreground py-12"
              >
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={item.product.id}
                    data-ocid={`cart.item.${idx + 1}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ${(Number(item.product.price) / 100).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateCartItem(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateCartItem(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onUpdateCartItem(item.product.id, 0)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <Button
                data-ocid="cart.primary_button"
                className="w-full bg-primary text-primary-foreground"
                onClick={() => {
                  setOpen(false);
                  setCheckoutOpen(true);
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        onSuccess={() => {
          setCheckoutOpen(false);
          onClearCart();
        }}
      />
    </>
  );
}
