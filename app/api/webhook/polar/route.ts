import { adminSupabase } from "@/lib/supabase/admin";
import { Webhooks } from "@polar-sh/nextjs";

// Duration map for Accelerator products (in days)
const GET_DURATION_FOR_PRODUCT = (productId: string) => {
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_1_MONTH) return 30;
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_3_MONTHS) return 90;
  
  return null;
};

// Map products for legacy/add-on credits
const GET_CREDITS_FOR_PRODUCT = (productId: string) => {
  console.log(`Polar Webhook - Mapping credits for product: ${productId}`);
  // Top-up (€5): 50 Credits
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_TOPUP_50 || productId === 'd706db71-02ce-4638-81ef-8b7e917aabf4') return 100;
  
  // Accelerator Passes: 250 for 1 month, 1000 for 3 months
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_1_MONTH) return 350;
  if (productId === process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_ACCELERATOR_3_MONTHS) return 1250;

  return 0;
};

// Extract User ID and Product ID safely from payload
const extractIds = (eventData: any) => {
  const userId = 
    eventData.customer?.external_id || 
    eventData.customer_external_id || 
    eventData.customer?.metadata?.userId ||
    eventData.metadata?.userId ||
    eventData.user_id;
  
  const productId = 
    eventData.product_id || 
    eventData.product?.id || 
    eventData.subscription?.product_id;
    
  return { userId, productId };
};

// Handle all one-off orders (Credit Top-ups AND Accelerator Time Passes)
async function handleOrder(payload: any) {
  const eventData = payload.data;
  const { userId, productId } = extractIds(eventData);

  if (!userId) {
    console.error("Polar Webhook Error: No user ID found in order payload.");
    return;
  }

  const orderId = payload.data.id;
  
  // 1. Check if it's a Credit Top-up
  const credits = GET_CREDITS_FOR_PRODUCT(productId);
  if (credits > 0) {
    console.log(`Polar Webhook - Granting ${credits} credits to user ${userId} for order ${orderId}`);
    
    const { error } = await adminSupabase.rpc('handle_successful_checkout', {
      _checkout_id: orderId,
      _user_id: userId,
      _credit_amount: credits
    });

    if (error) throw error;
  }

  // 2. Check if it's an Accelerator Time Pass
  const durationDays = GET_DURATION_FOR_PRODUCT(productId);
  if (durationDays) {
    console.log(`Polar Webhook - Granting ${durationDays} days of Accelerator to user ${userId} for order ${orderId}`);

    // Fetch existing subscription to check if we should extend or start fresh
    const { data: existingSub } = await adminSupabase
      .from('user_subscriptions')
      .select('current_period_end, tier')
      .eq('user_id', userId)
      .single();

    let newEndDate = new Date();
    
    if (existingSub?.tier === 'accelerator' && existingSub?.current_period_end) {
      const currentEnd = new Date(existingSub.current_period_end);
      if (currentEnd > new Date()) {
        // Extend existing active period
        newEndDate = new Date(currentEnd.getTime() + durationDays * 24 * 60 * 60 * 1000);
      } else {
         // Expired, start fresh
         newEndDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
      }
    } else {
       // No active accelerator session, start fresh
       newEndDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    }

    const { error } = await adminSupabase.from('user_subscriptions').upsert({
      user_id: userId,
      tier: 'accelerator',
      polar_customer_id: eventData.customer_id,
      subscription_id: orderId, // Use order ID since no subscription exists
      status: 'active',
      current_period_end: newEndDate.toISOString(),
      cancel_at_period_end: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (error) throw error;
    return; // Done processing time pass
  }
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    console.log("Polar Webhook: order.paid");
    await handleOrder(payload);
  }
});
