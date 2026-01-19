
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const color = progress < 30 ? 'bg-red-500' : progress < 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-300">Fracción de Compresión Torácica</span>
        <span className="text-sm font-medium text-blue-300">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
