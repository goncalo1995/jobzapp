// app/[locale]/dashboard/page.tsx
import { Link } from '@/i18n/navigation';
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight, Zap, User } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Applications', value: '0', icon: Briefcase, color: 'text-primary' },
    { label: 'Interviews', value: '0', icon: Clock, color: 'text-warning' },
    { label: 'Offers', value: '0', icon: CheckCircle, color: 'text-success' },
    { label: 'Resumes', value: '0', icon: FileText, color: 'text-accent' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Applications
            </h2>
            <Link href="/dashboard/jobs" className="text-xs font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
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
