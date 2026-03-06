import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

// Initialize a supabase client with the service role key to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    // Handle the payload
  },
  onOrderCreated: async (payload) => {
    // Top-up or One-time purchase of the two-week plan
    // We expect the payload.customer_id or payload.customer.external_id (which is our user id)
    // to map to a user in our DB. Let's use custom field or external ID as user.id
    
    const userId = payload.data.customerId; // getting the customer ID
    // Usually Polar payload for order or subscription includes customer details.
    
    // Log for debugging
    console.log("Polar Order Created Payload:", JSON.stringify(payload));
  },
  onSubscriptionCreated: async (payload) => {
    // Subscription created (e.g. Annual Plan)
    console.log("Polar Subscription Created:", JSON.stringify(payload));
  },
  onSubscriptionUpdated: async (payload) => {
    console.log("Polar Subscription Updated:", JSON.stringify(payload));
  }
});
