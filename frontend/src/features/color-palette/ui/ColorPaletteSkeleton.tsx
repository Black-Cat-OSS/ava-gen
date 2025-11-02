/**
 * Skeleton component for color palette loading state
 * Shows animated placeholders while color palettes are being fetched
 * Provides visual feedback during Suspense loading
 */
export const ColorPaletteSkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full ">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border-2 border-none bg-gray-800 h-[80px]"></div>
        ))}
      </div>
      <div className="bg-gray-800 rounded h-[36px] w-[140px] mt-6"></div>
    </div>
  );
};
