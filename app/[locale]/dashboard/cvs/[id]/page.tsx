// app/[locale]/dashboard/cvs/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Save, ArrowLeft, Download, Trash2, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export default function EditCVPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cv, setCv] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCV() {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setCv(data);
      setLoading(false);
    }
    fetchCV();
  }, [id, supabase]);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('cvs')
      .update({
        name: cv.name,
        target_role: cv.target_role,
        content: cv.content,
        markdown_content: cv.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to save CV');
    } else {
      toast.success('CV saved');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete CV');
    } else {
      toast.success('CV deleted');
      router.push('/dashboard/cvs');
    }
  }

  async function handleExport() {
    try {
      const response = await fetch('/api/cv/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId: id }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF4500]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/dashboard/cvs" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F5F0E8]/30 hover:text-[#FF4500] transition-colors group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl font-heading uppercase tracking-tighter text-[#F5F0E8]">
              Edit <span className="text-[#FF4500] italic">CV</span>
            </h1>
            <p className="text-[#F5F0E8]/50 font-mono text-sm uppercase tracking-widest leading-relaxed">
              Tailoring for: <span className="text-[#F5F0E8]">{cv.target_role || 'General'}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <Button 
             variant="outline"
             onClick={handleDelete}
             className="border-white/5 text-[#F5F0E8]/20 hover:text-red-500 hover:border-red-500/20 font-bold uppercase tracking-widest px-4 h-11"
           >
             <Trash2 className="h-4 w-4" />
           </Button>
           <Button 
             variant="outline"
             onClick={handleExport}
             className="border-white/5 text-[#F5F0E8]/40 hover:text-[#FF4500] hover:border-[#FF4500]/20 font-bold uppercase tracking-widest px-6 h-11"
           >
             <Download className="mr-2 h-4 w-4" />
             Export PDF
           </Button>
           <Button 
             onClick={handleSave} 
             disabled={saving}
             className="bg-[#FF4500] hover:bg-[#FF8C00] text-[#0D0D0D] font-bold uppercase tracking-widest px-8 h-11"
           >
             {saving ? 'Saving...' : 'Save Changes'}
             <Save className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-white/5 p-8 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">CV Name</label>
                <Input 
                  value={cv.name}
                  onChange={(e) => setCv({ ...cv, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F5F0E8] font-mono focus:border-[#FF4500]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">Target Role</label>
                <Input 
                  value={cv.target_role || ''}
                  onChange={(e) => setCv({ ...cv, target_role: e.target.value })}
                  className="bg-white/5 border-white/10 text-[#F5F0E8] font-mono focus:border-[#FF4500]/50"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">Content</label>
              <Textarea 
                value={cv.content || ''}
                onChange={(e) => setCv({ ...cv, content: e.target.value })}
                className="min-h-[600px] bg-white/5 border-white/10 text-[#F5F0E8] font-mono p-4 focus:border-[#FF4500]/50 transition-all text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#FF4500]/30 p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-[#FF4500]" />
               <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF4500]">AI Optimizer</h2>
            </div>
            <p className="text-xs font-mono text-[#F5F0E8]/50 leading-relaxed uppercase tracking-widest">
               Your career bio is available. We can rewrite this CV to match {cv.target_role || 'this role'} better.
            </p>
            <Button variant="outline" className="w-full border-white/10 text-white/40 hover:text-[#FF4500] hover:border-[#FF4500]/30 font-bold uppercase tracking-widest text-[10px] h-11" disabled>
               Optimise for Selection
            </Button>
          </div>

          <div className="bg-white/5 border border-white/5 p-8 rounded-2xl space-y-4">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#F5F0E8]/30">History</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F0E8]/20">
                   <span>Last major edit</span>
                   <span>{new Date(cv.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F0E8]/20">
                   <span>Created</span>
                   <span>{new Date(cv.created_at).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
