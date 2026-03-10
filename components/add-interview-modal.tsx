'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Constants } from '@/types/database.types';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS, useInterviewLimit } from '@/hooks/queries';
import { Sparkles, ShieldCheck, Plus, Loader2, CalendarIcon, Users } from 'lucide-react';
import Link from 'next/link';

interface AddInterviewModalProps {
  applicationId: string;
  companyId?: string;
  interview?: any; // Optional interview for edit mode
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AddInterviewModal({ 
  applicationId, 
  companyId, 
  interview, 
  onSuccess, 
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  children 
}: AddInterviewModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [fetchingContacts, setFetchingContacts] = useState(false);

  const { data: limitData, isLoading: checkingLimitRef } = useInterviewLimit();
  
  // Only check limit if adding a new one
  const isLimitReached = !interview && limitData ? !limitData.canAdd : false;
  const checkingLimit = !interview && checkingLimitRef;

  const queryClient = useQueryClient();
  
  const [type, setType] = useState('Technical');
  const [format, setFormat] = useState('Google Meet');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [round, setRound] = useState('1');
  const [interviewers, setInterviewers] = useState('');
  const [notes, setNotes] = useState('');
  
  const [companyContacts, setCompanyContacts] = useState<any[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const supabase = createClient();

  // Pre-fill form if editing
  useEffect(() => {
    if (interview && open) {
      setType(interview.type || 'Technical');
      setFormat(interview.format || 'Google Meet');
      // Format date for datetime-local input
      if (interview.interview_date) {
        const d = new Date(interview.interview_date);
        const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDate(formattedDate);
      }
      setDuration(interview.duration?.toString() || '60');
      setRound(interview.round?.toString() || '1');
      setInterviewers(interview.interviewer_names?.join(', ') || '');
      setSelectedContactIds(interview.interviewer_ids || []);
      setNotes(interview.notes || '');
    }
  }, [interview, open]);

  useEffect(() => {
    if (open && companyId) {
      const fetchContacts = async () => {
        setFetchingContacts(true);
        const { data } = await supabase.from('contacts').select('*').eq('company_id', companyId);
        if (data) setCompanyContacts(data);
        setFetchingContacts(false);
      };
      fetchContacts();
    }

  }, [open, companyId, supabase, interview]);

  const toggleContact = (id: string) => {
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  async function handleSubmit() {
    if (!date) {
      toast.error('Date and time are required');
      return;
    }

    setLoading(true);
    try {
      const interviewData = {
        job_application_id: applicationId,
        type: type as any,
        format: format as any,
        interview_date: new Date(date).toISOString(),
        duration: parseInt(duration),
        round: parseInt(round),
        interviewer_names: interviewers ? interviewers.split(',').map(n => n.trim()) : [],
        interviewer_ids: selectedContactIds.length > 0 ? selectedContactIds : null,
        notes
      };

      let error;
      if (interview) {
        // Update
        const { error: updateError } = await supabase
          .from('interviews')
          .update(interviewData)
          .eq('id', interview.id);
        error = updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('interviews')
          .insert(interviewData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(interview ? 'Interview updated successfully' : 'Interview added successfully');
      queryClient.invalidateQueries({ queryKey: [KEYS.INTERVIEWS] });
      setOpen(false);
      onSuccess();
      
      // Reset form (if not editing)
      if (!interview) {
        setType('Technical');
        setFormat('Google Meet');
        setDate('');
        setDuration('60');
        setRound('1');
        setInterviewers('');
        setSelectedContactIds([]);
        setNotes('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save interview');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> {interview ? 'Edit Interview' : 'Add Interview'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">{interview ? 'Edit Interview' : 'Schedule Interview'}</DialogTitle>
          {!isLimitReached && (
            <DialogDescription>
              {interview ? 'Update the details for this interview.' : 'Record details for an upcoming or past interview.'}
            </DialogDescription>
          )}
        </DialogHeader>

        {checkingLimit ? (
           <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Checking account limits...</p>
           </div>
        ) : isLimitReached && !interview ? (
           <div className="py-6 space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-black">Interview Limit Reached</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                 You have reached the maximum of {limitData?.limit || 10} active interviews on the Starter plan. 
                 Upgrade to an Accelerator time-pass for unlimited tracking and AI Copilot.
              </p>
              <div className="pt-4">
                 <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0">
                    <Link href="/dashboard/settings">
                       Upgrade to Accelerator <Sparkles className="w-4 h-4 ml-2" />
                    </Link>
                 </Button>
                 <Button variant="ghost" className="w-full mt-2" onClick={() => setOpen(false)}>
                    Cancel
                 </Button>
              </div>
           </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Interview Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.interview_type.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Input 
                id="format"
                placeholder="e.g. Google Meet, On-site" 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time <span className="text-destructive">*</span></Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="date"
                  type="datetime-local" 
                  className="pl-10"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="space-y-2">
                 <Label htmlFor="round">Round</Label>
                 <Input 
                   id="round"
                   type="number"
                   min="1"
                   value={round}
                   onChange={(e) => setRound(e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="duration">Duration (m)</Label>
                 <Input 
                   id="duration"
                   type="number"
                   min="1"
                   value={duration}
                   onChange={(e) => setDuration(e.target.value)}
                 />
               </div>
            </div>
          </div>

          <div className="space-y-4">
            {companyContacts.length > 0 && (
              <div className="space-y-2">
                <Label>Link Existing Contacts</Label>
                {fetchingContacts ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin"/> Loading contacts...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {companyContacts.map(contact => (
                      <Badge 
                        key={contact.id}
                        variant={selectedContactIds.includes(contact.id) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => toggleContact(contact.id)}
                      >
                        {contact.name} {contact.role && <span className="text-[10px] opacity-70 ml-1">({contact.role})</span>}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="interviewers">Additional Interviewers (comma separated names)</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="interviewers"
                  placeholder="Jane Doe, John Smith" 
                  className="pl-10"
                  value={interviewers}
                  onChange={(e) => setInterviewers(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Preparation</Label>
            <Textarea 
              id="notes"
              placeholder="Questions to ask, key points to mention..."
              className="min-h-[100px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading || checkingLimit || isLimitReached}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {interview ? 'Save Changes' : 'Add Interview'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
