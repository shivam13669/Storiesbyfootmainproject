import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, LogOut, User, BookOpen, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CurrencyPicker } from "./CurrencyPicker";
import { LoginModal } from "./LoginModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/firebase";

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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();
  const { user, loading } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

          {/* Currency + Login/User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <CurrencyPicker value={currency} onChange={setCurrency} />

            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : user ? (
              // User Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/90 font-medium text-sm hidden sm:inline max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/account");
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/account");
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      My Bookings
                    </button>
                    <button
                      onClick={() => {
                        navigate("/contact");
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Support & FAQs
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
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
              <div className="px-3 py-2 flex items-center gap-2">
                <CurrencyPicker value={currency} onChange={setCurrency} className="flex-1" />
                {user && !loading ? (
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex-none px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                    {user.displayName || user.email?.split("@")[0]}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex-none px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile User Dropdown */}
      {isUserDropdownOpen && user && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}>
          <div className="absolute top-16 right-4 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <BookOpen className="w-4 h-4" />
              My Bookings
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
              <HelpCircle className="w-4 h-4" />
              Support & FAQs
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsUserDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 flex items-center gap-3 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Navigation;
