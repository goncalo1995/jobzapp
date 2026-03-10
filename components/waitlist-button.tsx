"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function WaitlistButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join waitlist");

      toast.success(data.message || "Successfully joined the waitlist!");
      setOpen(false);
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="w-full py-5 bg-secondary text-muted-foreground text-center text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-secondary/30 hover:text-muted-foreground/80 transition-all flex items-center justify-center gap-2 group"
        >
          Join Waitlist <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tight">Join Elite Waitlist</DialogTitle>
          <DialogDescription>
            Enter your email to get early access to 1-on-1 strategy sessions, unlimited premium models, and priority support.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full font-bold tracking-widest uppercase text-xs" 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
            Secure My Spot
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
