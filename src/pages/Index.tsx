
import Deals from "@/components/Deals";
import ShoppingList from "@/components/ShoppingList";
import StoreMap from "@/components/StoreMap";
import { Store } from "lucide-react";

const Index = () => {
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
            <ShoppingList />
          </div>
          <div className="lg:col-span-3">
            <StoreMap />
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
