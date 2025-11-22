// src/NoThanks.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./index.css"; // pastikan Tailwind + font Poppins sudah di-import

interface Emoji {
  id: number;
  x: number;
  y: number;
}

const GRADIENT = "bg-gradient-to-r from-[#2f2ef7] to-[#9b8bf0]";

const NoThanks: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(1);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const navigate = useNavigate();

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Volume handler
  const handleVolumeChange = (val: number) => {
    setPlayerVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  // Autoplay attempt
  useEffect(() => {
    const tryPlay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch {
        console.log("Autoplay diblokir browser, user harus klik dulu.");
      }
    };
    tryPlay();
  }, []);

  // Efek emoji 😢
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newEmoji: Emoji = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setEmojis((prev) => [...prev, newEmoji]);
      setTimeout(() => {
        setEmojis((prev) => prev.filter((em) => em.id !== newEmoji.id));
      }, 1500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative font-poppins overflow-hidden">
      <title>jahat kamu ayyy</title>

      {/* Audio */}
      <audio ref={audioRef} src="/music/ocean_engines.mp3" loop />

      {/* Emoji 😢 */}
      {emojis.map((emoji) => (
        <motion.span
          key={emoji.id}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute pointer-events-none select-none text-2xl"
          style={{ top: emoji.y, left: emoji.x }}
        >
          😢
        </motion.span>
      ))}

      {/* 🎵 MUSIC PLAYER - LUXURY ROMANTIC EDITION 💙 */}
      <motion.div
        onClick={() => setPlayerExpanded((p) => !p)}
        layout
        transition={{ layout: { duration: 0.45, ease: "easeInOut" } }}
        className="fixed top-6 right-6 z-50 bg-gradient-to-br from-blue-700/90 via-blue-600/80 to-pink-400/70 backdrop-blur-xl 
                   rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 cursor-pointer text-white border border-white/20 hover:shadow-blue-300/40 transition-all"
      >
        {/* Glow circle icon */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            repeat: isPlaying ? Infinity : 0,
            duration: 8,
            ease: "linear",
          }}
          className="rounded-full bg-gradient-to-r from-blue-500 to-pink-400 p-2 shadow-md flex items-center justify-center"
        >
          <Music className="text-white" size={20} />
        </motion.div>

        {/* Play / Pause Button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="text-white font-medium bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-md transition"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </motion.button>

        {/* Animated song info */}
        <AnimatePresence>
          {playerExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col text-left pr-3"
            >
              <span className="text-sm font-semibold">Ocean & Engines</span>
              <span className="text-xs text-gray-200 mb-2">NIKI</span>

              {/* Volume & Progress */}
              <div className="flex items-center gap-2">
                <Volume2 size={14} className="text-white/80" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={playerVolume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-24 accent-pink-400 cursor-pointer"
                />
              </div>

              {/* Progress bar */}
              <motion.div
                layout
                className="mt-2 w-full h-[4px] bg-white/20 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isPlaying ? "100%" : "0%" }}
                  transition={{
                    duration: 8,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "linear",
                  }}
                  className="h-full bg-gradient-to-r from-blue-400 to-pink-400"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio tag */}
        <audio
          ref={audioRef}
          src="/music/ocean_engines.mp3"
          loop
          autoPlay
        />
      </motion.div>

      {/* Main Content */}
      <main className="text-center mt-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`font-extrabold text-[2.5rem] md:text-[4rem] leading-tight mb-4 ${GRADIENT} bg-clip-text text-transparent`}
        >
          Jahat Banget
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className={`font-extrabold text-[2.5rem] md:text-[4rem] leading-tight mb-8 ${GRADIENT} bg-clip-text text-transparent`}
        >
          Kamu Sumpah :(
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => navigate("/validate")}
          className="rounded-full border-2 border-[#2f2ef7] text-[#2f2ef7] px-6 py-2 font-medium hover:bg-[#f8f7ff]"
        >
          iya iya aku buka
        </motion.button>
      </main>
    </div>
  );
};

export default NoThanks;
