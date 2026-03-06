'use client';

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, ArrowRight, Star, Plus, Briefcase, DollarSign } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Constants } from '@/types/database.types';

const STATUS_OPTIONS = Constants.public.Enums.application_status;

interface StageTransitionModalProps {
  applicationId: string;
  currentStatus: string;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export function StageTransitionModal({ 
  applicationId, 
  currentStatus, 
  onSuccess,
  children 
}: StageTransitionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetStatus, setTargetStatus] = useState(currentStatus);
  
  // Transition-specific fields
  const [recordInteraction, setRecordInteraction] = useState(true);
  const [notes, setNotes] = useState('');
  
  // Interview fields
  const [interviewType, setInterviewType] = useState('Technical');
  const [interviewDate, setInterviewDate] = useState('');
  
  // Offer fields
  const [salary, setSalary] = useState('');

  const supabase = createClient();

  async function handleTransition() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Update Application Status
      const { error: appError } = await supabase
        .from('job_applications')
        .update({ 
          status: targetStatus as any,
          last_updated: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (appError) throw appError;

      // 2. Record Interaction (optional but recommended)
      if (recordInteraction && notes) {
        await supabase.from('interactions').insert({
          type: 'Follow-up', // Default type for transitions
          notes: `Moved stage from ${currentStatus} to ${targetStatus}. ${notes}`,
          interaction_date: new Date().toISOString(),
          created_by: user.id
        });
      }

      // 3. Status-Specific Actions
      if (targetStatus === 'Interviewing' && interviewDate) {
        await supabase.from('interviews').insert({
          job_application_id: applicationId,
          type: interviewType as any,
          interview_date: new Date(interviewDate).toISOString(),
          round: 1, // Default to 1 if first interview
          notes: notes
        });
      }

      if (targetStatus === 'Offer' && salary) {
        await supabase.from('job_offers').insert({
          job_application_id: applicationId,
          status: 'Pending',
          base_salary: parseFloat(salary),
          negotiation_notes: notes
        });
      }

      toast.success(`Application moved to ${targetStatus}`);
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to move stage');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
            Move Stage <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">Move Stage</DialogTitle>
          <DialogDescription>
            Update the status of your application and record any new information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={targetStatus} onValueChange={setTargetStatus}>
              <SelectTrigger className="h-11 bg-secondary/30 border-border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {targetStatus === 'Interviewing' && (
            <div className="space-y-4 p-4 rounded-xl bg-accent/5 border border-accent/10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-accent">
                <Star className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Schedule Interview</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground">Type</Label>
                  <Select value={interviewType} onValueChange={setInterviewType}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.interview_type.map(type => (
                        <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground">Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                      type="datetime-local" 
                      className="h-9 pl-8 text-xs" 
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {targetStatus === 'Offer' && (
            <div className="space-y-4 p-4 rounded-xl bg-success/5 border border-success/10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-success">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Offer Details</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Base Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder="e.g. 120000" 
                    className="h-9 pl-8 text-xs" 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>Notes / Context</span>
              <span className="text-[10px] text-muted-foreground italic">Recorded as Interaction</span>
            </Label>
            <Textarea 
              placeholder="How did it go? Any feedback or next steps?"
              className="min-h-[100px] resize-none text-sm bg-secondary/30 border-border"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleTransition} disabled={loading} className="min-w-[120px]">
            {loading ? 'Moving...' : 'Confirm Move'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
