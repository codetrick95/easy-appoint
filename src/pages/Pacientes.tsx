import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';

const Pacientes = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPaciente, setEditPaciente] = useState<any | null>(null);
  const [form, setForm] = useState({ nome: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPacientes = () => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', user.id)
      .order('nome', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPacientes(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPacientes();
    // eslint-disable-next-line
  }, [user]);

  const openNew = () => {
    setEditPaciente(null);
    setForm({ nome: '', email: '' });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditPaciente(p);
    setForm({ nome: p.nome, email: p.email || '' });
    setModalOpen(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    if (editPaciente) {
      // update
      await supabase.from('pacientes').update({ nome: form.nome, email: form.email }).eq('id', editPaciente.id);
    } else {
      // insert
      await supabase.from('pacientes').insert([{ nome: form.nome, email: form.email, user_id: user.id }]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchPacientes();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('pacientes').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchPacientes();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4" onClick={openNew}>Novo Paciente</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSave} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{editPaciente ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
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
          ) : pacientes.length === 0 ? (
            <div>Nenhum paciente encontrado.</div>
          ) : (
            <ul className="space-y-2">
              {pacientes.map(p => (
                <li key={p.id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.nome}</div>
                    <div className="text-sm text-muted-foreground">{p.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(p.id)}>Excluir</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div>Tem certeza que deseja excluir este paciente?</div>
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

export default Pacientes;