
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import type { ShoppingItem } from "@/pages/Index";

interface ShoppingListProps {
  items: ShoppingItem[];
  onCheckedChange: (id: number) => void;
  onAddItem: (name: string) => void;
}

const ShoppingList = ({ items, onCheckedChange, onAddItem }: ShoppingListProps) => {
  const [newItemName, setNewItemName] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName("");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <List className="h-5 w-5 text-primary" />
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddItem} className="mb-4 flex items-center gap-2">
          <Input 
            placeholder="Add new item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            aria-label="New shopping item"
          />
          <Button type="submit" size="icon" aria-label="Add item">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ul className="h-full max-h-[450px] space-y-4 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => onCheckedChange(item.id)}
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`text-sm font-medium transition-colors ${
                  item.checked
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ShoppingList;
