// app/[locale]/dashboard/cvs/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Save, ArrowLeft, Zap, Sparkles, AlertCircle, Plus, Trash2, Briefcase, GraduationCap, Code2, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';

export default function NewCVPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [jobDescription, setJobDescription] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [formData, setFormData] = useState({
    name: 'My New CV',
    target_role: '',
  });

  const [cvData, setCvData] = useState<any>({
    full_name: '',
    current_role: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: []
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
        if (data.parsed_data) {
          const parsed = data.parsed_data as any;
          setCvData({
            ...parsed,
            full_name: parsed.full_name || '',
            certifications: parsed.certifications || []
          });
          setFormData(prev => ({ ...prev, target_role: parsed.current_role || '' }));
        }
      }
    }
    fetchProfile();
  }, [supabase]);

  async function handleTailor() {
    if (!jobDescription.trim()) {
      toast.error('Paste the Job Description first');
      return;
    }
    setTailoring(true);
    try {
      const res = await fetch('/api/cv/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: cvData, jobDescription }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCvData(data.tailoredData);
      setFormData(prev => ({ ...prev, target_role: data.tailoredData.current_role || prev.target_role }));
      toast.success('CV tailored successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Tailoring failed');
    }
    setTailoring(false);
  }

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
        content: JSON.stringify(cvData),
        markdown_content: cvData.summary, // Fallback for simple display
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create CV');
    } else {
      toast.success('CV created successfully');
      router.push(`/dashboard/cvs`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <Link href="/dashboard/cvs" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to Resumes
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">CV Builder</h1>
            <p className="text-muted-foreground text-sm">Tailor your resume for a specific job.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Saving...' : 'Save CV'}
            <Save className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Controls & Job Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl space-y-6 sticky top-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">CV Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Senior Dev - Google"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Target Role</label>
                <Input 
                  value={formData.target_role}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, target_role: e.target.value }));
                    setCvData((prev: any) => ({ ...prev, current_role: e.target.value }));
                  }}
                  placeholder="Ex: Frontend Engineer"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Job Description</label>
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste the JD below to unlock AI tailoring. We&apos;ll rewrite your content to highlight relevance.
              </p>
              <Textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements here..."
                className="min-h-[300px] text-sm leading-relaxed resize-none bg-secondary/30"
              />
              <Button 
                onClick={handleTailor} 
                disabled={tailoring || !profile?.parsed_data} 
                className="w-full"
                variant="outline"
              >
                {tailoring ? 'Tailoring...' : 'Tailor with AI'}
                <Sparkles className="ml-1.5 h-4 w-4" />
              </Button>
              {!profile?.parsed_data && (
                <p className="text-[10px] text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  Fill your Profile data first to enable AI tailoring.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: CV Editor */}
        <div className="lg:col-span-8 space-y-6">
          <SectionContainer title="Personal Summary" icon={<Type className="h-4 w-4" />}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input 
                  value={cvData.full_name || ''} 
                  onChange={(e) => setCvData({...cvData, full_name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Current Role</label>
                <Input 
                  value={cvData.current_role || ''} 
                  onChange={(e) => setCvData({...cvData, current_role: e.target.value})}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Professional Summary</label>
              <Textarea 
                value={cvData.summary || ''} 
                onChange={(e) => setCvData({...cvData, summary: e.target.value})}
                placeholder="A brief overview of your professional background..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </SectionContainer>

          <SectionContainer title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
            <div className="space-y-6">
              {cvData.experience?.map((exp: any, idx: number) => (
                <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-4 space-y-4 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const newExp = [...cvData.experience];
                      newExp.splice(idx, 1);
                      setCvData({...cvData, experience: newExp});
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
                          const newExp = [...cvData.experience];
                          newExp[idx].company = e.target.value;
                          setCvData({...cvData, experience: newExp});
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Role</label>
                      <Input 
                        value={exp.role || ''} 
                        onChange={(e) => {
                          const newExp = [...cvData.experience];
                          newExp[idx].role = e.target.value;
                          setCvData({...cvData, experience: newExp});
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Period</label>
                      <Input 
                        value={exp.period || ''} 
                        onChange={(e) => {
                          const newExp = [...cvData.experience];
                          newExp[idx].period = e.target.value;
                          setCvData({...cvData, experience: newExp});
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
                              const newExp = [...cvData.experience];
                              newExp[idx].points[pIdx] = e.target.value;
                              setCvData({...cvData, experience: newExp});
                            }}
                            className="h-8 text-sm"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const newExp = [...cvData.experience];
                              newExp[idx].points.splice(pIdx, 1);
                              setCvData({...cvData, experience: newExp});
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
                          const newExp = [...cvData.experience];
                          if (!newExp[idx].points) newExp[idx].points = [];
                          newExp[idx].points.push("");
                          setCvData({...cvData, experience: newExp});
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
                  setCvData({
                    ...cvData, 
                    experience: [...(cvData.experience || []), { company: '', role: '', period: '', points: [''] }]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </div>
          </SectionContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionContainer title="Skills" icon={<Code2 className="h-4 w-4" />}>
              <div className="space-y-6">
                {cvData.skills?.map((skillGroup: any, groupIdx: number) => {
                  if (typeof skillGroup === 'string') {
                    // Legacy flat skill string
                    return (
                      <Badge key={groupIdx} variant="secondary" className="flex items-center gap-1 py-1 w-max mb-2">
                        {skillGroup}
                        <button onClick={() => {
                          const newSkills = [...cvData.skills];
                          newSkills.splice(groupIdx, 1);
                          setCvData({...cvData, skills: newSkills});
                        }}>
                          <Trash2 className="h-2.5 w-2.5 hover:text-destructive" />
                        </button>
                      </Badge>
                    );
                  }
                  // Grouped skill object: { category: string, items: string[] }
                  return (
                    <div key={groupIdx} className="space-y-3 bg-secondary/10 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between">
                        <Input 
                          value={skillGroup.category || ''} 
                          onChange={(e) => {
                            const newSkills = [...cvData.skills];
                            newSkills[groupIdx].category = e.target.value;
                            setCvData({...cvData, skills: newSkills});
                          }}
                          className="h-8 text-sm font-bold bg-background w-1/2"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                             const newSkills = [...cvData.skills];
                             newSkills.splice(groupIdx, 1);
                             setCvData({...cvData, skills: newSkills});
                          }}
                          className="text-muted-foreground hover:text-destructive h-8 px-2"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {skillGroup.items?.map((item: string, itemIdx: number) => (
                          <Badge key={itemIdx} variant="secondary" className="flex items-center gap-1 py-1">
                            {item}
                            <button onClick={() => {
                              const newSkills = [...cvData.skills];
                              newSkills[groupIdx].items.splice(itemIdx, 1);
                              setCvData({...cvData, skills: newSkills});
                            }}>
                              <Trash2 className="h-2.5 w-2.5 hover:text-destructive" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                         <Input 
                           placeholder={`Add a skill to ${skillGroup.category || 'this category'}...`}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               const val = (e.target as HTMLInputElement).value.trim();
                               if (val) {
                                 const newSkills = [...cvData.skills];
                                 if (!newSkills[groupIdx].items) newSkills[groupIdx].items = [];
                                 if (!newSkills[groupIdx].items.includes(val)) {
                                   newSkills[groupIdx].items.push(val);
                                   setCvData({...cvData, skills: newSkills});
                                 }
                                 (e.target as HTMLInputElement).value = '';
                               }
                             }
                           }}
                           className="h-8 text-sm"
                         />
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed"
                  onClick={() => {
                     const newSkills = [...(cvData.skills || [])];
                     // Only add object type since we are migrating to them
                     newSkills.push({ category: 'New Category', items: [] });
                     setCvData({...cvData, skills: newSkills});
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Skill Category
                </Button>
              </div>
            </SectionContainer>

            <SectionContainer title="Education" icon={<GraduationCap className="h-4 w-4" />}>
              <div className="space-y-4">
                {cvData.education?.map((edu: any, idx: number) => (
                  <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-2 relative group">
                    <button 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const newEdu = [...cvData.education];
                        newEdu.splice(idx, 1);
                        setCvData({...cvData, education: newEdu});
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <Input 
                      value={edu.institution || ''} 
                      placeholder="Institution"
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[idx].institution = e.target.value;
                        setCvData({...cvData, education: newEdu});
                      }}
                      className="h-7 text-xs font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        value={edu.degree || ''} 
                        placeholder="Degree"
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[idx].degree = e.target.value;
                          setCvData({...cvData, education: newEdu});
                        }}
                        className="h-7 text-xs"
                      />
                      <Input 
                        value={edu.period || ''} 
                        placeholder="Period"
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[idx].period = e.target.value;
                          setCvData({...cvData, education: newEdu});
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed h-8 text-xs"
                  onClick={() => {
                    setCvData({
                      ...cvData, 
                      education: [...(cvData.education || []), { institution: '', degree: '', period: '' }]
                    });
                  }}
                >
                  <Plus className="h-3 w-3 mr-2" /> Add Education
                </Button>
              </div>
            </SectionContainer>
          </div>

          <SectionContainer title="Key Projects" icon={<Code2 className="h-4 w-4" />}>
            <div className="space-y-4">
              {cvData.projects?.map((proj: any, idx: number) => (
                <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-2 relative group">
                  <button 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const newProj = [...cvData.projects];
                      newProj.splice(idx, 1);
                      setCvData({...cvData, projects: newProj});
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <Input 
                    value={proj.name || ''} 
                    placeholder="Project Name"
                    onChange={(e) => {
                      const newProj = [...cvData.projects];
                      newProj[idx].name = e.target.value;
                      setCvData({...cvData, projects: newProj});
                    }}
                    className="h-7 text-xs font-semibold"
                  />
                  <Textarea 
                    value={proj.description || ''} 
                    placeholder="Description"
                    onChange={(e) => {
                      const newProj = [...cvData.projects];
                      newProj[idx].description = e.target.value;
                      setCvData({...cvData, projects: newProj});
                    }}
                    className="min-h-[60px] text-xs resize-none"
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed h-8 text-xs"
                onClick={() => {
                  setCvData({
                    ...cvData, 
                    projects: [...(cvData.projects || []), { name: '', description: '' }]
                  });
                }}
              >
                <Plus className="h-3 w-3 mr-2" /> Add Project
              </Button>
            </div>
          </SectionContainer>

          <SectionContainer title="Certifications / Achievements" icon={<Code2 className="h-4 w-4" />}>
            <div className="space-y-4">
              {cvData.certifications?.map((cert: any, idx: number) => (
                <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-2 relative group">
                  <button 
                    className="absolute top-2 right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive w-6 h-6 rounded-md hover:bg-destructive/10"
                    onClick={() => {
                      const newCerts = [...cvData.certifications];
                      newCerts.splice(idx, 1);
                      setCvData({...cvData, certifications: newCerts});
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Input 
                    value={cert.name || ''} 
                    placeholder="Certification Name or Achievement"
                    onChange={(e) => {
                      const newCerts = [...cvData.certifications];
                      newCerts[idx].name = e.target.value;
                      setCvData({...cvData, certifications: newCerts});
                    }}
                    className="h-7 text-xs font-semibold pr-8"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={cert.issuer || ''} 
                      placeholder="Issuer (e.g. AWS, Microsoft)"
                      onChange={(e) => {
                        const newCerts = [...cvData.certifications];
                        newCerts[idx].issuer = e.target.value;
                        setCvData({...cvData, certifications: newCerts});
                      }}
                      className="h-7 text-xs"
                    />
                    <Input 
                      value={cert.date || ''} 
                      placeholder="Date / Year"
                      onChange={(e) => {
                        const newCerts = [...cvData.certifications];
                        newCerts[idx].date = e.target.value;
                        setCvData({...cvData, certifications: newCerts});
                      }}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed h-8 text-xs"
                onClick={() => {
                  setCvData({
                    ...cvData, 
                    certifications: [...(cvData.certifications || []), { name: '', issuer: '', date: '' }]
                  });
                }}
              >
                <Plus className="h-3 w-3 mr-2" /> Add Certification
              </Button>
            </div>
          </SectionContainer>
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

function Separator() {
  return <div className="h-px bg-border w-full" />;
}
