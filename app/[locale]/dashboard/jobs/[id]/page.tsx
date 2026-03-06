// app/[locale]/dashboard/jobs/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, ArrowLeft, Trash2, Edit, 
  Archive, FileText, Share2, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { 
  OverviewTab, 
  ContactsTab, 
  OfferDetailsTab,
  SidebarWidgets
} from '@/components/job-detail-tabs';
import { StageTransitionModal } from '@/components/stage-transition-modal';
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center border border-border shadow-sm shrink-0">
             {job.company?.website ? (
               <Image 
                 src={`https://img.logo.dev/${job.company.website.replace('https://', '')}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY}`} 
                 alt={job.company.name} 
                 className="h-10 w-10 object-contain"
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
              <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 font-bold text-xs">
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
          />
        </div>
      </header>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
              {['Overview', 'Contacts', 'Offer Details'].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase().replace(' ', '-')}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 text-sm font-bold text-muted-foreground data-[state=active]:text-foreground transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-0 outline-none">
              <OverviewTab job={job} cv={cv || undefined} />
            </TabsContent>

            <TabsContent value="contacts" className="mt-0 outline-none">
              <ContactsTab contacts={contacts} interactions={interactions} companyId={job.company_id} onSuccess={loadData} />
            </TabsContent>

            <TabsContent value="offer-details" className="mt-0 outline-none">
              <OfferDetailsTab offers={offers} applicationId={job.id} onSuccess={loadData} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4">
           <SidebarWidgets job={job} contacts={contacts} onSuccess={loadData} />
        </div>
      </div>
    </div>
  );
}
