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
    <div className="max-w-4xl space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <Link href="/dashboard/cvs" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to Resumes
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">Edit Resume</h1>
            <p className="text-muted-foreground text-sm">
              Tailoring for: <span className="font-medium text-foreground">{cv.target_role || 'General'}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
           <Button 
             variant="outline"
             onClick={handleDelete}
             className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
             size="icon"
           >
             <Trash2 className="h-4 w-4" />
           </Button>
           <Button 
             variant="outline"
             onClick={handleExport}
           >
             <Download className="mr-2 h-4 w-4" />
             Export PDF
           </Button>
           <Button onClick={handleSave} disabled={saving}>
             {saving ? 'Saving...' : 'Save Changes'}
             <Save className="ml-1.5 h-4 w-4" />
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border p-6 rounded-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Resume Name</label>
                <Input 
                  value={cv.name}
                  onChange={(e) => setCv({ ...cv, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Role</label>
                <Input 
                  value={cv.target_role || ''}
                  onChange={(e) => setCv({ ...cv, target_role: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Content</label>
              </div>
              <Textarea 
                value={cv.content || ''}
                onChange={(e) => setCv({ ...cv, content: e.target.value })}
                className="min-h-[600px] font-mono text-sm leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-primary" />
               <h2 className="text-xs font-semibold text-primary">AI Optimizer</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
               Your career bio is available. We can rewrite this CV to match {cv.target_role || 'this role'} better.
            </p>
            <Button variant="outline" className="w-full text-xs" disabled>
               Optimise for Selection
            </Button>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl space-y-4">
             <h3 className="text-xs font-semibold text-muted-foreground">History</h3>
             <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                   <span>Last major edit</span>
                   <span>{new Date(cv.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
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
