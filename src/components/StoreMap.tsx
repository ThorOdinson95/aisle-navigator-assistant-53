
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

  const svgWidth = 980;
  const svgHeight = 720;

  return (
    <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col items-center border border-gray-100">
      {/* Heading */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Store Map & Navigation</h2>
        </div>
        {uncheckedItemsCount > 0 ? (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Optimized aisle navigation for {uncheckedItemsCount} item{uncheckedItemsCount !== 1 ? 's' : ''} • Follow the blue path through store aisles
          </p>
        ) : (
          <p className="text-sm text-gray-600">All items collected! Navigate to checkout when ready.</p>
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
            x="10" y="10" width={svgWidth - 20} height={svgHeight - 20}
            className="fill-gray-100 stroke-gray-300 stroke-2 rounded-lg"
          />

          {/* Aisle markings - light gray lines to show walkways */}
          <g className="opacity-30">
            {/* Main horizontal aisles */}
            <line x1="200" y1="120" x2="700" y2="120" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="200" y1="200" x2="700" y2="200" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="200" y1="350" x2="700" y2="350" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="200" y1="480" x2="700" y2="480" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            
            {/* Vertical connecting aisles */}
            <line x1="200" y1="120" x2="200" y2="600" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="400" y1="100" x2="400" y2="600" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="600" y1="120" x2="600" y2="480" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
            <line x1="700" y1="180" x2="700" y2="600" className="stroke-gray-400 stroke-2" strokeDasharray="5,5" />
          </g>

          {/* Store sections */}
          {storeSections.map((section) => (
            <g key={section.id}>
              <rect
                x={section.x}
                y={section.y}
                width={section.width}
                height={section.height}
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
                x={section.x + section.width / 2}
                y={section.y + section.height / 2 + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`
                  pointer-events-none
                  font-semibold text-[8px] sm:text-[10px] md:text-xs lg:text-sm
                  ${hoveredSection === section.id ? 'fill-white' : 'fill-gray-700'}
                  transition-colors duration-200 ease-in-out
                `}
                style={{ fontSize: Math.min(section.width / section.name.length * 1.8, section.height * 0.4, 14) }}
              >
                {section.name}
              </text>
            </g>
          ))}

          {/* Navigation Path - Enhanced with aisle following */}
          {pathSVG && (
            <g>
              {/* Path line with enhanced styling */}
              <path
                d={pathSVG}
                className="fill-none stroke-blue-600 stroke-[4] opacity-90"
                strokeDasharray="12,6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Path shadow for better visibility */}
              <path
                d={pathSVG}
                className="fill-none stroke-white stroke-[6] opacity-50"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Path points */}
              {optimalPath.map((point, index) => (
                <g key={`${point.name}-${index}`}>
                  {/* Point circle with enhanced styling */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={point.type === 'entrance' ? 10 : point.type === 'checkout' ? 10 : point.type === 'aisle' ? 4 : 8}
                    className={`
                      ${point.type === 'entrance' ? 'fill-green-500' : 
                        point.type === 'checkout' ? 'fill-red-500' : 
                        point.type === 'aisle' ? 'fill-blue-300' : 'fill-blue-500'}
                      stroke-white stroke-2
                    `}
                  />
                  
                  {/* Step number - only for major waypoints */}
                  {point.type !== 'aisle' && (
                    <text
                      x={point.x}
                      y={point.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold text-xs pointer-events-none"
                    >
                      {point.type === 'entrance' ? 'S' : 
                       point.type === 'checkout' ? 'E' : 
                       optimalPath.filter(p => p.type === 'section').indexOf(point) + 1}
                    </text>
                  )}
                  
                  {/* Point label - only for major waypoints */}
                  {point.type !== 'aisle' && (
                    <text
                      x={point.x}
                      y={point.y - 18}
                      textAnchor="middle"
                      className={`
                        font-semibold text-xs pointer-events-none
                        ${point.type === 'entrance' ? 'fill-green-700' : 
                          point.type === 'checkout' ? 'fill-red-700' : 'fill-blue-700'}
                      `}
                    >
                      {point.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Direction arrows along the path */}
              {optimalPath.length > 1 && optimalPath.slice(0, -1).map((point, index) => {
                const nextPoint = optimalPath[index + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                
                return (
                  <g key={`arrow-${index}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                    <polygon
                      points="-6,-3 6,0 -6,3"
                      className="fill-blue-600 opacity-80"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Static elements */}
          <g>
            <rect x="880" y="15" width="80" height="30" className="fill-blue-100 stroke-blue-400 rounded-md" />
            <text x="920" y="32" textAnchor="middle" dominantBaseline="middle" className="fill-blue-800 font-bold text-xs">Restrooms</text>
          </g>

          {/* Entrance/Exit Labels */}
          <text x="145" y="690" textAnchor="middle" className="fill-green-700 font-bold text-lg">Entrance</text>
          <text x="220" y="690" textAnchor="middle" className="fill-red-700 font-bold text-lg">Exit</text>
          <text x="600" y="690" textAnchor="middle" className="fill-red-700 font-bold text-lg">Exit</text>
          <text x="680" y="690" textAnchor="middle" className="fill-green-700 font-bold text-lg">Entrance</text>
        </svg>
      </div>

      {/* Current step info */}
      {hoveredSection && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg shadow-md text-blue-800 text-lg font-semibold animate-fade-in">
          You are exploring: <span className="text-blue-900">{storeSections.find(s => s.id === hoveredSection)?.name}</span>
        </div>
      )}

      {/* Path summary with aisle information */}
      {optimalPath.length > 2 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-2xl">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Aisle-by-Aisle Navigation Route
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {optimalPath.filter(point => point.type !== 'aisle').map((point, index) => {
              const filteredPoints = optimalPath.filter(p => p.type !== 'aisle');
              return (
                <span
                  key={`${point.name}-${index}`}
                  className={`
                    px-2 py-1 rounded text-white font-medium
                    ${point.type === 'entrance' ? 'bg-green-500' : 
                      point.type === 'checkout' ? 'bg-red-500' : 'bg-blue-500'}
                  `}
                >
                  {index === 0 ? 'Start' : 
                   index === filteredPoints.length - 1 ? 'Finish' : 
                   `${index}.`} {point.name}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Route follows store aisles and walkways for efficient navigation
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreMap;
