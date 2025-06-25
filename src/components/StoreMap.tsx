import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Navigation, SkipForward, RotateCcw, Eye, EyeOff } from "lucide-react";
import { storeSections } from "../mapData";
import { calculateOptimalPath, generateSVGPath } from "../lib/pathOptimization";
import type { ShoppingItem } from "@/pages/Index";
import { useState, useMemo } from "react";

interface StoreMapProps {
  items: ShoppingItem[];
}

const StoreMap = ({ items }: StoreMapProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRoute, setShowRoute] = useState(true);
  
  const optimalPath = useMemo(() => calculateOptimalPath(items), [items]);
  const svgPath = useMemo(() => generateSVGPath(optimalPath), [optimalPath]);

  const getDepartmentItems = (department: string) => {
    return items.filter(item => item.department === department && !item.checked);
  };

  const currentLocation = optimalPath[currentStep]?.name || 'Store Entrance';
  const departmentItems = getDepartmentItems(optimalPath[currentStep]?.department || '');

  const progress = ((currentStep + 1) / optimalPath.length) * 100;

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, optimalPath.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Store Map & Navigation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRoute(!showRoute)}
              className="text-xs"
            >
              {showRoute ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {showRoute ? 'Hide' : 'Show'} Route
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
        
        {optimalPath.length > 2 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Step {currentStep + 1} of {optimalPath.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  {currentLocation}
                </Badge>
                {departmentItems.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    ({departmentItems.length} item{departmentItems.length !== 1 ? 's' : ''})
                  </div>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-xs px-2"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === optimalPath.length - 1}
                  className="text-xs px-2"
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === optimalPath.length - 1}
                  className="text-xs px-2"
                >
                  <SkipForward className="h-3 w-3" />
                  Go
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative w-full" style={{ aspectRatio: '900/700' }}>
          <svg 
            viewBox="0 0 900 700" 
            className="w-full h-full border rounded-lg bg-white"
            style={{ maxHeight: '500px' }}
          >
            {/* Store sections */}
            {storeSections.map((section) => {
              const isVisited = optimalPath.slice(0, currentStep + 1).some(
                point => point.name === section.name
              );
              const isCurrent = currentStep < optimalPath.length && 
                              optimalPath[currentStep]?.name === section.name;
              
              return (
                <g key={section.id}>
                  <rect
                    x={section.x}
                    y={section.y}
                    width={section.width}
                    height={section.height}
                    fill={isCurrent ? "#3b82f6" : isVisited ? "#10b981" : section.color}
                    stroke={isCurrent ? "#1e40af" : isVisited ? "#059669" : "#e5e7eb"}
                    strokeWidth="1"
                    opacity={isCurrent ? 0.9 : isVisited ? 0.8 : 0.7}
                  />
                  <text
                    x={section.x + section.width / 2}
                    y={section.y + section.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fontWeight={isCurrent ? "bold" : "normal"}
                    fill={isCurrent || isVisited ? "white" : "#374151"}
                  >
                    {section.name}
                  </text>
                </g>
              );
            })}

            {/* Navigation path */}
            {showRoute && optimalPath.length > 1 && (
              <g>
                {/* Full path */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                
                {/* Completed path */}
                {currentStep > 0 && (
                  <path
                    d={generateSVGPath(optimalPath.slice(0, currentStep + 1))}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                )}
                
                {/* Path points */}
                {optimalPath.map((point, index) => {
                  const isPassed = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isCurrent ? "6" : "4"}
                        fill={isCurrent ? "#3b82f6" : isPassed ? "#10b981" : "#ef4444"}
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <text
                        x={point.x}
                        y={point.y - 12}
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill={isCurrent ? "#3b82f6" : isPassed ? "#10b981" : "#ef4444"}
                      >
                        {index + 1}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Legend */}
            <g transform="translate(10, 10)">
              <rect width="120" height="45" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" opacity="0.95"/>
              <text x="8" y="15" fontSize="8" fontWeight="bold" fill="#374151">Legend</text>
              <circle cx="15" cy="25" r="3" fill="#ef4444"/>
              <text x="25" y="28" fontSize="7" fill="#374151">Planned</text>
              <circle cx="15" cy="35" r="3" fill="#10b981"/>
              <text x="25" y="38" fontSize="7" fill="#374151">Visited</text>
              <circle cx="70" cy="25" r="3" fill="#3b82f6"/>
              <text x="80" y="28" fontSize="7" fill="#374151">Current</text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap;
