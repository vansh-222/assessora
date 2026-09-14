'use client';

import { useMemo } from 'react';
import { Book, Calculator, Dna, FileText, Globe, Code, Brain, ArrowRight } from 'lucide-react';

interface Subject {
  name: string;
  completedTopics: number;
  totalTopics: number;
}

export function KnowledgeMapVisual({ subjects }: { subjects: Subject[] }) {
  const totalCompleted = subjects.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const totalTopics = subjects.reduce((acc, curr) => acc + curr.totalTopics, 0);

  // Layout parameters
  const centerX = 400;
  const centerY = 300;
  const radiusX = 280; // Distance of nodes from center X
  const radiusY = 180; // Distance of nodes from center Y

  // We need to place nodes in specific spots to match the image:
  // Math top center-right
  // English middle right
  // History bottom right
  // Comp Sci bottom center-left
  // Biology middle left
  // Physics top left

  const nodes = useMemo(() => {
    return subjects.map((subject, index) => {
      // Calculate angle (spread evenly in an ellipse)
      // Start top center (approx -60 deg), go clockwise
      let angle = (index * (360 / subjects.length) - 60) * (Math.PI / 180);
      
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      return { ...subject, x, y, index };
    });
  }, [subjects]);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'mathematics': return <FileText className="w-5 h-5" />; // The image shows a FileText for math
      case 'physics': return <Calculator className="w-5 h-5" />; // Looks like a flask in the image, but Calculator/Flask is fine
      case 'biology': return <Dna className="w-5 h-5" />;
      case 'english': return <Book className="w-5 h-5" />;
      case 'history': return <FileText className="w-5 h-5" />;
      case 'computer science': return <Code className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full max-w-[900px] max-h-[700px]">
        {/* SVG Canvas for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" /> {/* emerald-200 */}
              <stop offset="100%" stopColor="#34d399" /> {/* emerald-400 */}
            </linearGradient>
            
            {/* The nodes have a darker green part in their lines in the image, let's use a simple dashed line */}
          </defs>
          
          {nodes.map((node) => {
            // Curved path from center to node
            const dx = node.x - centerX;
            const dy = node.y - centerY;
            
            // Adjust control points for smoother S-curve
            const controlPoint1X = centerX + dx * 0.4;
            const controlPoint1Y = centerY;
            const controlPoint2X = node.x - dx * 0.2;
            const controlPoint2Y = node.y;
            
            return (
              <g key={`line-${node.name}`}>
                {/* Main line */}
                <path
                  d={`M ${centerX} ${centerY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${node.x} ${node.y}`}
                  fill="none"
                  stroke="#6ee7b7" // emerald-300
                  strokeWidth="2.5"
                />
                {/* Dashed line over it */}
                <path
                  d={`M ${centerX} ${centerY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${node.x} ${node.y}`}
                  fill="none"
                  stroke="#10b981" // emerald-500
                  strokeWidth="2.5"
                  strokeDasharray="0 12"
                  strokeLinecap="round"
                />
                {/* Dots on line */}
                <circle cx={centerX + dx * 0.5} cy={centerY + dy * 0.5} r="4" fill="#0A3D2C" />
                <circle cx={centerX + dx * 0.8} cy={centerY + dy * 0.8} r="3" fill="#10b981" />
              </g>
            );
          })}
        </svg>

        {/* Central Node */}
        <div 
          className="absolute z-20 flex flex-col items-center justify-center bg-[#0A3D2C] text-white rounded-full shadow-xl border-[6px] border-emerald-50/50"
          style={{ width: '130px', height: '130px', left: `calc(50% - 65px)`, top: `calc(50% - 65px)` }}
        >
          <Brain className="w-8 h-8 mb-1.5 text-emerald-400" />
          <span className="font-bold text-sm leading-tight">All Subjects</span>
          <span className="text-[10px] text-emerald-200 mt-0.5">{totalTopics} topics</span>
        </div>

        {/* Subject Nodes */}
        {nodes.map((node) => {
          const progress = node.totalTopics > 0 ? (node.completedTopics / node.totalTopics) * 100 : 0;
          return (
            <div 
              key={node.name}
              className="absolute z-10 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-emerald-50 p-4 w-60 transform -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+4px)] transition-transform duration-300 cursor-pointer group"
              style={{ left: `calc(50% + ${node.x - centerX}px)`, top: `calc(50% + ${node.y - centerY}px)` }}
            >
              <div className="flex flex-col">
                {/* Icon Circle at top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-50 border-4 border-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  {getIcon(node.name)}
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{node.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {node.completedTopics}/{node.totalTopics} topics completed
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-emerald-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
