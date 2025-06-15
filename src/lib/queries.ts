import { supabase } from '@/integrations/supabase/client';
import type { Deal, Product, Section } from '@/types/supabase';

export const fetchDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase.from('deals').select('*');
  if (error) throw new Error(error.message);
  return (data as Deal[]) || [];
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const fetchSections = async (): Promise<Section[]> => {
  const { data, error } = await supabase.from('sections').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};
