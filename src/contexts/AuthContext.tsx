import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "customer" | "vendor" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  selectRole: (role: "customer" | "vendor") => Promise<{ error: string | null }>;
  hasVendorShop: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);
  const [hasVendorShop, setHasVendorShop] = useState(false);

  const fetchRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setRole(data.role as AppRole);
      if (data.role === "vendor") {
        const { data: vendor } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        setHasVendorShop(!!vendor);
      }
    } else {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchRole(session.user.id), 0);
        } else {
          setRole(null);
          setHasVendorShop(false);
        }
        setLoading(false);
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setHasVendorShop(false);
  };

  const selectRole = async (selectedRole: "customer" | "vendor") => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: selectedRole });
    if (!error) {
      setRole(selectedRole);
    }
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider
      value={{ user, session, role, loading, signUp, signIn, signOut, selectRole, hasVendorShop }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
