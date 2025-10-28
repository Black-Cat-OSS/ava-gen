export const Sceleton = () => {
  return (
    <div className="flex space-x-3 animate-pulse">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-muted rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="w-20 h-4 bg-muted rounded"></div>
        <div className="w-16 h-3 bg-muted rounded mt-1"></div>
      </div>
    </div>
  );
};
