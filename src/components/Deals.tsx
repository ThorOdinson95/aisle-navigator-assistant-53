
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { ShoppingItem } from "@/pages/Index";
import { allDeals } from "@/data/deals";
import { useMemo } from 'react';

interface DealsProps {
  items: ShoppingItem[];
}

const Deals = ({ items }: DealsProps) => {
  const relevantDeals = useMemo(() => {
    const itemKeywords = items
      .flatMap(item => item.name.toLowerCase().split(' '))
      .concat(items.map(item => item.department.toLowerCase()));
    
    const uniqueKeywords = [...new Set(itemKeywords)];

    const generalDeals = allDeals.filter(deal => deal.relatedKeywords.length === 0);

    if (items.length === 0) {
      return allDeals.filter(d => d.id === 1 || d.id === 2 || d.id === 3);
    }

    const itemSpecificDeals = allDeals.filter(deal => 
      deal.relatedKeywords.length > 0 &&
      deal.relatedKeywords.some(keyword => 
        uniqueKeywords.some(itemKeyword => itemKeyword.includes(keyword.toLowerCase()))
      )
    );

    return [...new Set([...itemSpecificDeals, ...generalDeals])];
  }, [items]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle>Deals & Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {relevantDeals.length > 0 ? (
          <ul className="space-y-4">
            {relevantDeals.map((deal) => (
              <li key={deal.id} className="rounded-lg border bg-accent/50 p-4 animate-fade-in">
                <p className="font-semibold text-accent-foreground">{deal.title}</p>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No specific deals for your current list. Check out our general offers!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Deals;

