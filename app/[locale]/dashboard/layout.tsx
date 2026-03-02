// app/[locale]/dashboard/layout.tsx
import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 w-full max-w-2xl h-96 bg-primary/3 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
