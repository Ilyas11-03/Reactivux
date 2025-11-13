import React, { useEffect, useRef, useState } from "react";
import { logout } from "../Login/core/request";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Utilisateur");
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_name");
    if (stored && stored.trim().length > 0) {
      setUserName(stored);
    }
  }, []);

  useEffect(() => {
    if (!userModalOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserModalOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserModalOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [userModalOpen]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/60">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-3">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="logo"
              className="h-9 w-auto drop-shadow-sm"
            />
            <span className="font-semibold text-gray-900 tracking-tight">Restauration</span>
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 ring-1 ring-gray-300/70 bg-white/70 hover:bg-white/90"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18 18 6M6 6l12 12"
                    : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                }
              />
            </svg>
          </button>
        </div>

       
        {/* DESKTOP USER BUTTON */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end ">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserModalOpen((o) => !o)}
              aria-label="Compte utilisateur"
              title="Compte utilisateur"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/60 transition cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={userModalOpen}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
                {userName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || <User className="w-4 h-4" />}
              </span>
              <span className="max-w-[12rem] truncate">{userName}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${userModalOpen ? "rotate-180" : ""}`} />
            </button>

            {userModalOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl bg-white/95 backdrop-blur ring-1 ring-gray-200 shadow-xl" role="menu">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Connecté en tant que</p>
                  <p className="mt-1 truncate text-sm font-semibold text-gray-900">{userName}</p>
                </div>
                <div className="p-1">
                  <button
                    className="w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Profil
                  </button>
                  <button
                    className="w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    Paramètres
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => { setUserModalOpen(false); handleLogout(); }}
                    className="w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 p-6 border-t border-gray-200 bg-white/80 backdrop-blur">
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="flex w-full justify-between items-center text-gray-900 font-semibold"
            >
              Product
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-5 h-5 transition-transform ${
                  productOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 
                    1.06 0L10 11.94l3.72-3.72a.75.75 
                    0 1 1 1.06 1.06l-4.25 4.25a.75.75 
                    0 0 1-1.06 0L5.22 9.28a.75.75 
                    0 0 1 0-1.06Z"
                />
              </svg>
            </button>

            {productOpen && (
              <div className="pl-4 space-y-2">
                {["Analytics", "Engagement", "Security", "Integrations", "Automations"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-gray-700 hover:text-indigo-600"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="block text-red-600 font-semibold hover:text-red-700 transition-colors text-left w-full cursor-pointer"
            >
              Log out →
            </button>
          </div>
        </div>
      )}

      {/* USER DROPDOWN rendered inline above; no full-screen modal */}
    </header>
  );
};

export default Header;
