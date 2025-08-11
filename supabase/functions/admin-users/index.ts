import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  console.log("=== FUNCAO ATUALIZADA CHAMADA ===");
  console.log("Method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const service = createClient(supabaseUrl, serviceKey);

    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      console.log("USUARIO NAO ENCONTRADO");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { ...corsHeaders } 
      });
    }

    const { data: prof } = await userClient
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();
    
    if (!prof?.is_admin) {
      console.log("NAO EH ADMIN");
      return new Response(JSON.stringify({ error: "Forbidden" }), { 
        status: 403, 
        headers: { ...corsHeaders } 
      });
    }

    const body = await req.json();
    const action = body?.action;
    console.log("ACAO:", action);

    if (action === "list") {
      console.log("EXECUTANDO LISTA ATUALIZADA");
      const { data, error } = await service
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) {
        console.log("ERRO DB:", error);
        throw error;
      }
      
      console.log("PERFIS ENCONTRADOS:", data?.length);
      console.log("DADOS COMPLETOS:", data);
      
      const response = { ok: true, data };
      console.log("RETORNANDO RESPOSTA:", response);
      
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { 
      status: 400, 
      headers: { ...corsHeaders } 
    });
    
  } catch (e: any) {
    console.log("ERRO NA FUNCAO:", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { 
      status: 500, 
      headers: { ...corsHeaders } 
    });
  }
});


