export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-400 py-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Linkasa. All rights reserved.</p>
        <p className="mt-2 text-sm">Learn Sign Language, The Fun Way.</p>
      </div>
    </footer>
  );
}
