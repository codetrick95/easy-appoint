import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Clock,
  Calendar,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff,
  Key,
  Globe,
  Database,
  Camera,
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

const Configuracoes = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    especialidade: '',
    telefone: '',
    email: '',
    link_publico: '',
    foto_perfil: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    linkedin: ''
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      publicProfile: true,
      showPhone: false,
      showEmail: true,
      showSocialMedia: true
    },
    preferences: {
      theme: 'light',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    system: {
      autoBackup: true,
      dataRetention: '1_year',
      sessionTimeout: '8_hours'
    }
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

  // Função para salvar dados adicionais no localStorage
  const saveExtendedProfile = (userId: string, extendedData: any) => {
    localStorage.setItem(`profile_extended_${userId}`, JSON.stringify(extendedData));
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', error);
      } else {
        const extendedProfile = loadExtendedProfile(data);
        setProfile(extendedProfile);
        if (data) {
          setForm({
            nome: data.nome,
            especialidade: data.especialidade || '',
            telefone: data.telefone || '',
            email: data.email,
            link_publico: data.link_publico,
            foto_perfil: extendedProfile.foto_perfil || '',
            instagram: extendedProfile.instagram || '',
            tiktok: extendedProfile.tiktok || '',
            facebook: extendedProfile.facebook || '',
            linkedin: extendedProfile.linkedin || ''
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      // Usar base64 para armazenamento local (mais confiável)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setForm(f => ({ ...f, foto_perfil: base64String }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Dados básicos para o Supabase
      const profileData = {
        nome: form.nome,
        especialidade: form.especialidade || null,
        telefone: form.telefone || null,
        email: form.email,
        link_publico: form.link_publico,
        user_id: user.id
      };

      // Dados estendidos para localStorage
      const extendedData = {
        foto_perfil: form.foto_perfil || '',
        instagram: form.instagram || '',
        tiktok: form.tiktok || '',
        facebook: form.facebook || '',
        linkedin: form.linkedin || ''
      };

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profile.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([profileData]);
        
        if (error) throw error;
      }

      // Salvar dados estendidos no localStorage
      saveExtendedProfile(user.id, extendedData);

      setModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    // Aqui você pode salvar as configurações no localStorage ou no banco
    localStorage.setItem('agenda_settings', JSON.stringify(settings));
    // Simular salvamento
    setTimeout(() => {
      console.log('Configurações salvas:', settings);
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <User className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
              </DialogHeader>
              
              {/* Foto de Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Foto de Perfil
                </h3>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={form.foto_perfil} />
                    <AvatarFallback>
                      {form.nome ? form.nome.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <Label htmlFor="foto_perfil" className="text-sm">
                      {form.foto_perfil ? 'Alterar foto' : 'Adicionar foto'}
                    </Label>
                    <Input
                      id="foto_perfil"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto && (
                      <p className="text-xs text-muted-foreground">
                        Fazendo upload...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={form.nome}
                      onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade</Label>
                    <Input
                      id="especialidade"
                      value={form.especialidade}
                      onChange={e => setForm(f => ({ ...f, especialidade: e.target.value }))}
                      placeholder="Ex: Cardiologia, Psicologia..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={form.telefone}
                      onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Redes Sociais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Redes Sociais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={form.instagram}
                      onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                      placeholder="@seu_usuario"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiktok" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      TikTok
                    </Label>
                    <Input
                      id="tiktok"
                      value={form.tiktok}
                      onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))}
                      placeholder="@seu_usuario"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={form.facebook}
                      onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))}
                      placeholder="facebook.com/seu_perfil"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={form.linkedin}
                      onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/seu_perfil"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <div className="space-y-4">
                {/* Foto e Informações Básicas */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.foto_perfil} />
                    <AvatarFallback>
                      {profile.nome ? profile.nome.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">{profile.nome}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    {profile.especialidade && (
                      <p className="text-sm text-muted-foreground">{profile.especialidade}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Telefone</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile.telefone || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Link Público</Label>
                    <p className="text-sm text-muted-foreground font-mono">
                      {profile.link_publico}
                    </p>
                  </div>
                </div>

                {/* Redes Sociais */}
                {(profile.instagram || profile.tiktok || profile.facebook || profile.linkedin) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Redes Sociais</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.instagram && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          Instagram
                        </Badge>
                      )}
                      {profile.tiktok && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Youtube className="h-3 w-3" />
                          TikTok
                        </Badge>
                      )}
                      {profile.facebook && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Facebook className="h-3 w-3" />
                          Facebook
                        </Badge>
                      )}
                      {profile.linkedin && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Linkedin className="h-3 w-3" />
                          LinkedIn
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum perfil configurado ainda.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes por email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    notifications: { ...s.notifications, email: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes por SMS
                </p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    notifications: { ...s.notifications, sms: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    notifications: { ...s.notifications, push: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Perfil Público</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir acesso ao link público
                </p>
              </div>
              <Switch
                checked={settings.privacy.publicProfile}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    privacy: { ...s.privacy, publicProfile: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar Telefone</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir telefone no perfil público
                </p>
              </div>
              <Switch
                checked={settings.privacy.showPhone}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    privacy: { ...s.privacy, showPhone: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar Email</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir email no perfil público
                </p>
              </div>
              <Switch
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    privacy: { ...s.privacy, showEmail: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar Redes Sociais</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir redes sociais no perfil público
                </p>
              </div>
              <Switch
                checked={settings.privacy.showSocialMedia}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    privacy: { ...s.privacy, showSocialMedia: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select 
                value={settings.preferences.theme} 
                onValueChange={(value) => 
                  setSettings(s => ({
                    ...s,
                    preferences: { ...s.preferences, theme: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={settings.preferences.language} 
                onValueChange={(value) => 
                  setSettings(s => ({
                    ...s,
                    preferences: { ...s.preferences, language: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Fuso Horário</Label>
              <Select 
                value={settings.preferences.timezone} 
                onValueChange={(value) => 
                  setSettings(s => ({
                    ...s,
                    preferences: { ...s.preferences, timezone: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Fazer backup automático dos dados
                </p>
              </div>
              <Switch
                checked={settings.system.autoBackup}
                onCheckedChange={(checked) => 
                  setSettings(s => ({
                    ...s,
                    system: { ...s.system, autoBackup: checked }
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Retenção de Dados</Label>
              <Select 
                value={settings.system.dataRetention} 
                onValueChange={(value) => 
                  setSettings(s => ({
                    ...s,
                    system: { ...s.system, dataRetention: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6_months">6 meses</SelectItem>
                  <SelectItem value="1_year">1 ano</SelectItem>
                  <SelectItem value="2_years">2 anos</SelectItem>
                  <SelectItem value="indefinite">Indefinido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Timeout da Sessão</Label>
              <Select 
                value={settings.system.sessionTimeout} 
                onValueChange={(value) => 
                  setSettings(s => ({
                    ...s,
                    system: { ...s.system, sessionTimeout: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_hour">1 hora</SelectItem>
                  <SelectItem value="4_hours">4 horas</SelectItem>
                  <SelectItem value="8_hours">8 horas</SelectItem>
                  <SelectItem value="24_hours">24 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
        
        <Button variant="outline" onClick={handleSignOut}>
          <Key className="h-4 w-4 mr-2" />
          Sair da Conta
        </Button>
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm font-medium">Versão</Label>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Última Atualização</Label>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant="secondary">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes; 