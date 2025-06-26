export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-10xl mx-auto">
        <h1 className="text-xl font-bold">Download Central</h1>
        <div className="space-x-4">
          <a href="#" className="hover:text-violet-300">Home</a>
          <a href="#" className="hover:text-violet-300">Files</a>
          <a href="#" className="hover:text-violet-300">About</a>
        </div>
      </div>
    </nav>
  );
}
