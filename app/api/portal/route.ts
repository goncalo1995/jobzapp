import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const polarExternalId = user.id;
  const isSandbox = (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") === "sandbox";
  const polarApiBase = isSandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
  const polarApiUrl = `${polarApiBase}/v1/customers?external_id=${polarExternalId}`;
  
  console.log(polarApiUrl);
  let customerId = "";
  try {
    const response = await fetch(polarApiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        customerId = data.items[0].id;
      }
    }
  } catch(e) {
    console.error(e);
  }
  
  // If the user has not made any purchases, they do not have a customer record in Polar yet.
  if (!customerId) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=no_polar_customer", req.url));
  }

  // Let Polar handle the rest now that we are sure we have a valid customer ID
  const polarPortalHandler = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN as string,
    getCustomerId: async () => customerId,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings`,
    server: (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production",
  });

  // Next.js route handlers expect Context as the second argument, typically { params }
  // However, the Polar CustomerPortal handler type signature only takes 1 argument.
  return (polarPortalHandler as any)(req, { params: {} });
}
