import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  ArrowLeft,
} from "lucide-react";
import { getTop10FastestQuizAttempts } from "@/api/quiz";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

type LeaderboardEntry = {
  rank: number;
  name: string;
  time: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const LeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => {
  const rankIcon = () => {
    if (entry.rank === 1)
      return <Trophy className="text-yellow-500" size={24} />;
    if (entry.rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (entry.rank === 3)
      return <Medal className="text-orange-400" size={24} />;
    return (
      <span className="text-gray-500 font-bold w-6 text-center">
        {entry.rank}
      </span>
    );
  };

  return (
    <div
      className={`flex items-center p-4 rounded-2xl transition-colors bg-white`}
    >
      <div className="w-10 flex-shrink-0">{rankIcon()}</div>
      <Avatar className="w-12 h-12 rounded-full mx-4">
        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="flex-grow font-bold text-lg text-gray-800">{entry.name}</p>
      <p className="font-semibold text-gray-600">{formatTime(entry.time)}</p>
    </div>
  );
};

export default function LeaderboardPage() {

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTop10FastestQuizAttempts();

        const mappedData: LeaderboardEntry[] = data.map((attempt, index) => ({
          rank: index + 1,
          name: attempt.user.username,
          time: attempt.completionTime
        }));

        setLeaderboardData(mappedData);
      } catch (error) {
        console.error("Failed to fetch quiz attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <header className="relative">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/profile"
            className="absolute top-4 left-4 text-gray-500 hover:text-[#9188f1] p-2 rounded-full"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Trophy size={48} className="mx-auto text-yellow-500 mb-2" />
              <h1 className="text-4xl font-extrabold text-gray-900">
                Quiz Leaderboard
              </h1>
              <p className="text-gray-600 mt-2">
                Top 10 fastest completion times for the Final Quiz.
              </p>
            </div>

            <div className="space-y-3">
              {leaderboardData.map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
