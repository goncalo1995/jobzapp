// app/[locale]/dashboard/me/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Wand2, Save, CheckCircle, Plus, Trash2, Briefcase, GraduationCap, Code2, Type, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [rawBio, setRawBio] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [structuredData, setStructuredData] = useState<any>({
    full_name: '',
    current_role: '',
    summary: '',
    contact: {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: ''
    },
    skills: [],
    experience: [],
    education: [],
    projects: []
  });

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
          if (data.parsed_data) {
            setStructuredData(data.parsed_data);
          }
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
        parsed_data: structuredData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error('Failed to save');
    } else {
      toast.success('Profile saved');
      setProfile((prev: any) => ({ ...prev, raw_bio: rawBio, parsed_data: structuredData }));
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
      setStructuredData(data.parsedData);
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
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Your Profile
          </h1>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-fit"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Paste your career history — the AI will extract structured data for resume tailoring.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Raw Brain Dump */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">Brain Dump</label>
              </div>
              <Button 
                onClick={handleParse} 
                disabled={parsing} 
                variant="outline"
                size="sm"
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {parsing ? 'Extracting...' : 'AI Extract'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste your experience here and click &quot;AI Extract&quot; to build your structured profile.
            </p>
            <Textarea 
              value={rawBio}
              onChange={(e) => setRawBio(e.target.value)}
              placeholder="Paste your LinkedIn summary, CV content, or write about your experience..."
              className="min-h-[500px] field-sizing-fixed bg-secondary/30 border-border text-foreground p-4 text-sm leading-relaxed resize-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Right: Structured Sections */}
        <div className="lg:col-span-8 space-y-6">
          <SectionContainer title="Personal Details" icon={<Type className="h-4 w-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input 
                  value={structuredData.full_name || ''} 
                  onChange={(e) => setStructuredData({...structuredData, full_name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Current Role</label>
                <Input 
                  value={structuredData.current_role || ''} 
                  onChange={(e) => setStructuredData({...structuredData, current_role: e.target.value})}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input 
                  value={structuredData.contact?.email || ''} 
                  onChange={(e) => setStructuredData({...structuredData, contact: {...structuredData.contact, email: e.target.value}})}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input 
                  value={structuredData.contact?.phone || ''} 
                  onChange={(e) => setStructuredData({...structuredData, contact: {...structuredData.contact, phone: e.target.value}})}
                  placeholder="+351 912 345 678"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Input 
                  value={structuredData.contact?.location || ''} 
                  onChange={(e) => setStructuredData({...structuredData, contact: {...structuredData.contact, location: e.target.value}})}
                  placeholder="Lisbon, Portugal"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">LinkedIn / Portfolio</label>
                <Input 
                  value={structuredData.contact?.linkedin || ''} 
                  onChange={(e) => setStructuredData({...structuredData, contact: {...structuredData.contact, linkedin: e.target.value}})}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">GitHub</label>
                <Input 
                  value={structuredData.contact?.github || ''} 
                  onChange={(e) => setStructuredData({...structuredData, contact: {...structuredData.contact, github: e.target.value}})}
                  placeholder="github.com/username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Professional Summary</label>
              <Textarea 
                value={structuredData.summary || ''} 
                onChange={(e) => setStructuredData({...structuredData, summary: e.target.value})}
                placeholder="A brief overview of your professional background..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </SectionContainer>

          <SectionContainer title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
            <div className="space-y-6">
              {structuredData.experience?.map((exp: any, idx: number) => (
                <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-4 space-y-4 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const newExp = [...structuredData.experience];
                      newExp.splice(idx, 1);
                      setStructuredData({...structuredData, experience: newExp});
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Company</label>
                      <Input 
                        value={exp.company || ''} 
                        onChange={(e) => {
                          const newExp = [...structuredData.experience];
                          newExp[idx].company = e.target.value;
                          setStructuredData({...structuredData, experience: newExp});
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Role</label>
                      <Input 
                        value={exp.role || ''} 
                        onChange={(e) => {
                          const newExp = [...structuredData.experience];
                          newExp[idx].role = e.target.value;
                          setStructuredData({...structuredData, experience: newExp});
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Period</label>
                      <Input 
                        value={exp.period || ''} 
                        onChange={(e) => {
                          const newExp = [...structuredData.experience];
                          newExp[idx].period = e.target.value;
                          setStructuredData({...structuredData, experience: newExp});
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Achievements / Points</label>
                    <div className="space-y-2">
                      {exp.points?.map((point: string, pIdx: number) => (
                        <div key={pIdx} className="flex gap-2">
                          <Input 
                            value={point} 
                            onChange={(e) => {
                              const newExp = [...structuredData.experience];
                              newExp[idx].points[pIdx] = e.target.value;
                              setStructuredData({...structuredData, experience: newExp});
                            }}
                            className="h-8 text-sm"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const newExp = [...structuredData.experience];
                              newExp[idx].points.splice(pIdx, 1);
                              setStructuredData({...structuredData, experience: newExp});
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-6 text-[10px] p-0 text-primary"
                        onClick={() => {
                          const newExp = [...structuredData.experience];
                          if (!newExp[idx].points) newExp[idx].points = [];
                          newExp[idx].points.push("");
                          setStructuredData({...structuredData, experience: newExp});
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add point
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed"
                onClick={() => {
                  setStructuredData({
                    ...structuredData, 
                    experience: [...(structuredData.experience || []), { company: '', role: '', period: '', points: [''] }]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </div>
          </SectionContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionContainer title="Skills" icon={<Code2 className="h-4 w-4" />}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-secondary/20 rounded-lg border border-border/50">
                  {structuredData.skills?.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1 py-1">
                      {skill}
                      <button onClick={() => {
                        const newSkills = [...structuredData.skills];
                        newSkills.splice(idx, 1);
                        setStructuredData({...structuredData, skills: newSkills});
                      }}>
                        <Trash2 className="h-2.5 w-2.5 hover:text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a skill..." 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !structuredData.skills?.includes(val)) {
                          setStructuredData({...structuredData, skills: [...(structuredData.skills || []), val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </SectionContainer>

            <SectionContainer title="Education" icon={<GraduationCap className="h-4 w-4" />}>
              <div className="space-y-4">
                {structuredData.education?.map((edu: any, idx: number) => (
                  <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-2 relative group">
                    <button 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const newEdu = [...structuredData.education];
                        newEdu.splice(idx, 1);
                        setStructuredData({...structuredData, education: newEdu});
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <Input 
                      value={edu.institution || ''} 
                      placeholder="Institution"
                      onChange={(e) => {
                        const newEdu = [...structuredData.education];
                        newEdu[idx].institution = e.target.value;
                        setStructuredData({...structuredData, education: newEdu});
                      }}
                      className="h-7 text-xs font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        value={edu.degree || ''} 
                        placeholder="Degree"
                        onChange={(e) => {
                          const newEdu = [...structuredData.education];
                          newEdu[idx].degree = e.target.value;
                          setStructuredData({...structuredData, education: newEdu});
                        }}
                        className="h-7 text-xs"
                      />
                      <Input 
                        value={edu.period || ''} 
                        placeholder="Period"
                        onChange={(e) => {
                          const newEdu = [...structuredData.education];
                          newEdu[idx].period = e.target.value;
                          setStructuredData({...structuredData, education: newEdu});
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Points / Details (e.g. Master Thesis)</label>
                      <div className="space-y-2">
                        {edu.points?.map((point: string, pIdx: number) => (
                          <div key={pIdx} className="flex gap-2">
                            <Input 
                              value={point} 
                              onChange={(e) => {
                                const newEdu = [...structuredData.education];
                                newEdu[idx].points[pIdx] = e.target.value;
                                setStructuredData({...structuredData, education: newEdu});
                              }}
                              className="h-7 text-xs"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                const newEdu = [...structuredData.education];
                                newEdu[idx].points.splice(pIdx, 1);
                                setStructuredData({...structuredData, education: newEdu});
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-5 text-[10px] p-0 text-primary"
                          onClick={() => {
                            const newEdu = [...structuredData.education];
                            if (!newEdu[idx].points) newEdu[idx].points = [];
                            newEdu[idx].points.push("");
                            setStructuredData({...structuredData, education: newEdu});
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add detail
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed h-8 text-xs"
                  onClick={() => {
                    setStructuredData({
                      ...structuredData, 
                      education: [...(structuredData.education || []), { institution: '', degree: '', period: '' }]
                    });
                  }}
                >
                  <Plus className="h-3 w-3 mr-2" /> Add Education
                </Button>
              </div>
            </SectionContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionContainer({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}
