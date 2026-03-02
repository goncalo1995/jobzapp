// app/[locale]/dashboard/cvs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Plus, Search, Download, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export default function CVsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [cvs, setCvs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function fetchCVs() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (data) setCvs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCVs();
  }, [supabase]);

  const filteredCvs = cvs.filter(cv => 
    cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cv.target_role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleExport(id: string, name: string) {
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
      a.download = `${name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold text-foreground">Resumes</h1>
          <p className="text-muted-foreground text-sm">Manage and tailor your resumes for each application.</p>
        </div>
        <Link href="/dashboard/cvs/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Resume
          </Button>
        </Link>
      </header>

      {/* Search */}
      <div className="flex items-center gap-3 bg-card border border-border p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or role..." 
            className="pl-10 bg-transparent border-none text-foreground focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* CV Grid */}
      {filteredCvs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCvs.map((cv) => (
            <div key={cv.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all flex flex-col">
              <div className="p-5 space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  {cv.is_default && (
                    <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-semibold text-primary">
                      Default
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {cv.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {cv.target_role || 'General Purpose'}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground/60">
                  Updated {new Date(cv.updated_at).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-secondary/30 border-t border-border grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleExport(cv.id, cv.name)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  PDF
                </Button>
                <Link href={`/dashboard/cvs/${cv.id}`} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <Link href="/dashboard/cvs/new" className="group border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/30 hover:bg-primary/5 transition-all">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground/60 group-hover:text-foreground text-sm">New Resume</p>
              <p className="text-[11px] text-muted-foreground">Tailor for a specific role</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-lg font-semibold text-foreground">No resumes yet</h2>
            <p className="text-sm text-muted-foreground">Create your first resume to start tailoring it for applications.</p>
          </div>
          <Link href="/dashboard/cvs/new">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
