import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Search, MessageCircle, User, Bell, LogOut } from 'lucide-react';
import { Badge } from './ui/badge';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface NavigationProps {
  unreadNotifications?: number;
  unreadMessages?: number;
}

type LinkItem = { path: string; icon: React.ElementType; label: string; badge?: number };
type ActionItem = { action: () => void; icon: React.ElementType; label: string };
type NavItem = LinkItem | ActionItem;

export const Navigation = ({ unreadNotifications = 0, unreadMessages = 0 }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems: NavItem[] = [
    { path: '/browse', icon: Heart, label: 'Browse' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/chat', icon: MessageCircle, label: 'Chat', badge: unreadMessages },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
    { path: '/profile', icon: User, label: 'Profile' },
    { action: () => logout(navigate), icon: LogOut, label: 'Logout' },
  ];

  const baseClasses =
    'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-all relative';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:bottom-auto z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Matcha
            </span>
          </div>

          <div className="flex items-center justify-around w-full md:justify-end md:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              if ('path' in item) {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={cn(
                      baseClasses,
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <div className="relative">
                      <Icon className="w-6 h-6" />
                      {!!item.badge && item.badge > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                          {item.badge > 9 ? '9+' : item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs md:text-sm">{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className={cn(baseClasses, 'text-muted-foreground hover:text-foreground')}
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};