"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NavLink = ({ href, children, hasDropdown }) => (
  <a
    href={href}
    className="group relative flex items-center gap-1 px-1 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
  >
    {children}
    {hasDropdown && (
      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
    )}
    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 w-full scale-x-0 rounded-full bg-white opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100" />
  </a>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setIsVisible(
        currentScrollY <= lastScrollY ||
          currentScrollY < 50 ||
          currentScrollY + window.innerHeight >=
            document.documentElement.scrollHeight
      );

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      label: "Product",
      href: "/product",
      hasDropdown: false,
    },
    {
      label: "Docs",
      href: "/docs",
      hasDropdown: false,
    },
    {
      label: "Pricing",
      href: "/pricing",
      hasDropdown: false,
    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`w-full transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="group flex items-center gap-0 text-2xl font-bold text-white"
            >
              <img
                src="/icon.png"
                alt="LmScale Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="relative">
                LmScale
                <span className="text-white">.</span>
                <div className="absolute -inset-x-2 -inset-y-1 -z-10 scale-95 rounded-lg bg-white/5 opacity-0 blur-sm transition duration-300 group-hover:scale-100 group-hover:opacity-100" />
              </span>
            </a>
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <NavLink href={item.href} hasDropdown={item.hasDropdown}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href="/login"
              className="group relative text-sm font-medium text-white transition-colors duration-200 hover:text-white"
            >
              Login
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 w-full scale-x-0 rounded-full bg-white opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100" />
            </a>
            <a
              href="/signup"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 p-0.5 transition-all duration-300 hover:bg-white/10"
            >
              <span className="inline-flex h-full w-full items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-300">
                Sign up
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-full p-2.5 text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 animate-in fade-in zoom-in" />
            ) : (
              <Menu className="h-6 w-6 animate-in fade-in zoom-in" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-16 z-40 transform overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-black/90 backdrop-blur-xl">
          <div className="px-4 py-6">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="h-4 w-4 text-white/50" />
                  )}
                </a>
              ))}
              <div className="my-3 border-t border-white/10" />
              <a
                href="/login"
                className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
              >
                Login
              </a>
              <a
                href="/signup"
                className="flex items-center rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                Sign up
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
