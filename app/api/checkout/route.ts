import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN as string,
  server: (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production",
});

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') || 'en';
  const productId = searchParams.get('products');

  if (!productId) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard/settings?error=invalid_product`, req.url));
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const localizedSuccessUrl = process.env.POLAR_SUCCESS_URL || `${siteUrl}/${locale}/dashboard/success?checkout_id={CHECKOUT_ID}`;
  
  // const checkoutHandler = Checkout({
  //   accessToken: process.env.POLAR_ACCESS_TOKEN as string,
  //   successUrl: localizedSuccessUrl,
  //   returnUrl: siteUrl, 
  //   server: (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production",
  //   theme: "dark",
  // });

  try {
    const result = await polar.checkouts.create({
      products: [productId],
      successUrl: localizedSuccessUrl,
      metadata: {
        userId: user.id
      }
    });

    if (result && result.url) {
      return NextResponse.redirect(result.url);
    } else {
      throw new Error("Failed to create checkout session");
    }
  } catch (error) {
    console.error("Polar Checkout Error:", error);
    return NextResponse.redirect(new URL(`/${locale}/dashboard/settings?error=checkout_failed`, req.url));
  }
}
