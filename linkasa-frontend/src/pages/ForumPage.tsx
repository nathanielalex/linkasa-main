import { useEffect, useState } from "react";
import { MessageSquare, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getThreads, type Thread } from "@/api/thread";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ForumPostProps = {
  post: Thread
};

const ForumPostCard = ({ post }: ForumPostProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-[0px_3px_0px_0px_rgb(221,216,212)] transition-transform hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/forum/thread/${post.id}`)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 rounded-full">
          <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {post.content}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Posted by {post.user.username} &bull; {formattedDate}
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquare size={18} />
            <span>{post.replies?.length ?? 0} Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const data = await getThreads();
        setThreads(data);
      } catch (err) {
        setError("Failed to load threads");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredThreads = threads.filter((thread) =>
    thread.content.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white border-2 border-gray-200 focus:border-[#9188f1] focus:ring-2 focus:ring-[#9188f1]/50 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={22}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={() => navigate("/forum/create")}
                className="bg-[#9188f1] text-white font-bold px-6 py-3 rounded-full shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] flex items-center gap-2 sm:ml-auto w-full sm:w-auto justify-center"
              >
                <Plus size={20} />
                Create New Post
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredThreads.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
