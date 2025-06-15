import PersonalizedSuggestions from "@/components/PersonalizedSuggestions";
import ShoppingList from "@/components/ShoppingList";
import StoreMap from "@/components/StoreMap";
import { Store } from "lucide-react";
import { useState } from "react";
import type { ProductSuggestion } from "@/data/products";

// Added department to each item for mapping
const initialShoppingItems = [
  { id: 1, name: "Great Value Milk, 1 Gallon", checked: true, department: "Dairy" },
  { id: 2, name: "Marketside Rotisserie Chicken", checked: false, department: "Deli" },
  { id: 3, name: "Freshness Guaranteed Bananas, 2 lbs", checked: false, department: "Fresh Produce" },
  { id: 4, name: "Large Cage-Free Eggs, 12 ct", checked: false, department: "Dairy" },
  { id: 5, name: "Avocados, Bag of 4", checked: true, department: "Fresh Produce" },
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

type NewItem = string | ProductSuggestion;

const Index = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(initialShoppingItems);

  const handleCheckedChange = (id: number) => {
    setShoppingItems(
      shoppingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (item: NewItem) => {
    const getDepartment = (name: string): string => {
      const lowerCaseName = name.toLowerCase();
      // From most specific to least specific

      // Groceries
      if (lowerCaseName.includes('rotisserie chicken')) return 'Deli';
      if (lowerCaseName.includes('chicken') || lowerCaseName.includes('beef') || lowerCaseName.includes('pork') || lowerCaseName.includes('steak')) return 'Meat';
      if (lowerCaseName.includes('ham') || lowerCaseName.includes('salami') || lowerCaseName.includes('deli')) return 'Deli';
      if (lowerCaseName.includes('milk') || lowerCaseName.includes('cheese') || lowerCaseName.includes('eggs') || lowerCaseName.includes('yogurt')) return 'Dairy';
      if (lowerCaseName.includes('banana') || lowerCaseName.includes('avocado') || lowerCaseName.includes('produce') || lowerCaseName.includes('fresh') || lowerCaseName.includes('apple') || lowerCaseName.includes('vegetable')) return 'Fresh Produce';
      if (lowerCaseName.includes('bakery') || lowerCaseName.includes('bread') || lowerCaseName.includes('cake')) return 'Bakery';
      if (lowerCaseName.includes('frozen')) return 'Frozen';
      if (lowerCaseName.includes('snack') || lowerCaseName.includes('chips') || lowerCaseName.includes('pretzel')) return 'Snacks';
      if (lowerCaseName.includes('candy') || lowerCaseName.includes('chocolate')) return 'Candy';
      if (lowerCaseName.includes('beverage') || lowerCaseName.includes('soda') || lowerCaseName.includes('wine')) return 'Adult Beverages';

      // General Merchandise
      if (lowerCaseName.includes('auto') && !lowerCaseName.includes('accessories')) return 'Auto Care Center';
      if (lowerCaseName.includes('auto accessories')) return 'Auto Accessories';
      if (lowerCaseName.includes('wrench') || lowerCaseName.includes('tool') || lowerCaseName.includes('hardware')) return 'Tools & Hardware';
      if (lowerCaseName.includes('tent') || lowerCaseName.includes('camping')) return 'Outdoor';
      if (lowerCaseName.includes('sport')) return 'Sports & Outdoors';
      if (lowerCaseName.includes('lego') || lowerCaseName.includes('game') || lowerCaseName.includes('toy')) return 'Toys & Games';
      if (lowerCaseName.includes('book')) return 'Books';
      if (lowerCaseName.includes('craft') || lowerCaseName.includes('yarn')) return 'Arts & Crafts';
      if (lowerCaseName.includes('seasonal') || lowerCaseName.includes('celebrate') || lowerCaseName.includes('christmas')) return 'Seasonal';
      if (lowerCaseName.includes('tv') || lowerCaseName.includes('electronic') || lowerCaseName.includes('headphone')) return 'Electronics';
      if (lowerCaseName.includes('desk') || lowerCaseName.includes('office chair')) return 'Home Office';
      if (lowerCaseName.includes('furniture') || lowerCaseName.includes('bedding') || lowerCaseName.includes('bath') || lowerCaseName.includes('home decor')) return 'Home';
      if (lowerCaseName.includes('cookware') || lowerCaseName.includes('kitchen') || lowerCaseName.includes('dining')) return 'Kitchen & Dining';

      // Consumables & Health
      if (lowerCaseName.includes('paper') || lowerCaseName.includes('laundry') || lowerCaseName.includes('cleaning')) return 'Paper & Cleaning';
      if (lowerCaseName.includes('dog') || lowerCaseName.includes('cat') || lowerCaseName.includes('pet')) return 'Pet Care';
      if (lowerCaseName.includes('shampoo') || lowerCaseName.includes('beauty') || lowerCaseName.includes('toothpaste') || lowerCaseName.includes('soap') || lowerCaseName.includes('personal care')) return 'Personal Care & Beauty';
      if (lowerCaseName.includes('pharmacy') || lowerCaseName.includes('medicine')) return 'Pharmacy';

      // Apparel
      if (lowerCaseName.includes('shoe') || lowerCaseName.includes('boot')) return 'Shoes';
      if (lowerCaseName.includes('men')) return 'Mens';
      if (lowerCaseName.includes('ladies') || lowerCaseName.includes('women')) return 'Ladies';
      if (lowerCaseName.includes('boy')) return 'Boys';
      if (lowerCaseName.includes('girl')) return 'Girls';
      if (lowerCaseName.includes('baby') || lowerCaseName.includes('infant')) return 'Baby';
      
      return 'Grocery'; // Default department
    };

    const newItem: ShoppingItem = {
      id: Date.now(),
      name: typeof item === 'string' ? item : item.name,
      checked: false,
      department: typeof item === 'string' ? getDepartment(item) : item.department,
    };
    setShoppingItems((prevItems) => [newItem, ...prevItems]);
  };

  const handleDeleteItem = (id: number) => {
    setShoppingItems((prevItems) => prevItems.filter((item) => item.id !== id));
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
              onDeleteItem={handleDeleteItem}
            />
          </div>
          <div className="lg:col-span-3">
            <StoreMap items={shoppingItems} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <PersonalizedSuggestions items={shoppingItems} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
