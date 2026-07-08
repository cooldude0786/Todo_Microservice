"use client"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Menu, Search, User, LogOut, Home } from "lucide-react"

interface GlassNavbarProps {
  onSearch?: (query: string) => void
  searchQuery?: string
  onToggleSidebar?: () => void
}

export function GlassNavbar({ onSearch, searchQuery = "", onToggleSidebar }: GlassNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setLocalSearchQuery(query)
    onSearch?.(query)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const displayName = session?.user?.name || session?.user?.email || "User"

  return (
    <nav className={` transition-all duration-300 ${
      isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-lg"
        : "bg-white/60 backdrop-blur-sm"
    }`}>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 py-3 md:flex-nowrap md:justify-between md:h-16 md:py-0">
          {/* Sidebar toggle + Logo/Home */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <Home className="h-6 w-6" />
              <span className="font-semibold text-lg">TodoApp</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full min-w-0 md:flex-1 md:max-w-md md:mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden items-center space-x-4 md:flex shrink-0">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700 font-medium">
                {displayName}
              </span>
            </div>

            <button
              onClick={() => router.push("/profile")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
