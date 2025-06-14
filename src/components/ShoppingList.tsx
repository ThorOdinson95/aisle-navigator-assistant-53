
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { List } from "lucide-react";
import { useState } from "react";

const initialShoppingItems = [
  { id: 1, name: "Great Value Milk, 1 Gallon", checked: true },
  { id: 2, name: "Marketside Rotisserie Chicken", checked: false },
  { id: 3, name: "Freshness Guaranteed Bananas, 2 lbs", checked: false },
  { id: 4, name: "Large Cage-Free Eggs, 12 ct", checked: false },
  { id: 5, name: "Avocados, Bag of 4", checked: true },
  { id: 6, name: "Great Value Creamy Peanut Butter", checked: false },
  { id: 7, name: "Member's Mark Paper Towels, 12 rolls", checked: false },
];

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState(initialShoppingItems);

  const handleCheckedChange = (id: number) => {
    setShoppingItems(
      shoppingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <List className="h-5 w-5 text-primary" />
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {shoppingItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => handleCheckedChange(item.id)}
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
