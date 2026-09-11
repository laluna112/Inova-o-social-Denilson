import { useEffect, useMemo, useState } from 'react';
import { Bell, Plus, Pencil, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { client } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const defaultForm = {
  title: '',
  message: '',
  affected_date: new Date().toISOString().split('T')[0],
  type: 'aviso',
  meal_type: 'geral',
  is_active: true,
};

export default function AvisosManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const fetchAvisos = async () => {
    setLoading(true);
    try {
      const data = await client.entities.Aviso.filter({}, '-created_date', 200);
      setItems(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro ao carregar avisos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  const visibleItems = useMemo(() => items.filter((item) => item.is_active !== false), [items]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = { ...form };
      if (editing) {
        const updated = await client.entities.Aviso.update?.(editing.id, payload);
        if (updated) {
          setItems((current) => current.map((item) => (item.id === editing.id ? updated : item)));
        } else {
          setItems((current) => current.map((item) => item.id === editing.id ? { ...item, ...payload } : item));
        }
        toast({ title: 'Aviso atualizado' });
      } else {
        const created = await client.entities.Aviso.create?.(payload);
        if (created) {
          setItems((current) => [created, ...current]);
        } else {
          const fallbackId = `aviso-${Date.now()}`;
          setItems((current) => [{ ...payload, id: fallbackId, created_date: new Date().toISOString() }, ...current]);
        }
        toast({ title: 'Aviso criado' });
      }
      setEditing(null);
      setForm(defaultForm);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro ao salvar aviso', variant: 'destructive' });
    }
  };

  const handleDelete = async (item) => {
    try {
      if (item && client.entities.Aviso.delete) {
        await client.entities.Aviso.delete(item.id);
      }
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast({ title: 'Aviso removido' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro ao remover aviso', variant: 'destructive' });
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title ?? '',
      message: item.message ?? '',
      affected_date: item.affected_date ?? new Date().toISOString().split('T')[0],
      type: item.type ?? 'aviso',
      meal_type: item.meal_type ?? 'geral',
      is_active: item.is_active !== false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-orange-500" />
          <h3 className="font-semibold text-stone-800">Gerenciar avisos</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="aviso-title">Título</Label>
              <Input id="aviso-title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="aviso-message">Mensagem</Label>
              <Textarea id="aviso-message" name="message" value={form.message} onChange={handleChange} rows={3} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aviso-date">Data afetada</Label>
              <Input id="aviso-date" name="affected_date" type="date" value={form.affected_date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aviso-type">Tipo</Label>
              <select
                id="aviso-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="aviso">Aviso</option>
                <option value="alteracao">Alteração</option>
                <option value="cancelamento">Cancelamento</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aviso-meal">Ref. afetada</Label>
              <select
                id="aviso-meal"
                name="meal_type"
                value={form.meal_type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="geral">Geral</option>
                <option value="cafe_da_manha">Café da manhã</option>
                <option value="almoco">Almoço</option>
                <option value="lanche_da_tarde">Lanche da tarde</option>
              </select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 sm:col-span-2">
              <div>
                <p className="text-sm font-medium text-stone-700">Aviso ativo</p>
                <p className="text-xs text-stone-400">Mostrar para os usuários</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={(checked) => setForm((current) => ({ ...current, is_active: checked }))} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {editing && (
              <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(defaultForm); }}>
                Cancelar
              </Button>
            )}
            <Button type="submit" className="gap-2">
              {editing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editing ? 'Salvar aviso' : 'Adicionar aviso'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-stone-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Carregando avisos...
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="text-center py-10 text-stone-400">Nenhum aviso cadastrado.</div>
        ) : (
          <div className="space-y-3">
            {visibleItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-800">{item.title}</p>
                      {item.is_active === false ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{item.message}</p>
                    <p className="text-xs text-stone-400 mt-2">{item.affected_date} · {item.type} · {item.meal_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500" aria-label="Editar aviso">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-2 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600" aria-label="Remover aviso">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
