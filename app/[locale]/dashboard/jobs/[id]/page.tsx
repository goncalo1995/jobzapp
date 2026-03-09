// app/[locale]/dashboard/jobs/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, ArrowLeft, Trash2, Edit, FileText,
  Calendar, DollarSign, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { 
  OverviewTab, 
  ContactsTab, 
  OfferDetailsTab,
  InterviewsTab
} from '@/components/job-detail-tabs';
import { StageTransitionModal } from '@/components/stage-transition-modal';
import { AddInterviewModal } from '@/components/add-interview-modal';
import { AddOfferModal } from '@/components/add-offer-modal';
import type { JobApplication, Interview, Interaction, Contact, JobOffer, CV } from '@/types';
import Image from "next/image";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  
  const [job, setJob] = useState<(JobApplication & { company?: any }) | null>(null);
  const [cv, setCv] = useState<CV | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [offers, setOffers] = useState<JobOffer[]>([]);

  // Modal chaining state
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);

  const supabase = createClient();

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Job Application
      const { data: jobData, error: jobError } = await supabase
        .from('job_applications')
        .select(`*, company:companies(*)`)
        .eq('id', id)
        .single();

      if (jobError || !jobData) {
        toast.error('Failed to load application');
        router.push('/dashboard/jobs');
        return;
      }
      setJob(jobData);

      // 2. Fetch CV if exists
      if (jobData.cv_id) {
        const { data: cvData } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', jobData.cv_id)
          .single();
        if (cvData) setCv(cvData);
      }

      // 3. Fetch Interviews
      const { data: interviewsData } = await supabase
        .from('interviews')
        .select('*')
        .eq('job_application_id', id)
        .order('interview_date', { ascending: true });
      if (interviewsData) setInterviews(interviewsData);

      // 4. Fetch Offers
      const { data: offersData } = await supabase
        .from('job_offers')
        .select('*')
        .eq('job_application_id', id)
        .order('created_at', { ascending: false });
      if (offersData) setOffers(offersData);

      // 5. Fetch Company Contacts and their Interactions
      if (jobData.company_id) {
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('*')
          .eq('company_id', jobData.company_id);
        
        if (contactsData) {
          setContacts(contactsData);
          const contactIds = contactsData.map(c => c.id);
          if (contactIds.length > 0) {
            const { data: interactionsData } = await supabase
              .from('interactions')
              .select('*')
              .in('contact_id', contactIds)
              .order('interaction_date', { ascending: false });
            if (interactionsData) setInteractions(interactionsData);
          }
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, supabase]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this application?')) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Application deleted');
      router.push('/dashboard/jobs');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center border border-border shadow-sm shrink-0">
             {job.company?.website ? (
               <Image 
                 src={`https://img.logo.dev/${job.company.website.replace('https://', '')}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`} 
                 alt={job.company.name} 
                 width={64}
                 height={64}
                 className="object-contain p-1"
                 onError={(e) => {
                   (e.target as any).style.display = 'none';
                   (e.target as any).nextSibling.style.display = 'flex';
                 }}
               />
             ) : null}
             <Building2 className="h-8 w-8 text-muted-foreground hidden" />
          </div>
          <div className="space-y-2">
            <Link href="/dashboard/jobs" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" />
              Applications
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-heading font-black text-foreground tracking-tight">{job.position}</h1>
              <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {job.company?.name || job.company_name_denormalized}</span>
              <span className="flex items-center gap-1.5">•</span>
              <span className="flex items-center gap-1.5">{job.location || 'Remote'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StageTransitionModal 
            applicationId={job.id} 
            currentStatus={job.status || 'Applied'} 
            onSuccess={loadData}
            onTransitionedToInterview={() => setShowAddInterview(true)}
            onTransitionedToOffer={() => setShowAddOffer(true)}
          />
          <Button variant="outline" size="icon" className="h-10 w-10 border-border" asChild>
            <Link href={`/dashboard/jobs/${job.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/5" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Areas - Restructured for cleaner visuals */}
      <div className="space-y-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="relative border-b border-border">
            <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0 gap-2 md:gap-8 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth">
              {[
                { label: 'Overview', value: 'overview', icon: FileText },
                { label: 'Interviews', value: 'interviews', icon: Calendar },
                { label: 'Contacts', value: 'contacts', icon: Users },
                { label: 'Offer Details', value: 'offer-details', icon: DollarSign },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-4 text-sm font-bold text-muted-foreground data-[state=active]:text-foreground transition-all flex items-center gap-2 shrink-0 group"
                >
                  <tab.icon className={cn(
                    "h-4 w-4 transition-colors",
                    "group-data-[state=active]:text-primary"
                  )} />
                  <span className="hidden lg:block data-[state=active]:block group-data-[state=active]:inline">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in duration-300">
            <OverviewTab job={job} cv={cv || undefined} />
          </TabsContent>

          <TabsContent value="interviews" className="mt-0 outline-none animate-in fade-in duration-300">
            <InterviewsTab interviews={interviews} applicationId={job.id} companyId={job.company_id} onSuccess={loadData} />
          </TabsContent>

          <TabsContent value="contacts" className="mt-0 outline-none animate-in fade-in duration-300">
            <ContactsTab contacts={contacts} interactions={interactions} companyId={job.company_id} onSuccess={loadData} />
          </TabsContent>

          <TabsContent value="offer-details" className="mt-0 outline-none animate-in fade-in duration-300">
            <OfferDetailsTab offers={offers} applicationId={job.id} onSuccess={loadData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chained Modals */}
      {showAddInterview && (
        <AddInterviewModal 
          applicationId={job.id} 
          companyId={job.company_id || undefined} 
          onSuccess={() => {
            setShowAddInterview(false);
            loadData();
          }}
          open={showAddInterview}
          onOpenChange={setShowAddInterview}
        />
      )}

      {showAddOffer && (
        <AddOfferModal 
          applicationId={job.id} 
          onSuccess={() => {
            setShowAddOffer(false);
            loadData();
          }}
          open={showAddOffer}
          onOpenChange={setShowAddOffer}
        />
      )}
    </div>
  );
}
