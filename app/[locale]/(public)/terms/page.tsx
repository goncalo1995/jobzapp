import { ShieldAlert, Scale, ServerCrash, UserX, Database, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | JobZapp",
  description: "Terms of Service for JobZapp. Understand the rules and regulations for using our platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 xl:py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-extrabold tracking-tight sm:text-5xl mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-muted-foreground flex items-center gap-2">
          <Scale className="h-5 w-5" /> Let's keep things clear and professional.
        </p>
        <p className="text-sm text-muted-foreground mt-4 font-mono">
          Last Updated: March 9, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        
        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">1.</span>
            Acceptance of Terms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using JobZapp (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. We are based in the European Union and adhere to strict EU consumer and data protection standards (GDPR).
          </p>
        </section>

        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">2.</span>
            AI Services and Uptime Limitations
          </h2>
          <div className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 border p-4 rounded-lg mb-6 flex items-start gap-3">
             <ServerCrash className="h-5 w-5 shrink-0 mt-0.5" />
             <div className="text-sm leading-relaxed">
               <strong>Important Disclaimer regarding AI Uptime:</strong> JobZapp relies on third-party Artificial Intelligence providers (such as OpenAI, Anthropic, or OpenRouter) to deliver core functionalities like resume tailoring and interview preparation.
             </div>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>No Uptime Guarantee for AI:</strong> We cannot guarantee 100% uptime for AI generation features. Outages or temporary rate limits from our upstream AI providers are beyond our control. We will not be held liable for any missed deadlines, job application failures, or damages resulting from temporary unavailability of the AI features.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>"Bring Your Own Key" (BYOK) Responsibility:</strong> If you utilize the BYOK feature, you are solely responsible for the costs, limits, and security of your own API keys.</span>
            </li>
          </ul>
        </section>

        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">3.</span>
            User Responsibilities & Acceptable Use
          </h2>
          <p className="text-muted-foreground mb-4">
            You are responsible for your use of the Service and for any content you provide, including compliance with applicable laws, rules, and regulations. You must not:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <span><strong>Attempt to circumvent security:</strong> Reverse-engineer, decompile, or attempt to extract the source code or proprietary AI prompts of the Service (Jailbreaking, Prompt Injection attempts). Such actions will result in immediate termination of your account without refund.</span>
            </li>
            <li className="flex gap-3">
              <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <span><strong>Abuse the system:</strong> Use the service for any illegal purpose, or to upload malicious data, malware, or highly sensitive confidential information that violates third-party NDAs.</span>
            </li>
          </ul>
        </section>

        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">4.</span>
            Data Protection & GDPR Rights
          </h2>
          <p className="text-muted-foreground mb-4">
            We respect your privacy and process your data in compliance with the General Data Protection Regulation (GDPR). 
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span><strong>Data Ownership:</strong> You retain all rights to the personal data (resumes, job applications) you provide to the Service.</span>
            </li>
            <li className="flex gap-3">
              <UserX className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span><strong>Right to be Forgotten:</strong> You can permanently delete your account and all associated data at any time via the settings dashboard.</span>
            </li>
          </ul>
        </section>

        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">5.</span>
            Limitation of Liability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by European law, JobZapp and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any advice or output generated by the AI; or (iv) unauthorized access, use, or alteration of your transmissions or content.
          </p>
        </section>
        
        <section className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-3 mt-0 mb-6 border-b pb-4">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">6.</span>
            Payments, Credits, and Refunds
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            AI generation requires credits, which are consumed upon successfully generating output.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <span><strong>Refund Policy:</strong> Under EU consumer protection law, you have the right to withdraw from a purchase within 14 days without giving any reason, <strong>provided you have not used the purchased digital credits</strong>. Once you commence using the AI generation utilizing purchased credits, you waive your right of withdrawal for those specific credits, as the digital service has been performed.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
