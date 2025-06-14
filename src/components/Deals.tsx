
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { ShoppingItem } from "@/pages/Index";
import { allDeals } from "@/data/deals";
import { useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DealsProps {
  items: ShoppingItem[];
}

const Deals = ({ items }: DealsProps) => {
  const relevantDeals = useMemo(() => {
    const deals = allDeals.filter(deal => deal.type === 'deal');

    if (items.length === 0) {
      return deals.filter(d => [1, 3, 8].includes(d.id));
    }

    const itemKeywords = items
      .flatMap(item => item.name.toLowerCase().split(' '))
      .concat(items.map(item => item.department.toLowerCase()));
    
    const uniqueKeywords = [...new Set(itemKeywords)];

    const itemSpecificDeals = deals.filter(deal => 
      deal.relatedKeywords.length > 0 &&
      deal.relatedKeywords.some(keyword => 
        uniqueKeywords.some(itemKeyword => itemKeyword.includes(keyword.toLowerCase()))
      )
    );

    const generalDeals = deals.filter(deal => deal.relatedKeywords.length === 0);

    return [...new Set([...itemSpecificDeals, ...generalDeals])];
  }, [items]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle>Deals</CardTitle>
      </CardHeader>
      <CardContent>
        {relevantDeals.length > 0 ? (
          <ScrollArea className="h-[200px] w-full">
            <ul className="space-y-2 pr-4">
              {relevantDeals.map((deal) => (
                <li key={deal.id} className="rounded-lg border bg-accent/50 p-3 animate-fade-in">
                  <p className="font-semibold text-accent-foreground">{deal.title}</p>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">No specific deals for your current list. Check out our general offers!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Deals;
