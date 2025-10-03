"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  // Get user type from users table (need to fetch from API)
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user type from API
      fetch(`/api/users?id=${session.user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.userType) {
            setUserType(data.userType);
          }
        })
        .catch(() => {});
    } else {
      setUserType(null);
    }
  }, [session]);

  // Public navigation links (always visible)
  const publicLinks = [
    { 
      href: "/knowledge", 
      label: "Knowledge Hub",
      dropdown: [
        { href: "/knowledge/blogs", label: "Blogs" },
        { href: "/knowledge/city-insights", label: "City Insights" },
      ]
    },
    { href: "/pricing", label: "Pricing" },
  ];

  // Protected navigation links (only visible when authenticated)
  const protectedLinks = [
    { href: "/catalogs", label: "Catalogs" },
    { href: "/community", label: "Community" },
    { href: "/projects", label: "Projects" },
  ];

  // Show protected links only if authenticated
  const navLinks = session?.user 
    ? [...publicLinks.slice(0, 1), ...protectedLinks, ...publicLinks.slice(1)] 
    : publicLinks;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl">Hub4Estate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div 
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setKnowledgeOpen(true)}
                  onMouseLeave={() => setKnowledgeOpen(false)}
                >
                  <button className="px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1">
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {knowledgeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden min-w-[200px]"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 hover:bg-accent transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                {/* Role-based dashboard link */}
                {userType === "provider" ? (
                  <Link href="/provider/dashboard">
                    <Button>Provider Dashboard</Button>
                  </Link>
                ) : userType === "admin" ? (
                  <Link href="/admin">
                    <Button>Admin Panel</Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.label} className="space-y-2">
                    <div className="font-semibold px-3 py-2">{link.label}</div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                {session?.user ? (
                  <>
                    {userType === "provider" ? (
                      <Link href="/provider/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          Provider Dashboard
                        </Button>
                      </Link>
                    ) : userType === "admin" ? (
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          Admin Panel
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}