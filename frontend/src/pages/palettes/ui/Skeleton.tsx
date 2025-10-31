export const PalettesSkeleton = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="h-45 w-full bg-gray-200 dark:bg-gray-700 rounded p-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-6 h-7"></div>
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-3 h-12 mt-2"></div>
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-3 h-12 mt-2"></div>
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-2 h-6"></div>
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-2 col-start-4 h-6"></div>
            <div className="bg-gray-500 dark:bg-gray-600 rounded col-span-3 mt-3 h-5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
