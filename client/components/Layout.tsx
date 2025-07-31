import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Package,
  Plus,
  BarChart3,
  FileText,
  Menu,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationsApi } from "@/lib/api";
import type { Notification } from "@shared/orders";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications on mount
    const fetchNotifications = async () => {
      try {
        const response = await notificationsApi.getNotifications(5);
        if (response.success && response.data) {
          setNotifications(response.data);
          setUnreadCount(response.data.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Create Order", href: "/create", icon: Plus },
    { name: "All Orders", href: "/orders", icon: Package },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Package className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg">OrderFlow</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden font-bold text-lg sm:inline-block">
                OrderFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavItems />
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex flex-col items-start p-4 cursor-pointer",
                        !notification.read && "bg-muted/50"
                      )}
                      onClick={async () => {
                        if (!notification.read) {
                          try {
                            await notificationsApi.markAsRead(notification.id);
                            setNotifications(prev =>
                              prev.map(n =>
                                n.id === notification.id ? { ...n, read: true } : n
                              )
                            );
                            setUnreadCount(prev => Math.max(0, prev - 1));
                          } catch (error) {
                            console.error('Error marking notification as read:', error);
                          }
                        }
                      }}
                    >
                      <div className="flex w-full justify-between items-start">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-primary cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">AD</span>
              </div>
              <span className="hidden sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>© 2024 OrderFlow. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">
                API Docs
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
