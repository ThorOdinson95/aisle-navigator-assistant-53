
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";

const StoreMap = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Map className="h-5 w-5 text-primary" />
        <CardTitle>Store Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-full min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
          <p className="text-muted-foreground">Optimized route will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
