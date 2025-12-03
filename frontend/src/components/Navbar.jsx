export const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-3 shadow bg-white sticky top-0 z-10">

      <h1 className="text-xl font-bold text-pink-600">Sweet Bites</h1>

      <input
        type="text"
        placeholder="Search cakes..."
        className="border rounded-full px-4 py-1 w-40 md:w-60 text-sm"
      />

      <div className="flex gap-3 text-xl">
        <span>❤️</span>
        <span>☰</span>
      </div>

    </div>
  );
};

export default Navbar;
