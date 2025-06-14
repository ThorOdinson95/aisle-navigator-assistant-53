
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const StoreMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token || !mapContainer.current) return;

    try {
      mapboxgl.accessToken = token;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Centered on the US
        zoom: 3,
      });
      setTokenError(false);
    } catch (error) {
      console.error("Mapbox initialization error:", error);
      setTokenError(true);
      setToken(''); // Reset token if it's invalid
    }

    return () => {
      map.current?.remove();
    };
  }, [token]);

  const handleSetToken = () => {
    if (tempToken.startsWith('pk.')) {
      setToken(tempToken);
      setTokenError(false);
    } else {
      setTokenError(true);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Map className="h-5 w-5 text-primary" />
        <CardTitle>Store Map</CardTitle>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Connect to Mapbox</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              To display the store map, please enter your public Mapbox access token. You can get a free token from your{' '}
              <a href="https://account.mapbox.com/access-tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Mapbox account
              </a>.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="text" 
                placeholder="pk.ey..." 
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                className={tokenError ? 'border-destructive' : ''}
                onKeyDown={(e) => e.key === 'Enter' && handleSetToken()}
              />
              <Button onClick={handleSetToken}>Set Token</Button>
            </div>
            {tokenError && <p className="text-destructive text-sm mt-2">Please enter a valid Mapbox public token.</p>}
          </div>
        ) : (
          <div ref={mapContainer} className="h-full min-h-[500px] rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
};

export default StoreMap;
