// Validate.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // untuk redirect

const PASSWORD = "231123"; // password statis

const Validate: React.FC = () => {
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(
    "You will never forget our anniversary, right?"
  );
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePress = (num: string) => {
    if (input.length >= PASSWORD.length) return;
    const newInput = input + num;
    setInput(newInput);

    if (newInput.length === PASSWORD.length) {
      if (newInput === PASSWORD) {
        setSuccess(true);
        setHint("Welcome 💜");
        setError(false);

        // redirect ke landing setelah sedikit delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(true);
        setHint("OH NOOO YOU FORGETT??");
        setTimeout(() => {
          setError(false);
          setInput("");
          setHint("You will never forget our anniversary, right?");
        }, 1500);
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setHint("You will never forget our anniversary, right?");
    setError(false);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#5c6bc0] font-poppins relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex items-center gap-10 border border-white/20">
        {/* Foto */}
        <div className="flex-shrink-0">
          <img
            src="/images/validate.jpg" // taruh di public/images/
            alt="profile"
            className="w-44 h-44 object-cover rounded-full shadow-lg border-4 border-white/30"
          />
        </div>

        {/* Keypad & Input */}
        <div className="text-center text-white w-72">
          <h2 className="text-xl font-semibold mb-4 tracking-wide">
            Enter The Passcode
          </h2>

          {/* Kolom Input / Hint */}
          <motion.div
            key={hint + input}
            animate={
              error ? { x: [-12, 12, -12, 12, 0] } : { scale: [0.95, 1] }
            }
            transition={{ duration: 0.5 }}
            className={`rounded-lg py-3 px-4 mb-5 min-h-[48px] flex items-center justify-center text-base font-medium shadow-lg
              ${
                success
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : error
                  ? "bg-red-100 text-red-600 border border-red-300"
                  : "bg-white/90 text-gray-800 border border-gray-200"
              }`}
          >
            {input.length > 0 && !success && !error
              ? "●".repeat(input.length) // password dots
              : hint}
          </motion.div>

          {/* Animasi teks error ekstra */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="text-red-400 font-bold text-sm mb-4"
              >
                OH NOOO YOU FORGETT?? 😢
              </motion.p>
            )}
          </AnimatePresence>

          {/* Keypad grid */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handlePress(n.toString())}
                className="bg-white/90 text-[#1a237e] font-bold rounded-xl py-4 text-lg shadow-md hover:bg-white transition"
              >
                {n}
              </button>
            ))}
            {/* Clear button */}
            <button
              onClick={handleClear}
              className="bg-white/90 text-red-500 font-bold rounded-xl py-4 text-lg shadow-md hover:bg-red-50 transition"
            >
              ⌫
            </button>
            <button
              onClick={() => handlePress("0")}
              className="bg-white/90 text-[#1a237e] font-bold rounded-xl py-4 text-lg shadow-md hover:bg-white transition"
            >
              0
            </button>
            <div />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-white/70">
        Made with 💙 by Loved, Dimas Aryo
      </p>
    </div>
  );
};

export default Validate;
