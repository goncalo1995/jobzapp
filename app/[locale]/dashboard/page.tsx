'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight, Zap, User, Activity } from 'lucide-react';
import { useDashboardData } from '@/hooks/queries';
import Image from 'next/image';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDashboardData();

  useEffect(() => {
    if (error) {
      router.replace('/auth/login');
    }
  }, [error, router]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  const { applications, interviews, offers, resumes, recentActivity } = data;

  const stats = [
    { label: 'Applications', value: applications?.length || 0, icon: Briefcase, color: 'text-primary' },
    { label: 'Interviews', value: interviews?.length || 0, icon: Clock, color: 'text-warning' },
    { label: 'Offers', value: offers?.length || 0, icon: CheckCircle, color: 'text-success' },
    { label: 'Resumes', value: resumes?.length || 0, icon: FileText, color: 'text-accent' },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s your job search at a glance.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="space-y-0.5">
              <span className="text-3xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </span>
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Recent Applications
              </h2>
              <Link href="/dashboard/jobs" className="text-xs font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            {applications && applications.length > 0 ? (
              <div className="flex-1 flex flex-col divide-y divide-border/50">
                {applications.slice(0, 3).map((app: any) => (
                  <Link 
                    key={app.id} href={`/dashboard/jobs/${app.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative bg-secondary rounded-lg overflow-hidden border border-border shrink-0">
                        {app.company?.website ? (
                          <Image 
                            src={`https://img.logo.dev/${app.company.website.replace('https://', '')}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`}
                            alt={app.company.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-contain"
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground uppercase text-xs" style={{ display: app.company?.website ? 'none' : 'flex' }}>
                          {app.company?.name?.charAt(0) || app.company_name_denormalized?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{app.position}</p>
                        <p className="text-xs text-muted-foreground">{app.company?.name || app.company_name_denormalized}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{app.status}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                         {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
                <div className="h-14 w-14 bg-secondary rounded-full flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground/70">No applications yet</p>
                  <p className="text-xs text-muted-foreground">Start by adding your first job application.</p>
                </div>
                <Link 
                  href="/dashboard/jobs/new"
                  className="mt-2 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all rounded-lg"
                >
                  Add Application
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Recent Activity
              </h2>
              <Link href="/dashboard/activity" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                View All
              </Link>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background hover:border-primary/20 transition-colors">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        {activity.created_at ? new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown Date'}
                      </p>
                      <p className="text-sm font-medium text-foreground">{activity.type}</p>
                      {activity.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Quick Actions
            </h2>
            <div className="space-y-1.5">
              <Link 
                href="/dashboard/me"
                className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Complete Profile</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
              </Link>

              <Link 
                href="/dashboard/cvs/new"
                className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Create Resume</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
              </Link>
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary">
                AI Readiness
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload your career data in the Profile section to enable AI resume tailoring and match scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
