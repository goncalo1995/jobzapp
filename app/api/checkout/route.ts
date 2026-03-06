import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN as string,
  successUrl: process.env.POLAR_SUCCESS_URL as string,
  returnUrl: "http://localhost:3000", // An optional URL which renders a back-button in the Checkout
  server: (process.env.NEXT_PUBLIC_POLAR_SERVER || "sandbox") as "sandbox" | "production",
  theme: "dark",
});
