import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Instagram,
  Facebook,
  Linkedin,
  Youtube
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  nome: string;
  especialidade?: string;
  telefone?: string;
  email: string;
  link_publico: string;
  created_at: string;
  updated_at: string;
}

// Interface estendida para incluir campos adicionais
interface ExtendedProfile extends Profile {
  foto_perfil?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
}

interface Agendamento {
  id: string;
  nome_paciente: string;
  telefone_paciente?: string;
  email_paciente?: string;
  data_hora: string;
  duracao_minutos: number;
  status: string;
  observacoes?: string;
}

const PublicAgendamento = () => {
  const { linkId } = useParams();
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nome_paciente: '',
    telefone_paciente: '',
    email_paciente: '',
    data_hora: '',
    duracao_minutos: '60',
    observacoes: ''
  });

  // Função para carregar dados adicionais do localStorage
  const loadExtendedProfile = (baseProfile: Profile): ExtendedProfile => {
    const extendedData = localStorage.getItem(`profile_extended_${baseProfile.user_id}`);
    const parsedData = extendedData ? JSON.parse(extendedData) : {};
    
    return {
      ...baseProfile,
      foto_perfil: parsedData.foto_perfil || '',
      instagram: parsedData.instagram || '',
      tiktok: parsedData.tiktok || '',
      facebook: parsedData.facebook || '',
      linkedin: parsedData.linkedin || ''
    };
  };

  const fetchProfile = async () => {
    if (!linkId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('link_publico', linkId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
      } else {
        const extendedProfile = loadExtendedProfile(data);
        setProfile(extendedProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [linkId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      // Converter a data/hora para o fuso horário local
      const dataHoraLocal = new Date(form.data_hora);
      
      const agendamentoData = {
        nome_paciente: form.nome_paciente,
        telefone_paciente: form.telefone_paciente || null,
        email_paciente: form.email_paciente || null,
        data_hora: dataHoraLocal.toISOString(),
        duracao_minutos: parseInt(form.duracao_minutos),
        status: 'agendado',
        observacoes: form.observacoes || null,
        user_id: profile.user_id,
        agendamento_publico: true
      };

      const { error } = await supabase
        .from('agendamentos')
        .insert([agendamentoData]);
      
      if (error) throw error;

      setSuccess(true);
      setModalOpen(false);
      setForm({
        nome_paciente: '',
        telefone_paciente: '',
        email_paciente: '',
        data_hora: '',
        duracao_minutos: '60',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link não encontrado</h2>
            <p className="text-muted-foreground">
              O link de agendamento não foi encontrado ou não está disponível.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Agendamento Realizado!</h2>
            <p className="text-muted-foreground mb-4">
              Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
            </p>
            <Button 
              onClick={() => setSuccess(false)}
              className="w-full"
            >
              Fazer Novo Agendamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Agende sua Consulta</h1>
              <p className="text-muted-foreground">Preencha os dados para agendar sua consulta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Informações do Profissional */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dr. {profile.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Foto de Perfil */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.foto_perfil} />
                    <AvatarFallback>
                      {profile.nome ? profile.nome.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{profile.nome}</h3>
                    {profile.especialidade && (
                      <Badge variant="secondary">{profile.especialidade}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {profile.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.telefone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                {/* Redes Sociais */}
                {(profile.instagram || profile.tiktok || profile.facebook || profile.linkedin) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Redes Sociais</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.instagram && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          Instagram
                        </Button>
                      )}
                      {profile.tiktok && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Youtube className="h-3 w-3" />
                          TikTok
                        </Button>
                      )}
                      {profile.facebook && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Facebook className="h-3 w-3" />
                          Facebook
                        </Button>
                      )}
                      {profile.linkedin && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Linkedin className="h-3 w-3" />
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Informações da Consulta</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duração: 60 minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Horário flexível</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Novo Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Consulta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <form onSubmit={handleSave} className="space-y-4">
                      <DialogHeader>
                        <DialogTitle>Agendar Consulta</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nome_paciente">Nome Completo *</Label>
                        <Input
                          id="nome_paciente"
                          value={form.nome_paciente}
                          onChange={e => setForm(f => ({ ...f, nome_paciente: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="telefone_paciente">Telefone</Label>
                          <Input
                            id="telefone_paciente"
                            value={form.telefone_paciente}
                            onChange={e => setForm(f => ({ ...f, telefone_paciente: e.target.value }))}
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email_paciente">Email</Label>
                          <Input
                            id="email_paciente"
                            type="email"
                            value={form.email_paciente}
                            onChange={e => setForm(f => ({ ...f, email_paciente: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="data_hora">Data e Hora *</Label>
                          <Input
                            id="data_hora"
                            type="datetime-local"
                            value={form.data_hora}
                            onChange={e => setForm(f => ({ ...f, data_hora: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duracao_minutos">Duração (min)</Label>
                          <Input
                            id="duracao_minutos"
                            type="number"
                            min="30"
                            step="30"
                            value={form.duracao_minutos}
                            onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={form.observacoes}
                          onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                          rows={3}
                          placeholder="Informações adicionais sobre sua consulta..."
                        />
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                          {saving ? 'Salvando...' : 'Confirmar Agendamento'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Como funciona</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>1. Preencha seus dados pessoais</p>
                    <p>2. Escolha a data e horário desejados</p>
                    <p>3. Confirme o agendamento</p>
                    <p>4. Aguarde a confirmação do profissional</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAgendamento; 