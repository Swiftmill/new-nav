import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore, type SpeedDialItem } from "@/store/settings";

interface SortableTileProps {
  item: SpeedDialItem;
  onRemove: (id: string) => void;
  onOpen: (url: string) => void;
}

function SortableTile({ item, onRemove, onOpen }: SortableTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <motion.div layout ref={setNodeRef} style={style} className="relative">
      <button
        {...attributes}
        {...listeners}
        className="group flex h-36 w-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-stars bg-[length:200%_200%] bg-slate-900/50 p-4 text-sm text-slate-200 shadow-lg shadow-purple-900/20 transition-all hover:border-[var(--accent-color)] hover:shadow-glow"
        style={{ backgroundPosition: "center" }}
        onClick={() => !isDragging && onOpen(item.url)}
        onDoubleClick={() => window.electron?.openExternal?.(item.url)}
      >
        <img src={item.icon} alt={item.title} className="mb-3 h-12 w-12" />
        <span className="font-medium">{item.title}</span>
        <span className="text-xs text-slate-400">{item.url.replace(/^https?:\/\//, "")}</span>
      </button>
      <button
        onClick={() => onRemove(item.id)}
        className="absolute -right-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 shadow-lg transition hover:text-red-400 group-hover:flex"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function SpeedDial({ onOpen }: { onOpen: (url: string) => void }) {
  const speedDial = useSettingsStore((state) => state.speedDial);
  const reorder = useSettingsStore((state) => state.reorderSpeedDial);
  const remove = useSettingsStore((state) => state.removeSpeedDial);
  const addTile = useSettingsStore((state) => state.addSpeedDial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", icon: "" });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = speedDial.findIndex((item) => item.id === active.id);
      const newIndex = speedDial.findIndex((item) => item.id === over.id);
      reorder(arrayMove(speedDial, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.url) return;
    const id = form.title.toLowerCase().replace(/\s+/g, "-");
    addTile({
      id,
      title: form.title,
      url: form.url.startsWith("http") ? form.url : `https://${form.url}`,
      icon: form.icon || "/assets/icons/chatgpt.svg"
    });
    setForm({ title: "", url: "", icon: "" });
    setOpen(false);
  };

  return (
    <Card className="col-span-7 min-h-[26rem] bg-slate-900/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Speed Dial</CardTitle>
          <p className="text-sm text-slate-400">Vos favoris à portée de main. Glissez-déposez pour réorganiser.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" className="rounded-2xl">
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un site</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icône (URL ou chemin local)</Label>
                <Input
                  id="icon"
                  placeholder="/assets/icons/custom.svg"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                />
              </div>
              <Button variant="accent" onClick={handleSubmit} className="rounded-2xl">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={speedDial.map((item) => item.id)}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {speedDial.map((item) => (
                  <SortableTile key={item.id} item={item} onRemove={remove} onOpen={onOpen} />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
