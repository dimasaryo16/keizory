import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants, Transition } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./index.css";
import type { HTMLMotionProps } from "framer-motion";

// --- GRADIENT UTAMA ---
const GRADIENT = "bg-gradient-to-r from-[#2f2ef7] to-[#9b8bf0]";

// --- ANIMASI TEKS ---
const textVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: (custom = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: custom, duration: 0.8, ease: "easeOut" },
  }),
};

type CTAButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "outline";
};

const CTAButton: React.FC<CTAButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...rest
}) => {
  const hover = { scale: 1.05, y: -2 };
  const tap = { scale: 0.95 };

  // FIX: Transition harus pakai type Transition
  const transition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
  };

  if (variant === "primary") {
    return (
      <motion.button
        whileHover={hover}
        whileTap={tap}
        transition={transition}
        {...rest}
        className={`rounded-full px-8 py-3 text-white font-semibold shadow-lg text-sm md:text-base ${className}`}
        style={{
          background: "linear-gradient(90deg,#261be6,#3b2cf2)",
          boxShadow: "0 4px 20px rgba(59,44,242,0.3)",
        }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={hover}
      whileTap={tap}
      transition={transition}
      {...rest}
      className={`rounded-full px-6 py-2 border-2 border-[#3b2cf2] text-[#3b2cf2] font-semibold bg-transparent hover:bg-[#f8f7ff] text-sm md:text-base ${className}`}
    >
      {children}
    </motion.button>
  );
};

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
        <motion.div
          key={love.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed pointer-events-none z-[9999]"
          style={{
            top: love.y,
            left: love.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-red-500 text-lg md:text-2xl select-none">
            ❤️
          </span>
        </motion.div>
      ))}
    </>
  );
};

// --- KOMPONEN UTAMA ---
const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-poppins">
      <LoveTrail />

      <main className="w-full px-6 md:px-10 lg:px-24 text-center">
        <section className="max-w-5xl mx-auto">
          <motion.h1
            variants={textVariant}
            initial="hidden"
            animate="show"
            custom={0.2}
            className={`font-extrabold leading-tight mb-4 text-[2.5rem] md:text-[5rem] lg:text-[6rem] tracking-tight ${GRADIENT} bg-clip-text text-transparent`}
          >
            Hi Keizory Adzra
          </motion.h1>

          <motion.h2
            variants={textVariant}
            initial="hidden"
            animate="show"
            custom={0.5}
            className={`font-extrabold leading-tight mb-6 text-[3rem] md:text-[6rem] lg:text-[7rem] tracking-tight ${GRADIENT} bg-clip-text text-transparent`}
          >
            Davinka
          </motion.h2>

          <motion.p
            variants={textVariant}
            initial="hidden"
            animate="show"
            custom={0.9}
            className="text-sm md:text-base text-[#2b2670] mb-10"
          >
            I Have Something For You, Do You Wanna See?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
            className="flex justify-center gap-4"
          >
            <CTAButton variant="primary" onClick={() => navigate("/validate")}>
              Yes, Please 💌
            </CTAButton>
            <CTAButton variant="outline" onClick={() => navigate("/no_thanks")}>
              No, Thanks 💔
            </CTAButton>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default App;
