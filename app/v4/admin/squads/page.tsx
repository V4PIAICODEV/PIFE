"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Squad {
  id: string;
  name: string;
  _count?: {
    users: number;
  };
}

export default function AdminSquadsPage() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // Carregar lista
  const fetchSquads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v4/admin/squads");
      const data = await res.json();
      setSquads(data);
    } catch (error) {
      toast.error("Erro ao carregar lista");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  // Salvar (Novo ou Edição)
  const handleSave = async () => {
    if (!formData.name) return toast.warning("O nome é obrigatório!");

    try {
      const method = editingSquad ? "PUT" : "POST";
      const body = editingSquad 
        ? { id: editingSquad.id, name: formData.name }
        : { name: formData.name };

      const res = await fetch("/api/v4/admin/squads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingSquad ? "Squad atualizado!" : "Squad criado!"); // MASCULINO
        setIsDialogOpen(false);
        fetchSquads();
      } else {
        toast.error("Erro ao salvar.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Deletar
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza? Os usuários deste squad ficarão sem time.")) return; // MASCULINO

    try {
      const res = await fetch(`/api/v4/admin/squads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Squad excluído."); // MASCULINO
        fetchSquads();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openNew = () => {
    setEditingSquad(null);
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (squad: Squad) => {
    setEditingSquad(squad);
    setFormData({ name: squad.name });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Squads</h1>
          <p className="text-muted-foreground">Cadastre e organize os times.</p>
        </div>
        <Button onClick={openNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Squad
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Squads Cadastrados</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
          ) : squads.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Nenhum squad encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {squads.map((squad) => (
                  <TableRow key={squad.id}>
                    <TableCell className="font-medium">{squad.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{squad._count?.users || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(squad)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(squad.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSquad ? "Editar Squad" : "Novo Squad"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Nome do Squad</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Ex: Comercial, Tech..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}