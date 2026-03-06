import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const t = useTranslations("Pages.checkout.success");

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full text-center py-8 shadow-2xl border-primary/20 bg-gradient-to-b from-card to-secondary/10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4 ring-8 ring-primary/5">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("message")}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI Copilot Features Enabled</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6">
          <Link href="/dashboard/settings" className="w-full">
            <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              {t("viewSettings")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full">
              {t("backToDashboard")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
