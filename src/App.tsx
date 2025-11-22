import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

// --- GRADIENT UTAMA ---
const GRADIENT = "bg-gradient-to-r from-[#2f2ef7] to-[#9b8bf0]";

// --- EFEK LOVE TRAIL ---
type Love = { id: number; x: number; y: number };

const LoveTrail: React.FC = () => {
  const [loves, setLoves] = useState<Love[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const newLove = { id: Date.now(), x: e.clientX, y: e.clientY };
      setLoves((prev) => [...prev, newLove]);

      setTimeout(() => {
        setLoves((prev) => prev.filter((love) => love.id !== newLove.id));
      }, 800);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {loves.map((love) => (
        <div
          key={love.id}
          className="fixed pointer-events-none z-[9999] heart-pop"
          style={{
            top: love.y,
            left: love.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-red-500 text-lg md:text-2xl select-none">
            ❤️
          </span>
        </div>
      ))}
    </>
  );
};

// --- TOMBOL ---
type CTAButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

const CTAButton: React.FC<CTAButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...rest
}) => {
  const baseClass =
    "rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95";

  if (variant === "primary") {
    return (
      <button
        {...rest}
        className={`${baseClass} px-8 py-3 text-white shadow-lg text-sm md:text-base ${className}`}
        style={{
          background: "linear-gradient(90deg,#261be6,#3b2cf2)",
          boxShadow: "0 4px 20px rgba(59,44,242,0.3)",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...rest}
      className={`${baseClass} px-6 py-2 border-2 border-[#3b2cf2] text-[#3b2cf2] bg-transparent hover:bg-[#f8f7ff] text-sm md:text-base ${className}`}
    >
      {children}
    </button>
  );
};

// --- KOMPONEN UTAMA ---
const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-poppins">
      <LoveTrail />

      <main className="w-full px-6 md:px-10 lg:px-24 text-center fade-in">
        <section className="max-w-5xl mx-auto">
          <h1
            className={`font-extrabold leading-tight mb-4 text-[2.5rem] md:text-[5rem] lg:text-[6rem] tracking-tight ${GRADIENT} bg-clip-text text-transparent slide-up`}
            style={{ animationDelay: "0.2s" }}
          >
            Hi Keizory Adzra
          </h1>

          <h2
            className={`font-extrabold leading-tight mb-6 text-[3rem] md:text-[6rem] lg:text-[7rem] tracking-tight ${GRADIENT} bg-clip-text text-transparent slide-up`}
            style={{ animationDelay: "0.5s" }}
          >
            Davinka
          </h2>

          <p
            className="text-sm md:text-base text-[#2b2670] mb-10 slide-up"
            style={{ animationDelay: "0.9s" }}
          >
            I Have Something For You, Do You Wanna See?
          </p>

          <div
            className="flex justify-center gap-4 opacity-0 animate-fadeScale"
            style={{ animationDelay: "1.2s" }}
          >
            <CTAButton variant="primary" onClick={() => navigate("/validate")}>
              Yes, Please 💌
            </CTAButton>
            <CTAButton variant="outline" onClick={() => navigate("/no_thanks")}>
              No, Thanks 💔
            </CTAButton>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
