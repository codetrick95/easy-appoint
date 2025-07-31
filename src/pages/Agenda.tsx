import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2, Clock, User, Phone, Mail, Grid, List, CalendarDays } from 'lucide-react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, isSameDay, isSameWeek, isSameMonth, isSameYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Agendamento {
  id: string;
  nome_paciente: string;
  telefone_paciente?: string;
  email_paciente?: string;
  data_hora: string;
  duracao_minutos: number;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  observacoes?: string;
  created_at: string;
}

type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly';

const Agenda = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState<Agendamento | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome_paciente: '',
    telefone_paciente: '',
    email_paciente: '',
    data_hora: '',
    duracao_minutos: '60',
    status: 'agendado' as const,
    observacoes: ''
  });

  // Horários disponíveis
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const statusColors = {
    agendado: 'bg-blue-100 text-blue-800',
    confirmado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
    concluido: 'bg-gray-100 text-gray-800'
  };

  const fetchAgendamentos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      switch (viewMode) {
        case 'daily':
          startDate = startOfDay(selectedDate);
          endDate = endOfDay(selectedDate);
          break;
        case 'weekly':
          startDate = startOfWeek(selectedDate, { locale: ptBR });
          endDate = endOfWeek(selectedDate, { locale: ptBR });
          break;
        case 'monthly':
          startDate = startOfMonth(selectedDate);
          endDate = endOfMonth(selectedDate);
          break;
        case 'yearly':
          startDate = startOfYear(selectedDate);
          endDate = endOfYear(selectedDate);
          break;
        default:
          startDate = startOfDay(selectedDate);
          endDate = endOfDay(selectedDate);
      }
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('user_id', user.id)
        .gte('data_hora', startDate.toISOString())
        .lte('data_hora', endDate.toISOString())
        .order('data_hora', { ascending: true });

      if (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } else {
        setAgendamentos(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [user, selectedDate, viewMode]);

  const openNew = () => {
    setEditAgendamento(null);
    setForm({
      nome_paciente: '',
      telefone_paciente: '',
      email_paciente: '',
      data_hora: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      duracao_minutos: '60',
      status: 'agendado',
      observacoes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (agendamento: Agendamento) => {
    setEditAgendamento(agendamento);
    setForm({
      nome_paciente: agendamento.nome_paciente,
      telefone_paciente: agendamento.telefone_paciente || '',
      email_paciente: agendamento.email_paciente || '',
      data_hora: format(parseISO(agendamento.data_hora), "yyyy-MM-dd'T'HH:mm"),
      duracao_minutos: String(agendamento.duracao_minutos),
      status: agendamento.status,
      observacoes: agendamento.observacoes || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const agendamentoData = {
        nome_paciente: form.nome_paciente,
        telefone_paciente: form.telefone_paciente || null,
        email_paciente: form.email_paciente || null,
        data_hora: form.data_hora,
        duracao_minutos: parseInt(form.duracao_minutos),
        status: form.status,
        observacoes: form.observacoes || null,
        user_id: user.id
      };

      if (editAgendamento) {
        const { error } = await supabase
          .from('agendamentos')
          .update(agendamentoData)
          .eq('id', editAgendamento.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agendamentos')
          .insert([agendamentoData]);
        
        if (error) throw error;
      }

      setModalOpen(false);
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', deleteId);
      
      if (error) throw error;
      
      setDeleteId(null);
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'daily':
        setSelectedDate(prev => 
          direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1)
        );
        break;
      case 'weekly':
        setSelectedDate(prev => 
          direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
        );
        break;
      case 'monthly':
        setSelectedDate(prev => 
          direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
        );
        break;
      case 'yearly':
        setSelectedDate(prev => 
          direction === 'prev' ? subYears(prev, 1) : addYears(prev, 1)
        );
        break;
    }
  };

  const getAgendamentosForDate = (date: Date) => {
    return agendamentos.filter(agendamento => {
      const agendamentoDate = parseISO(agendamento.data_hora);
      return isSameDay(agendamentoDate, date);
    });
  };

  const getAgendamentosForWeek = (weekStart: Date) => {
    return agendamentos.filter(agendamento => {
      const agendamentoDate = parseISO(agendamento.data_hora);
      return isSameWeek(agendamentoDate, weekStart, { locale: ptBR });
    });
  };

  const getAgendamentosForMonth = (monthStart: Date) => {
    return agendamentos.filter(agendamento => {
      const agendamentoDate = parseISO(agendamento.data_hora);
      return isSameMonth(agendamentoDate, monthStart);
    });
  };

  const getAgendamentosForYear = (yearStart: Date) => {
    return agendamentos.filter(agendamento => {
      const agendamentoDate = parseISO(agendamento.data_hora);
      return isSameYear(agendamentoDate, yearStart);
    });
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`;
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'daily':
        return format(selectedDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR });
      case 'weekly':
        const weekStart = startOfWeek(selectedDate, { locale: ptBR });
        const weekEnd = endOfWeek(selectedDate, { locale: ptBR });
        return `${format(weekStart, 'dd/MM', { locale: ptBR })} - ${format(weekEnd, 'dd/MM/yyyy', { locale: ptBR })}`;
      case 'monthly':
        return format(selectedDate, 'MMMM \'de\' yyyy', { locale: ptBR });
      case 'yearly':
        return format(selectedDate, 'yyyy', { locale: ptBR });
      default:
        return '';
    }
  };

  const renderDailyView = () => {
    const dayAgendamentos = getAgendamentosForDate(selectedDate);
    
    return (
      <div className="space-y-3">
        {horarios.map(horario => {
          const [hora, minuto] = horario.split(':').map(Number);
          const dataHora = new Date(selectedDate);
          dataHora.setHours(hora, minuto, 0, 0);
          
          const agendamento = dayAgendamentos.find(a => {
            const agendamentoHora = parseISO(a.data_hora);
            return agendamentoHora.getHours() === hora && 
                   agendamentoHora.getMinutes() === minuto;
          });

          return (
            <div key={horario} className="flex items-center border-b border-gray-100 py-3">
              <div className="w-20 text-sm font-medium text-gray-600">
                {horario}
              </div>
              <div className="flex-1">
                {agendamento ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          {agendamento.nome_paciente}
                        </span>
                        <Badge className={statusColors[agendamento.status]}>
                          {agendamento.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-blue-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(agendamento.duracao_minutos)}
                        </div>
                        
                        {agendamento.telefone_paciente && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {agendamento.telefone_paciente}
                          </div>
                        )}
                        
                        {agendamento.email_paciente && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {agendamento.email_paciente}
                          </div>
                        )}
                      </div>
                      
                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-600 mt-2">
                          {agendamento.observacoes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(agendamento)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(agendamento.id)}
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
                            Tem certeza que deseja excluir o agendamento de{' '}
                            <strong>{agendamento.nome_paciente}</strong>?
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
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm py-4">
                    Horário livre
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(selectedDate, { locale: ptBR });
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(selectedDate, { locale: ptBR })
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayAgendamentos = getAgendamentosForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={index} className={`p-2 border rounded-lg ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
              <div className="text-center mb-2">
                <div className="text-xs text-gray-500">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={`font-medium ${isToday ? 'text-blue-600' : ''}`}>
                  {format(day, 'dd')}
                </div>
              </div>
              
              <div className="space-y-1">
                {dayAgendamentos.slice(0, 3).map((agendamento) => (
                  <div key={agendamento.id} className="text-xs p-1 bg-green-100 rounded">
                    <div className="font-medium truncate">{agendamento.nome_paciente}</div>
                    <div className="text-gray-600">{formatTime(agendamento.data_hora)}</div>
                  </div>
                ))}
                {dayAgendamentos.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAgendamentos.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Dias do mês */}
        {monthDays.map((day, index) => {
          const dayAgendamentos = getAgendamentosForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, selectedDate);
          
          return (
            <div 
              key={index} 
              className={`p-2 border rounded-lg min-h-[80px] ${
                isToday ? 'bg-blue-50 border-blue-200' : ''
              } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
            >
              <div className={`text-right text-sm ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                {format(day, 'dd')}
              </div>
              
              <div className="space-y-1 mt-1">
                {dayAgendamentos.slice(0, 2).map((agendamento) => (
                  <div key={agendamento.id} className="text-xs p-1 bg-green-100 rounded">
                    <div className="font-medium truncate">{agendamento.nome_paciente}</div>
                    <div className="text-gray-600">{formatTime(agendamento.data_hora)}</div>
                  </div>
                ))}
                {dayAgendamentos.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAgendamentos.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearlyView = () => {
    const yearAgendamentos = getAgendamentosForYear(selectedDate);
    const months = eachMonthOfInterval({
      start: startOfYear(selectedDate),
      end: endOfYear(selectedDate)
    });

    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => {
          const monthAgendamentos = yearAgendamentos.filter(agendamento => {
            const agendamentoDate = parseISO(agendamento.data_hora);
            return isSameMonth(agendamentoDate, month);
          });
          
          const isCurrentMonth = isSameMonth(month, new Date());
          
          return (
            <div key={index} className={`p-4 border rounded-lg ${isCurrentMonth ? 'bg-blue-50 border-blue-200' : ''}`}>
              <div className="text-center mb-3">
                <div className="font-medium">{format(month, 'MMMM', { locale: ptBR })}</div>
                <div className="text-sm text-gray-500">{monthAgendamentos.length} agendamentos</div>
              </div>
              
              <div className="space-y-2">
                {monthAgendamentos.slice(0, 3).map((agendamento) => (
                  <div key={agendamento.id} className="text-sm p-2 bg-green-100 rounded">
                    <div className="font-medium">{agendamento.nome_paciente}</div>
                    <div className="text-gray-600">
                      {format(parseISO(agendamento.data_hora), 'dd/MM HH:mm')}
                    </div>
                  </div>
                ))}
                {monthAgendamentos.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{monthAgendamentos.length - 3} mais agendamentos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e consultas
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSave} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {editAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-2">
                <Label htmlFor="nome_paciente">Nome do Paciente *</Label>
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
                    min="15"
                    step="15"
                    value={form.duracao_minutos}
                    onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(value: any) => setForm(f => ({ ...f, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  rows={3}
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

      {/* Controles de Visualização */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Diário
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Semanal
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Mensal
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Anual
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {getViewTitle()}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Agenda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando agendamentos...</p>
            </div>
          ) : (
            <div>
              {viewMode === 'daily' && renderDailyView()}
              {viewMode === 'weekly' && renderWeeklyView()}
              {viewMode === 'monthly' && renderMonthlyView()}
              {viewMode === 'yearly' && renderYearlyView()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda; 