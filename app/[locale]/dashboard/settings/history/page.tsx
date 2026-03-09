"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock, History, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CreditLog } from "@/types";

export default function CreditHistoryPage() {
  const [logs, setLogs] = useState<CreditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("ai_credit_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50); // Fetch last 50 transactions

        if (error) throw error;
        
        setLogs(data || []);
      } catch (err: any) {
        console.error("Error fetching credit history:", err);
        setError("Failed to load credit history");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [supabase]);

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit History</h1>
          <p className="text-muted-foreground mt-2">View your recent AI credit usage and additions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Transaction Log
          </CardTitle>
          <CardDescription>A detailed audit of your credit balance changes.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-3">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="h-12 bg-secondary/20 rounded animate-pulse" />
               ))}
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-secondary/10 rounded-lg border border-border/50">
              <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
              <p className="text-sm font-medium text-muted-foreground">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-secondary/5 rounded-lg border border-border/50">
              <Clock className="h-10 w-10 text-muted-foreground opacity-30" />
              <p className="text-sm font-medium text-muted-foreground">No credit transactions yet.</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.created_at && format(new Date(log.created_at), "MMM d, yyyy • h:mm a")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.action_type === 'increment' ? 'default' : 'secondary'}
                          className={log.action_type === 'increment' ? 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/20' : ''}
                        >
                          {log.action_type === 'increment' ? 'Addition' : 'Usage'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {log.action_type === 'increment' 
                          ? 'Credits topped up or refunded' 
                          : 'AI Service usage deducted'}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        <span className={log.action_type === 'increment' ? 'text-primary' : 'text-foreground'}>
                          {log.action_type === 'increment' ? '+' : ''}{log.amount}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
