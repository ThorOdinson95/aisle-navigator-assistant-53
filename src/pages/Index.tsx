
import Deals from "@/components/Deals";
import ShoppingList from "@/components/ShoppingList";
import StoreMap from "@/components/StoreMap";
import { Store } from "lucide-react";
import { useState } from "react";

// Added department to each item for mapping
const initialShoppingItems = [
  { id: 1, name: "Great Value Milk, 1 Gallon", checked: true, department: "Dairy" },
  { id: 2, name: "Marketside Rotisserie Chicken", checked: false, department: "Deli" },
  { id: 3, name: "Freshness Guaranteed Bananas, 2 lbs", checked: false, department: "Produce" },
  { id: 4, name: "Large Cage-Free Eggs, 12 ct", checked: false, department: "Dairy" },
  { id: 5, name: "Avocados, Bag of 4", checked: true, department: "Produce" },
  { id: 6, name: "Great Value Creamy Peanut Butter", checked: false, department: "Grocery" },
  { id: 7, name: "Member's Mark Paper Towels, 12 rolls", checked: false, department: "Paper & Cleaning" },
];

// Type definition for a shopping item
export type ShoppingItem = {
  id: number;
  name: string;
  checked: boolean;
  department: string;
};

const Index = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(initialShoppingItems);

  const handleCheckedChange = (id: number) => {
    setShoppingItems(
      shoppingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (itemName: string) => {
    // A simple way to guess the department from the name for the demo
    const getDepartment = (name: string): string => {
      const lowerCaseName = name.toLowerCase();
      if (lowerCaseName.includes('milk') || lowerCaseName.includes('cheese') || lowerCaseName.includes('eggs')) return 'Dairy';
      if (lowerCaseName.includes('chicken') || lowerCaseName.includes('deli')) return 'Deli';
      if (lowerCaseName.includes('banana') || lowerCaseName.includes('avocado') || lowerCaseName.includes('produce') || lowerCaseName.includes('fresh')) return 'Produce';
      if (lowerCaseName.includes('bread') || lowerCaseName.includes('bakery')) return 'Bakery';
      if (lowerCaseName.includes('cereal') || lowerCaseName.includes('snacks') || lowerCaseName.includes('candy') || lowerCaseName.includes('grocery') || lowerCaseName.includes('butter')) return 'Grocery';
      if (lowerCaseName.includes('tv') || lowerCaseName.includes('electronics')) return 'Electronics';
      if (lowerCaseName.includes('game') || lowerCaseName.includes('toy')) return 'Toys & Games';
      if (lowerCaseName.includes('towel') || lowerCaseName.includes('paper')) return 'Paper & Cleaning';
      if (lowerCaseName.includes('shampoo') || lowerCaseName.includes('beauty')) return 'Personal Care & Beauty';
      return 'Grocery'; // Default department
    };

    const newItem: ShoppingItem = {
      id: Date.now(),
      name: itemName,
      checked: false,
      department: getDepartment(itemName),
    };
    setShoppingItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div className="min-h-screen w-full bg-muted/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Walmart Aisle Navigator
            </h1>
            <p className="text-muted-foreground">
              Your smart shopping companion
            </p>
          </div>
        </header>
        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <ShoppingList 
              items={shoppingItems} 
              onCheckedChange={handleCheckedChange}
              onAddItem={handleAddItem}
            />
          </div>
          <div className="lg:col-span-3">
            <StoreMap items={shoppingItems} />
          </div>
          <div className="lg:col-span-1">
            <Deals />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
