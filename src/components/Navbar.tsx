"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export default function Navbar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const role = session?.user?.role;
  const isLoggedIn = !!session?.user;

  let links: { name: string; href: string }[] = [];

  if (role === "DONOR") {
    links = [
      { name: "My Dashboard", href: "/dashboard/donor" }
    ];
  } else if (role === "NGO") {
    links = [
      { name: "Live Feed & Logistics", href: "/dashboard/ngo" }
    ];
  } else if (role === "ADMIN") {
    links = [
      { name: "Platform Oversight", href: "/dashboard/admin" }
    ];
  }

  const getHomeLink = () => {
    if (role === "DONOR") return "/dashboard/donor";
    if (role === "NGO") return "/dashboard/ngo";
    if (role === "ADMIN") return "/dashboard/admin";
    return "/";
  };

  const handleLogout = async () => {
    await logout();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        
        {/* Logo acting as Home Button */}
        <Link href={getHomeLink()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            NGO Connect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    pathname === link.href ? "text-emerald-600 dark:text-emerald-500" : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center">
                  {session.user.name || session.user.email}
                  <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    {role}
                  </span>
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-zinc-950 absolute w-full left-0 shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {isLoggedIn ? (
              <>
                <div className="pb-4 border-b">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{session.user.name || session.user.email}</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">{role}</p>
                </div>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block text-sm font-medium ${
                      pathname === link.href ? "text-emerald-600" : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 justify-start mt-4" onClick={() => { closeMenu(); handleLogout(); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/signin" onClick={closeMenu}>
                  <Button variant="outline" className="w-full justify-start">Log In</Button>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <Button className="w-full justify-start bg-emerald-600 text-white hover:bg-emerald-700">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
