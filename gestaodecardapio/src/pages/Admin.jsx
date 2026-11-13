import React, { useState, useEffect } from "react";
import { client } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Link, Navigate } from "react-router-dom";
import {
  LogOut,
  UtensilsCrossed,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Coffee,
  Sun,
  Cookie,
  Leaf,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import MenuItemForm from "@/components/MenuItemForm";
import AvisosManager from "@/components/AvisosManager";

const MEAL_CONFIG = {
  cafe_da_manha: { label: "Café da Manhã", icon: Coffee, badge: "bg-amber-100 text-amber-700" },
  almoco: { label: "Almoço", icon: Sun, badge: "bg-orange-100 text-orange-700" },
  lanche_da_tarde: { label: "Lanche da Tarde", icon: Cookie, badge: "bg-rose-100 text-rose-700" },
};

MEAL_CONFIG.cafe_da_manha.badge = "bg-amber-200 text-amber-900";
MEAL_CONFIG.almoco.badge = "bg-orange-200 text-orange-900";
MEAL_CONFIG.lanche_da_tarde.badge = "bg-rose-200 text-rose-900";

function AdminItem({ item, onEdit, onDelete }) {
  const config = MEAL_CONFIG[item.meal_type] || {};

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-100 p-3 hover:shadow-sm transition-shadow">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.badge} shadow-md ring-2 ring-white/80`}
      >
        {config.icon && <config.icon className="w-9 h-9" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-stone-800 text-sm truncate">{item.name}</h3>
          {item.is_vegetarian && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400">
          {config.label} · {item.calories ? `${item.calories} kcal` : "Sem calorias"} ·{" "}
          {new Date(item.menu_date + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-stone-100 text-stone-500 hover:text-orange-700 transition-colors"
          title="Editar"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-red-50 text-stone-500 hover:text-red-700 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterMeal, setFilterMeal] = useState("");
  const [tab, setTab] = useState("itens");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const query = {};
      if (filterDate) query.menu_date = filterDate;
      if (filterMeal) query.meal_type = filterMeal;
      const data = await client.entities.MenuItem.filter(query, "-menu_date,-created_date", 200);
      setItems(data);
    } catch (e) {
      toast({ title: "Erro ao carregar itens", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterDate, filterMeal]);

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Deseja realmente excluir "${item.name}"?`)) return;

    try {
      await client.entities.MenuItem.delete(item.id);
      toast({ title: "Item excluído", description: item.name });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await client.entities.MenuItem.update(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
        toast({ title: "Item atualizado com sucesso!" });
      } else {
        const created = await client.entities.MenuItem.create(payload);
        setItems((prev) => [created, ...prev]);
        toast({ title: "Item adicionado ao cardápio!" });
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch (e) {
      toast({ title: "Erro ao salvar item", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md ring-2 ring-orange-100">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-stone-800 leading-tight">Gestão do Cardápio</h1>
              <p className="text-[11px] text-stone-400 leading-tight">Nutricionista / Administrador</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-orange-600 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Cardápio</span>
            </Link>
            <button
              onClick={() => logout("/login")}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors shadow-sm"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-6 bg-white rounded-xl border border-stone-100 p-1.5 shadow-sm w-fit">
          <button
            onClick={() => setTab("itens")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "itens" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" /> Itens do cardápio
          </button>
          <button
            onClick={() => setTab("avisos")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "avisos" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <AlertTriangle className="w-5 h-5" /> Avisos
          </button>
        </div>

        {tab === "avisos" ? (
          <AvisosManager />
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-stone-800">Itens do cardápio</h2>
                <p className="text-sm text-stone-400">Gerencie as refeições da escola</p>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium text-sm hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" /> Novo item
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg border border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-white"
              />
              <select
                value={filterMeal}
                onChange={(e) => setFilterMeal(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg border border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm bg-white"
              >
                <option value="">Todas as refeições</option>
                <option value="cafe_da_manha">Café da Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="lanche_da_tarde">Lanche da Tarde</option>
              </select>

              {(filterDate || filterMeal) && (
                <button
                  onClick={() => {
                    setFilterDate("");
                    setFilterMeal("");
                  }}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 px-3 py-2.5 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-7 h-7 text-orange-400 animate-spin mb-3" />
                <p className="text-sm text-stone-400">Carregando...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-28 h-28 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <UtensilsCrossed className="w-12 h-12 text-stone-300" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-stone-600 mb-1">
                  Nenhum item encontrado
                </h3>
                <p className="text-sm text-stone-400 mb-4">
                  {filterDate || filterMeal
                    ? "Tente ajustar os filtros."
                    : "Adicione o primeiro item ao cardápio."}
                </p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  <Plus className="w-6 h-6" /> Novo item
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => (
                  <AdminItem key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <MenuItemForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialItem={editingItem}
        saving={saving}
      />
    </div>
  );
}
