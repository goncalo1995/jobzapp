"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, TrendingUp, Clock, Loader2, Target, BarChart2, Zap, ArrowDownRight, Award } from "lucide-react";

export default function AnalyticsPage() {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobs } = await supabase
        .from('job_applications')
        .select('status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (jobs && jobs.length > 0) {
        // Funnel Aggregation
        const counts = { Applied: 0, Interviewing: 0, Offered: 0, Rejected: 0, Hired: 0 };
        jobs.forEach((job: any) => {
          if (counts[job.status as keyof typeof counts] !== undefined) {
            counts[job.status as keyof typeof counts]++;
          }
        });

        // Pipeline Logic
        // Applied is everyone. Interviewing is Interviewing + Offered + Hired.
        const totalApplied = jobs.length;
        const totalInterviewed = counts.Interviewing + counts.Offered + counts.Hired;
        const totalOffered = counts.Offered + counts.Hired;

        setFunnelData({
          applied: totalApplied,
          interviewed: totalInterviewed,
          offered: totalOffered,
          rejected: counts.Rejected,
          hired: counts.Hired,
          interviewRate: totalApplied > 0 ? Math.round((totalInterviewed / totalApplied) * 100) : 0,
          offerRate: totalInterviewed > 0 ? Math.round((totalOffered / totalInterviewed) * 100) : 0,
          winRate: totalApplied > 0 ? Math.round((totalOffered / totalApplied) * 100) : 0
        });

        // Timeline Aggregation (Velocity)
        const groups: Record<string, number> = {};
        jobs.forEach((job: any) => {
          const date = new Date(job.created_at);
          const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          groups[monthYear] = (groups[monthYear] || 0) + 1;
        });

        const chartData = Object.entries(groups).map(([date, count]) => ({
          date,
          applications: count
        }));
        setTimelineData(chartData);

      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
           <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className="w-4 h-4 text-primary animate-pulse" />
              </div>
           </div>
           <p className="text-sm font-medium text-muted-foreground animate-pulse">Synthesizing application data...</p>
        </div>
      </div>
    );
  }

  if (!funnelData || funnelData.applied === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
           <BarChart2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Unlock Advanced Analytics</h2>
        <p className="text-muted-foreground">Log your first job application to activate the insights engine and visualize your hiring funnel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
           <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
             Insights Engine
           </h1>
           <p className="text-muted-foreground mt-2 text-lg">Deep dive into your conversion metrics and application velocity.</p>
         </div>
         <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <Zap className="w-4 h-4 fill-primary/20" /> Accelerator Tier Feature
         </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Total Volume
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-4xl font-black">{funnelData.applied}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-success" /> Lifetime applications
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Interview Rate
              <Target className="w-4 h-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-blue-500 dark:text-blue-400">{funnelData.interviewRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
               {funnelData.interviewed} total interviews secured
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Offer Rate
              <Award className="w-4 h-4 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-purple-500 dark:text-purple-400">{funnelData.offerRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
               Conversion from interviews
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Overall Win Rate
              <Clock className="w-4 h-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-emerald-500 dark:text-emerald-400">{funnelData.winRate}%</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
               App to Offer efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Custom Premium Funnel Visualization */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="border-border/60 shadow-lg h-full flex flex-col">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">Conversion Funnel</CardTitle>
                 <CardDescription>Visual drop-off analysis of your job search pipeline.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center px-8 pb-8">
                 <div className="relative w-full flex flex-col items-center">
                    
                    {/* Level 1: Applied */}
                    <div className="w-full relative group">
                       <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative z-10 w-full bg-gradient-to-r from-muted/50 via-muted to-muted/50 border border-border rounded-t-2xl rounded-b-md p-5 text-center flex flex-col items-center justify-center overflow-hidden shadow-inner">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Applied</span>
                          <span className="text-3xl font-black">{funnelData.applied}</span>
                       </div>
                    </div>

                    {/* Funnel connector */}
                    <div className="w-full flex justify-center my-1 relative">
                       <ArrowDownRight className="w-5 h-5 text-muted-foreground/30 absolute right-1/4" />
                       <span className="text-[10px] font-bold text-muted-foreground tracking-wider py-1 px-3 bg-background border border-border/50 rounded-full z-10">
                          {funnelData.interviewRate}% CONVERSION
                       </span>
                    </div>

                    {/* Level 2: Interviewing */}
                    <div className="w-[85%] relative group">
                       <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative z-10 w-full bg-gradient-to-r from-blue-500/10 via-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-lg p-5 text-center flex flex-col items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                          <span className="text-xs font-bold uppercase tracking-widest text-blue-500/70 dark:text-blue-400/70 mb-1">Interviewed</span>
                          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{funnelData.interviewed}</span>
                       </div>
                    </div>

                    {/* Funnel connector */}
                    <div className="w-[85%] flex justify-center my-1 relative">
                       <ArrowDownRight className="w-5 h-5 text-blue-500/30 absolute right-1/4" />
                       <span className="text-[10px] font-bold text-blue-500/70 tracking-wider py-1 px-3 bg-background border border-blue-500/20 rounded-full z-10">
                          {funnelData.offerRate}% CONVERSION
                       </span>
                    </div>

                    {/* Level 3: Offered */}
                    <div className="w-[60%] relative group">
                       <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative z-10 w-full bg-gradient-to-r from-purple-500/20 via-purple-500/30 to-purple-500/20 border border-purple-500/40 rounded-b-2xl rounded-t-md p-5 text-center flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                          <span className="text-xs font-bold uppercase tracking-widest text-purple-600/70 dark:text-purple-400/80 mb-1">Offered</span>
                          <span className="text-3xl font-black text-purple-700 dark:text-purple-400">{funnelData.offered}</span>
                       </div>
                    </div>

                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Velocity Chart */}
        <div className="lg:col-span-7 space-y-6">
           <Card className="border-border/60 shadow-lg h-full flex flex-col">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">Application Velocity</CardTitle>
                 <CardDescription>Your job search momentum over time.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[300px]">
                 {timelineData.length > 1 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                       <XAxis 
                         dataKey="date" 
                         axisLine={false}
                         tickLine={false}
                         tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false}
                         tickLine={false}
                         tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                       />
                       <RechartsTooltip 
                         contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                         cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="applications" 
                         stroke="hsl(var(--primary))" 
                         strokeWidth={3}
                         fillOpacity={1} 
                         fill="url(#colorApps)" 
                         animationDuration={1500}
                       />
                     </AreaChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
                      <Clock className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-sm">Need more data points to establish velocity trend.</p>
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>

      </div>

    </div>
  );
}
