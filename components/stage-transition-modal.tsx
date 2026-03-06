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
import { ApplicationStatus } from '@/types';

interface StageTransitionModalProps {
  applicationId: string;
  currentStatus: string;
  onSuccess: () => void;
  onTransitionedToInterview?: () => void;
  onTransitionedToOffer?: () => void;
  children?: React.ReactNode;
}

export function StageTransitionModal({ 
  applicationId, 
  currentStatus, 
  onSuccess,
  onTransitionedToInterview,
  onTransitionedToOffer,
  children 
}: StageTransitionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetStatus, setTargetStatus] = useState(currentStatus);
  
  // Transition-specific fields
  const [recordInteraction, setRecordInteraction] = useState(true);
  const [notes, setNotes] = useState('');

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
          job_application_id: applicationId,
          type: 'Follow-up', // Default type for transitions
          notes: `Moved stage from ${currentStatus} to ${targetStatus}. ${notes}`,
          interaction_date: new Date().toISOString(),
          created_by: user.id
        });
      }

      toast.success(`Application moved to ${targetStatus}`);
      setOpen(false);
      onSuccess();

      // Trigger callbacks for specific stages
      if (targetStatus === 'Interviewing' && onTransitionedToInterview) {
        onTransitionedToInterview();
      } else if (targetStatus === 'Offer' && onTransitionedToOffer) {
        onTransitionedToOffer();
      }

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
            Update the status of your application.
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
                {ApplicationStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
