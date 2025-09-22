import { useAuthStore } from "@/store/useAuthStore";
import {
  BookOpen,
  BrainCircuit,
  FilePen,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <BookOpen />, text: "Learn", href: "/flashcard" },
    { icon: <BrainCircuit />, text: "Practice", href: "/practice" },
    { icon: <FilePen />, text: "Quiz", href: "/start-quiz" },
    { icon: <MessageSquare />, text: "Forum", href: "/forum" },
    { icon: <User />, text: "Profile", href: "/profile" },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Menu className="h-6 w-6 text-gray-700" strokeWidth={2} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 min-h-screen w-64 p-6 border-l border-gray-200 bg-white
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#9188f1]">Linkasa</h1>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-colors ${
                  isActive
                    ? "bg-[#dbf881]/50 text-black"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)} // close sidebar when nav link clicked
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Home />
            <span>Home</span>
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors w-full"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
