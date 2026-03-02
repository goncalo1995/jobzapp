// app/[locale]/dashboard/me/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Wand2, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [rawBio, setRawBio] = useState('');
  const [profile, setProfile] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setRawBio(data.raw_bio || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [supabase]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        raw_bio: rawBio,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error('Failed to save');
    } else {
      toast.success('Profile saved');
    }
    setSaving(false);
  }

  async function handleParse() {
    if (!rawBio.trim()) {
      toast.error('Write or paste your career info first');
      return;
    }
    setParsing(true);
    try {
      const res = await fetch('/api/me/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawBio }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProfile((prev: any) => ({ ...prev, parsed_data: data.parsedData }));
      toast.success('Career data extracted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Parsing failed');
    }
    setParsing(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Your Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Paste your career history — the AI will extract structured data for resume tailoring.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Career Bio</label>
              <div className="flex gap-2">
                <Button 
                  onClick={handleParse} 
                  disabled={parsing} 
                  variant="outline"
                  size="sm"
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                  {parsing ? 'Parsing...' : 'AI Parse'}
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  size="sm"
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
            <Textarea 
              value={rawBio}
              onChange={(e) => setRawBio(e.target.value)}
              placeholder="Paste your LinkedIn summary, CV content, or write about your experience, skills, and career goals..."
              className="min-h-[400px] bg-secondary/50 border-border text-foreground p-4 text-sm leading-relaxed resize-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          {profile?.parsed_data ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <h2 className="text-sm font-semibold text-foreground">Extracted Data</h2>
              </div>
              <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 overflow-auto max-h-80 whitespace-pre-wrap">
                {JSON.stringify(profile.parsed_data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Getting Started</h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Write or paste your career info, then click &quot;AI Parse&quot; to extract structured data that powers resume tailoring.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary">Tips</h2>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
              <li>• Include job titles, companies, and dates</li>
              <li>• List key skills and technologies</li>
              <li>• Mention achievements with metrics</li>
              <li>• Add education and certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
