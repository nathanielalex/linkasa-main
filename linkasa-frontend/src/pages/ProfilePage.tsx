import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { getUserLessonProgress, type UserLessonProgress } from "@/api/lesson";
import { getBestFinalAttempt, type FinalQuizAttemptResponse } from "@/api/quiz";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

const LessonProgressCard = ({ lesson }: { lesson: UserLessonProgress }) => {
  const hasAttempted = lesson.score !== null;
  const scoreColor = hasAttempted
    ? lesson.score! >= 80
      ? "text-green-600"
      : lesson.score! >= 50
      ? "text-yellow-600"
      : "text-red-600"
    : "text-gray-400";
  const progressColor = hasAttempted
    ? lesson.score! >= 80
      ? "bg-green-500"
      : lesson.score! >= 50
      ? "bg-yellow-500"
      : "bg-red-500"
    : "bg-gray-300";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_3px_0px_0px_rgb(221,216,212)]">
      <h3 className="font-bold text-lg text-gray-800 mb-4">{lesson.lesson.title}</h3>
      {hasAttempted ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-600">
                Last Score
              </span>
              <span className={`text-lg font-bold ${scoreColor}`}>
                {lesson.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${progressColor} h-2.5 rounded-full`}
                style={{ width: `${lesson.score}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={16} />
            <span>{formatDate(lesson.completedAt)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">Not attempted yet.</p>
        </div>
      )}
    </div>
  );
};

const QuizSummaryCard = ({
  attempt,
}: {
  attempt: FinalQuizAttemptResponse;
}) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_3px_0px_0px_rgb(221,216,212)]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Final Quiz Summary
      </h2>
      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div className="bg-purple-50 p-4 rounded-lg">
          <Award size={24} className="mx-auto text-purple-600 mb-2" />
          <p className="text-sm text-purple-800 font-semibold">Score</p>
          <p className="text-3xl font-bold text-purple-900">{attempt.score}%</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <Clock size={24} className="mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-blue-800 font-semibold">Completion Time</p>
          <p className="text-3xl font-bold text-blue-900">
            {formatTime(attempt.completionTime)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <Calendar size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-sm text-green-800 font-semibold">Last Attempt</p>
          <p className="text-xl font-bold text-green-900 mt-2">
            {formatDate(attempt.attemptedAt)}
          </p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/leaderboard"
          className="bg-[#9188f1] inline-block text-white font-bold px-6 py-3 rounded-full shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
        >
          Check the leaderboards
        </Link>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [progressData, setProgressData] = useState<UserLessonProgress[] | null>(
    null
  );
  const [attempt, setAttempt] = useState<FinalQuizAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getUserLessonProgress();
        // console.log(data);
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching user lesson progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
    const fetchBestAttempt = async () => {
      try {
        const data = await getBestFinalAttempt();
        // console.log(data);
        setAttempt(data);
      } catch (error) {
        console.error("Error fetching best attempt:", error);
        setErrorMsg("Failed to fetch best attempt.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestAttempt();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div>{errorMsg}</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
              My Progress
            </h1>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Lesson History
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progressData?.map((lesson) => (
                  <LessonProgressCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </section>

            <section>
              {attempt && <QuizSummaryCard attempt={attempt} />}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
