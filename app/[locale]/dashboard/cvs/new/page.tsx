// app/[locale]/dashboard/cvs/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Save, ArrowLeft, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export default function NewCVPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: 'My New CV',
    target_role: '',
    content: '',
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
        // Pre-fill content if profile has a bio
        if (data.raw_bio && !formData.content) {
          setFormData(prev => ({ ...prev, content: data.raw_bio ?? '' }));
        }
      }
    }
    fetchProfile();
  }, [supabase]);

  async function handleCreate() {
    if (!formData.name) {
      toast.error('CV name is required');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Not authenticated');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        name: formData.name,
        target_role: formData.target_role,
        content: formData.content,
        markdown_content: formData.content, // For now keeping same
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create CV');
      console.error(error);
    } else {
      toast.success('CV created successfully');
      router.push(`/dashboard/cvs`);
    }
    setLoading(false);
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
            <h1 className="text-3xl font-heading font-bold text-foreground">New Resume</h1>
            <p className="text-muted-foreground text-sm">Draft your tailored resume.</p>
          </div>
        </div>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Resume'}
          <Save className="ml-1.5 h-4 w-4" />
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border p-6 rounded-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Resume Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Senior Dev - Google"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Role</label>
                <Input 
                  value={formData.target_role}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_role: e.target.value }))}
                  placeholder="Ex: Frontend Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Content</label>
                <span className="text-xs text-muted-foreground italic">Supports basic text for now</span>
              </div>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your CV content here..."
                className="min-h-[500px] font-mono text-sm leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions and Info */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary">
                AI Assist
              </h2>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use AI to rewrite your content for high ATS match based on your target role.
            </p>
            
            <Button 
              variant="outline"
              className="w-full text-xs"
              disabled
            >
              Tailor for Role (Coming Soon)
            </Button>
          </div>

          {!profile?.raw_bio && (
            <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-xl flex gap-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-destructive">Profile Incomplete</p>
                <p className="text-xs text-destructive/80 leading-relaxed">
                  Your profile bio is empty. Complete it to enable AI tailoring features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
