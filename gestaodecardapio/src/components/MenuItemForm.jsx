import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const defaultForm = {
  name: '',
  description: '',
  ingredients: '',
  calories: '',
  menu_date: new Date().toISOString().split('T')[0],
  meal_type: 'almoco',
  is_vegetarian: false,
};

export default function MenuItemForm({ isOpen, onClose, onSubmit, initialItem, saving }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;

    if (initialItem) {
      setForm({
        name: initialItem.name ?? '',
        description: initialItem.description ?? '',
        ingredients: initialItem.ingredients ?? '',
        calories: initialItem.calories ?? '',
        menu_date: initialItem.menu_date ?? new Date().toISOString().split('T')[0],
        meal_type: initialItem.meal_type ?? 'almoco',
        is_vegetarian: Boolean(initialItem.is_vegetarian),
      });
      return;
    }

    setForm(defaultForm);
  }, [initialItem, isOpen]);

  const title = useMemo(() => (initialItem ? 'Editar item' : 'Novo item'), [initialItem]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSwitch = (checked) => {
    setForm((current) => ({ ...current, is_vegetarian: checked }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      calories: form.calories === '' ? undefined : Number(form.calories),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Preencha os dados da refeição.</DialogDescription>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-stone-100 text-stone-500" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="menu_date">Data</Label>
              <Input id="menu_date" name="menu_date" type="date" value={form.menu_date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal_type">Refeição</Label>
              <select
                id="meal_type"
                name="meal_type"
                value={form.meal_type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="cafe_da_manha">Café da Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="lanche_da_tarde">Lanche da Tarde</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredientes</Label>
            <Textarea id="ingredients" name="ingredients" value={form.ingredients} onChange={handleChange} rows={2} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias</Label>
              <Input id="calories" name="calories" type="number" min="0" value={form.calories} onChange={handleChange} placeholder="320" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 mt-8">
              <div>
                <p className="text-sm font-medium text-stone-700">Vegetariano</p>
              </div>
              <Switch checked={form.is_vegetarian} onCheckedChange={handleSwitch} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : initialItem ? 'Salvar alterações' : 'Adicionar item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
