
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product as ProductSuggestion } from "@/types/supabase";

interface ProductBrowserProps {
  onAddProduct: (product: ProductSuggestion) => void;
}

const ProductBrowser = ({ onAddProduct }: ProductBrowserProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(department)) {
      newExpanded.delete(department);
    } else {
      newExpanded.add(department);
    }
    setExpandedDepartments(newExpanded);
  };

  // Group products by department
  const productsByDepartment = products?.reduce((acc, product) => {
    if (!acc[product.department]) {
      acc[product.department] = [];
    }
    acc[product.department].push(product);
    return acc;
  }, {} as Record<string, ProductSuggestion[]>) || {};

  const departments = Object.keys(productsByDepartment).sort();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Browse Products</h3>
      <div className="max-h-80 overflow-y-auto space-y-2">
        {departments.map((department) => (
          <div key={department} className="border rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto font-medium"
              onClick={() => toggleDepartment(department)}
            >
              <span>{department}</span>
              {expandedDepartments.has(department) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {expandedDepartments.has(department) && (
              <div className="border-t bg-muted/20 p-2 space-y-1">
                {productsByDepartment[department].map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted/40 rounded">
                    <span className="text-sm flex-1">{product.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddProduct(product)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBrowser;
