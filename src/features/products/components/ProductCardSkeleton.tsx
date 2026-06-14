import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#e5beb5]/30 shadow-sm flex flex-col animate-pulse">
      <div className="relative aspect-square bg-[#ffe9e4]/50"></div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

        <div className="flex gap-1.5 mt-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-1.5">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
