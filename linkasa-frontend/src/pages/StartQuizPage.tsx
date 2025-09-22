import { Clock, Type, CheckSquare, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuizStartMenu() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-xl p-6 shadow-xl text-center">
          <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center bg-[#dbf881] rounded-full">
            <Award size={48} className="text-black" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Final Quiz</h1>
          <p className="text-gray-600 text-sm mb-6">
            Time to test your knowledge of the ASL alphabet!
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
              How It Works
            </h2>
            {[
              {
                icon: <CheckSquare size={16} />,
                text: "You will be shown a sign for a letter from the alphabet.",
              },
              {
                icon: <Type size={16} />,
                text: "Your task is to type the single correct letter into the input box.",
              },
              {
                icon: <Clock size={16} />,
                text: "A timer will start as soon as you begin. Try to be quick and accurate!",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-[#9188f1]/20 text-[#9188f1] rounded-full">
                  {item.icon}
                </div>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/quiz")}
            className="cursor-pointer w-full bg-[#dbf881] text-black font-bold text-base py-3 rounded-full shadow-[0px_3px_0px_0px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-[2px] active:translate-y-0 active:shadow-none"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
