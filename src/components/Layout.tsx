import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-warm-bg pb-20 md:pb-0 md:flex-row font-sans">
      {/* Side Navigation for Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r border-warm-border bg-warm-surface/80 backdrop-blur-xl px-6 py-10 relative z-20">
        <div className="mb-14 px-2">
          <h1 className="font-serif text-3xl font-bold text-olive-800 tracking-tight">DanaTaniku</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brown-500 mt-2">Sistem Pembukuan</p>
        </div>
        <nav className="flex flex-col space-y-3">
          <NavItemDesktop to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItemDesktop to="/add" icon={PlusCircle} label="Catat Transaksi" />
          <NavItemDesktop to="/history" icon={History} label="Riwayat" />
        </nav>
      </aside>

      <main className="flex-1 w-full max-w-lg mx-auto md:max-w-none md:p-8 lg:p-12 relative overflow-hidden">
        {/* Background blobs for the main layout */}
        <div className="absolute top-[-20%] right-[-10%] w-160 h-160 bg-olive-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none z-0 hidden md:block" />
        <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 bg-terracotta-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none z-0 hidden md:block" />

        <div className="md:bg-warm-surface/60 md:backdrop-blur-md md:border md:border-white/40 md:rounded-[3rem] md:shadow-2xl md:shadow-brown-900/5 md:min-h-full relative z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-border bg-warm-surface/90 backdrop-blur-xl pb-safe-area md:hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around px-2 py-2">
          <NavItem to="/" icon={LayoutDashboard} label="Beranda" />
          <NavItem to="/add" icon={PlusCircle} label="Catat" />
          <NavItem to="/history" icon={History} label="Riwayat" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center space-y-1 p-2 w-20 transition-all duration-300 relative",
          isActive ? "text-olive-700" : "text-brown-500 opacity-60 hover:opacity-100"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative flex items-center justify-center w-12 h-10 rounded-2xl mb-1 z-10">
            {isActive && (
              <motion.div 
                layoutId="activeTabMobile"
                className="absolute inset-0 bg-olive-100/80 rounded-2xl"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <Icon className="h-6 w-6 relative z-20" strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[10px] uppercase tracking-widest transition-all",
            isActive ? "font-bold text-olive-800" : "font-medium"
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
          "flex items-center space-x-4 px-6 py-4 rounded-3xl transition-all duration-300 relative group overflow-hidden",
          isActive ? "text-olive-800 font-semibold shadow-sm" : "text-brown-500 font-medium hover:text-brown-900"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div 
              layoutId="activeTabDesktop"
              className="absolute inset-0 bg-olive-100/50 border border-olive-200/50"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          )}
          {!isActive && (
            <div className="absolute inset-0 bg-warm-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <Icon className="h-5 w-5 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
          <span className="relative z-10 text-sm tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}
