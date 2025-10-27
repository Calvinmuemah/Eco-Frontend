import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Droplets, Menu, X, LogOut, User, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Live Dashboard", path: "/dashboard" },
  { name: "Sensors", path: "/sensors" },
  { name: "Analysis", path: "/analysis" },
  { name: "Industrial", path: "/industrial" },
  { name: "Chatbot", path: "/chatbot" },
  { name: "About", path: "/about" },
];

interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const API_BASE_URL = "http://localhost:5000/api/auth";

  // 🟢 Fetch user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
        else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  // 🔴 Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/home");

    try {
      const res = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({ title: "Logged out", description: "Signed out successfully." });
      } else {
        toast({
          title: "Logout failed",
          description: "Could not sign you out. Try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Unable to connect to server.",
        variant: "destructive",
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/home");
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 flex h-16 items-center justify-between">
        {/* ---- Left: Logo ---- */}
        <Link to="/home" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-gradient-water flex items-center justify-center">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-water bg-clip-text text-transparent">
            Eco Watch
          </span>
        </Link>

        {/* ---- Right: Nav Links + Theme + User/Login ---- */}
        <div className="hidden lg:flex items-center gap-5 ml-auto">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant="ghost"
                size="sm"
                className={
                  location.pathname === link.path
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }
              >
                {link.name}
              </Button>
            </Link>
          ))}

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-9 w-9 rounded-full border border-border overflow-hidden flex items-center justify-center bg-accent hover:ring-2 hover:ring-primary/40 transition">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-primary uppercase">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-lg bg-background/95 backdrop-blur-md border border-border"
              >
                <DropdownMenuLabel className="text-sm font-medium truncate">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:bg-accent/50 rounded-md"
                >
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer hover:bg-accent/50 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer hover:bg-destructive/20 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/">
              <Button className="gradient-water border-0 px-5">Login</Button>
            </Link>
          )}
        </div>

        {/* ---- Mobile Menu ---- */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ---- Mobile Navigation ---- */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 space-y-1 border-t animate-slide-up bg-background/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  location.pathname === link.path
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Button>
            </Link>
          ))}

          {user ? (
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          ) : (
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full gradient-water border-0 mt-2">
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
