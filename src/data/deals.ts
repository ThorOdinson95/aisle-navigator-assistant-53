
export type Deal = {
  id: number;
  title: string;
  description: string;
  relatedKeywords: string[];
  type: 'deal' | 'alternative';
  isStoreWide?: boolean;
};

export const allDeals: Deal[] = [
  { id: 1, title: "Rollback on Great Value items", description: "This week only! Stock up on family favorites.", relatedKeywords: ['great value', 'grocery'], type: 'deal' },
  { id: 2, title: "BOGO on Marketside Pizzas", description: "Buy one get one free. Perfect for a quick dinner.", relatedKeywords: ['pizza', 'deli', 'frozen', 'marketside'], type: 'deal', isStoreWide: true },
  { id: 3, title: "Save $10 on your next $50 purchase", description: "With a Walmart+ subscription.", relatedKeywords: [], type: 'deal', isStoreWide: true },
  { id: 4, title: "Alternative: Organic produce", description: "Healthier choice, check for availability.", relatedKeywords: ['produce', 'organic', 'salad', 'avocado'], type: 'alternative' },
  { id: 5, title: "Alternative: Cage-Free Eggs", description: "Ethical choice for a similar price.", relatedKeywords: ['eggs', 'dairy'], type: 'alternative' },
  { id: 6, title: "Deal: Bulk Paper Towels", description: "Save 15% when buying Member's Mark brand.", relatedKeywords: ['paper towels', 'paper', "member's mark"], type: 'deal' },
  { id: 7, title: "Alternative: Store Brand Soda", description: "Save up to 40% vs Coca-Cola.", relatedKeywords: ['coke', 'coca-cola', 'soda'], type: 'alternative' },
  { id: 8, title: "Deal on Rotisserie Chicken", description: "Only $4.98 every day!", relatedKeywords: ['chicken', 'rotisserie', 'deli'], type: 'deal', isStoreWide: true },
  { id: 9, title: "Alternative: Organic Bananas", description: "A healthier choice, often for a similar price.", relatedKeywords: ['banana', 'bananas'], type: 'alternative' },
  { id: 10, title: "Deal: 20% off Angus Beef", description: "Premium quality steaks on sale.", relatedKeywords: ['steak', 'beef', 'angus'], type: 'deal' },
  { id: 11, title: "Alternative: Great Value Cereal", description: "Same great taste as name brands, for less.", relatedKeywords: ['cereal', 'cheerios', 'flakes'], type: 'alternative' },
  { id: 12, title: "Deal: Save $5 on Tide", description: "When you buy two large containers.", relatedKeywords: ['tide', 'laundry'], type: 'deal' },
  { id: 13, title: "Alternative: Store Brand Yogurt", description: "Creamy and delicious, lower price.", relatedKeywords: ['yogurt', 'chobani', 'yoplait'], type: 'alternative' },
  { id: 14, title: "Deal on Starbucks Coffee", description: "Get a free mug with any 2 bags of beans.", relatedKeywords: ['starbucks', 'coffee'], type: 'deal' },
  { id: 15, title: "Alternative: Store Brand Pasta Sauce", description: "Rich flavor, perfect for any pasta night.", relatedKeywords: ['prego', 'pasta sauce', 'ragu'], type: 'alternative' },
  { id: 16, title: "Deal: Dog Food Discount", description: "Save 15% on Purina brand dog food.", relatedKeywords: ['purina', 'dog food', 'pet'], type: 'deal' },
  { id: 17, title: "Back to School: Crayola", description: "All Crayola products are 25% off this week.", relatedKeywords: ['crayola', 'school', 'craft'], type: 'deal', isStoreWide: true },
  { id: 18, title: "Deal on Sony Headphones", description: "Save $50 on select models.", relatedKeywords: ['sony', 'headphones', 'electronics'], type: 'deal' }
];
