import { Checkout } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Default to 'en' if not specified, or try to detect from headers if needed.
  // Using query param 'locale' if passed from the frontend links.
  const locale = searchParams.get('locale') || 'en';
  
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const localizedSuccessUrl = `${siteUrl}/${locale}/success?checkout_id={CHECKOUT_ID}`;
  
  const checkoutHandler = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN as string,
    successUrl: localizedSuccessUrl,
    returnUrl: siteUrl, 
    server: (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production",
    theme: "dark",
  });

  return (checkoutHandler as any)(req, { params: {} });
}
