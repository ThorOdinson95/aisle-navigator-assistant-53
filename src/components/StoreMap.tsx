
import React, { useState } from 'react';
import { storeSections, StoreSection } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, ShoppingCart, Map, Heart } from 'lucide-react';

interface StoreMapProps {
  items: ShoppingItem[];
}

export const StoreMap: React.FC<StoreMapProps> = ({ items }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredSection(id);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const handleClick = (section: StoreSection) => {
    alert(`You clicked on the "${section.name}" section!`);
  };

  // The overall SVG viewBox dimensions, meticulously adjusted to tightly fit the new denser layout.
  // These values are derived from the coordinates used in mapData.ts to ensure
  // the map fills the available SVG space without excessive empty borders, matching the reference.
  const svgWidth = 980; // Adjusted based on max X + width of rightmost section
  const svgHeight = 720; // Adjusted based on max Y + height of bottommost section + label space

  return (
    <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col items-center border border-gray-100">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Shopping
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6">
          <div className="text-center p-8">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Store Information</h3>
            <p className="text-muted-foreground">Store hours, location, and services</p>
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="mt-6">
          <div className="text-center p-8">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Shopping List</h3>
            <p className="text-muted-foreground">Manage your shopping items</p>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <div className="w-full h-auto relative" style={{ paddingTop: `${(svgHeight / svgWidth) * 100}%` }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="absolute top-0 left-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet" // Ensures the SVG scales correctly while maintaining aspect ratio
            >
              {/* Main store boundary - for visual framing, adjusted to match image's overall space */}
              <rect
                x="10" y="10" width={svgWidth - 20} height={svgHeight - 20}
                className="fill-gray-100 stroke-gray-300 stroke-2 rounded-lg"
              />

              {storeSections.map((section) => (
                <g key={section.id}>
                  {/* Rectangle representing the store section */}
                  <rect
                    x={section.x}
                    y={section.y}
                    width={section.width}
                    height={section.height}
                    className={`
                      stroke-2 rounded-sm
                      ${hoveredSection === section.id
                        ? 'fill-blue-400 stroke-blue-600 shadow-lg' // Highlighted style
                        : 'fill-gray-200 stroke-gray-400' // Default style
                      }
                      transition-all duration-200 ease-in-out cursor-pointer
                    `}
                    onMouseEnter={() => handleMouseEnter(section.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(section)}
                  />
                  {/* Text label for the section */}
                  <text
                    x={section.x + section.width / 2}
                    y={section.y + section.height / 2 + 2} // Adjust Y slightly for vertical centering
                    textAnchor="middle" // Centers text horizontally
                    dominantBaseline="middle" // Centers text vertically
                    className={`
                      pointer-events-none
                      font-semibold text-[8px] sm:text-[10px] md:text-xs lg:text-sm
                      ${hoveredSection === section.id ? 'fill-white' : 'fill-gray-700'}
                      transition-colors duration-200 ease-in-out
                    `}
                    // Dynamic font size adjustment for smaller sections
                    style={{ fontSize: Math.min(section.width / section.name.length * 1.8, section.height * 0.4, 14) }}
                  >
                    {section.name}
                  </text>
                </g>
              ))}

              {/* Static elements to represent general areas and points of interest */}
              {/* Restrooms Icon/Label (aligned to top right in the image) */}
              <g>
                <rect x="880" y="15" width="80" height="30" className="fill-blue-100 stroke-blue-400 rounded-md" />
                <text x="920" y="32" textAnchor="middle" dominantBaseline="middle" className="fill-blue-800 font-bold text-xs">Restrooms</text>
              </g>

              {/* Entrance/Exit Labels, precisely repositioned to fit the denser layout from the image */}
              <text x="145" y="690" textAnchor="middle" className="fill-green-700 font-bold text-lg">Entrance</text>
              <text x="220" y="690" textAnchor="middle" className="fill-red-700 font-bold text-lg">Exit</text>

              <text x="600" y="690" textAnchor="middle" className="fill-red-700 font-bold text-lg">Exit</text>
              <text x="680" y="690" textAnchor="middle" className="fill-green-700 font-bold text-lg">Entrance</text>

            </svg>
          </div>

          {/* Display name of hovered section */}
          {hoveredSection && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg shadow-md text-blue-800 text-lg font-semibold animate-fade-in">
              You are exploring: <span className="text-blue-900">{storeSections.find(s => s.id === hoveredSection)?.name}</span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="text-center p-8">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Favorites</h3>
            <p className="text-muted-foreground">Your favorite products and locations</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreMap;
