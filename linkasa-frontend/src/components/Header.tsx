import { HandHeart, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HomeButton } from "./HomeButton";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        className="max-w-5xl mx-auto flex justify-between items-center
                     px-6 py-3 rounded-full text-black
                     bg-white shadow-[0px_4px_0px_0px_rgb(221,216,212)]"
      >
        <a
          href="#"
          className="flex items-center gap-2 text-2xl font-bold tracking-wider"
        >
          <HandHeart className="h-8 w-8" />
          Linkasa
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="hover:text-[#4741A6] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#4741A6] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#community"
            className="hover:text-[#4741A6] transition-colors"
          >
            Community
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            {user ? (
              <Link to="/practice" onClick={() => setMobileMenuOpen(false)}>
                <HomeButton variant="secondary" className="px-4 py-1 text-sm">
                  Dashboard
                </HomeButton>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <HomeButton variant="secondary" className="px-4 py-1 text-sm">
                  Login
                </HomeButton>
              </Link>
            )}
          </div>
          <HomeButton
            variant="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 text-white" strokeWidth={3.5} />
          </HomeButton>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 z-50 h-full w-3/4 max-w-xs bg-white border-l px-4 py-6 shadow-lg transition-transform transform translate-x-0 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-black hover:text-primary transition-colors"
            >
              ✕
            </button>
            <nav className="flex flex-col space-y-4 text-lg mt-10">
              <a
                href="#features"
                className="text-slate-800 hover:text-[#4741A6] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-800 hover:text-[#4741A6] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#community"
                className="text-slate-800 hover:text-[#4741A6] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </a>
              <div className="flex flex-col gap-2 pt-4">
                {user ? (
                  <Link to="/practice" onClick={() => setMobileMenuOpen(false)}>
                    <HomeButton className="w-full" variant="secondary">
                      Dashboard
                    </HomeButton>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <HomeButton className="w-full" variant="secondary">
                        Log In
                      </HomeButton>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <HomeButton className="w-full" variant="secondary">
                        Sign Up
                      </HomeButton>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
