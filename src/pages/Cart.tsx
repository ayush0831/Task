import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 text-xl font-bold font-heading">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Browse products and add items to your cart.</p>
        <Link to="/dashboard" className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-background p-2">
                <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium font-heading line-clamp-1">{item.title}</h3>
                  <p className="text-sm font-bold text-primary font-heading">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-secondary transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-secondary transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-heading">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:opacity-70 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-6 h-fit lg:sticky lg:top-8">
          <h2 className="text-lg font-bold font-heading mb-4">Order Summary</h2>
          <div className="space-y-2 border-b border-border pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 max-w-[60%]">{item.title}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-bold font-heading">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
          <button className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
