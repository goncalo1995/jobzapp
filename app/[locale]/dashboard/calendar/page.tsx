'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Building2,
  Users
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { Interview } from '@/types';

type InterviewWithExt = Interview & {
  job_application: {
    id: string;
    position: string;
    company: {
      id: string;
      name: string;
      website: string | null;
    }
  }
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [interviews, setInterviews] = useState<InterviewWithExt[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchInterviews() {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          job_application:job_applications (
            id,
            position,
            company:companies (
              id,
              name,
              website
            )
          )
        `)
        .order('interview_date', { ascending: true });

      if (data) {
        setInterviews(data as any);
      }
      setLoading(false);
    }

    fetchInterviews();
  }, [supabase]);

  // Filter interviews for the selected date
  const selectedDateInterviews = interviews.filter(i => {
    if (!i.interview_date || !date) return false;
    const iDate = new Date(i.interview_date);
    return iDate.getDate() === date.getDate() &&
           iDate.getMonth() === date.getMonth() &&
           iDate.getFullYear() === date.getFullYear();
  });

  // Get dates with interviews for the calendar dots
  const interviewDates = interviews.map(i => new Date(i.interview_date!));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Interview Calendar</h1>
          <p className="text-muted-foreground">Keep track of all your upcoming and past job interviews.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" asChild>
             <Link href="/dashboard/jobs">View All Applications</Link>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Calendar Section */}
        <Card className="lg:col-span-5 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" /> Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
              modifiers={{
                hasInterview: interviewDates
              }}
              modifiersClassNames={{
                hasInterview: "font-bold text-primary underline decoration-2 underline-offset-4"
              }}
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </CardContent>
          <div className="p-6 bg-muted/20 border-t border-border/50 space-y-4">
             <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selected: {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
             <div className="space-y-4">
                {selectedDateInterviews.length > 0 ? (
                  selectedDateInterviews.map((interview) => (
                    <div key={interview.id} className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 relative bg-secondary rounded-lg overflow-hidden border border-border shrink-0">
                             {interview.job_application.company.website ? (
                               <Image 
                                 src={`https://img.logo.dev/${interview.job_application.company.website.replace('https://', '')}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`} 
                                 alt={interview.job_application.company.name}
                                 fill
                                 className="object-contain p-1"
                                 onError={(e) => {
                                   (e.target as any).style.display = 'none';
                                   (e.target as any).nextSibling.style.display = 'flex';
                                 }}
                               />
                             ) : null}
                             <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground uppercase text-xs" style={{ display: interview.job_application.company.website ? 'none' : 'flex' }}>
                               {interview.job_application.company.name.charAt(0)}
                             </div>
                           </div>
                           <div>
                             <h5 className="font-bold text-sm leading-tight">{interview.job_application.position}</h5>
                             <p className="text-xs text-muted-foreground">{interview.job_application.company.name}</p>
                           </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 shrink-0">
                          {interview.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(interview.interview_date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {interview.format}</span>
                      </div>

                      <Button variant="ghost" size="sm" className="w-full h-8 text-[10px] uppercase font-bold tracking-wider" asChild>
                        <Link href={`/dashboard/jobs/${interview.job_application.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No interviews scheduled for this day.</p>
                  </div>
                )}
             </div>
          </div>
        </Card>

        {/* Right: Upcoming Interviews List */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-heading font-bold">Upcoming Interviews</CardTitle>
                <CardDescription>All your scheduled meetings across all roles.</CardDescription>
              </div>
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">{interviews.length} Total</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.length > 0 ? (
                  interviews.map((interview) => (
                    <div key={interview.id} className="group bg-muted/20 border border-border rounded-xl p-5 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 relative bg-background rounded-xl p-2 border border-border shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                             {interview.job_application.company.website ? (
                               <Image 
                                 src={`https://img.logo.dev/${interview.job_application.company.website.replace('https://', '')}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`} 
                                 alt={interview.job_application.company.name}
                                 fill
                                 className="object-contain p-2"
                                 onError={(e) => {
                                   (e.target as any).style.display = 'none';
                                   (e.target as any).nextSibling.style.display = 'flex';
                                 }}
                               />
                             ) : null}
                             <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground uppercase text-sm" style={{ display: interview.job_application.company.website ? 'none' : 'flex' }}>
                               {interview.job_application.company.name.charAt(0)}
                             </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{interview.job_application.position}</h4>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium text-foreground/70"><Building2 className="h-3 w-3" /> {interview.job_application.company.name}</span>
                            <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {new Date(interview.interview_date!).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(interview.interview_date!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                           <Badge variant="outline" className="mb-1">{interview.type}</Badge>
                           <p className="text-[10px] text-muted-foreground">{interview.format}</p>
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-primary hover:text-primary-foreground" asChild>
                          <Link href={`/dashboard/jobs/${interview.job_application.id}`}>
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">No interviews scheduled</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">When you add interviews to your job applications, they will appear here for easy tracking.</p>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/jobs">Go to Applications</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips/Widget Card */}
          {/* <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 flex items-center gap-6">
             <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
               <Star className="h-8 w-8 text-primary" />
             </div>
             <div className="space-y-1">
               <h4 className="font-bold text-foreground">Next Major Step</h4>
               <p className="text-sm text-foreground/70">Your upcoming Portfolio Review tomorrow is with 2 senior designers. Make sure to have your Figma links ready!</p>
             </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
