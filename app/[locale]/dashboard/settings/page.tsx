"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Key, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-4xl py-8">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const t = useTranslations("Pages.settings");
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();
  const [aiCredits, setAiCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [showError, setShowError] = useState(false);
  
  const errorParam = searchParams.get("error");
  
  const [openRouterKey, setOpenRouterKey] = useState("");

  useEffect(() => {
    let channel: any;

    async function loadCredits() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('ai_credits')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        setAiCredits(data.ai_credits || 0);
      }
      setLoadingCredits(false);

      // Setup Realtime Subscription
      channel = supabase.channel('settings-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            const newCredits = payload.new.ai_credits;
            setAiCredits(newCredits || 0);
          }
        )
        .subscribe();
    }
    
    const savedKey = localStorage.getItem("openrouter_key");
    if (savedKey) {
      setOpenRouterKey(savedKey);
    }
    
    loadCredits();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase]);

  useEffect(() => {
    if (errorParam === "no_polar_customer") {
      setShowError(true);
    }
  }, [errorParam]);

  const handleSaveKey = () => {
    if (openRouterKey.trim() === "") {
      localStorage.removeItem("openrouter_key");
      toast.success(t("byok.savedText"));
    } else {
      localStorage.setItem("openrouter_key", openRouterKey.trim());
      toast.success(t("byok.savedText"));
    }
  };

  const handleRemoveKey = () => {
    setOpenRouterKey("");
    localStorage.removeItem("openrouter_key");
    toast.success(t("byok.savedText"));
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
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="space-y-1">
                <p className="font-medium text-lg">Current Balance</p>
              </div>
              <div className="flex items-center gap-3">
                {loadingCredits ? (
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Badge variant={aiCredits > 0 ? "default" : "secondary"} className="text-base px-3 py-1">
                    {t("aiQuotas.creditsAvailable", { count: aiCredits })}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={`/api/checkout?locale=${locale}&products=${process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TOPUP_50 || 'd706db71-02ce-4638-81ef-8b7e917aabf4'}`} className="flex-1">
                <Button className="w-full" variant="outline">
                  {t("aiQuotas.buyCredits")}
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

        {/* BYOK Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              {t("byok.title")}
            </CardTitle>
            <CardDescription>{t("byok.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openrouter-key">{t("byok.keyLabel")}</Label>
              <Input
                id="openrouter-key"
                type="password"
                placeholder={t("byok.keyPlaceholder")}
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
            <Button variant="ghost" onClick={handleRemoveKey} disabled={!openRouterKey}>
              {t("byok.removeKey")}
            </Button>
            <Button onClick={handleSaveKey}>
              {t("byok.saveKey")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
