import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import SessionBar from "./SessionBar";
import { Package, ShoppingCart, User, LogOut } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Package, label: "Products" },
  { to: "/dashboard/cart", icon: ShoppingCart, label: "Cart" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

const AppLayout = () => {
  const { user, logout, sessionTimeLeft } = useAuth();
  const { itemCount } = useCart();
  const minutes = Math.floor(sessionTimeLeft / 60000);
  const seconds = Math.floor((sessionTimeLeft % 60000) / 1000);

  return (
    <div className="min-h-screen bg-background pt-1">
      <SessionBar />

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-1 bottom-0 z-40 hidden w-56 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <h2 className="font-heading text-lg font-bold">Dashboard</h2>
        </div>
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">Welcome, {user?.name}</p>
          <p className="mt-1 text-xs font-medium text-primary font-heading">
            Session: {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.label === "Cart" && itemCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed top-1 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <h2 className="font-heading text-lg font-bold">Dashboard</h2>
        <p className="text-xs font-medium text-primary font-heading">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-20 lg:pt-1 lg:pb-0 lg:pl-56">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-card py-2 lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs font-medium ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.label === "Cart" && itemCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 text-xs font-medium text-muted-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AppLayout;
