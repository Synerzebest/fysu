import React from 'react'

function ProductSkeleton() {
    return (
        <div className="relative text-center w-[250px] sm:w-[300px] lg:w-[350px] shrink-0 animate-pulse">
          {/* Image placeholder */}
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200"></div>
    
          {/* Textes */}
          <div className="space-y-2 mt-2 flex flex-col items-center">
            <div className="h-4 w-3/5 bg-gray-300 rounded"></div>
            <div className="h-4 w-2/5 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      );
}

export default ProductSkeleton
