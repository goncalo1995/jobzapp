// components/dashboard/sidebar.tsx
'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Calendar as CalendarIcon, 
  FileText, 
  LogOut,
  Menu,
  X,
  Activity,
  Settings,
  Sparkles,
  Key,
  Loader2,
  BarChart2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '../ui/spinner';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/me', label: 'Profile', icon: User },
  { href: '/dashboard/jobs', label: 'Applications', icon: Briefcase },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarIcon },
  { href: '/dashboard/cvs', label: 'Resumes', icon: FileText },
  { href: '/dashboard/prep', label: 'Interview Prep', icon: Sparkles },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
];

import { useProfile } from '@/components/providers/profile-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// ... (skipping nav items)

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const { credits: aiCredits, loading: profileLoading } = useProfile();
  const [hasByok, setHasByok] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check for BYOK locally
    setHasByok(!!localStorage.getItem("jobzapp_openrouter_key"));
  }, []);

  async function handleSignOut() {
    if (!confirm('Are you sure you want to sign out?')) return;

    localStorage.removeItem("jobzapp_openrouter_key");
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <aside className={cn(
      "border-border bg-card flex flex-col z-20 shrink-0 transition-all duration-300",
      isCollapsed ? "md:w-20" : "md:w-64",
      "md:border-r md:h-full md:relative",
      isOpen ? "fixed inset-0 h-screen w-full" : "h-14 border-b w-full"
    )}>
      <div className="px-4 md:px-0 h-14 flex items-center justify-between border-b border-border shrink-0">
        <Link 
          href="/dashboard" 
          className={cn(
            "font-heading font-bold text-primary tracking-tight transition-all",
            isCollapsed ? "mx-auto text-xl" : "px-6 text-xl"
          )}
          onClick={() => setIsOpen(false)}
        >
          {isCollapsed ? "J" : <>Job<span className="text-foreground">Zapp</span></>}
        </Link>
        <button className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("flex-1 flex-col overflow-y-auto", isOpen ? "flex" : "hidden md:flex")}>
        <nav className="flex-1 p-3 space-y-0.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href !== '/dashboard/prep');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium",
                  isCollapsed ? "justify-center" : "gap-3",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title={isCollapsed ? item.label : undefined}
              >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-inherit")} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
        </nav>

        {/* AI Tier Display */}
        <div className="p-3 border-t border-border flex flex-col gap-2">
          {!isCollapsed && (
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="block group px-2 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tier</span>
                {hasByok ? (
                  <Badge variant="secondary" className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary border-primary/20">
                    <Key className="w-3 h-3 mr-1" /> BYOK
                  </Badge>
                // ) : aiCredits && aiCredits > 0 ? (
                //   <Badge variant="default" className="px-2 py-0.5 text-[10px]">
                //     Premium
                //   </Badge>
                ) : (
                  <Badge variant="outline" className="px-2 py-0.5 text-[10px]">
                    Free
                  </Badge>
                )}
              </div>
              
              {!hasByok && (
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className={cn("w-4 h-4 transition-colors", aiCredits > 0 ? "text-primary" : "text-muted-foreground")} />
                  {profileLoading ? <Spinner className='w-4' /> : null}
                  <span className={cn("text-sm font-medium", aiCredits === 0 ? "text-muted-foreground" : "")}>
                    {profileLoading ? "" : aiCredits} Credits
                  </span>
                </div>
              )}
              {hasByok && (
                 <div className="text-xs text-muted-foreground mt-1.5 leading-tight">
                   Using local API key.<br/>Credits paused.
                 </div>
              )}
            </Link>
          )}

          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
              <Link 
                href="/dashboard/settings" 
                onClick={() => setIsOpen(false)} 
                className="flex justify-center py-2"
              >
                {hasByok ? <Key className="w-5 h-5 text-primary" /> : <Sparkles className={cn("w-5 h-5", aiCredits > 0 ? "text-primary" : "text-muted-foreground")} />}
              </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasByok ? "BYOK Mode" : `${aiCredits} Credits`}</p>
              </TooltipContent>
            </Tooltip>

          )}

          <div className="h-px bg-border my-1 w-full hidden md:block" />

          <button 
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-lg",
              isCollapsed ? "justify-center" : "gap-3"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && "Sign Out"}
          </button>


          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden md:flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg",
              isCollapsed ? "justify-center" : "gap-3"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!isCollapsed && "Collapse Sidebar"}
          </button>
        </div>
      </div>
    </aside>
  );
}
