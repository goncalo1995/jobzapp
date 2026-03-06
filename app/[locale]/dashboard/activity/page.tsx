'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar as CalendarIcon, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

interface ActivityItem {
  id: string;
  type: 'interaction' | 'interview' | 'offer';
  date: string;
  title: string;
  description: string;
  meta?: any;
}

export default function ActivityTrackerPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    async function fetchActivities() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [interviewsRes, offersRes, interactionsRes] = await Promise.all([
        supabase.from('interviews')
          .select('*, job_application:job_applications(id, job_title, company:companies(id, name, website))'),
        supabase.from('job_offers')
          .select('*, job_application:job_applications(id, job_title, company:companies(id, name, website))'),
        supabase.from('interactions')
          .select('*, contact:contacts(id, name, role)')
          .eq('created_by', user.id)
      ]);

      const items: ActivityItem[] = [];

      // Process Interviews
      if (interviewsRes.data) {
        interviewsRes.data.forEach((i: any) => {
          items.push({
            id: `interview-${i.id}`,
            type: 'interview',
            date: i.created_at || i.interview_date,
            title: `Scheduled ${i.type} Interview`,
            description: i.notes || `Interview for ${i.job_application?.job_title}`,
            meta: {
              company: i.job_application?.company,
              appId: i.job_application?.id,
              date: i.interview_date
            }
          });
        });
      }

      // Process Offers
      if (offersRes.data) {
        offersRes.data.forEach((o: any) => {
          items.push({
            id: `offer-${o.id}`,
            type: 'offer',
            date: o.created_at,
            title: `Received Offer`,
            description: o.negotiation_notes || `Offer for ${o.job_application?.job_title}. Status: ${o.status}`,
            meta: {
              company: o.job_application?.company,
              appId: o.job_application?.id,
              salary: o.base_salary
            }
          });
        });
      }

      // Process Interactions (Stage Moves, Notes)
      if (interactionsRes.data) {
        interactionsRes.data.forEach((int: any) => {
          items.push({
            id: `interaction-${int.id}`,
            type: 'interaction',
            date: int.created_at || int.interaction_date,
            title: int.contact ? `Note on ${int.contact.name}` : `Stage Move / Note`,
            description: int.notes || '',
            meta: {
              type: int.type
            }
          });
        });
      }

      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setActivities(items);
      setLoading(false);
    }

    fetchActivities();
  }, [supabase]);

  const filteredActivities = activities.filter(a => {
    const matchesFilter = filterType === 'all' || a.type === filterType;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Activity Tracker</h1>
          <p className="text-muted-foreground">A timeline of all your job search actions, notes, and progress.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search activities..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'interaction', 'interview', 'offer'].map((t) => (
            <Badge 
              key={t}
              variant={filterType === t ? 'default' : 'outline'}
              className="cursor-pointer capitalize px-3 py-1.5 whitespace-nowrap"
              onClick={() => setFilterType(t)}
            >
              {t === 'all' ? 'All Activity' : `${t}s`}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading activity...</div>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {activity.type === 'interaction' && <MessageSquare className="h-4 w-4" />}
                {activity.type === 'interview' && <CalendarIcon className="h-4 w-4" />}
                {activity.type === 'offer' && <DollarSign className="h-4 w-4" />}
              </div>
              
              {/* Card */}
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-sm group-hover:shadow-md transition-shadow group-hover:border-primary/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                        {activity.title}
                      </h4>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-background capitalize text-[10px]">{activity.type}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 bg-secondary/30 p-3 rounded-lg border border-border/50">
                    {activity.description}
                  </p>

                  {activity.meta?.company && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-8 w-8 relative bg-secondary rounded overflow-hidden border border-border">
                        {activity.meta.company.website ? (
                          <Image 
                            src={`https://img.logo.dev/${activity.meta.company.website}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`}
                            alt={activity.meta.company.name}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                              (e.target as any).style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                      <span className="text-xs font-medium text-foreground">{activity.meta.company.name}</span>
                      {activity.meta.appId && (
                        <Link href={`/dashboard/jobs/${activity.meta.appId}`} className="ml-auto text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                          View Job <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-xl">
            No activity found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
