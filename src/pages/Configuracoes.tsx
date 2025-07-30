import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Configuracoes = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState({ nome: '', email: '', telefone: '', especialidade: '', link_publico: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('nome, email, telefone, especialidade, link_publico')
        .eq('user_id', user.id)
        .single();
      if (data) setPerfil(data);
      setLoading(false);
    };
    fetchPerfil();
  }, [user]);

  const handleChange = (e: any) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const { error } = await supabase
      .from('profiles')
      .update(perfil)
      .eq('user_id', user.id);
    setSaving(false);
    setMsg(error ? 'Erro ao salvar.' : 'Alterações salvas com sucesso!');
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input name="nome" value={perfil.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" value={perfil.email} onChange={handleChange} type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input name="telefone" value={perfil.telefone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Especialidade</Label>
                <Input name="especialidade" value={perfil.especialidade} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Link Público (personalize seu link)</Label>
                <Input name="link_publico" value={perfil.link_publico || ''} onChange={handleChange} />
                <div className="text-xs text-muted-foreground">Exemplo: se preencher "dr-joao", seu link será https://seusite.com/publico/dr-joao</div>
              </div>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
              {msg && <div className="text-sm mt-2">{msg}</div>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;