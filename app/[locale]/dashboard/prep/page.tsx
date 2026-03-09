"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Briefcase, FileText, Loader2, Sparkles, MessageCircle, 
  AlertCircle, CheckCircle2, GraduationCap, Clock, Flame, 
  Eye, EyeOff, Lightbulb, BookOpen, History, Trash2, Code, LayoutTemplate, Zap, ShieldAlert, Calendar, CalendarDays, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { AIModelSelector } from "@/components/ai/model-selector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";

// Types
interface PrepResource {
  name: string;
  url: string;
  type: 'leetcode' | 'article' | 'video' | 'book' | 'practice' | 'cheatsheet';
}

interface PrepQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'strategic' | 'case' | 'mixed';
  whyTheyAsk: string;
  candidateStrategy: string;
  hint?: string;
  resources?: PrepResource[];
}

interface PrepData {
  companyInsights: string;
  roleAnalysis: string;
  customFocus?: string;
  trainingPlan: string;
  questions: PrepQuestion[];
}

interface PrepHistoryItem extends PrepData {
  id: string;
  created_at: string;
  config: {
    type: string;
    difficulty: string;
    time: string;
  };
}

function PrepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramInterviewId = searchParams.get('interviewId');

  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(paramInterviewId);
  const [interviewsList, setInterviewsList] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [interviewContext, setInterviewContext] = useState<any>(null);
  
  const [customFocus, setCustomFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.5-sonnet");
  const [error, setError] = useState<string | null>(null);

  // Advanced Configurations
  const [prepType, setPrepType] = useState("Mixed");
  const [hardness, setHardness] = useState("Standard");
  const [timeToPrepare, setTimeToPrepare] = useState("1 week");

  // History and Current Prep State
  const [history, setHistory] = useState<PrepHistoryItem[]>([]);
  const [selectedPrepId, setSelectedPrepId] = useState<string | null>(null);

  // UI State
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState("insights");

  const supabase = createClient();

  // Load existing data
  useEffect(() => {
    async function fetchContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileData?.parsed_data) {
          setProfile(profileData.parsed_data);
        }

        // Fetch all interviews for the dropdown
        const { data: allInterviews } = await supabase
          .from('interviews')
          .select(`
            id,
            round,
            type,
            interview_date,
            job_applications!inner(company_name_denormalized, position)
          `)
          .eq('job_applications.user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (allInterviews) {
          setInterviewsList(allInterviews);
        }

        if (selectedInterviewId) {
          // Fetch the chosen interview details and the parent job description
          const { data: interviewData } = await supabase
            .from("interviews")
            .select(`
              *,
              job_applications!inner(job_description)
            `)
            .eq("id", selectedInterviewId)
            .eq('job_applications.user_id', user.id)
            .single();
            
          if (interviewData) {
            setInterviewContext(interviewData);
            
            if (interviewData.job_applications?.job_description) {
              setJobDescription(interviewData.job_applications.job_description);
            }
            
            // Handle loading history from interviews table
            if (interviewData.ai_prep_data && Array.isArray(interviewData.ai_prep_data)) {
              let loadedHistory = interviewData.ai_prep_data as unknown as PrepHistoryItem[];
              
              // Map any legacy records missing an ID
              loadedHistory = loadedHistory.map((p, idx) => ({
                ...p,
                id: p.id || `legacy-${idx}-${new Date(p.created_at || Date.now()).getTime()}`
              }));

              if (loadedHistory.length > 0) {
                setHistory(loadedHistory);
                setSelectedPrepId(loadedHistory[loadedHistory.length - 1].id); // Select latest
              } else {
                setHistory([]);
                setSelectedPrepId(null);
              }
            } else {
              setHistory([]);
              setSelectedPrepId(null);
            }
          }
        } else {
           setInterviewContext(null);
           setHistory([]);
           setSelectedPrepId(null);
        }
      } catch (err) {
        console.error('Error fetching context:', err);
        toast.error('Failed to load context data');
      } finally {
        setPageLoading(false);
      }
    }
    fetchContext();
  }, [supabase, selectedInterviewId, router]);

  async function handleGeneratePrep() {
    // Reset error state
    setError(null);

    // Validation
    if (!profile) {
      toast.error("You need to import your CV first in the My Profile tab.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please provide a Job Description to tailor the mock interview.");
      return;
    }

    setLoading(true);
    setRevealedQuestions({});
    setShowHints({});
    setActiveTab("insights");

    try {
      const savedKey = localStorage.getItem("jobzapp_openrouter_key");
      
      const res = await fetch("/api/prep/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          profile, 
          jobDescription, 
          customFocus: customFocus.trim() || undefined,
          model: selectedModel,
          customApiKey: savedKey || undefined,
          prepType,
          hardness,
          timeToPrepare,
          interviewId: selectedInterviewId || undefined
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Generation failed (${res.status})`);
      }
      
      if (data.prepData) {
        setHistory(prev => [...prev, data.prepData]);
        setSelectedPrepId(data.prepData.id);
        toast.success("Interview prep generated successfully!");
        
        if (selectedInterviewId) {
          toast.info("Saved automatically to this interview record.");
        }
      } else {
        throw new Error("No preparation data received");
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const toggleReveal = (index: number) => {
    setRevealedQuestions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleHint = (index: number) => {
    setShowHints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getDifficultyColor = (level: string) => {
    switch(level) {
      case 'Standard': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
      case 'Hardcore': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrepTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'behavioral': return <MessageCircle className="w-3 h-3"/>;
      case 'technical': return <Code className="w-3 h-3"/>;
      case 'case study': return <LayoutTemplate className="w-3 h-3"/>;
      default: return <Activity className="w-3 h-3"/>;
    }
  };

  const handleDeletePrep = async () => {
    if (!selectedInterviewId || !selectedPrepId) return;
    
    // Optimistic UI
    const previousHistory = [...history];
    const previousSelected = selectedPrepId;
    
    const newHistory = history.filter(p => p.id !== selectedPrepId);
    setHistory(newHistory);
    setSelectedPrepId(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null);
    
    try {
      const res = await fetch(`/api/prep/${selectedInterviewId}/${selectedPrepId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete prep");
      toast.success("Preparation deleted");
    } catch (err) {
      toast.error("Could not delete preparation");
      setHistory(previousHistory);
      setSelectedPrepId(previousSelected);
    }
  };

  const currentPrep = history.find(p => p.id === selectedPrepId);

  if (pageLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Settings */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="bg-secondary/10 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Context Setup
              </CardTitle>
              <div className="pt-2">
                <Select value={selectedInterviewId || "none"} onValueChange={(val) => {
                  setSelectedInterviewId(val === "none" ? null : val);
                  if (val !== "none") {
                     router.replace(`/dashboard/prep?interviewId=${val}`, { scroll: false });
                  } else {
                     router.replace(`/dashboard/prep`, { scroll: false });
                  }
                }}>
                  <SelectTrigger className="w-full h-9 text-xs bg-background">
                    <SelectValue placeholder="Link to an Interview (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-muted-foreground italic">No interview selected (General Prep)</SelectItem>
                    <SelectGroup>
                      <SelectLabel className="text-[10px] uppercase text-muted-foreground">Your Interviews</SelectLabel>
                      {interviewsList.map(intv => (
                        <SelectItem key={intv.id} value={intv.id}>
                          {intv.job_applications?.company_name_denormalized} - {intv.job_applications?.position} (R{intv.round})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Accordion type="single" collapsible defaultValue={jobDescription ? undefined : "item-1"}>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <div className="flex items-center gap-2 w-full justify-between pr-4">
                        <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" /> Job Description
                        </label>
                        {jobDescription.length > 0 && (
                          <Badge variant={jobDescription.length === 5000 ? "destructive" : "outline"} className="text-xs">
                            {jobDescription.length} chars
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea 
                        placeholder="Paste the full job description here..."
                        className="min-h-[150px] max-h-[300px] text-xs font-mono resize-y"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        maxLength={5000}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

                <div className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5"/> Preparation Type
                  </label>
                  <Select value={prepType} onValueChange={setPrepType}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mixed"><div className="flex items-center gap-2"><Activity className="w-3 h-3"/> Mixed (Balanced)</div></SelectItem>
                      <SelectItem value="Behavioral"><div className="flex items-center gap-2"><MessageCircle className="w-3 h-3"/> Strictly Behavioral</div></SelectItem>
                      <SelectItem value="Technical"><div className="flex items-center gap-2"><Code className="w-3 h-3"/> Technical / Coding</div></SelectItem>
                      <SelectItem value="Case Study"><div className="flex items-center gap-2"><LayoutTemplate className="w-3 h-3"/> System Design / Case Study</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                    <Flame className="w-3.5 h-3.5"/> Difficulty Level
                  </label>
                  <Select value={hardness} onValueChange={setHardness}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard"><div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Standard (Realistic)</div></SelectItem>
                      <SelectItem value="Hardcore"><div className="flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-rose-500"/> Hardcore (Pressure Test)</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5"/> Time to Prepare
                  </label>
                  <Select value={timeToPrepare} onValueChange={setTimeToPrepare}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Time available" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 hour"><div className="flex items-center gap-2"><Zap className="w-3 h-3"/> 1 Hour (Panic Mode)</div></SelectItem>
                      <SelectItem value="1 day"><div className="flex items-center gap-2"><Clock className="w-3 h-3"/> 1 Day</div></SelectItem>
                      <SelectItem value="1 week"><div className="flex items-center gap-2"><Calendar className="w-3 h-3"/> 1 Week</div></SelectItem>
                      <SelectItem value="1 month"><div className="flex items-center gap-2"><CalendarDays className="w-3 h-3"/> 1 Month (Deep Dive)</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" /> Custom Instructions
                  </label>
                  <span className="text-[10px] text-muted-foreground uppercase opacity-50">Optional</span>
                </div>
                <Textarea 
                  placeholder="E.g., 'Focus heavily on team conflict', 'I lack AWS experience.'"
                  className="min-h-[80px] text-xs resize-y"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                />
              </div>

            </CardContent>
            <CardFooter className="flex-col gap-4 border-t bg-muted/5 pt-6">
              <div className="w-full">
                <AIModelSelector
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  className="w-full"
                />
              </div>
              
              {error && (
                <div className="w-full p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                  <p className="font-medium">Error:</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              )}
              
              <Button 
                onClick={handleGeneratePrep} 
                disabled={loading || !jobDescription.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          
          {history.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preparation History</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedPrepId || ""} onValueChange={setSelectedPrepId}>
                  <SelectTrigger className="w-[280px] h-9 text-xs bg-background">
                    <SelectValue placeholder="Select previous prep" />
                  </SelectTrigger>
                  <SelectContent>
                    {history.map((prep, idx) => (
                      <SelectItem key={prep.id} value={prep.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">{prep.config?.type || 'Mixed'}</Badge>
                          <span>{new Date(prep.created_at).toLocaleDateString()} at {new Date(prep.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedInterviewId && selectedPrepId && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0" onClick={handleDeletePrep}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentPrep && !loading ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              
              {/* Configuration Summary Badge */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3 items-center text-sm">
                    <Badge variant="outline" className="py-1 capitalize gap-1 flex items-center">
                      {getPrepTypeIcon(currentPrep.config?.type)} {currentPrep.config?.type || 'Mixed'}
                    </Badge>
                    <Badge className={getDifficultyColor(currentPrep.config?.difficulty || 'Standard')}>
                      <Flame className="w-3 h-3 mr-1" /> {currentPrep.config?.difficulty || 'Standard'}
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" /> {currentPrep.config?.time || 'Unknown'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tabs for structured layout */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="plan">Training Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="questions" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Mock Questions ({currentPrep.questions?.length || 0})
                    </h3>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                      {currentPrep.questions?.map((q, i) => {
                        const isRevealed = revealedQuestions[i];
                        const showHint = showHints[i];
                        
                        return (
                          <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl px-2 bg-card overflow-hidden">
                            <AccordionTrigger className="hover:no-underline px-2 py-4 text-left">
                              <div className="flex flex-col md:flex-row md:items-start gap-3 w-full pr-4">
                                <Badge 
                                  variant={
                                    q.type === 'behavioral' ? 'secondary' : 
                                    q.type === 'technical' ? 'default' : 
                                    q.type === 'case' ? 'outline' : 'secondary'
                                  } 
                                  className="w-fit shrink-0 mt-0.5 capitalize"
                                >
                                  {q.type}
                                </Badge>
                                <span className="font-semibold text-sm leading-relaxed">{q.question}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-4 pt-1">
                              <div className="space-y-4 rounded-lg bg-muted/10 p-4 border border-border/50">
                                <div>
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                    Why they ask this
                                  </h5>
                                  <p className="text-sm leading-relaxed">{q.whyTheyAsk}</p>
                                </div>
                                
                                {q.hint && (
                                  <div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs text-muted-foreground hover:text-primary mb-2"
                                      onClick={() => toggleHint(i)}
                                    >
                                      <Lightbulb className="w-3 h-3 mr-1" />
                                      {showHint ? 'Hide Hint' : 'Show Hint'}
                                    </Button>
                                    {showHint && (
                                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-md text-sm animate-in fade-in">
                                        <p className="text-yellow-800 dark:text-yellow-200">💡 {q.hint}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div className="pt-2">
                                  {!isRevealed ? (
                                    <Button 
                                      variant="outline" 
                                      className="w-full border-dashed group" 
                                      onClick={() => toggleReveal(i)}
                                    >
                                      <Eye className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" /> 
                                      Reveal Solution Strategy
                                    </Button>
                                  ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-primary">
                                          Your Strategy
                                        </h5>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => toggleReveal(i)}>
                                          <EyeOff className="w-3 h-3 mr-1" /> Hide
                                        </Button>
                                      </div>
                                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                          {q.candidateStrategy}
                                        </ReactMarkdown>
                                      </div>
                                      
                                      {q.resources && q.resources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                          <h6 className="text-xs font-semibold mb-2 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> Resources:
                                          </h6>
                                          <div className="flex flex-wrap gap-2">
                                            {q.resources.map((r, ridx) => (
                                              <a
                                                key={ridx}
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded text-xs hover:underline"
                                              >
                                                {r.type === 'leetcode' ? '⚡' : r.type === 'video' ? '🎥' : '📚'} {r.name}
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                </TabsContent>
                
                <TabsContent value="plan" className="space-y-4 mt-4">
                  {currentPrep.trainingPlan && (
                    <Card>
                      <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                          <GraduationCap className="w-5 h-5"/> Actionable Training Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm pt-4 prose prose-sm dark:prose-invert max-w-none prose-a:text-primary">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentPrep.trainingPlan}
                        </ReactMarkdown>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="bg-muted/10 border-b pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-500"/> Company Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm pt-4 prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentPrep.companyInsights}
                        </ReactMarkdown>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="bg-muted/10 border-b pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Role Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm pt-4 prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentPrep.roleAnalysis}
                        </ReactMarkdown>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {currentPrep.customFocus && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-primary"/> Custom Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm prose prose-sm dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentPrep.customFocus}
                        </ReactMarkdown>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6 border-2 border-dashed rounded-xl p-10 bg-muted/5">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Curating Your Mock Interview</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  We are analyzing the job description and your profile to formulate a focused, precise training plan.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="outline" className="animate-pulse">{prepType}</Badge>
                  <Badge variant="outline" className="animate-pulse">{hardness}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-xl p-10 bg-muted/5 text-muted-foreground">
              {selectedInterviewId && history.length === 0 ? (
                 <>
                   <History className="h-12 w-12 opacity-20 text-primary" />
                   <h3 className="text-lg font-semibold text-foreground">No Preparations Yet</h3>
                   <p className="text-sm font-medium max-w-sm text-center">
                     You haven't generated any preparations for this interview round. Adjust your settings on the left and click generate to begin!
                   </p>
                 </>
              ) : (
                 <>
                   <Sparkles className="h-12 w-12 opacity-20" />
                   <p className="text-sm font-medium">Configure your settings and hit generate to craft your custom prep guide.</p>
                   {selectedInterviewId && (
                     <p className="text-xs text-center max-w-md text-muted-foreground/60">
                       Your preparation will be automatically tied to this specific interview round.
                     </p>
                   )}
                 </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function InterviewPrepPage() {
  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Preparation Console</h1>
          <p className="text-muted-foreground mt-2">
            Generate highly-structured mock questions, actionable training plans, and strategic insights.
          </p>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <PrepForm />
      </Suspense>
    </div>
  );
}

export const dynamic = 'force-dynamic';