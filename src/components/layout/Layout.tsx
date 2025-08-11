import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [active, setActive] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user) { setChecking(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('active')
        .eq('user_id', user.id)
        .single();
      setActive(Boolean(data?.active ?? true));
      setChecking(false);
    };
    check();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Conta Bloqueada</h2>
          <p className="text-muted-foreground">Entre em contato com o suporte para regularizar seu acesso.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 sticky top-0 z-20">
            <SidebarTrigger className="ml-2" />
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}