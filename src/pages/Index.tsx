
import Deals from "@/components/Deals";
import ShoppingList from "@/components/ShoppingList";
import StoreMap from "@/components/StoreMap";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-muted/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Aisle Navigator Assistant
          </h1>
          <p className="text-muted-foreground">
            Your smart shopping companion for Walmart
          </p>
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
