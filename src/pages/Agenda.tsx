import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';

const Agenda = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgendamento, setEditAgendamento] = useState<any | null>(null);
  const [form, setForm] = useState({ nome_paciente: '', data_hora: '', duracao_minutos: '', status: 'agendado', observacoes: '' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAgendamentos = () => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('agendamentos')
      .select('*')
      .eq('user_id', user.id)
      .order('data_hora', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setAgendamentos(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgendamentos();
    // eslint-disable-next-line
  }, [user]);

  const openNew = () => {
    setEditAgendamento(null);
    setForm({ nome_paciente: '', data_hora: '', duracao_minutos: '', status: 'agendado', observacoes: '' });
    setModalOpen(true);
  };

  const openEdit = (a: any) => {
    setEditAgendamento(a);
    setForm({
      nome_paciente: a.nome_paciente || '',
      data_hora: a.data_hora ? a.data_hora.slice(0, 16) : '',
      duracao_minutos: a.duracao_minutos ? String(a.duracao_minutos) : '',
      status: a.status || 'agendado',
      observacoes: a.observacoes || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    const agendamento = {
      nome_paciente: form.nome_paciente,
      data_hora: form.data_hora,
      duracao_minutos: form.duracao_minutos ? Number(form.duracao_minutos) : null,
      status: form.status,
      observacoes: form.observacoes,
      user_id: user.id
    };
    if (editAgendamento) {
      await supabase.from('agendamentos').update(agendamento).eq('id', editAgendamento.id);
    } else {
      await supabase.from('agendamentos').insert([agendamento]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchAgendamentos();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('agendamentos').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchAgendamentos();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4" onClick={openNew}>Novo Agendamento</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSave} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{editAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>Nome do Paciente</Label>
                  <Input value={form.nome_paciente} onChange={e => setForm(f => ({ ...f, nome_paciente: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Data e Hora</Label>
                  <Input type="datetime-local" value={form.data_hora} onChange={e => setForm(f => ({ ...f, data_hora: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Duração (minutos)</Label>
                  <Input type="number" min={0} value={form.duracao_minutos} onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {loading ? (
            <div>Carregando...</div>
          ) : agendamentos.length === 0 ? (
            <div>Nenhum agendamento encontrado.</div>
          ) : (
            <ul className="space-y-2">
              {agendamentos.map(a => (
                <li key={a.id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{a.nome_paciente}</div>
                    <div className="text-sm text-muted-foreground">{new Date(a.data_hora).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{a.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(a.id)}>Excluir</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div>Tem certeza que deseja excluir este agendamento?</div>
                        <AlertDialogFooter>
                          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;