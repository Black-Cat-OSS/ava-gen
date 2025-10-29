export const AvatarCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="aspect-square bg-muted rounded-md mb-3 animate-pulse" />
      <div className="space-y-1">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
};
