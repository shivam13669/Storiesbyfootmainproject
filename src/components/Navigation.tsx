import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CurrencyPicker } from "./CurrencyPicker";
import { LoginModal } from "./LoginModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth, getSessionUser } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", to: "/", type: "route" as const },
  { name: "Destinations", to: "/destinations", type: "route" as const },
  { name: "Services", to: "/services", type: "route" as const },
  { name: "Testimonials", to: "/testimonials", type: "route" as const },
  { name: "About", to: "/about", type: "route" as const },
  { name: "Contact", to: "/contact", type: "route" as const },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, isAdmin, logout, session } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 text-white shadow-lg">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 min-w-0 no-underline">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fde743b16560c4ea5a4a46e65a2543876%2F4be0568d99d2469baa7ef6c274a8a1b2?format=webp&width=800" alt="StoriesByFoot logo" className="h-9 w-auto sm:h-10" />
            <span className="text-base sm:text-lg md:text-xl font-bold leading-tight text-white">
              StoriesBy<span className="text-secondary">Foot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const classes = "text-white/90 hover:text-white transition-colors font-medium relative group";

              if (item.type === "route") {
                return (
                  <Link key={item.name} to={item.to} className={classes}>
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              }

              return (
                <a key={item.name} href={item.to} className={classes}>
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
          </div>

          {/* Currency + Login/User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <CurrencyPicker value={currency} onChange={setCurrency} />
            {isAuthenticated ? (
              (() => {
                const displayUser = user || getSessionUser(session)
                return displayUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {displayUser.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white/90 text-sm font-medium max-w-[100px] truncate">
                          Hi, {displayUser.fullName.split(' ')[0]}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem disabled className="text-xs text-muted-foreground cursor-default">
                        {displayUser.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isAdmin ? (
                        <DropdownMenuItem asChild>
                          <Link to="/admin-dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          {user && !isAdmin ? (
                            <DropdownMenuItem asChild>
                              <Link to="/user-dashboard" className="flex items-center gap-2 cursor-pointer">
                                <UserIcon className="w-4 h-4" />
                                My Profile
                              </Link>
                            </DropdownMenuItem>
                          ) : null}
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 text-red-600 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null
              })()
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 border border-white/10 backdrop-blur-lg rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const classes = "block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors";

                if (item.type === "route") {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classes}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.name}
                    href={item.to}
                    className={classes}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="px-3 py-2 border-t border-white/10 mt-2 pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CurrencyPicker value={currency} onChange={setCurrency} className="flex-1" />
                </div>
                {isAuthenticated ? (
                  <>
                    {isAdmin ? (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md bg-orange-500/20 text-orange-300 text-sm font-medium hover:bg-orange-500/30 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    ) : user ? (
                      <Link
                        to="/user-dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md bg-orange-500/20 text-orange-300 text-sm font-medium hover:bg-orange-500/30 transition-colors"
                      >
                        My Dashboard
                      </Link>
                    ) : session ? (
                      <Link
                        to="/admin-setup"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md bg-orange-500/20 text-orange-300 text-sm font-medium hover:bg-orange-500/30 transition-colors flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Complete Admin Setup
                      </Link>
                    ) : null}
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-md bg-red-500/20 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Navigation;
