"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Check the initial theme
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleLogout = async () => {
    try {
      // Clear cookies manually for additional safety
      document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      // Sign out via NextAuth
      await signOut({ 
        callbackUrl: "/login",
        redirect: true
      })
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect on error as fallback
      window.location.href = "/login";
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 flex justify-center",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="w-full max-w-[80%] flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-colors"
          >
            <span className="text-primary">Hire</span>
            <span className="text-foreground">X</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/openings"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Jobs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div 
              className="relative inline-block w-12 h-6 cursor-pointer"
              onClick={toggleTheme}
            >
              <div className={cn(
                "absolute left-0 top-0 w-12 h-6 rounded-full transition-colors duration-300",
                isDarkMode ? "bg-primary" : "bg-gray-300"
              )}>
              </div>
              <div className={cn(
                "absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center",
                isDarkMode 
                  ? "translate-x-7 bg-gray-900" 
                  : "translate-x-0.5 translate-y-0.5"
              )}
              style={{ top: isDarkMode ? "2px" : "0" }}
              >
                {isDarkMode ? (
                  <Moon className="h-3 w-3 text-yellow-300" />
                ) : (
                  <Sun className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>

            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <div 
              className="relative inline-block w-10 h-5 cursor-pointer mr-2"
              onClick={toggleTheme}
            >
              <div className={cn(
                "absolute left-0 top-0 w-10 h-5 rounded-full transition-colors duration-300",
                isDarkMode ? "bg-primary" : "bg-gray-300"
              )}>
              </div>
              <div className={cn(
                "absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center",
                isDarkMode 
                  ? "translate-x-6 bg-gray-900" 
                  : "translate-x-0.5 translate-y-0.5"
              )}
              style={{ top: isDarkMode ? "2px" : "0" }}
              >
                {isDarkMode ? (
                  <Moon className="h-2 w-2 text-yellow-300" />
                ) : (
                  <Sun className="h-2 w-2 text-yellow-500" />
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background p-6 md:hidden">
          <div className="flex flex-col space-y-6">
            <Link
              href="/#features"
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/openings"
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Jobs
            </Link>
            <div className="pt-6 border-t">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full mb-3"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}