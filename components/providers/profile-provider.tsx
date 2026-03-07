'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string | null;
  ai_credits: number;
}

interface ProfileContextType {
  profile: Profile | null;
  credits: number;
  loading: boolean;
  user: User | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    async function loadProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (!authUser) {
        setLoading(false);
        return;
      }

      // Fetch initial profile
      const { data } = await supabase
        .from('user_profiles')
        .select('id, name, ai_credits')
        .eq('id', authUser.id)
        .single();


      if (data) {
        setProfile(data as Profile);
      }
      setLoading(false);

      // Subscribe to real-time changes
      channel = supabase
        .channel(`profile:${authUser.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_profiles',
            filter: `id=eq.${authUser.id}`,
          },
          (payload) => {
            console.log('[ProfileProvider] Real-time update received:', payload);
            setProfile((prev) => (prev ? { ...prev, ...payload.new } : (payload.new as Profile)));
          }
        )
        .subscribe();
    }

    loadProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <ProfileContext.Provider value={{ profile, credits: profile?.ai_credits || 0, loading, user }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
