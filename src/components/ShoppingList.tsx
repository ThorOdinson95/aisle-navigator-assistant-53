
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { List } from "lucide-react";

const shoppingItems = [
  { id: 1, name: "Organic Bananas", checked: true },
  { id: 2, name: "Whole Milk, 1 Gallon", checked: false },
  { id: 3, name: "Cage-Free Large Eggs", checked: false },
  { id: 4, name: "Artisan Sourdough Bread", checked: false },
  { id: 5, name: "Avocados, Bag of 4", checked: true },
  { id: 6, name: "Natural Creamy Peanut Butter", checked: false },
  { id: 7, name: "Rotisserie Chicken", checked: false },
];

const ShoppingList = () => {
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
              <Checkbox id={`item-${item.id}`} checked={item.checked} />
              <label
                htmlFor={`item-${item.id}`}
                className={`text-sm font-medium transition-colors ${
                  item.checked ? "line-through text-muted-foreground" : "text-foreground"
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
