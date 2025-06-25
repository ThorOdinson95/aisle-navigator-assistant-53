
import React, { useState, useMemo } from 'react';
import { storeSections, StoreSection } from '../mapData';
import type { ShoppingItem } from '@/pages/Index';
import { calculateOptimalPath, generateSVGPath, PathPoint } from '../lib/pathOptimization';
import { MapPin, Navigation, Route, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoreMapProps {
  items: ShoppingItem[];
}

export const StoreMap: React.FC<StoreMapProps> = ({ items }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showOptimizedRoute, setShowOptimizedRoute] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleMouseEnter = (id: string) => {
    setHoveredSection(id);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const handleClick = (section: StoreSection) => {
    console.log(`Navigating to: ${section.name}`);
  };

  // Calculate optimal path
  const optimalPath = useMemo(() => {
    return calculateOptimalPath(items);
  }, [items]);

  const pathSVG = useMemo(() => {
    return generateSVGPath(optimalPath);
  }, [optimalPath]);

  // Navigation controls
  const handleNextStep = () => {
    if (currentStep < optimalPath.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResetNavigation = () => {
    setCurrentStep(0);
  };

  const uncheckedItemsCount = items.filter(item => !item.checked).length;
  const svgWidth = 980;
  const svgHeight = 720;

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-200">
      {/* Enhanced Header */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Smart Navigation</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptimizedRoute(!showOptimizedRoute)}
              className="text-xs"
            >
              <Route className="h-3 w-3 mr-1" />
              {showOptimizedRoute ? 'Hide Route' : 'Show Route'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetNavigation}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        {uncheckedItemsCount > 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Route optimized for {uncheckedItemsCount} item{uncheckedItemsCount !== 1 ? 's' : ''} • Total distance minimized
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap className="h-3 w-3" />
              Smart routing enabled
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">All items collected! Navigate to checkout when ready.</p>
        )}
      </div>

      {/* Navigation Progress */}
      {optimalPath.length > 0 && (
        <div className="w-full mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Step {currentStep + 1} of {optimalPath.length}: {optimalPath[currentStep]?.name}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="text-xs h-7"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={currentStep === optimalPath.length - 1}
                className="text-xs h-7"
              >
                Next
              </Button>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / optimalPath.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Store Map */}
      <div className="w-full h-auto relative" style={{ paddingTop: `${(svgHeight / svgWidth) * 100}%` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Store boundary */}
          <rect
            x="10" y="10" width={svgWidth - 20} height={svgHeight - 20}
            className="fill-gray-50 stroke-gray-300 stroke-2"
          />

          {/* Main walkway grid */}
          <g className="opacity-30">
            {/* Horizontal walkways */}
            <line x1="50" y1="130" x2="920" y2="130" className="stroke-gray-400 stroke-2" />
            <line x1="50" y1="380" x2="920" y2="380" className="stroke-gray-400 stroke-2" />
            <line x1="50" y1="520" x2="920" y2="520" className="stroke-gray-400 stroke-2" />
            <line x1="50" y1="650" x2="920" y2="650" className="stroke-gray-400 stroke-2" />
            
            {/* Vertical walkways */}
            <line x1="190" y1="20" x2="190" y2="700" className="stroke-gray-400 stroke-2" />
            <line x1="390" y1="20" x2="390" y2="700" className="stroke-gray-400 stroke-2" />
            <line x1="740" y1="20" x2="740" y2="700" className="stroke-gray-400 stroke-2" />
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
                  stroke-2 cursor-pointer transition-all duration-200
                  ${hoveredSection === section.id
                    ? 'fill-blue-400 stroke-blue-600 shadow-lg'
                    : 'fill-gray-200 stroke-gray-400'
                  }
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
                  pointer-events-none font-medium text-[10px] transition-colors duration-200
                  ${hoveredSection === section.id ? 'fill-white' : 'fill-gray-700'}
                `}
                style={{ fontSize: Math.min(section.width / section.name.length * 1.8, section.height * 0.4, 12) }}
              >
                {section.name}
              </text>
            </g>
          ))}

          {/* Navigation Path */}
          {showOptimizedRoute && pathSVG && (
            <g>
              {/* Path shadow */}
              <path
                d={pathSVG}
                className="fill-none stroke-white stroke-[5] opacity-70"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Main path */}
              <path
                d={pathSVG}
                className="fill-none stroke-blue-600 stroke-[3] opacity-90"
                strokeDasharray="8,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Path points with current step highlighting */}
              {optimalPath.map((point, index) => (
                <g key={`${point.name}-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={index === currentStep ? 12 : (point.type === 'entrance' || point.type === 'checkout' ? 8 : 6)}
                    className={`
                      stroke-white stroke-2 transition-all duration-300
                      ${index === currentStep ? 'fill-yellow-500' :
                        point.type === 'entrance' ? 'fill-green-500' : 
                        point.type === 'checkout' ? 'fill-red-500' : 'fill-blue-500'}
                    `}
                  />
                  
                  <text
                    x={point.x}
                    y={point.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-bold text-[10px] pointer-events-none"
                  >
                    {point.type === 'entrance' ? 'S' : 
                     point.type === 'checkout' ? 'E' : 
                     optimalPath.filter(p => p.type === 'section').indexOf(point) + 1}
                  </text>
                  
                  {index === currentStep && (
                    <text
                      x={point.x}
                      y={point.y - 20}
                      textAnchor="middle"
                      className="font-bold text-sm fill-yellow-600 pointer-events-none"
                    >
                      You are here
                    </text>
                  )}
                </g>
              ))}

              {/* Direction arrows */}
              {optimalPath.length > 1 && optimalPath.slice(0, -1).map((point, index) => {
                const nextPoint = optimalPath[index + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                
                return (
                  <g key={`arrow-${index}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                    <polygon
                      points="-5,-2 5,0 -5,2"
                      className="fill-blue-600 opacity-80"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Static elements */}
          <rect x="880" y="15" width="80" height="25" className="fill-blue-100 stroke-blue-400" />
          <text x="920" y="30" textAnchor="middle" dominantBaseline="middle" className="fill-blue-800 font-bold text-[10px]">Restrooms</text>
        </svg>
      </div>

      {/* Current section info */}
      {hoveredSection && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg shadow-sm text-blue-800 text-sm font-medium animate-fade-in">
          Viewing: <span className="text-blue-900">{storeSections.find(s => s.id === hoveredSection)?.name}</span>
        </div>
      )}

      {/* Route summary */}
      {optimalPath.length > 2 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
            <Navigation className="h-4 w-4" />
            Optimized Route ({optimalPath.length} stops)
          </h3>
          <div className="flex flex-wrap gap-1 text-xs">
            {optimalPath.map((point, index) => (
              <span
                key={`${point.name}-${index}`}
                className={`
                  px-2 py-1 rounded text-white font-medium transition-all duration-200
                  ${index === currentStep ? 'bg-yellow-500 scale-105' :
                    point.type === 'entrance' ? 'bg-green-500' : 
                    point.type === 'checkout' ? 'bg-red-500' : 'bg-blue-500'}
                `}
              >
                {index === 0 ? 'Start' : 
                 index === optimalPath.length - 1 ? 'Finish' : 
                 `${index}.`} {point.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Intelligent routing minimizes walking distance
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreMap;
