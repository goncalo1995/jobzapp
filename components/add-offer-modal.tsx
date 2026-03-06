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
import { DollarSign, Briefcase, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Constants } from '@/types/database.types';

interface AddOfferModalProps {
  applicationId: string;
  offer?: any; // Optional offer for edit mode
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AddOfferModal({ 
  applicationId, 
  offer, 
  onSuccess, 
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  children 
}: AddOfferModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  const [loading, setLoading] = useState(false);
  
  const [status, setStatus] = useState('Pending');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [equity, setEquity] = useState('');
  const [benefits, setBenefits] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [notes, setNotes] = useState('');

  const supabase = createClient();

  // Pre-fill form if editing
  useEffect(() => {
    if (offer && open) {
      setStatus(offer.status || 'Pending');
      setSalary(offer.base_salary?.toString() || '');
      setCurrency(offer.base_salary_currency || 'USD');
      setEquity(offer.equity || '');
      setBenefits(offer.benefits?.join(', ') || '');
      setPros(offer.pros?.join(', ') || '');
      setCons(offer.cons?.join(', ') || '');
      setNotes(offer.negotiation_notes || '');
    }
  }, [offer, open]);

  async function handleSubmit() {
    if (!salary) {
      toast.error('Base salary is required');
      return;
    }

    setLoading(true);
    try {
      const offerData = {
        job_application_id: applicationId,
        status: status as any,
        base_salary: parseFloat(salary),
        base_salary_currency: currency,
        equity: equity,
        benefits: benefits ? benefits.split(',').map(b => b.trim()) : [],
        pros: pros ? pros.split(',').map(p => p.trim()) : [],
        cons: cons ? cons.split(',').map(c => c.trim()) : [],
        negotiation_notes: notes
      };

      let error;
      if (offer) {
        const { error: updateError } = await supabase
          .from('job_offers')
          .update(offerData)
          .eq('id', offer.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('job_offers')
          .insert(offerData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(offer ? 'Offer updated successfully' : 'Offer recorded successfully');
      setOpen(false);
      onSuccess();
      
      // Reset form (if not editing)
      if (!offer) {
        setStatus('Pending');
        setSalary('');
        setCurrency('USD');
        setEquity('');
        setBenefits('');
        setPros('');
        setCons('');
        setNotes('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save offer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> {offer ? 'Edit Offer' : 'Add Offer'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">{offer ? 'Edit Job Offer' : 'Record Job Offer'}</DialogTitle>
          <DialogDescription>
            {offer ? 'Update the details of the offer you received.' : 'Record the details of the offer you received.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Base Salary <span className="text-destructive">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="salary"
                  type="number"
                  placeholder="e.g. 120000" 
                  className="pl-10"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equity">Equity / Options</Label>
              <Input 
                id="equity"
                placeholder="e.g. 0.1% or 10,000 units" 
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-status">Offer Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="offer-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.offer_status.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits (comma separated)</Label>
            <Input 
              id="benefits"
              placeholder="Health insurance, 401k, Hybrid work" 
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pros" className="text-success flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Pros (comma separated)</Label>
              <Textarea 
                id="pros"
                placeholder="Great team, interesting tech..."
                className="min-h-[80px] text-sm resize-none"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cons" className="text-destructive flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Cons (comma separated)</Label>
              <Textarea 
                id="cons"
                placeholder="Long commute, legacy code..."
                className="min-h-[80px] text-sm resize-none"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Negotiation Notes</Label>
            <Textarea 
              id="notes"
              placeholder="Counter-offer sent on Friday..."
              className="min-h-[80px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (offer ? 'Update Offer' : 'Record Offer')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
