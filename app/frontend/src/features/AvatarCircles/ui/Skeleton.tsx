export const Skeleton = () => {
  return (
    <div className="flex items-center space-x-2">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-muted animate-pulse"
          style={{ marginLeft: index > 0 ? '-80px' : 0 }}
        />
      ))}
    </div>
  );
};
