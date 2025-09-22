import React, { useEffect, useState } from "react";
import { X, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { getFlashcards, type Flashcard } from "@/api/flashcard";
import { useNavigate } from "react-router-dom";

const Flashcard = ({
  frontContent,
  backContent,
  isFlipped,
}: {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
}) => {
  return (
    <div className="w-full h-full" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          {frontContent}
        </div>
        <div
          className="absolute w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-[#dbf881] text-black font-bold px-8 py-3 rounded-full shadow-[0px_3px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[0px_3px_0px_0px_rgba(0,0,0,0.2)]"
    >
      {children}
    </button>
  );
};

export default function FlashcardPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards();
        setFlashcards(data);
      } catch (err) {
        console.error("Failed to fetch flashcards:", err);
        setError("Failed to load flashcards.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  if (loading) return <p>Loading flashcards...</p>;
  if (error) return <p>{error}</p>;

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev - 1);
      }, 150);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="bg-[#9188f1] min-h-screen flex flex-col text-white">
      <header className="p-4 w-full max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <button className="text-white opacity-70 hover:opacity-100 cursor-pointer" onClick={() => navigate("/practice")}>
          <X size={28} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        <p className="text-xl font-semibold">
          {currentCardIndex + 1} / {totalCards}
        </p>

        <div
          className="w-full max-w-lg h-72 md:h-80 cursor-pointer"
          onClick={handleFlip}
        >
          <Flashcard
            isFlipped={isFlipped}
            frontContent={
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <img
                  src={currentCard.alphabet.imageUrl}
                  alt={`Sign for ${currentCard.alphabet.letter}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            }
            backContent={
              <div className="text-center">
                <p className="text-5xl font-bold text-gray-800">
                  {currentCard.alphabet.letter}
                </p>
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <RotateCw size={16} /> Click to flip
        </div>

        <div className="flex items-center justify-center space-x-6">
          <NavButton onClick={handlePrev} disabled={currentCardIndex === 0}>
            <div className="flex items-center gap-2">
              <ArrowLeft size={20} />
              <span>Prev</span>
            </div>
          </NavButton>
          <NavButton
            onClick={handleNext}
            disabled={currentCardIndex === totalCards - 1}
          >
            <div className="flex items-center gap-2">
              <span>Next</span>
              <ArrowRight size={20} />
            </div>
          </NavButton>
        </div>
      </main>
    </div>
  );
}
