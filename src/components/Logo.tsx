
import React from 'react';
import { Cloud } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-300 p-0.5">
        <div className="absolute inset-0 flex items-center justify-center">
          <Cloud className="h-4 w-4 text-white" />
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight">AeroSense</span>
    </div>
  );
}
