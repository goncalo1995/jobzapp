'use client';

import { 
  Building2, Calendar, FileText, Link as LinkIcon, 
  DollarSign, Briefcase, MapPin, CheckCircle2, 
  Plus, Users, MessageSquare, Star, Clock,
  ArrowUpRight, ExternalLink, Mail, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { JobApplication, Interview, Interaction, Contact, JobOffer, CV } from '@/types';
import { AddContactModal } from './add-contact-modal';
import { AddInterviewModal } from './add-interview-modal';
import { AddOfferModal } from './add-offer-modal';

// --- Shared Components ---

function InfoCard({ label, value, icon: Icon }: { label: string, value: string | null | undefined, icon: any }) {
  if (!value) return null;
  return (
    <div className="bg-card border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
      <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// --- Tab Components ---

export function OverviewTab({ job, cv }: { job: JobApplication & { company?: any }, cv?: CV }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard 
          label="Applied Date" 
          value={job.applied_date ? new Date(job.applied_date).toLocaleDateString() : 'Not applied'} 
          icon={Calendar} 
        />
        <InfoCard 
          label="Salary Range" 
          value={job.min_salary ? `${job.salary_currency || '$'}${job.min_salary.toLocaleString()} - ${job.max_salary ? job.max_salary.toLocaleString() : ''}` : 'Not specified'} 
          icon={DollarSign} 
        />
        <InfoCard 
          label="CV Version" 
          value={cv?.name || 'No CV attached'} 
          icon={FileText} 
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Job Description</h3>
          </div>
          {job.job_url && (
            <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
              Original Post <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {job.job_description || "No description provided."}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Personal Notes</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {job.notes || "Add your personal notes about this application here..."}
        </p>
      </div>
    </div>
  );
}

export function ContactsTab({ 
  contacts, 
  interactions, 
  companyId, 
  onSuccess 
}: { 
  contacts: Contact[], 
  interactions: Interaction[], 
  companyId: string | null,
  onSuccess: () => void
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Contacts at this Company</h3>
          {companyId && (
            <AddContactModal companyId={companyId} onSuccess={onSuccess} />
          )}
        </div>

        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {contact.email && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                       <a href={`mailto:${contact.email}`}><Mail className="h-4 w-4" /></a>
                     </Button>
                   )}
                   {contact.linkedin && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                       <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
                     </Button>
                   )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary/10 border border-dashed border-border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No contacts found for this company.</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Interactions</h3>
        <div className="space-y-4">
          {interactions.map((interaction, i) => (
            <div key={i} className="flex gap-4 relative">
              {i !== interactions.length - 1 && (
                <div className="absolute left-[19px] top-10 w-[2px] h-[calc(100%-16px)] bg-border" />
              )}
              <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center shrink-0 border border-border">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="bg-card border border-border rounded-xl p-4 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {interaction.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {interaction.interaction_date ? new Date(interaction.interaction_date).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{interaction.notes}</p>
              </div>
            </div>
          ))}
          {interactions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 italic">No interactions recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function OfferDetailsTab({ 
  offers, 
  applicationId, 
  onSuccess 
}: { 
  offers: JobOffer[], 
  applicationId: string,
  onSuccess: () => void
}) {
  const latestOffer = offers[0]; // Assuming sorted by date

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Offer Details</h3>
        <AddOfferModal applicationId={applicationId} onSuccess={onSuccess} />
      </div>

      {latestOffer ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
             <div className="flex items-center justify-between">
               <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px]">Compensation</h4>
               <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">{latestOffer.status}</Badge>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Base Salary</p>
                  <p className="text-2xl font-heading font-bold text-foreground">
                    {latestOffer.base_salary_currency || '$'}{latestOffer.base_salary?.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Equity</p>
                  <p className="text-lg font-bold text-foreground">{latestOffer.equity || 'N/A'}</p>
                </div>
             </div>

             <div className="space-y-3 pt-2">
                <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px]">Benefits Highlights</h4>
                <div className="flex flex-wrap gap-2">
                   {latestOffer.benefits?.map((benefit, i) => (
                     <Badge key={i} variant="secondary" className="font-medium">{benefit}</Badge>
                   ))}
                   {(!latestOffer.benefits || latestOffer.benefits.length === 0) && <p className="text-xs text-muted-foreground italic">No benefits listed</p>}
                </div>
             </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
             <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px]">The Verdict</h4>
             
             <div className="space-y-4">
                <div className="space-y-2">
                   <p className="text-xs font-semibold text-success flex items-center gap-1.5"><ArrowUpRight className="h-3 w-3" /> Pros</p>
                   <ul className="text-sm space-y-1">
                     {latestOffer.pros?.map((pro, i) => <li key={i} className="flex gap-2 items-start"><CheckCircle2 className="h-3 w-3 mt-1 shrink-0" /> {pro}</li>)}
                   </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                   <p className="text-xs font-semibold text-destructive flex items-center gap-1.5"><ArrowUpRight className="h-3 w-3 rotate-90" /> Cons</p>
                   <ul className="text-sm space-y-1">
                     {latestOffer.cons?.map((con, i) => <li key={i} className="flex gap-2 items-start text-muted-foreground"><span className="text-destructive font-bold">•</span> {con}</li>)}
                   </ul>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/10 border border-dashed border-border rounded-xl p-20 flex flex-col items-center justify-center text-center space-y-4">
          <DollarSign className="h-12 w-12 text-muted-foreground/30" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">No Offer Yet</h4>
            <p className="text-sm text-muted-foreground max-w-sm">Keep tracking your progress. Offers will appear here once you record them.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarWidgets({ 
  job, 
  contacts, 
  onSuccess 
}: { 
  job: JobApplication, 
  contacts: Contact[], 
  onSuccess: () => void 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Actions</h3>
        </div>
        <div className="space-y-2">
          <AddInterviewModal applicationId={job.id} companyId={job.company_id || undefined} onSuccess={onSuccess}>
            <Button variant="outline" className="w-full justify-start gap-2 h-10">
              <Star className="h-4 w-4 text-accent" /> Schedule Interview
            </Button>
          </AddInterviewModal>
          {job.company_id && (
            <AddContactModal companyId={job.company_id} onSuccess={onSuccess}>
              <Button variant="outline" className="w-full justify-start gap-2 h-10">
                <Users className="h-4 w-4 text-primary" /> Add Contact
              </Button>
            </AddContactModal>
          )}
          <AddOfferModal applicationId={job.id} onSuccess={onSuccess}>
            <Button variant="outline" className="w-full justify-start gap-2 h-10">
              <DollarSign className="h-4 w-4 text-success" /> Record Offer
            </Button>
          </AddOfferModal>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">People</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" asChild>
            <Users className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {contacts.slice(0, 3).map((contact, i) => (
             <div key={i} className="flex items-center justify-between gap-3">
               <div className="flex items-center gap-2.5">
                 <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                   {contact.name.charAt(0)}
                 </div>
                 <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{contact.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{contact.role}</p>
                 </div>
               </div>
               <div className="flex items-center gap-1">
                 {contact.email && <Mail className="h-3 w-3 text-muted-foreground" />}
                 {contact.linkedin && <Linkedin className="h-3 w-3 text-muted-foreground" />}
               </div>
             </div>
          ))}
          {contacts.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-2">No contacts recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

