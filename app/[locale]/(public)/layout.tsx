import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      {/* <div className="fixed bottom-4 right-4 z-50">
        <LanguageSwitcher />
      </div> */}
      <SiteFooter />
    </>
  )
}
