
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Lightbulb } from "lucide-react";
import type { ShoppingItem } from "@/pages/Index";
import { useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchDeals } from "@/lib/queries";
import type { Deal } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface PersonalizedSuggestionsProps {
  items: ShoppingItem[];
}

const PersonalizedSuggestions = ({ items }: PersonalizedSuggestionsProps) => {
  const { data: allDeals, isLoading, isError } = useQuery<Deal[]>({
    queryKey: ['deals'],
    queryFn: fetchDeals
  });

  const { relevantDeals, relevantAlternatives } = useMemo(() => {
    if (!allDeals || items.length === 0) {
      return { relevantDeals: [], relevantAlternatives: [] };
    }

    const deals = allDeals.filter(deal => deal.type === 'deal' && !deal.is_store_wide);
    const relevantDeals = deals.filter(deal => 
      deal.related_keywords.some(keyword =>
        items.some(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    );

    const alternatives = allDeals.filter(deal => deal.type === 'alternative');
    const relevantAlternatives = alternatives.filter(alt => 
      alt.related_keywords.some(keyword => 
        items.some(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    );

    return { relevantDeals, relevantAlternatives };
  }, [items, allDeals]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>For You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasPersonalizedContent = relevantDeals.length > 0 || relevantAlternatives.length > 0;

  if (isError || !hasPersonalizedContent) {
    return null;
  }

  return (
    <Card className="transition-transform duration-200 hover:scale-105">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle>For You</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] w-full">
            {relevantDeals.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/>Deals For You</h4>
                <ul className="space-y-2 pr-4">
                  {relevantDeals.map((deal) => (
                    <li key={deal.id} className="rounded-lg border bg-accent/50 p-3 animate-fade-in">
                      <p className="font-semibold text-accent-foreground">{deal.title}</p>
                      <p className="text-sm text-muted-foreground">{deal.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relevantAlternatives.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500"/>Alternatives For You</h4>
                <ul className="space-y-2 pr-4">
                  {relevantAlternatives.map((alt) => (
                    <li key={alt.id} className="rounded-lg border bg-amber-100/50 dark:bg-amber-900/20 p-3 animate-fade-in">
                      <p className="font-semibold text-amber-800 dark:text-amber-200">{alt.title}</p>
                      <p className="text-sm text-muted-foreground">{alt.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PersonalizedSuggestions;
