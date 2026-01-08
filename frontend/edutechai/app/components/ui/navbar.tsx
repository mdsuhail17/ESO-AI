"use client";

import { MenuVertical } from "./menu-vertical";
import { useState, useEffect } from "react";
import { MenuToggleIcon } from "./menu-toggle-icon";
import { LogIn, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export const Navbar = ({ isLoggedIn = false, userName = "" }: { isLoggedIn?: boolean; userName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "#top" },
    { label: "The Problem", href: "#problem" },
    { label: "The Solution", href: "#solution" },
    { label: "Features", href: "#features" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ];

  // Close menu when a link is clicked and handle smooth scroll
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsOpen(false);
    }

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    }
  };

  // Handle logo click - scroll to hero section
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 p-2 sm:p-3 md:p-4 transition-all duration-300 ${
      scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : ""
    }`}>
      <div className="flex items-center justify-between w-full px-2 sm:px-4 md:px-8 lg:px-16">
        {/* Logo on Left - Home Page Link */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="hover:opacity-90 transition-opacity cursor-pointer"
        >
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white/60 via-white to-white/60 bg-clip-text text-transparent">
            Eso AI
          </h1>
        </Link>

        {/* Right Side - Login/Profile and Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Login Button or Profile */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{userName}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm sm:text-base font-medium"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Login
            </Link>
          )}

          {/* Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-2 sm:p-3 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              <MenuToggleIcon open={isOpen} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" duration={500} stroke="currentColor" />
            </button>

            {/* Menu */}
            {isOpen && (
              <div className="absolute top-12 sm:top-14 md:top-16 right-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 whitespace-nowrap">
                <MenuVertical
                  menuItems={menuItems}
                  color="#3b82f6"
                  skew={-2}
                  onLinkClick={handleLinkClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

