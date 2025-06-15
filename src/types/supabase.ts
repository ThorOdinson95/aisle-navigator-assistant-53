
export type Product = {
  id: number;
  name: string;
  department: string;
  created_at: string;
}

export type Deal = {
  id: number;
  title: string;
  description: string;
  related_keywords: string[];
  type: 'deal' | 'alternative';
  is_store_wide: boolean | null;
  created_at: string;
}
