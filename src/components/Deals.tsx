
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const deals = [
  { id: 1, title: "20% off all cereals", description: "This week only! Consider Cheerios." },
  { id: 2, title: "BOGO on family-size chips", description: "Great for parties. Lays & Doritos." },
  { id: 3, title: "Save $5 on fresh produce", description: "When you spend $25 or more." },
  { id: 4, title: "Alternative: Organic milk", description: "Healthier choice, only $1 more." }
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
