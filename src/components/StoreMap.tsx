
import React, { useState, useMemo } from 'react';
import { storeSections, StoreSection } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';
import { calculateOptimalPath, generateSVGPath, PathPoint } from '../lib/pathOptimization';
import { MapPin, Navigation } from 'lucide-react';

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

  // Calculate optimal path based on shopping items
  const optimalPath = useMemo(() => {
    return calculateOptimalPath(items);
  }, [items]);

  const pathSVG = useMemo(() => {
    return generateSVGPath(optimalPath);
  }, [optimalPath]);

  // Count unchecked items for path info
  const uncheckedItemsCount = items.filter(item => !item.checked).length;

  const svgWidth = 700;
  const svgHeight = 500;

  return (
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-4 md:p-6 flex flex-col items-center border border-gray-100">
      {/* Heading */}
      <div className="w-full mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Store Map & Navigation</h2>
        </div>
        {uncheckedItemsCount > 0 ? (
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            Optimized navigation for {uncheckedItemsCount} item{uncheckedItemsCount !== 1 ? 's' : ''} • Follow the blue path through store walkways
          </p>
        ) : (
          <p className="text-xs text-gray-600">All items collected! Navigate to checkout when ready.</p>
        )}
      </div>

      <div className="w-full h-auto relative" style={{ paddingTop: `${(svgHeight / svgWidth) * 100}%` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main store boundary */}
          <rect
            x="5" y="5" width={svgWidth - 10} height={svgHeight - 10}
            className="fill-gray-100 stroke-gray-300 stroke-2 rounded-lg"
          />

          {/* Walkway markings - light gray lines to show clear paths */}
          <g className="opacity-40">
            {/* Main horizontal walkways */}
            <line x1="35" y1="85" x2="660" y2="85" className="stroke-gray-500 stroke-2" />
            <line x1="35" y1="250" x2="660" y2="250" className="stroke-gray-500 stroke-2" />
            <line x1="35" y1="360" x2="660" y2="360" className="stroke-gray-500 stroke-2" />
            <line x1="35" y1="460" x2="660" y2="460" className="stroke-gray-500 stroke-2" />
            
            {/* Vertical connecting walkways */}
            <line x1="130" y1="15" x2="130" y2="485" className="stroke-gray-500 stroke-2" />
            <line x1="210" y1="85" x2="210" y2="485" className="stroke-gray-500 stroke-2" />
            <line x1="275" y1="85" x2="275" y2="360" className="stroke-gray-500 stroke-2" />
            <line x1="420" y1="85" x2="420" y2="360" className="stroke-gray-500 stroke-2" />
            <line x1="535" y1="15" x2="535" y2="485" className="stroke-gray-500 stroke-2" />
          </g>

          {/* Store sections - scaled down */}
          {storeSections.map((section) => (
            <g key={section.id}>
              <rect
                x={section.x * 0.71}
                y={section.y * 0.69}
                width={section.width * 0.71}
                height={section.height * 0.69}
                className={`
                  stroke-2 rounded-sm
                  ${hoveredSection === section.id
                    ? 'fill-blue-400 stroke-blue-600 shadow-lg'
                    : 'fill-gray-200 stroke-gray-400'
                  }
                  transition-all duration-200 ease-in-out cursor-pointer
                `}
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(section)}
              />
              <text
                x={section.x * 0.71 + (section.width * 0.71) / 2}
                y={section.y * 0.69 + (section.height * 0.69) / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`
                  pointer-events-none
                  font-semibold text-[6px] sm:text-[8px] md:text-[10px]
                  ${hoveredSection === section.id ? 'fill-white' : 'fill-gray-700'}
                  transition-colors duration-200 ease-in-out
                `}
                style={{ fontSize: Math.min((section.width * 0.71) / section.name.length * 1.5, (section.height * 0.69) * 0.35, 10) }}
              >
                {section.name}
              </text>
            </g>
          ))}

          {/* Navigation Path - Following walkways */}
          {pathSVG && (
            <g>
              {/* Path shadow for better visibility */}
              <path
                d={pathSVG}
                className="fill-none stroke-white stroke-[4] opacity-50"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Main path line */}
              <path
                d={pathSVG}
                className="fill-none stroke-blue-600 stroke-[3] opacity-90"
                strokeDasharray="8,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Path points - scaled down */}
              {optimalPath.map((point, index) => (
                <g key={`${point.name}-${index}`}>
                  {/* Point circle */}
                  <circle
                    cx={point.x * 0.71}
                    cy={point.y * 0.69}
                    r={point.type === 'entrance' ? 7 : point.type === 'checkout' ? 7 : 6}
                    className={`
                      ${point.type === 'entrance' ? 'fill-green-500' : 
                        point.type === 'checkout' ? 'fill-red-500' : 'fill-blue-500'}
                      stroke-white stroke-2
                    `}
                  />
                  
                  {/* Step number */}
                  <text
                    x={point.x * 0.71}
                    y={point.y * 0.69 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-bold text-[8px] pointer-events-none"
                  >
                    {point.type === 'entrance' ? 'S' : 
                     point.type === 'checkout' ? 'E' : 
                     optimalPath.filter(p => p.type === 'section').indexOf(point) + 1}
                  </text>
                  
                  {/* Point label */}
                  <text
                    x={point.x * 0.71}
                    y={point.y * 0.69 - 12}
                    textAnchor="middle"
                    className={`
                      font-semibold text-[8px] pointer-events-none
                      ${point.type === 'entrance' ? 'fill-green-700' : 
                        point.type === 'checkout' ? 'fill-red-700' : 'fill-blue-700'}
                    `}
                  >
                    {point.name}
                  </text>
                </g>
              ))}

              {/* Direction arrows along the path - scaled down */}
              {optimalPath.length > 1 && optimalPath.slice(0, -1).map((point, index) => {
                const nextPoint = optimalPath[index + 1];
                const midX = ((point.x + nextPoint.x) / 2) * 0.71;
                const midY = ((point.y + nextPoint.y) / 2) * 0.69;
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                
                return (
                  <g key={`arrow-${index}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                    <polygon
                      points="-4,-2 4,0 -4,2"
                      className="fill-blue-600 opacity-80"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Static elements - scaled down */}
          <g>
            <rect x="620" y="10" width="60" height="20" className="fill-blue-100 stroke-blue-400 rounded-md" />
            <text x="650" y="22" textAnchor="middle" dominantBaseline="middle" className="fill-blue-800 font-bold text-[8px]">Restrooms</text>
          </g>

          {/* Entrance/Exit Labels - scaled down */}
          <text x="103" y="480" textAnchor="middle" className="fill-green-700 font-bold text-sm">Entrance</text>
          <text x="157" y="480" textAnchor="middle" className="fill-red-700 font-bold text-sm">Exit</text>
          <text x="430" y="480" textAnchor="middle" className="fill-red-700 font-bold text-sm">Exit</text>
          <text x="485" y="480" textAnchor="middle" className="fill-green-700 font-bold text-sm">Entrance</text>
        </svg>
      </div>

      {/* Current step info - more compact */}
      {hoveredSection && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg shadow-md text-blue-800 text-sm font-semibold animate-fade-in">
          You are exploring: <span className="text-blue-900">{storeSections.find(s => s.id === hoveredSection)?.name}</span>
        </div>
      )}

      {/* Path summary - more compact */}
      {optimalPath.length > 2 && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-xl">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
            <Navigation className="h-3 w-3" />
            Navigation Route
          </h3>
          <div className="flex flex-wrap gap-1 text-xs">
            {optimalPath.map((point, index) => (
              <span
                key={`${point.name}-${index}`}
                className={`
                  px-2 py-1 rounded text-white font-medium text-xs
                  ${point.type === 'entrance' ? 'bg-green-500' : 
                    point.type === 'checkout' ? 'bg-red-500' : 'bg-blue-500'}
                `}
              >
                {index === 0 ? 'Start' : 
                 index === optimalPath.length - 1 ? 'Finish' : 
                 `${index}.`} {point.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Route follows store walkways for clear navigation
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreMap;
