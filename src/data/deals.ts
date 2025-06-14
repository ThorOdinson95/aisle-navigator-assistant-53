
export type Deal = {
  id: number;
  title: string;
  description: string;
  relatedKeywords: string[];
  type: 'deal' | 'alternative';
};

export const allDeals: Deal[] = [
  { id: 1, title: "Rollback on Great Value items", description: "This week only! Stock up on family favorites.", relatedKeywords: ['great value', 'grocery'], type: 'deal' },
  { id: 2, title: "BOGO on Marketside Pizzas", description: "Buy one get one free. Perfect for a quick dinner.", relatedKeywords: ['pizza', 'deli', 'frozen', 'marketside'], type: 'deal' },
  { id: 3, title: "Save $10 on your next $50 purchase", description: "With a Walmart+ subscription.", relatedKeywords: [], type: 'deal' },
  { id: 4, title: "Alternative: Organic produce", description: "Healthier choice, check for availability.", relatedKeywords: ['produce', 'organic', 'salad', 'banana', 'avocado'], type: 'alternative' },
  { id: 5, title: "Alternative: Cage-Free Eggs", description: "Ethical choice for a similar price.", relatedKeywords: ['eggs', 'dairy'], type: 'alternative' },
  { id: 6, title: "Deal: Bulk Paper Towels", description: "Save 15% when buying Member's Mark brand.", relatedKeywords: ['paper towels', 'paper', "member's mark"], type: 'deal' },
  { id: 7, title: "Alternative: Store Brand Soda", description: "Save up to 40% vs Coca-Cola.", relatedKeywords: ['coke', 'coca-cola', 'soda'], type: 'alternative' },
  { id: 8, title: "Deal on Rotisserie Chicken", description: "Only $4.98 every day!", relatedKeywords: ['chicken', 'rotisserie', 'deli'], type: 'deal' }
];

