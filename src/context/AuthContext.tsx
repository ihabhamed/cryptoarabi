
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
    try {
      // Get current session to ensure we have the latest auth state
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.user) {
        console.log('Cannot check admin status: No user in current session');
        return false;
      }
      
      console.log('Checking admin status for user:', currentSession.user.id);
      
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
      
      try {
        // First get the initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', initialSession?.user?.id);
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Wait before checking admin status to ensure auth is ready
          setTimeout(async () => {
            await checkIsAdmin();
            setLoading(false);
          }, 1000);
        } else {
          setLoading(false);
        }
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event, newSession?.user?.id);
            
            // Update session and user state
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
              // For new sign-ins, check admin status after a delay
              if (event === 'SIGNED_IN') {
                // Longer delay to ensure Supabase session is fully established
                setTimeout(async () => {
                  await checkIsAdmin();
                }, 1500);
              }
            } else {
              setIsAdmin(false);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
        setLoading(false);
      }
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
