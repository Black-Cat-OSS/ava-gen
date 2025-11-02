export const Skeleton = () => {
  return (
    <div className="flex items-center space-x-2 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-gray-700"
          style={{ marginLeft: index > 0 ? '-100px' : 0 }}
        />
      ))}
    </div>
  );
};
