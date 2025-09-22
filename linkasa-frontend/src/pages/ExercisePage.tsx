import { useEffect, useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createUserLessonProgress, getExercisesByLesson, type Exercise } from "@/api/lesson";

type AnswerState = "unanswered" | "selected" | "correct" | "incorrect";
type FeedbackState = "hidden" | "correct" | "incorrect";

const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const progressPercentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-[#dbf881] h-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const ChoiceButton = ({
  text,
  onClick,
  state,
}: {
  text: string;
  onClick: () => void;
  state: AnswerState;
}) => {
  const baseClasses =
    "w-full text-left p-4 rounded-xl border-2 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-150 flex items-center justify-between";

  const stateClasses = {
    unanswered: "bg-white border-gray-200 hover:bg-gray-100",
    selected: "bg-purple-100 border-[#9188f1]",
    correct: "bg-green-100 border-green-500 text-green-700 font-bold",
    incorrect: "bg-red-100 border-red-500 text-red-700 font-bold",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${stateClasses[state]}`}
    >
      <span>{text}</span>
      {state === "correct" && <CheckCircle2 />}
      {state === "incorrect" && <XCircle />}
    </button>
  );
};

const FeedbackBanner = ({
  state,
  correctAnswer,
  onContinue,
  submitting
}: {
  state: FeedbackState;
  correctAnswer: string;
  onContinue: () => void;
  submitting: boolean;
}) => {
  if (state === "hidden") return null;

  const isCorrect = state === "correct";
  const bannerClasses = isCorrect ? "bg-[#dbf881]" : "bg-red-200";
  const textClasses = isCorrect ? "text-green-800" : "text-red-800";
  const Icon = isCorrect ? CheckCircle2 : XCircle;

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-6 ${bannerClasses}`}>
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Icon size={32} className={`mr-4 ${textClasses}`} />
          <div>
            <h3 className={`font-bold text-xl ${textClasses}`}>
              {isCorrect ? "Excellent!" : "Correct solution:"}
            </h3>
            {!isCorrect && <p className={textClasses}>{correctAnswer}</p>}
          </div>
        </div>
        <button
          onClick={() => {
            if (!submitting) onContinue();
          }}
          disabled={submitting}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] ${
            isCorrect ? "bg-green-600" : "bg-red-500"
          } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default function ExercisePage() {
  const { id } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("hidden");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid thread ID.");
      setLoading(false);
      return;
    }

    const lessonId = Number(id);

    const fetchExercises = async () => {
      try {
        const data = await getExercisesByLesson(lessonId);
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [id]);

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  const currentQuestion = exercises[currentQuestionIndex];
  const isAnswerChecked = feedbackState !== "hidden";
  const totalQuestions = exercises.length;

  const handleSelectAnswer = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === currentQuestion.correctAlphabet.letter) {
      setFeedbackState("correct");
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setFeedbackState("incorrect");
    }
  };

  const handleContinue = async() => {
    setFeedbackState("hidden");
    setSelectedAnswer(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const finalScore = Math.round(
        (correctAnswersCount / totalQuestions) * 100
      );
      setScore(finalScore);

      setSubmitting(true);
      setMessage(null);
      setError(null);

      if (!id || isNaN(Number(id))) {
        setError("Invalid thread ID.");
        setLoading(false);
        return;
      }

      const lessonId = Number(id);

      try {
        const progress = await createUserLessonProgress({ lessonId, score });
        setMessage(`Progress saved! Completed at: ${progress.completedAt}`);
      } catch (err) {
        console.error(err);
        setError("Failed to submit progress.");
      } finally {
        setSubmitting(false);
      }

    }
  };

  const getButtonState = (option: string): AnswerState => {
    if (!isAnswerChecked) {
      return selectedAnswer === option ? "selected" : "unanswered";
    }
    if (option === currentQuestion.correctAlphabet.letter) {
      return "correct";
    }
    if (
      option === selectedAnswer &&
      option !== currentQuestion.correctAlphabet.letter
    ) {
      return "incorrect";
    }
    return "unanswered";
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600" onClick={() => navigate("/practice")}>
            <X size={28} />
          </button>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={totalQuestions}
          />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            Which letter is this?
          </h1>

          <div className="mb-8 bg-white p-4 border-2 border-gray-200 rounded-xl h-[50vh]">
            <img
              src={currentQuestion.correctAlphabet.imageUrl}
              alt="Sign language gesture"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-row gap-2 mb-2">
            {currentQuestion.options.map((option) => (
              <ChoiceButton
                key={option.id}
                text={option.alphabet.letter}
                onClick={() => handleSelectAnswer(option.alphabet.letter)}
                state={getButtonState(option.alphabet.letter)}
              />
            ))}
          </div>
        </div>
      </main>

      {isAnswerChecked ? (
        <FeedbackBanner
          state={feedbackState}
          correctAnswer={currentQuestion.correctAlphabet.letter}
          onContinue={handleContinue}
          submitting={submitting}
        />
      ) : (
        <footer className="border-t-2 border-gray-200 p-4">
          <div className="max-w-3xl mx-auto text-right">
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className="bg-[#9188f1] text-white font-bold px-12 py-3 rounded-full shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </div>
        </footer>
      )}
      {message && (
        <div className="text-center p-4">
          <p>{message}</p>
          <p className="text-lg font-bold mt-2">Your score: {score} / 100</p>
        </div>
      )}
    </div>
  );
}
