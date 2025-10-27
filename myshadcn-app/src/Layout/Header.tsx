import React, { useState } from "react";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="logo"
              className="h-8 w-auto"
            />
            <span className="font-semibold text-gray-900">Your Company</span>
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex lg:gap-x-12">
          {/* PRODUCT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="flex items-center gap-x-1 text-sm font-semibold text-gray-900"
            >
              Product
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  productOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 
                  11.94l3.72-3.72a.75.75 0 1 1 1.06 
                  1.06l-4.25 4.25a.75.75 0 0 
                  1-1.06 0L5.22 9.28a.75.75 
                  0 0 1 0-1.06Z"
                />
              </svg>
            </button>

            {/* PRODUCT MENU */}
            {productOpen && (
              <div className="absolute left-0 mt-3 w-64 rounded-xl bg-white shadow-lg ring-1 ring-gray-900/10">
                <div className="p-4 space-y-3">
                  {[
                    { name: "Analytics", desc: "Understand your traffic" },
                    { name: "Engagement", desc: "Talk to your customers" },
                    { name: "Security", desc: "Keep data safe" },
                    { name: "Integrations", desc: "Connect with tools" },
                    { name: "Automations", desc: "Create funnels" },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className="block rounded-lg p-3 hover:bg-gray-50"
                    >
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a href="#" className="text-sm font-semibold text-gray-900">
            Features
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Marketplace
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Company
          </a>
        </div>

        {/* DESKTOP LOGIN */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold text-gray-900">
            Log in →
          </a>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 p-6 border-t border-gray-200">
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

            <a href="#" className="block text-gray-900 font-semibold">
              Features
            </a>
            <a href="#" className="block text-gray-900 font-semibold">
              Marketplace
            </a>
            <a href="#" className="block text-gray-900 font-semibold">
              Company
            </a>
            <a href="#" className="block text-gray-900 font-semibold">
              Log in →
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
