// Client-side fetcher
export async function fetchUserLimits(): Promise<{ canAdd: boolean, currentCount: number, limit: number | null }> {
   try {
      const res = await fetch('/api/user/limits');
      if (!res.ok) throw new Error("Failed to fetch limits");
      return await res.json();
   } catch (e) {
      console.error(e);
      return { canAdd: false, currentCount: 0, limit: 3 };
   }
}

// Client-side tier fetcher
export async function fetchUserTier(): Promise<{ tier: 'free' | 'accelerator' | 'elite', current_period_end: string | null }> {
   try {
      const res = await fetch('/api/user/tier');
      if (!res.ok) throw new Error("Failed to fetch tier");
      return await res.json();
   } catch (e) {
      console.error(e);
      return { tier: 'free', current_period_end: null };
   }
}

// Keep server logic separated
