
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { ShoppingItem } from "@/pages/Index";
import { allDeals } from "@/data/deals";
import { useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlternativesProps {
  items: ShoppingItem[];
}

const Alternatives = ({ items }: AlternativesProps) => {
  const relevantAlternatives = useMemo(() => {
    if (items.length === 0) {
      return [];
    }
    
    const alternatives = allDeals.filter(deal => deal.type === 'alternative');

    const itemKeywords = items
      .flatMap(item => item.name.toLowerCase().split(' '))
      .concat(items.map(item => item.department.toLowerCase()));
    const uniqueKeywords = [...new Set(itemKeywords)];

    return alternatives.filter(alt => 
      alt.relatedKeywords.some(keyword => 
        uniqueKeywords.some(itemKeyword => itemKeyword.includes(keyword.toLowerCase()))
      )
    );
  }, [items]);

  if (relevantAlternatives.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <CardTitle>Alternatives</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] w-full">
            <ul className="space-y-2 pr-4">
              {relevantAlternatives.map((alt) => (
                <li key={alt.id} className="rounded-lg border bg-amber-100/50 dark:bg-amber-900/20 p-3 animate-fade-in">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">{alt.title}</p>
                  <p className="text-sm text-muted-foreground">{alt.description}</p>
                </li>
              ))}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Alternatives;
