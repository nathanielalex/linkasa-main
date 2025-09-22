import { Flame, Gem, UserCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex justify-end items-center p-4 gap-4">
        <div className="flex items-center gap-1 font-bold text-orange-500">
          <Flame size={20} />
          <span>12</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-blue-500">
          <Gem size={20} />
          <span>250</span>
        </div>
        <UserCircle size={28} className="text-gray-400" />
      </div>
    </div>
  );
}
