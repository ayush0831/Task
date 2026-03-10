import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const ProductSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-4 space-y-3">
    <div className="shimmer aspect-square rounded-md" />
    <div className="shimmer h-4 w-3/4 rounded" />
    <div className="shimmer h-3 w-1/2 rounded" />
    <div className="shimmer h-9 w-full rounded-md" />
  </div>
);

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, items } = useCart();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const isInCart = (id: number) => items.some((i) => i.id === id);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Products</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((p) => (
              <div key={p.id} className="flex flex-col rounded-lg border border-border bg-card p-4">
                <div className="flex aspect-square items-center justify-center rounded-md bg-background p-4">
                  <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
                <h3 className="mt-3 text-sm font-medium font-heading line-clamp-2">{p.title}</h3>
                <p className="mt-1 text-lg font-bold text-primary font-heading">${p.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.image })}
                  disabled={isInCart(p.id)}
                  className={`mt-auto flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-opacity ${
                    isInCart(p.id)
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {isInCart(p.id) ? (
                    <>
                      <Check className="h-4 w-4" /> In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Products;
