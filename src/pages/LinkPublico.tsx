import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LinkPublico = () => {
  const { user } = useAuth();
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('link_publico')
        .eq('user_id', user.id)
        .single();
      if (data && data.link_publico) {
        setLink(`${window.location.origin}/publico/${data.link_publico}`);
      } else {
        setLink(`${window.location.origin}/publico/${user.id}`);
      }
      setLoading(false);
    };
    fetchLink();
  }, [user]);

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Seu Link Público</CardTitle>
          <CardDescription>
            Compartilhe este link para integrações automáticas (ex: n8n, WhatsApp, etc).<br/>
            Ele retorna seus agendamentos de forma pública.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={link}
                  readOnly
                />
                <Button onClick={handleCopy}>{copied ? 'Copiado!' : 'Copiar'}</Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Use este link em automações, bots ou para compartilhar sua agenda publicamente.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkPublico;