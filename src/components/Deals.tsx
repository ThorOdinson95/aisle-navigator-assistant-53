
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const deals = [
  { id: 1, title: "Rollback on Great Value cereals", description: "This week only! Stock up on family favorites." },
  { id: 2, title: "BOGO on Marketside Pizzas", description: "Buy one get one free. Perfect for a quick dinner." },
  { id: 3, title: "Save $10 on your next $50 purchase", description: "With a Walmart+ subscription." },
  { id: 4, title: "Alternative: Organic spinach", description: "Healthier choice, only $0.50 more than regular." }
];

const Deals = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle>Deals & Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {deals.map((deal) => (
            <li key={deal.id} className="rounded-lg border bg-accent/50 p-4">
              <p className="font-semibold text-accent-foreground">{deal.title}</p>
              <p className="text-sm text-muted-foreground">{deal.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Deals;
