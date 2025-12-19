export const LoadingSkeleton = () => {
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
          <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="w-full h-4 bg-muted rounded animate-pulse mt-1"></div>
      </div>
    </div>
  );
};
