import { useEffect, useState } from "react";
import { X, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createFinalQuizAttempt, getFinalQuizQuestions, type FinalQuizAnswer, type FinalQuizAttemptRequest, type Quiz } from "@/api/quiz";
import { useNavigate } from "react-router-dom";

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

const FeedbackBanner = ({
  state,
  correctAnswer,
  onContinue,
}: {
  state: FeedbackState;
  correctAnswer: string;
  onContinue: () => void;
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
            onContinue();
          }}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-[0px_2px_0px_0px_rgba(0,0,0,0.2)] ${
            isCorrect ? "bg-green-600" : "bg-red-500"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("hidden");

  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<FinalQuizAnswer[]>([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getFinalQuizQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch quiz questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (quizFinished) return;

    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizFinished]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>{error}</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswerChecked = feedbackState !== "hidden";
  const totalQuestions = questions.length;

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    const trimmedAnswer = selectedAnswer.trim().toUpperCase();
    const correct = currentQuestion.correctAlphabet.letter.toUpperCase();
    const isCorrect = trimmedAnswer === correct;

    const answer: FinalQuizAnswer = {
      questionNumber: currentQuestionIndex + 1,
      alphabetId: currentQuestion.correctAlphabet.id,
      userAnswer: selectedAnswer,
      isCorrect: isCorrect,
    };
    setUserAnswers((prev) => [...prev, answer]);

    if (isCorrect) {
      setFeedbackState("correct");
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setFeedbackState("incorrect");
    }
  };

  const handleContinue = async () => {
    setFeedbackState("hidden");
    setSelectedAnswer(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      const finalScore = Math.round(
        (correctAnswersCount / totalQuestions) * 100
      );
      setScore(finalScore);

      const finalAnswerPayload = [...userAnswers];
      if (userAnswers.length === totalQuestions - 1) {
        const lastAnswerIsCorrect =
          selectedAnswer?.trim().toUpperCase() ===
          currentQuestion.correctAlphabet.letter.toUpperCase();
        finalAnswerPayload.push({
          questionNumber: totalQuestions,
          alphabetId: currentQuestion.correctAlphabet.id,
          userAnswer: selectedAnswer || "",
          isCorrect: lastAnswerIsCorrect,
        });
      }

      const payload: FinalQuizAttemptRequest = {
        score: finalScore,
        completionTime: elapsedTime,
        answers: finalAnswerPayload,
      };

      setSubmitting(true);
      setMessage(null);
      setError(null);

      try {
        const response = await createFinalQuizAttempt(payload);
        setMessage(`Quiz submitted successfully! Score: ${response.score}%`);
      } catch (err) {
        setError("Failed to submit your quiz attempt. Please try again.");
        console.error("Failed to create final quiz attempt", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
          {submitting ? (
            <p className="text-lg">Submitting your results...</p>
          ) : (
            <>
              <p className="text-lg mb-2">Your final score is:</p>
              <p className="text-5xl font-bold text-[#9188f1] mb-4">{score}%</p>
              <p className="text-gray-600 mb-6">
                Completion Time: {formatTime(elapsedTime)}
              </p>
              {message && (
                <p className="text-green-600 bg-green-100 p-3 rounded-md">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-600 bg-red-100 p-3 rounded-md">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600" onClick={() => navigate("/start-quiz")}>
            <X size={28} />
          </button>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={totalQuestions}
          />
          <div className="flex items-center gap-2 text-gray-600 font-semibold w-20">
            <Clock size={20} />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            What letter is this?
          </h1>

          <div className="mb-8 bg-white p-4 border-2 border-gray-200 rounded-xl h-[50vh]">
            <img
              src={currentQuestion.correctAlphabet.imageUrl}
              alt="Sign language gesture"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-row gap-2 mb-2">
            <Input
              type="text"
              maxLength={1}
              placeholder="Type the letter"
              value={selectedAnswer ?? ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (/^[A-Z]?$/.test(value)) {
                  setSelectedAnswer(value);
                }
              }}
              disabled={isAnswerChecked}
              className={`w-48 h-24 mx-auto text-5xl font-bold text-center ${
                isAnswerChecked
                  ? selectedAnswer === currentQuestion.correctAlphabet.letter
                    ? "border-green-500 text-green-800"
                    : "border-red-500 text-red-800"
                  : "border-gray-300"
              } border-2 rounded-2xl outline-none transition-all`}
              autoFocus
            />
          </div>
        </div>
      </main>

      {isAnswerChecked ? (
        <FeedbackBanner
          state={feedbackState}
          correctAnswer={currentQuestion.correctAlphabet.letter}
          onContinue={handleContinue}
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
    </div>
  );
}
