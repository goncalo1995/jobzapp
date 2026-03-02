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
    <div className="max-w-4xl space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/dashboard/cvs" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F5F0E8]/30 hover:text-[#FF4500] transition-colors group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl font-heading uppercase tracking-tighter text-[#F5F0E8]">
              New <span className="text-[#FF4500] italic">CV</span>
            </h1>
            <p className="text-[#F5F0E8]/50 font-mono text-sm uppercase tracking-widest">
              Draft your tailored resume.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleCreate} 
          disabled={loading}
          className="bg-[#FF4500] hover:bg-[#FF8C00] text-[#0D0D0D] font-bold uppercase tracking-widest px-8"
        >
          {loading ? 'Creating...' : 'Create CV'}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-white/5 p-8 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">CV Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Senior Dev - Google"
                  className="bg-white/5 border-white/10 text-[#F5F0E8] font-mono focus:border-[#FF4500]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">Target Role</label>
                <Input 
                  value={formData.target_role}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_role: e.target.value }))}
                  placeholder="Ex: Frontend Engineer"
                  className="bg-white/5 border-white/10 text-[#F5F0E8] font-mono focus:border-[#FF4500]/50"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">Content</label>
                <span className="text-[9px] text-[#F5F0E8]/20 font-mono uppercase tracking-widest italic">Supports basic text for now</span>
              </div>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your CV content here..."
                className="min-h-[500px] bg-white/5 border-white/10 text-[#F5F0E8] font-mono p-4 focus:border-[#FF4500]/50 transition-all text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions and Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#FF4500]/10 to-[#1A1A1A] border border-[#FF4500]/30 p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF4500]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF4500]">
                AI Assist
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-mono text-[#F5F0E8]/50 leading-relaxed">
                Use AI to rewrite your content for high ATS match based on your target role.
              </p>
              
              <Button 
                variant="outline"
                className="w-full border-white/10 text-white/40 hover:text-[#FF4500] hover:border-[#FF4500]/30 font-bold uppercase tracking-widest text-[10px] bg-white/5 transition-all"
                disabled
              >
                Tailor for Role (Coming Soon)
              </Button>
            </div>
          </div>

          {!profile?.raw_bio && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex gap-4">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Profile Incomplete</p>
                <p className="text-[10px] text-red-500/50 font-mono leading-relaxed">
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
