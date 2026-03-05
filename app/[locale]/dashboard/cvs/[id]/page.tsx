// app/[locale]/dashboard/cvs/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FileText, Save, ArrowLeft, Download, Trash2, Zap, Sparkles, Plus, Briefcase, GraduationCap, Code2, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { PDFViewer } from '@react-pdf/renderer';
import { CVDoc } from '@/lib/pdf-generator';
import { Eye, Settings2 } from 'lucide-react';

export default function EditCVPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cv, setCv] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [styleConfig, setStyleConfig] = useState({
    fontSize: 10,
    headerFontSize: 24,
    margins: 40,
    sectionSpacing: 15
  });
  const [cvData, setCvData] = useState<any>({
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
    async function fetchCV() {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setCv(data);
        try {
          const parsed = JSON.parse(data.content || '{}');
          setCvData({
            full_name: parsed.full_name || data.name || '',
            current_role: parsed.current_role || data.target_role || '',
            summary: parsed.summary || data.content || '',
            contact: parsed.contact || { email: '', phone: '', location: '', linkedin: '', github: '' },
            skills: parsed.skills || [],
            experience: parsed.experience || [],
            education: parsed.education || [],
            projects: parsed.projects || []
          });
        } catch (e) {
          // Fallback for legacy text content
          setCvData((prev: any) => ({
             ...prev,
             full_name: data.name || '',
             current_role: data.target_role || '',
             summary: data.content || ''
          }));
        }
      }
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
        content: JSON.stringify(cvData),
        markdown_content: cvData.summary,
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
    }
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
            PDF
           </Button>
           <Button 
             variant="outline"
             onClick={() => setShowPreview(!showPreview)}
           >
             <Eye className="mr-2 h-4 w-4" />
             {showPreview ? 'Hide Preview' : 'Show Preview'}
           </Button>
           <Button onClick={handleSave} disabled={saving}>
             <Save className="ml-1.5 h-4 w-4" />
             {saving ? 'Saving...' : 'Save Changes'}
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border p-6 rounded-xl space-y-6 sticky top-8">
            {showPreview ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-foreground">
                  <Settings2 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Style Settings</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-medium">
                      <label className="text-muted-foreground uppercase">Base Font Size</label>
                      <span className="text-foreground">{styleConfig.fontSize}pt</span>
                    </div>
                    <Slider 
                      value={[styleConfig.fontSize]} 
                      min={8} 
                      max={14} 
                      step={0.5}
                      onValueChange={([v]) => setStyleConfig({...styleConfig, fontSize: v})}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-medium">
                      <label className="text-muted-foreground uppercase">Margins</label>
                      <span className="text-foreground">{styleConfig.margins}px</span>
                    </div>
                    <Slider 
                      value={[styleConfig.margins]} 
                      min={10} 
                      max={80} 
                      step={5}
                      onValueChange={([v]) => setStyleConfig({...styleConfig, margins: v})}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-medium">
                      <label className="text-muted-foreground uppercase">Section Spacing</label>
                      <span className="text-foreground">{styleConfig.sectionSpacing}px</span>
                    </div>
                    <Slider 
                      value={[styleConfig.sectionSpacing]} 
                      min={5} 
                      max={40} 
                      step={5}
                      onValueChange={([v]) => setStyleConfig({...styleConfig, sectionSpacing: v})}
                    />
                  </div>
                </div>

                <Separator />
                
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
                   <div className="flex items-center gap-2 text-primary">
                     <Sparkles className="h-4 w-4" />
                     <span className="text-xs font-semibold">One-Page Tip</span>
                   </div>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">
                     Lower the font size or margins if your content doesn&apos;t fit on a single page.
                   </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">CV Name</label>
                    <Input 
                      value={cv.name}
                      onChange={(e) => setCv({ ...cv, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Target Role</label>
                    <Input 
                      value={cv.target_role || ''}
                      onChange={(e) => {
                        setCv({ ...cv, target_role: e.target.value });
                        setCvData((prev: any) => ({ ...prev, current_role: e.target.value }));
                      }}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
                   <div className="flex items-center gap-2 text-primary">
                     <Sparkles className="h-4 w-4" />
                     <span className="text-xs font-semibold">AI Assistant</span>
                   </div>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">
                     To perform a new AI-powered tailoring, create a new resume from the main dashboard.
                   </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {showPreview ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm aspect-[1/1.4] w-full">
              <PDFViewer width="100%" height="100%" className="border-none">
                <CVDoc data={cvData} config={styleConfig} />
              </PDFViewer>
            </div>
          ) : (
            <>
              <SectionContainer title="Personal Details" icon={<Type className="h-4 w-4" />}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <Input 
                      value={cvData.contact?.email || ''} 
                      onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, email: e.target.value}})}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Phone</label>
                    <Input 
                      value={cvData.contact?.phone || ''} 
                      onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, phone: e.target.value}})}
                      placeholder="+351 912 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input 
                      value={cvData.contact?.location || ''} 
                      onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, location: e.target.value}})}
                      placeholder="Lisbon, Portugal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">LinkedIn / Portfolio</label>
                    <Input 
                      value={cvData.contact?.linkedin || ''} 
                      onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, linkedin: e.target.value}})}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">GitHub</label>
                    <Input 
                      value={cvData.contact?.github || ''} 
                      onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, github: e.target.value}})}
                      placeholder="github.com/username"
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

              <SectionContainer title="Technical Skills" icon={<Code2 className="h-4 w-4" />}>
                <div className="space-y-4">
                  {cvData.skills?.map((skill: any, idx: number) => {
                    const isGrouped = typeof skill === 'object' && skill !== null;
                    return (
                      <div key={idx} className="bg-secondary/20 border border-border/50 rounded-lg p-3 space-y-2 relative group">
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex items-center justify-center p-1"
                          onClick={() => {
                            const newSkills = [...cvData.skills];
                            newSkills.splice(idx, 1);
                            setCvData({...cvData, skills: newSkills});
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pr-6">
                          <Input 
                            value={isGrouped ? skill.category : 'Other'} 
                            placeholder="Category (e.g. Languages)"
                            onChange={(e) => {
                              const newSkills = [...cvData.skills];
                              if (typeof newSkills[idx] === 'string') {
                                newSkills[idx] = { category: e.target.value, items: [newSkills[idx]] };
                              } else {
                                newSkills[idx].category = e.target.value;
                              }
                              setCvData({...cvData, skills: newSkills});
                            }}
                            className="h-7 text-xs font-semibold md:col-span-1"
                          />
                          <Input 
                            value={isGrouped ? (Array.isArray(skill.items) ? skill.items.join(', ') : skill.items) : skill} 
                            placeholder="Comma separated skills (e.g. Java, Python)"
                            onChange={(e) => {
                              const newSkills = [...cvData.skills];
                              const itemsList = e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                              if (typeof newSkills[idx] === 'string') {
                                newSkills[idx] = { category: 'Other', items: itemsList };
                              } else {
                                newSkills[idx].items = itemsList;
                              }
                              setCvData({...cvData, skills: newSkills});
                            }}
                            className="h-7 text-xs md:col-span-2"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed h-8 text-xs"
                    onClick={() => {
                      setCvData({
                        ...cvData, 
                        skills: [...(cvData.skills || []), { category: '', items: [] }]
                      });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" /> Add Skill Category
                  </Button>
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
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Points / Details (e.g. Master Thesis)</label>
                          <div className="space-y-2">
                            {edu.points?.map((point: string, pIdx: number) => (
                              <div key={pIdx} className="flex gap-2">
                                <Input 
                                  value={point} 
                                  onChange={(e) => {
                                    const newEdu = [...cvData.education];
                                    newEdu[idx].points[pIdx] = e.target.value;
                                    setCvData({...cvData, education: newEdu});
                                  }}
                                  className="h-7 text-xs"
                                />
                                <button 
                                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive flex items-center justify-center"
                                  onClick={() => {
                                    const newEdu = [...cvData.education];
                                    newEdu[idx].points.splice(pIdx, 1);
                                    setCvData({...cvData, education: newEdu});
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-5 text-[10px] p-0 text-primary"
                              onClick={() => {
                                const newEdu = [...cvData.education];
                                if (!newEdu[idx].points) newEdu[idx].points = [];
                                newEdu[idx].points.push("");
                                setCvData({...cvData, education: newEdu});
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
                        setCvData({
                          ...cvData, 
                          education: [...(cvData.education || []), { institution: '', degree: '', period: '', points: [] }]
                        });
                      }}
                    >
                      <Plus className="h-3 w-3 mr-2" /> Add Education
                    </Button>
                  </div>
                </SectionContainer>

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
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Tech Stack (comma separated)</label>
                        <Input 
                          value={proj.tech_stack?.join(', ') || ''} 
                          placeholder="e.g. React, Node.js, Typescript"
                          onChange={(e) => {
                            const newProj = [...cvData.projects];
                            newProj[idx].tech_stack = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            setCvData({...cvData, projects: newProj});
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
                        projects: [...(cvData.projects || []), { name: '', description: '', tech_stack: [] }]
                      });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" /> Add Project
                  </Button>
                </div>
              </SectionContainer>
            </>
          )}
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
