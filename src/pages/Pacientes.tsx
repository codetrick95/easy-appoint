import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  FileText,
  Users,
  Filter
} from 'lucide-react';

interface Paciente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  data_nascimento?: string;
  convenio?: string;
  numero_carteirinha?: string;
  cpf?: string;
  profissao?: string;
  endereco_cep?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

const Pacientes = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPaciente, setEditPaciente] = useState<Paciente | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    convenio: '',
    numero_carteirinha: '',
    cpf: '',
    profissao: '',
    endereco_cep: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_estado: '',
    observacoes: ''
  });

  const fetchPacientes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao carregar pacientes:', error);
      } else {
        setPacientes(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [user]);

  const openNew = () => {
    setEditPaciente(null);
    setForm({
      nome: '',
      telefone: '',
      email: '',
      data_nascimento: '',
      convenio: '',
      numero_carteirinha: '',
      cpf: '',
      profissao: '',
      endereco_cep: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_bairro: '',
      endereco_cidade: '',
      endereco_estado: '',
      observacoes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (paciente: Paciente) => {
    setEditPaciente(paciente);
    setForm({
      nome: paciente.nome,
      telefone: paciente.telefone || '',
      email: paciente.email || '',
      data_nascimento: paciente.data_nascimento || '',
      convenio: paciente.convenio || '',
      numero_carteirinha: paciente.numero_carteirinha || '',
      cpf: paciente.cpf || '',
      profissao: paciente.profissao || '',
      endereco_cep: paciente.endereco_cep || '',
      endereco_rua: paciente.endereco_rua || '',
      endereco_numero: paciente.endereco_numero || '',
      endereco_bairro: paciente.endereco_bairro || '',
      endereco_cidade: paciente.endereco_cidade || '',
      endereco_estado: paciente.endereco_estado || '',
      observacoes: paciente.observacoes || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const pacienteData = {
        nome: form.nome,
        telefone: form.telefone || null,
        email: form.email || null,
        data_nascimento: form.data_nascimento || null,
        convenio: form.convenio || null,
        numero_carteirinha: form.numero_carteirinha || null,
        cpf: form.cpf || null,
        profissao: form.profissao || null,
        endereco_cep: form.endereco_cep || null,
        endereco_rua: form.endereco_rua || null,
        endereco_numero: form.endereco_numero || null,
        endereco_bairro: form.endereco_bairro || null,
        endereco_cidade: form.endereco_cidade || null,
        endereco_estado: form.endereco_estado || null,
        observacoes: form.observacoes || null,
        user_id: user.id
      };

      if (editPaciente) {
        const { error } = await supabase
          .from('pacientes')
          .update(pacienteData)
          .eq('id', editPaciente.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pacientes')
          .insert([pacienteData]);
        
        if (error) throw error;
      }

      setModalOpen(false);
      fetchPacientes();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', deleteId);
      
      if (error) throw error;
      
      setDeleteId(null);
      fetchPacientes();
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
    }
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.telefone?.includes(searchTerm) ||
    paciente.cpf?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de seus pacientes
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSave} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {editPaciente ? 'Editar Paciente' : 'Novo Paciente'}
                </DialogTitle>
              </DialogHeader>
              
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
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={form.cpf}
                      onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={form.data_nascimento}
                      onChange={e => setForm(f => ({ ...f, data_nascimento: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profissao">Profissão</Label>
                    <Input
                      id="profissao"
                      value={form.profissao}
                      onChange={e => setForm(f => ({ ...f, profissao: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contato
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={form.telefone}
                      onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Convênio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Convênio
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="convenio">Convênio</Label>
                    <Input
                      id="convenio"
                      value={form.convenio}
                      onChange={e => setForm(f => ({ ...f, convenio: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numero_carteirinha">Número da Carteirinha</Label>
                    <Input
                      id="numero_carteirinha"
                      value={form.numero_carteirinha}
                      onChange={e => setForm(f => ({ ...f, numero_carteirinha: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco_cep">CEP</Label>
                    <Input
                      id="endereco_cep"
                      value={form.endereco_cep}
                      onChange={e => setForm(f => ({ ...f, endereco_cep: e.target.value }))}
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco_estado">Estado</Label>
                    <Input
                      id="endereco_estado"
                      value={form.endereco_estado}
                      onChange={e => setForm(f => ({ ...f, endereco_estado: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco_cidade">Cidade</Label>
                    <Input
                      id="endereco_cidade"
                      value={form.endereco_cidade}
                      onChange={e => setForm(f => ({ ...f, endereco_cidade: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco_rua">Rua</Label>
                    <Input
                      id="endereco_rua"
                      value={form.endereco_rua}
                      onChange={e => setForm(f => ({ ...f, endereco_rua: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco_numero">Número</Label>
                    <Input
                      id="endereco_numero"
                      value={form.endereco_numero}
                      onChange={e => setForm(f => ({ ...f, endereco_numero: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco_bairro">Bairro</Label>
                  <Input
                    id="endereco_bairro"
                    value={form.endereco_bairro}
                    onChange={e => setForm(f => ({ ...f, endereco_bairro: e.target.value }))}
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  rows={3}
                  placeholder="Informações adicionais sobre o paciente..."
                />
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

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pacientes.length}</div>
            <p className="text-xs text-muted-foreground">
              Pacientes cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, telefone ou CPF..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando pacientes...</p>
            </div>
          ) : filteredPacientes.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}
              </p>
              {!searchTerm && (
                <Button onClick={openNew} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Paciente
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Data Nasc.</TableHead>
                    <TableHead>Convênio</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{paciente.nome}</div>
                          {paciente.profissao && (
                            <div className="text-sm text-muted-foreground">{paciente.profissao}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {paciente.telefone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {formatPhone(paciente.telefone)}
                            </div>
                          )}
                          {paciente.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {paciente.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {paciente.cpf ? formatCPF(paciente.cpf) : '-'}
                      </TableCell>
                      <TableCell>
                        {formatDate(paciente.data_nascimento || '')}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {paciente.convenio && (
                            <Badge variant="secondary">{paciente.convenio}</Badge>
                          )}
                          {paciente.numero_carteirinha && (
                            <div className="text-xs text-muted-foreground">
                              {paciente.numero_carteirinha}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(paciente)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteId(paciente.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              </AlertDialogHeader>
                              <div>
                                Tem certeza que deseja excluir o paciente{' '}
                                <strong>{paciente.nome}</strong>?
                              </div>
                              <AlertDialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteId(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDelete}
                                >
                                  Excluir
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pacientes; 