import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/ui/logo';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema de agendamentos",
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({ title: 'Informe seu e-mail', description: 'Digite o e-mail para enviar o link de recuperação.' });
      return;
    }
    const redirectTo = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      toast({ title: 'Não foi possível enviar o link', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Verifique seu e-mail', description: 'Enviamos um link para redefinir sua senha.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardDescription className="text-base">Acesso exclusivo para clientes. Seu login é liberado pela equipe TrickTime.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm mt-2">
              <button type="button" onClick={handleResetPassword} className="font-semibold text-primary">Esqueci minha senha</button>
            </div>
            <div className="text-center text-sm mt-2 text-muted-foreground">
              Não tem acesso? <a href="mailto:contato@tricktime.app" className="font-semibold text-primary">Falar com vendas</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;