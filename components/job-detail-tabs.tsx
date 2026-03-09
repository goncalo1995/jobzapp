'use client';

import { 
  Calendar, FileText, DollarSign, MapPin, CheckCircle2,
  MessageSquare, Clock, ArrowUpRight, ExternalLink, Mail, 
  Linkedin, Pencil, Sparkles
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
        <AddOfferModal applicationId={applicationId} offer={latestOffer} onSuccess={onSuccess} />
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

export function InterviewsTab({ 
  interviews, 
  applicationId, 
  companyId,
  onSuccess 
}: { 
  interviews: Interview[], 
  applicationId: string,
  companyId: string | null,
  onSuccess: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Interviews</h3>
        <AddInterviewModal 
          applicationId={applicationId} 
          companyId={companyId || undefined} 
          onSuccess={onSuccess} 
        />
      </div>

      <div className="space-y-4">
        {interviews.map((interview, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground">{interview.type} Interview</h4>
                  <Badge variant="secondary" className="text-[10px] h-5">Round {interview.round}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5" /> 
                    {interview.interview_date ? new Date(interview.interview_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3.5 w-3.5" /> {interview.format || 'Virtual'}
                  </span>
                  {interview.duration && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5" /> {interview.duration} mins
                    </span>
                  )}
                </div>
                {interview.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2 italic">"{interview.notes}"</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 md:self-start">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 border-primary/20 text-primary hover:bg-primary/10" asChild>
                <Link href={`/dashboard/prep?interviewId=${interview.id}`}>
                  <Sparkles className="h-3.5 w-3.5" /> Prepare with AI
                </Link>
              </Button>
              <AddInterviewModal 
                applicationId={applicationId} 
                companyId={companyId || undefined} 
                interview={interview}
                onSuccess={onSuccess}
              >
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </AddInterviewModal>
            </div>
          </div>
        ))}
        {interviews.length === 0 && (
          <div className="bg-secondary/10 border border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground italic">No interviews scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// SidebarWidgets removed as requested

