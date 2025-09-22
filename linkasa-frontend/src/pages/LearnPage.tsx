import { useEffect, useState } from "react";
import { Check, Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLessonsWithProgress, type LessonWithProgress } from "@/api/lesson";

const nodeStyles = [
  { left: 0, top: 0 },
  { left: -20, top: 120 },
  { left: -40, top: 240 },
  { left: -20, top: 360 },
  { left: 0, top: 480 },
  { left: 20, top: 600 },
];

type LessonNodeProps = {
  id: string;
  title: string;
  type: string;
  status: string;
  score: number;
};

const LessonNode = ({ lesson }: { lesson: LessonNodeProps }) => {
  const statusStyles = {
    completed: `bg-[#9188f1] text-white`,
    active: "bg-[#dbf881] text-black animate-pulse",
    locked: "bg-gray-300 text-gray-500",
  } as const;

  const shadowStyles = {
    completed: `shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]`,
    active: `shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]`,
    locked: `shadow-[0px_4px_0px_0px_#b0b0b0]`,
  } as const;

  const icon = {
    completed: <Check size={32} />,
    active: <Star size={32} />,
    locked: <Lock size={32} />,
  } as const;
  const status = lesson.status as keyof typeof statusStyles;
  const navigate = useNavigate();

  return (
    <div
      className="relative group"
      onClick={() =>
        lesson.status !== "locked" && navigate(`/practice/${lesson.id}`)
      }
    >
      <button
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform hover:-translate-y-1 ${statusStyles[status]} ${shadowStyles[status]}`}
        disabled={lesson.status === "locked"}
      >
        {icon[status]}
      </button>

      <div
        className="
          absolute
          top-1/2
          left-full
          ml-3
          w-48
          p-2
          bg-black
          text-white
          text-center
          rounded-lg
          text-sm
          opacity-0
          group-hover:opacity-100
          transition-opacity
          pointer-events-none
          -translate-y-1/2
          hidden
          md:block
          z-10
        "
      >
        <div>{lesson.title}</div>
        <div className="text-gray-300 text-xs mt-1">
          Score: {lesson.score ?? "N/A"}
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black"></div>
      </div>

      <div
        className="
          absolute
          top-full
          mt-2
          left-1/2
          -translate-x-1/2
          w-48
          p-2
          bg-black
          text-white
          text-center
          rounded-lg
          text-sm
          opacity-0
          group-hover:opacity-100
          transition-opacity
          pointer-events-none
          md:hidden
          z-10
        "
      >
        <div>{lesson.title}</div>
        <div className="text-gray-300 text-xs mt-1">
          Score: {lesson.score ?? "N/A"}
        </div>
      </div>
    </div>
  );
};

export default function LearnPage() {
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsWithProgress();
        // console.log(data)
        setLessons(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p>{error}</p>;

  const transformedLessons = lessons
    .sort((a, b) => a.lessonOrder - b.lessonOrder)
    .map((lesson, index) => {
      let status: "completed" | "active" | "locked" = "locked";
      let score = 0;

      if (lesson.userProgress.length > 0) {
        status = "completed";
        score = lesson.userProgress[0].score;
      } else if (index === 0 || lessons[index - 1].userProgress.length > 0) {
        status = "active";
      }

      return {
        id: `${lesson.id}`,
        title: `Alphabet ${lesson.title}`,
        type: "lesson",
        status,
        score: score,
      };
    });
  return (
    <div className="flex items-center justify-center h-[100vh] w-[200px] mx-auto px-4 relative">
      <div className="relative h-[600px] w-[100px]">
        {" "}
        {transformedLessons.map((lesson, i) => {
          const style = {
            position: "absolute" as const,
            left: `${nodeStyles[i]?.left || 0}px`,
            top: `${nodeStyles[i]?.top || 0}px`,
          };

          return (
            <div key={lesson.id} style={style}>
              <LessonNode lesson={lesson} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
