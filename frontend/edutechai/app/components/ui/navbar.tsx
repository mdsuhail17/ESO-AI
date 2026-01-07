"use client";

import { MenuVertical } from "./menu-vertical";
import { useState, useEffect } from "react";
import { MenuToggleIcon } from "./menu-toggle-icon";
import { LogIn, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Lenis from "lenis";

export const Navbar = ({ isLoggedIn = false, userName = "" }: { isLoggedIn?: boolean; userName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Get Lenis instance from window - check multiple times as it may not be ready immediately
    const checkLenis = () => {
      if (typeof window !== 'undefined') {
        const lenisInstance = (window as any).lenis;
        if (lenisInstance) {
          setLenis(lenisInstance);
          return true;
        }
      }
      return false;
    };

    // Check immediately
    if (!checkLenis()) {
      // If not found, check again after a short delay
      const timeout = setTimeout(() => {
        checkLenis();
      }, 100);
      return () => clearTimeout(timeout);
    }
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
  // On mobile: close automatically, on desktop: stay open
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Check if mobile (screen width < 1024px for lg breakpoint)
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      setIsOpen(false);
    }
    
    if (lenis) {
      if (href === '#top') {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        const element = document.querySelector(href);
        if (element) {
          lenis.scrollTo(element, { duration: 1.5, offset: -80, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
      }
    } else {
      // Fallback to native smooth scroll
      if (href === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Handle logo click - scroll to hero section
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Check if we're on the home page
    if (pathname === '/') {
      // Scroll to top/hero section using Lenis
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to home page
      router.push('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-center justify-between w-full px-8 md:px-16 lg:px-24">
        {/* Logo on Left - Home Page Link */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-lg">
            <span className="text-black text-xl font-bold">E</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              ESo AI
            </h1>
          </div>
        </Link>

        {/* Right Side - Login/Profile and Menu */}
        <div className="flex items-center gap-4">
          {/* Login Button or Profile */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white">
              <User className="w-4 h-4" />
              <span className="text-sm">{userName}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}

          {/* Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-3 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              <MenuToggleIcon open={isOpen} className="w-8 h-8" duration={500} stroke="currentColor" />
            </button>

            {/* Menu */}
            {isOpen && (
              <div className="absolute top-16 right-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 whitespace-nowrap">
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

