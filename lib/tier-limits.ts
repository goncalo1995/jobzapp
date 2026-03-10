import { createClient } from "./supabase/server";

export const MAX_ACTIVE_INTERVIEWS_FREE = 10;
export const CAN_USE_BYOK_FREE = false;

export async function getUserTier(): Promise<{ tier: 'free' | 'accelerator' | 'elite', current_period_end: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { tier: 'free', current_period_end: null };
    
    const { data } = await supabase
      .from('user_subscriptions')
      .select('tier, current_period_end, status')
      .eq('user_id', user.id)
      .single();
      
    if (!data) return { tier: 'free', current_period_end: null };
    
    // Only return accelerator if active and not expired
    if (data.tier === 'accelerator') {
      if (data.status !== 'active') return { tier: 'free', current_period_end: null };
      
      if (data.current_period_end) {
         const end = new Date(data.current_period_end);
         if (end < new Date()) {
            return { tier: 'free', current_period_end: null };
         }
      }
      return { tier: 'accelerator', current_period_end: data.current_period_end };
    }
    
    return { tier: 'free', current_period_end: null };
    
  } catch (error) {
    console.error("Error fetching user tier:", error);
    return { tier: 'free', current_period_end: null };
  }
}
export async function checkInterviewLimit(): Promise<{ canAdd: boolean, currentCount: number, limit: number | null }> {
   try {
      const { tier } = await getUserTier();
      
      // Accelerator/Elite users have no limits
      if (tier !== 'free') {
         return { canAdd: true, currentCount: 0, limit: null };
      }
      
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { canAdd: false, currentCount: 0, limit: MAX_ACTIVE_INTERVIEWS_FREE };
      
      // Get all applications to get their IDs
      const { data: applications } = await supabase
         .from('job_applications')
         .select('id')
         .eq('user_id', user.id);
         
      if (!applications || applications.length === 0) {
         return { canAdd: true, currentCount: 0, limit: MAX_ACTIVE_INTERVIEWS_FREE };
      }
      
      const appIds = applications.map(a => a.id);
      
      // Count total interviews
      const { count } = await supabase
         .from('interviews')
         .select('*', { count: 'exact', head: true })
         .in('job_application_id', appIds);
         
      const currentCount = count || 0;
      
      return { 
         canAdd: currentCount < MAX_ACTIVE_INTERVIEWS_FREE, 
         currentCount, 
         limit: MAX_ACTIVE_INTERVIEWS_FREE 
      };
      
   } catch (error) {
      console.error("Error checking interview limit:", error);
      return { canAdd: false, currentCount: 0, limit: MAX_ACTIVE_INTERVIEWS_FREE };
   }
}
