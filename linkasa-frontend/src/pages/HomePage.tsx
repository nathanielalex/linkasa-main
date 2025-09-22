import React from "react";
import {
  BookOpenCheck,
  Gamepad2,
  Flame,
  Target,
  BookOpen,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { HomeButton } from "@/components/HomeButton";
import { Link } from "react-router-dom";

const FeatureCard = ({
  icon,
  title,
  description,
  image,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: string;
}) => (
  <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200">
    {image ? (
      <img
        src={image}
        alt={`${title} illustration`}
        className="w-24 h-24 mb-6"
      />
    ) : (
      <div className="mb-6 text-[#9188f1]">{icon}</div>
    )}
    <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const HeroSection = () => (
  <section className="relative text-center py-24 md:py-32 px-6 text-white bg-[#2C2A4A] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br bg-[#2C2A4A] opacity-50"></div>
    <div className="relative max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
        Learn Sign Language, The Fun Way.
      </h1>
      <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
        Linkasa makes learning sign language easy and engaging with bite-sized
        lessons, gamified challenges, and a supportive community. Start your
        journey today!
      </p>
      <Link to={"/practice"}>
        <HomeButton variant="primary" className="text-xl px-10 py-4">
          Start Learning for Free
        </HomeButton>
      </Link>
    </div>
  </section>
);

const FeatureHighlights = () => (
  <section id="features" className="bg-slate-50 py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800">
          Why You'll Love Linkasa
        </h2>
        <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
          We've designed a learning experience that's effective, motivating, and
          fun.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BookOpenCheck size={48} />}
          title="Interactive Lessons"
          description="Learn through fun, visual exercises that make signing second nature."
        />
        <FeatureCard
          icon={<Gamepad2 size={48} />}
          title="Gamified Milestones"
          description="Unlock the next level, and climb the leaderboards as you progress."
        />
        <FeatureCard
          icon={<Flame size={48} />}
          title="Track Your Progress"
          description="Beat your past score and watch your progress grow."
        />
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 px-6 bg-[#2C2A4A] text-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold">How It Works</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Start your language learning journey in three simple steps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-600 border-t-2 border-dashed -translate-y-20"></div>

        <div className="text-center space-y-4 z-10">
          <div className="w-24 h-24 bg-[#9188f1] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-500">
            <Target className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-[#dbf881]">
            1. Learn & Practice
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Learn with our flashcards, then reinforce your learning through fun,
            hands-on exercises.
          </p>
        </div>

        <div className="text-center space-y-4 z-10">
          <div className="w-24 h-24 bg-[#9188f1] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-500">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-[#dbf881]">
            2. Take the Quiz
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Test your knowledge in our timed quiz. The faster you are, the
            higher you climb on the leaderboard!
          </p>
        </div>

        <div className="text-center space-y-4 z-10">
          <div className="w-24 h-24 bg-[#9188f1] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-500">
            <HeartHandshake className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-[#dbf881]">
            3. Join the Community
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Ask questions, share tips, and support other learners in our
            community forum.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section id="community" className="bg-slate-50 py-20 px-6 text-center">
    <div className="max-w-3xl mx-auto">
      <MessageCircle size={64} className="mx-auto mb-6 text-[#9188f1]" />
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
        Ready to Start Signing?
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Join thousands of learners and begin your sign language journey today.
        It's free!
      </p>
      <Link to={"/practice"}>
        <HomeButton variant="secondary" className="text-xl px-10 py-4">
          Get Started Now
        </HomeButton>
      </Link>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="bg-[#2C2A4A]">
      <Header />
      <main>
        <HeroSection />
        <FeatureHighlights />
        <HowItWorksSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
