"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Key, ExternalLink, BookOpen, CreditCard, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { fetchUserTier } from "@/lib/user-limits";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-4xl py-8">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

import { useProfile } from "@/components/providers/profile-provider";

function SettingsContent() {
  const t = useTranslations("Pages.settings");
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const { credits: aiCredits, loading: loadingCredits } = useProfile();
  const [showError, setShowError] = useState(false);
  
  const errorParam = searchParams.get("error");
  
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tierInfo, setTierInfo] = useState<{ tier: "free" | "accelerator" | "elite", current_period_end: string | null }>({ tier: "free", current_period_end: null });
  const [loadingTier, setLoadingTier] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndTier = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
      
      const info = await fetchUserTier();
      setTierInfo(info);
      setLoadingTier(false);

      // If free tier, force remove any saved API keys to prevent bypass
      if (info.tier === "free") {
        localStorage.removeItem("jobzapp_openrouter_key");
        setOpenRouterKey("");
      } else {
        const savedKey = localStorage.getItem("jobzapp_openrouter_key");
        if (savedKey) {
          setOpenRouterKey(savedKey);
        }
      }
    };
    fetchUserAndTier();
  }, []);

  useEffect(() => {
    if (errorParam === "no_polar_customer") {
      setShowError(true);
    }
  }, [errorParam]);

  const handleSaveKey = () => {
    if (openRouterKey.trim() === "") {
      localStorage.removeItem("jobzapp_openrouter_key");
      toast.success(t("byok.savedText"));
    } else {
      localStorage.setItem("jobzapp_openrouter_key", openRouterKey.trim());
      toast.success(t("byok.savedText"));
    }
  };

  const handleRemoveKey = () => {
    setOpenRouterKey("");
    localStorage.removeItem("jobzapp_openrouter_key");
    toast.success(t("byok.savedText"));
  };

  const handleDeleteAccount = async () => {
    // Basic native confirm for the danger zone
    if (!confirm("Are you absolutely sure you want to permanently delete your account and all associated data? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/me/delete', { method: 'DELETE' });
      if (res.ok) {
        toast.success("Account permanently deleted.");
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete account");
        setIsDeleting(false);
      }
    } catch (error) {
       toast.error("An unexpected error occurred");
       setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      {showError && (
        <Alert variant="destructive" className="relative pr-12">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {t("noPurchasesYet")}
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => setShowError(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and integrations.</p>
      </div>

      <div className="grid gap-6">
        {/* Active Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Active Plan
            </CardTitle>
            <CardDescription>Manage your current subscription and feature access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 border rounded-lg text-primary-foreground ${tierInfo.tier === 'accelerator' ? 'bg-primary' : 'bg-secondary text-secondary-foreground'}`}>
              <div className="space-y-1 mb-4 flex items-center justify-between">
                <p className="font-medium text-lg flex items-center gap-2">
                  {tierInfo.tier === 'accelerator' ? <Zap className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                  Current Tier
                </p>
              </div>
              <div>
                {loadingTier ? (
                  <div className="h-6 w-24 bg-primary-foreground/20 animate-pulse rounded"></div>
                ) : (
                  <div>
                    <Badge variant="outline" className={`text-base px-3 py-1 uppercase tracking-widest ${tierInfo.tier === 'accelerator' ? 'border-primary-foreground text-primary-foreground/90 bg-primary-foreground/10' : ''}`}>
                      {tierInfo.tier}
                    </Badge>
                    {tierInfo.tier === 'accelerator' && tierInfo.current_period_end && (
                      <p className="text-sm mt-2 font-medium opacity-90">
                        Pass Expires: {new Date(tierInfo.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                    {tierInfo.tier === 'free' && (
                       <p className="text-sm mt-2 text-muted-foreground">
                         Starter plan covers basic tracking. Upgrade for AI tools and unlimited tracking.
                       </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-3 pt-4 border-t border-border">
              <Link href={`/api/checkout?locale=${locale}&products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_1_MONTH || ''}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-[0_0_15px_rgba(0,69,255,0.3)]">
                  {tierInfo.tier === 'accelerator' ? "Extend Pass (1 Month)" : "Upgrade to Pro (1 Month)"}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={`/api/checkout?locale=${locale}&products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_3_MONTHS || ''}`} className="flex-1">
                <Button className="w-full" variant="outline" style={{ borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary))' }}>
                  {tierInfo.tier === 'accelerator' ? "Extend Pass (3 Months)" : "Upgrade to Pro (3 Months)"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={`/api/portal?locale=${locale}`} className="flex-1">
                <Button className="w-full" variant="secondary">
                  {t("aiQuotas.manageBilling")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* AI Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("aiQuotas.title")}
            </CardTitle>
            <CardDescription>{t("aiQuotas.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="space-y-1 mb-4">
                <p className="font-medium text-lg">Current Balance</p>
              </div>
              <div>
                {loadingCredits ? (
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Badge variant={aiCredits > 0 ? "default" : "secondary"} className="text-base px-3 py-1">
                    {t("aiQuotas.creditsAvailable", { count: aiCredits })}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
              <Link href={`/api/checkout?locale=${locale}&products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TOPUP_50 || 'd706db71-02ce-4638-81ef-8b7e917aabf4'}`} className="flex-1">
                <Button className="w-full" variant="secondary">
                  {t("aiQuotas.buyCredits")}
                  <CreditCard className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/settings/history" className="flex-1">
                <Button className="w-full" variant="secondary">
                  Credit History
                  <BookOpen className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t bg-muted/50 p-4 gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="share-link" className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Earn Free Credits
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Share this link with friends. When they visit, you both earn <span className="text-primary font-bold">5 AI Credits</span>.
              </p>
              <div className="flex gap-2 w-full">
                <Input
                  id="share-link"
                  readOnly
                  value={userId ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${userId}` : 'Loading...'} 
                  className="bg-background font-mono text-xs flex-1"
                />
                <Button 
                  onClick={() => {
                    if (userId) {
                      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${userId}`);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  variant="secondary"
                  disabled={!userId}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* BYOK Card */}
        <Card className={tierInfo.tier === "free" ? "opacity-60 cursor-not-allowed grayscale" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              {t("byok.title")}
              {tierInfo.tier === "free" && (
                <Badge variant="secondary" className="ml-2 uppercase text-[10px] tracking-widest font-black">
                  Accelerator Only
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{t("byok.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openrouter-key">{t("byok.keyLabel")}</Label>
              <Input
                id="openrouter-key"
                type="password"
                placeholder={tierInfo.tier === "free" ? "Upgrade to Accelerator to use custom keys" : t("byok.keyPlaceholder")}
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                disabled={tierInfo.tier === "free"}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
            <Button variant="ghost" onClick={handleRemoveKey} disabled={!openRouterKey || tierInfo.tier === "free"}>
              {t("byok.removeKey")}
            </Button>
            <Button onClick={handleSaveKey} disabled={tierInfo.tier === "free"}>
              {t("byok.saveKey")}
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 shadow-none border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive font-bold">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data (Resumes, Job Applications, Preparations).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-start gap-3">
               <Trash2 className="w-5 h-5 shrink-0 mt-0.5" />
               <p>
                 <strong>Warning:</strong> This action cannot be undone. This will permanently delete your JobZapp account and immediately revoke your access to any remaining AI credits.
               </p>
             </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t rounded-b-xl border-destructive/20">
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
