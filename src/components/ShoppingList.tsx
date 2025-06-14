import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, Plus, X } from "lucide-react";
import { useState, useMemo } from "react";
import type { ShoppingItem } from "@/pages/Index";
import { productSuggestions } from "@/data/products";
import type { ProductSuggestion } from "@/data/products";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type NewItem = string | ProductSuggestion;

interface ShoppingListProps {
  items: ShoppingItem[];
  onCheckedChange: (id: number) => void;
  onAddItem: (item: NewItem) => void;
  onDeleteItem: (id: number) => void;
}

const ShoppingList = ({ items, onCheckedChange, onAddItem, onDeleteItem }: ShoppingListProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddItemForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem(inputValue.trim());
      setInputValue("");
      setOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: ProductSuggestion) => {
    onAddItem(suggestion);
    setInputValue("");
    setOpen(false);
  }

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) {
      return productSuggestions.slice(0, 5);
    }
    const search = inputValue.toLowerCase();
    return productSuggestions.filter(p => p.name.toLowerCase().includes(search)).slice(0, 10);
  }, [inputValue]);

  return (
    <Card className="h-full transition-transform duration-200 hover:scale-105">
      <CardHeader className="flex flex-row items-center gap-2">
        <List className="h-5 w-5 text-primary" />
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <form onSubmit={handleAddItemForm} className="mb-4 flex items-center gap-2">
              <Input
                placeholder="Add or search items..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (!open && e.target.value) setOpen(true);
                }}
                onClick={() => setOpen(true)}
                aria-label="New shopping item"
              />
              <Button type="submit" size="icon" aria-label="Add item">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </PopoverTrigger>
          <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search products..."
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {filteredSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.name}
                      onSelect={() => handleSelectSuggestion(suggestion)}
                      value={suggestion.name}
                    >
                      {suggestion.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <ul className="h-full max-h-[450px] space-y-4 overflow-y-auto pr-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 animate-fade-in group">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => onCheckedChange(item.id)}
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-1 cursor-pointer text-sm font-medium transition-colors ${
                  item.checked
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onDeleteItem(item.id)}
                aria-label={`Delete ${item.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ShoppingList;
