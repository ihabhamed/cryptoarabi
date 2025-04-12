
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  checkIsAdmin: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIsAdmin = async (): Promise<boolean> => {
    if (!user) {
      console.log('Cannot check admin status: No user is logged in');
      return false;
    }
    
    try {
      console.log('Checking admin status for user:', user.id);
      
      // Use the RPC function we created
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status via RPC:', error);
        return false;
      }
      
      console.log('Admin check result from RPC:', data);
      
      setIsAdmin(!!data);
      return !!data;
    } catch (error) {
      console.error('Exception checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      // First check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Wait a moment before checking admin status to ensure the session is properly established
            setTimeout(async () => {
              await checkIsAdmin();
            }, 500);
          } else {
            setIsAdmin(false);
          }
        }
      );
      
      // If there's a user, check admin status
      if (session?.user) {
        await checkIsAdmin();
      }
      
      setLoading(false);
      
      return () => subscription.unsubscribe();
    };
    
    setupAuth();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const value = {
    session,
    user,
    loading,
    isAdmin,
    signOut,
    checkIsAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
