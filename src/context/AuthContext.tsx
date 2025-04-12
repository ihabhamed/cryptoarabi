
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
      
      // Use the RPC function with a deliberate retry mechanism
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Admin check attempt ${attempt}/3`);
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error(`Error checking admin status via RPC (attempt ${attempt}):`, error);
          // Wait a moment before retrying
          if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        
        console.log('Admin check result from RPC:', data);
        setIsAdmin(!!data);
        return !!data;
      }
      
      console.log('All admin check attempts failed');
      return false;
    } catch (error) {
      console.error('Exception checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      try {
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
              // Delay admin check to ensure session is fully established
              setTimeout(async () => {
                // Use a longer timeout to ensure auth is fully ready
                await new Promise(resolve => setTimeout(resolve, 1000));
                await checkIsAdmin();
              }, 1000);
            } else {
              setIsAdmin(false);
            }
          }
        );
        
        // If there's a user, check admin status with a delay
        if (session?.user) {
          setTimeout(async () => {
            await checkIsAdmin();
          }, 1000);
        }
        
      } catch (error) {
        console.error("Error setting up auth:", error);
      } finally {
        setLoading(false);
      }
      
      return () => {
        // Clean up subscription (this part stays the same)
      };
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
