import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export const KEYS = {
  JOB_APPLICATIONS: 'job_applications',
  INTERVIEWS: 'interviews',
  OFFERS: 'offers',
  CVS: 'cvs',
  ACTIVITY: 'activity',
  PROFILE: 'profile',
  LIMITS: 'limits',
};

// Hook for fetching job applications
export function useJobApplications() {
  const supabase = createClient();
  
  return useQuery({
    queryKey: [KEYS.JOB_APPLICATIONS],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .select('*, company:companies(id, name, website)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Hook for fetching CVs
export function useCVs() {
  const supabase = createClient();
  
  return useQuery({
    queryKey: [KEYS.CVS],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Global data hook (ideal for Dashboard landing)
export function useDashboardData() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['dashboard_data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [applications, interviews, offers, resumes, recentActivity] = await Promise.all([
        supabase
          .from('job_applications')
          .select('*, company:companies(id, name, website)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('interviews')
          .select('*, job_applications!inner(user_id)')
          .eq('job_applications.user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('job_offers')
          .select('*, job_applications!inner(user_id)')
          .eq('job_applications.user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('interactions')
          .select('id, type, notes, created_at')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      return {
        applications: applications.data || [],
        interviews: interviews.data || [],
        offers: offers.data || [],
        resumes: resumes.data || [],
        recentActivity: recentActivity.data || []
      };
    }
  });
}

// Hook for fetching user limits (interviews)
export function useInterviewLimit() {
  return useQuery({
    queryKey: [KEYS.LIMITS],
    queryFn: async () => {
      const res = await fetch('/api/user/limits');
      if (!res.ok) throw new Error('Failed to fetch limit');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

