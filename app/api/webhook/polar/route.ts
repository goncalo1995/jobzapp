import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

// Initialize a supabase client with the service role key to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Product to Credit Mapping (IDs should be updated in .env for production)
const GET_CREDITS_FOR_PRODUCT = (productId: string) => {
  console.log(`Polar Webhook - Mapping credits for product: ${productId}`);
  // Top-up (€5): 50 Credits
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TOPUP_50 || productId === 'd706db71-02ce-4638-81ef-8b7e917aabf4') return 50;
  
  // Two Week Plan (€18): 150 Credits
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PLAN_TWO_WEEK) return 150;
  
  // Annual Plan (€49): 6000 Credits
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PLAN_ANNUAL) return 6000;

  console.warn(`Polar Webhook - No credit mapping found for product: ${productId}`);
  return 0;
};

async function grantCredits(payload: any) {
  // Extract data from the payload (Payload can be an Order or a Subscription event)
  const eventData = payload.data;
  
  // Try to find the user ID in customer or customer_id
  const userId = eventData.customer?.external_id || eventData.customer_external_id;
  const productId = eventData.product_id || eventData.product?.id || eventData.subscription?.product_id;
  
  console.log("Polar Webhook - Event Data Details:", {
    userId,
    productId,
    orderId: eventData.id,
    type: payload.type
  });

  if (!userId) {
    console.error("Polar Webhook Error: No customer external_id (userId) found in payload");
    return;
  }

  const credits = GET_CREDITS_FOR_PRODUCT(productId);
  if (credits === 0) {
    console.warn(`Polar Webhook Warning: Zero credits mapped for product ${productId}. Skipping.`);
    return;
  }

  // Prevent double granting by tracking the order/subscription ID atomically
  const orderId = payload.data.id;
  if (orderId) {
    console.log(`Polar Webhook - Granting ${credits} credits to user ${userId} for order ${orderId}`);
    const { error } = await supabaseAdmin.rpc('handle_successful_checkout', {
      _checkout_id: orderId,
      _user_id: userId,
      _credit_amount: credits
    });

    if (error) {
      console.error("Polar Webhook - Error in handle_successful_checkout:", error);
      throw error; // Throw so Polar retries
    }

    console.log(`Polar Webhook - Successfully handled checkout and granted credits via atomic RPC for user ${userId}`);
  } else {
    console.warn(`Polar Webhook - No order ID found, skipping secure credit grant.`);
  }
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderCreated: async (payload) => {
    console.log("Polar Webhook: order.created received");
    await grantCredits(payload);
  },
  onOrderPaid: async (payload) => {
    console.log("Polar Webhook: order.paid received");
    await grantCredits(payload);
  },
  onSubscriptionCreated: async (payload) => {
    console.log("Polar Webhook: subscription.created received");
    await grantCredits(payload);
  },
  onSubscriptionActive: async (payload) => {
    console.log("Polar Webhook: subscription.active received");
    await grantCredits(payload);
  }
});
