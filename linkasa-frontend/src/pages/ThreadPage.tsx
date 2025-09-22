import { useEffect, useState } from "react";
import { ArrowLeft, Loader, MessageSquare, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createReply, getThread, type Thread, type ThreadReply } from "@/api/thread";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ReplyCardProps = {
  reply: ThreadReply;
};

const ReplyCard = ({ reply }: ReplyCardProps) => {
  const formattedDate = new Date(reply.createdAt).toLocaleDateString();
  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-10 h-10 rounded-full mt-1">
        <AvatarFallback>{reply.user.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
        <p className="font-bold text-gray-800">{reply.user.username}</p>
        <p className="text-gray-600 whitespace-pre-wrap">{reply.content}</p>
        <p className="text-xs text-gray-400 mt-2 text-right">{formattedDate}</p>
      </div>
    </div>
  );
};

export default function ThreadPage() {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid thread ID.");
      setLoading(false);
      return;
    }

    const threadId = Number(id);

    const fetchThread = async () => {
      try {
        setLoading(true);
        const data = await getThread(threadId);
        setThread(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch thread.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [id, refreshKey]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!thread) return <div>No thread found.</div>;

  const formattedDate = new Date(thread.createdAt).toLocaleDateString();

  const handlePostReply = async() => {
    if (!replyContent.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createReply(Number(id), {
        content: replyContent,
      });
      setReplyContent(""); // Clear input

      // Add new reply to the list
      setRefreshKey(prev => prev + 1);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to post reply", err);
      setError("Failed to post reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="mt-8">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link
            to="/forum"
            className="text-gray-500 hover:text-[#9188f1] p-2 rounded-full mr-2"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-[0px_3px_0px_0px_rgb(221,216,212)]">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12 rounded-full">
                <AvatarFallback>
                  {thread.user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{thread.user.username}</p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </div>
            <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
              {thread.content}
            </p>
            {thread.images && thread.images.length > 0 && (
              <div className="mt-4 space-y-2">
                {thread.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_IMG_URL}${image.image}`}
                    alt={`Thread image ${index + 1}`}
                    className="rounded-lg max-w-full h-auto"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              {thread.replies?.length ?? 0} Replies
            </h3>
            <div className="space-y-5">
              {thread?.replies?.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sticky bottom-4 shadow-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarFallback>
                  {thread.user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-[#9188f1] focus:ring-1 focus:ring-[#9188f1]/50 outline-none transition resize-none"
                  rows={3}
                ></textarea>
                <div className="text-right mt-2">
                  <button
                    onClick={handlePostReply}
                    disabled={isSubmitting || !replyContent.trim()}
                    className="bg-[#9188f1] text-white font-bold px-6 py-2 rounded-full shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} /> <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <span>Post Reply</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
