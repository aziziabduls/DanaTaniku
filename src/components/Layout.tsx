import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-bg pb-20 md:pb-0 md:flex-row">
      <main className="flex-1 w-full max-w-lg mx-auto md:max-w-7xl md:p-6 lg:p-8">
        <div className="md:bg-warm-surface md:border md:border-warm-border md:rounded-3xl md:shadow-sm md:min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-border bg-warm-surface/90 backdrop-blur-md pb-safe-area md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/add" icon={PlusCircle} label="Catat" />
          <NavItem to="/history" icon={History} label="Riwayat" />
        </div>
      </nav>

      {/* Side Navigation for Desktop (Optional, but good for scaling) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-warm-border bg-warm-surface px-4 py-8">
        <div className="mb-10 px-4">
          <h1 className="font-serif text-3xl font-bold text-olive-700">DanaTani</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavItemDesktop to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItemDesktop to="/add" icon={PlusCircle} label="Catat Transaksi" />
          <NavItemDesktop to="/history" icon={History} label="Riwayat" />
        </nav>
      </aside>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center space-y-1 p-2 transition-all duration-200",
          isActive ? "text-brown-900" : "text-brown-500 opacity-50 hover:opacity-100"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn(
             "flex items-center justify-center w-12 h-8 rounded-full mb-0.5",
             isActive ? "bg-olive-600/10 text-olive-800" : ""
          )}>
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[9px] uppercase tracking-widest",
            isActive ? "font-bold" : "font-medium"
          )}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavItemDesktop({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200",
          isActive ? "text-olive-700 bg-olive-50 font-medium" : "text-brown-500 hover:bg-warm-bg"
        )
      }
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );
}
