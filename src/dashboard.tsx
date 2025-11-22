import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import {
  Play,
  Pause,
  Music,
  Volume2,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 🎆 Fireworks (efek elegan futuristis)
const Fireworks: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "50";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }[] = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnFirework() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.5);
      const color = `hsl(${Math.random() * 360},100%,60%)`;
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const speed = Math.random() * 2 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2 + 1,
        });
      }
    }

    let frame: number;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.alpha -= 0.01;
      });
      particles = particles.filter((p) => p.alpha > 0);

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(animate);
    }

    const spawnInterval = setInterval(spawnFirework, 250);
    animate();

    const timeout = setTimeout(() => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(frame);
      document.body.removeChild(canvas);
      onDone();
    }, 2000);

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(frame);
      if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };
  }, [onDone]);

  return null;
};

// 📆 Start date
const START_DATE = new Date("2023-11-23T00:00:00");

// 🗓 Timeline items
const timelineItems = [
  {
    step:   "Oct 2023",
    title:  "Our start",
    desc:   "SERU JUGA YA KEIZORY ORANG NYA",
  },
  {
    step: "23 Nov 2023",
    title: "Day We're Together",
    desc: "LOHH KOK MALAH JADIAN??",
  },
  {
    step: "23 Nov 2024",
    title: "1st Anniv",
    desc: "EHHH SERIUSS SETAHUN ??",
  },
  { step: "23 Nov 2024", title: "2nd Anniv", desc: "Now it has been two years, and I hope this story lasts forever." },
];

// 📷 Photobooth slider dummy data
const photobooth = [
  { img: "/images/photobooth_merah.jpg", desc: "LIATT KAMU CANCII SEKALII" },
  { img: "/images/photobooth_blokm.jpg", desc: "HOHO Black On Black" },
  {
    img: "/images/photobooth_afterschool.jpg",
    desc: "After school photobooth",
  },
  { img: "/images/photobooth_tp.jpg", desc: "AHAHAHA GATAU AKU GABISA GAYA" },
  {
    img: "/images/photobooth_zory.jpg",
    desc: "WOWOWO ULANG TAHUN KAMU INI ADA MAMA SAMA BUNDA",
  },
  {
    img: "/images/validate.jpg",
    desc: "ANAK FUTSAL,ANAK TARII????",
  },
    {
    img: "images/my_birthday.jpg",
    desc: "THANKYOUU FOR SURPRISING ME",
  },
    {
    img: "images/pizza.jpg",
    desc: "MAGANG DI MARZANO CERITANYAA",
  },
];

const notes = [
  "Stay the Keizory I know the one I cherish, now and always.",
  "I know you've been through things that left a mark on you, and I hope you never drown in that sadness again, my love.",
  "I want you to grow into an even better version of yourself the one who reaches every dream you've ever held in your heart.",
];


// ⏳ Kalkulasi lama hubungan
function calcYMDHMS(from: Date, to: Date) {
  let years = 0,
    months = 0;
  const f = new Date(from.getTime());
  while (new Date(f.getFullYear() + 1, f.getMonth(), f.getDate()) <= to) {
    f.setFullYear(f.getFullYear() + 1);
    years++;
  }
  while (new Date(f.getFullYear(), f.getMonth() + 1, f.getDate()) <= to) {
    f.setMonth(f.getMonth() + 1);
    months++;
  }
  let delta = Math.floor((to.getTime() - f.getTime()) / 1000);
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = delta - minutes * 60;
  return { years, months, days, hours, minutes, seconds };
}

const Dashboard: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(1);
  const [now, setNow] = useState<Date>(new Date());
  const [showFireworks, setShowFireworks] = useState(true);

  // slider states
  const [photoIndex, setPhotoIndex] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);

  // letters states
  const [wrongClick, setWrongClick] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerVolume;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (v: number) => {
    if (!audioRef.current) return;
    setPlayerVolume(v);
    audioRef.current.volume = v;
  };

  const handleLetterClick = (index: number) => {
    if (index !== 2) {
      setWrongClick(true);
      setTimeout(() => setWrongClick(false), 2000);
    } else {
      setShowPopup(true);
    }
  };

  const diff = calcYMDHMS(START_DATE, now);

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-900 scroll-smooth relative">
      {showFireworks && <Fireworks onDone={() => setShowFireworks(false)} />}

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
              <span className="text-sm font-semibold">
                Satu Yang Tak Bisa Lepas
              </span>
              <span className="text-xs text-gray-200 mb-2">Reza Artamevia</span>

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
                  className="w-24 accent-pink-400"
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
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-pink-400"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio tag */}
        <audio
          ref={audioRef}
          src="/music/Satu_Yang_Tak_Bisa_Lepas.mp3"
          loop
          autoPlay
        />
      </motion.div>
            
      {/* HERO SECTION */}
      <header className="relative min-h-[100vh] flex flex-col items-center justify-center text-center overflow-hidden px-6 bg-gradient-to-b from-[#e0e7ff] via-[#f0f4ff] to-[#ffe6f2]">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,#c7d2fe_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_80%,#fce7f3_0%,transparent_70%)]"></div>

        {/* Floating hearts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div className="absolute text-pink-400 text-5xl animate-bounce-slow left-[15%] top-[30%]">
            💗
          </div>
          <div className="absolute text-blue-400 text-4xl animate-bounce-slow left-[70%] top-[20%]">
            💙
          </div>
          <div className="absolute text-pink-300 text-3xl animate-bounce-slow left-[50%] top-[60%]">
            💞
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2f2ef7] to-[#9b8bf0]"
        >
          Happy Anniversary, <br className="hidden md:block" /> Keizory 💙
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-base md:text-lg text-[#2b2670] max-w-2xl leading-relaxed"
        >
          With you, it’s been a wonderful mess full of laughter, arguments,
          lessons, and love. We didn’t always get it right, but somehow, we
          always found our way back to each other.
          <span className="block font-semibold text-blue-700 mt-2">
            I love you more than words can say, Keizory.
          </span>
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <a
            href="#counter"
            className="mt-10 inline-block px-8 py-3 bg-gradient-to-r from-blue-700 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
          Let’s Start The Journey
          </a>
        </motion.div>
      </header>

      {/* 🌸 COUNTER SECTION – SMOOTH TRANSITION VERSION 💙 */}
      <section
        id="counter"
        className="relative py-40 px-6 text-center overflow-hidden bg-gradient-to-b from-[#ffe6f2] via-[#f3f5ff] to-[#e0f2ff]"
      >
        {/* Floating gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 w-[28rem] h-[28rem] bg-blue-300/25 rounded-full blur-[140px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[24rem] h-[24rem] bg-pink-300/30 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-500 to-pink-500"
        >
          We’ve Been Together For
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="pt-6 text-base md:text-lg text-blue-600 max-w-xl mx-auto"
        >
          Every heartbeat, every second I’m grateful for you 💞
        </motion.p>

        {/* Counters */}
        <div className="mt-20 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-10 place-items-center">
          {Object.entries(diff).map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.15, rotate: 1 }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="relative group"
            >
              <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700 bg-gradient-to-r from-pink-300 via-blue-300 to-indigo-400 rounded-full scale-125"></div>

              <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center rounded-full bg-white/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.05)] border border-blue-100 transition-all duration-500 hover:shadow-[0_0_45px_rgba(59,130,246,0.35)]">
                <div className="text-3xl md:text-4xl font-bold text-blue-800">
                  {v}
                </div>
                <div className="text-sm md:text-base text-blue-500 capitalize mt-1">
                  {k}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💌 LETTERS SECTION – SMOOTH CONNECTED VERSION 💞 */}
      <section
        id="letters"
        className="relative py-32 text-center overflow-hidden bg-gradient-to-b from-[#e0f2ff] via-[#fdf2f8] to-[#ffe6f2]"
      >
        {/* ✨ Soft background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-[26rem] h-[26rem] bg-pink-200/30 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-[28rem] h-[28rem] bg-blue-200/25 rounded-full blur-[130px] animate-pulse-slow"></div>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-500 to-pink-500"
        >
          Please Read These Letters 
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-blue-600 text-sm md:text-base"
        >
          But you have to choose the right one first 😆
        </motion.p>

        {/* Alert animation */}
        <AnimatePresence>
          {wrongClick && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-100 to-pink-200 border border-pink-300 text-pink-700 px-4 py-2 rounded-lg shadow-md"
            >
              Oops! Wrong letter 😆 Try again~
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter cards */}
        <div className="flex justify-center gap-8 mt-14">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterClick(i)}
              className="relative p-6 rounded-2xl cursor-pointer bg-white/70 backdrop-blur-xl border border-blue-200 shadow-md hover:shadow-2xl transition-all"
            >
              <Mail size={36} className="text-blue-700" />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-200/30 to-pink-200/30 pointer-events-none"
              />
            </motion.div>
          ))}
        </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            onClick={() => setShowPopup(false)}   // klik background → close
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-gradient-to-b from-pink-200/40 to-blue-200/40 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}  // klik dalam popup → jangan close
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
              className="relative max-w-xl w-full mx-4 bg-white/60 backdrop-blur-xl shadow-[0_8px_35px_rgba(0,0,0,0.15)] rounded-3xl border border-white/40 p-10 text-blue-900"
            >
              
            {/* Title */}
            <h4 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-700 to-pink-600 bg-clip-text text-transparent">
              Special Letter 💙
            </h4>

            {/* Content */}
            <div className="text-gray-700 leading-relaxed space-y-5 text-[15.5px]">
              <p>
                Dear Keizory Adzra Davinka,  
                Aku nggak pernah nyangka kita bisa sejauh ini. Dari sesuatu yang mungkin
                awalnya bukan hal yang baik, somehow kita bisa tumbuh sedekat ini,
                dan aku bener-bener nggak nyangka. Tapi ada satu hal yang selalu bikin aku
                yakin aku bisa lihat betapa nyamannya diri aku saat ada kamu.  
                Dari semua jokes aku, sifat aku, sampai kebiasaan-kebiasaan kecil yang kadang
                random, aku merasa kamu adalah satu-satunya tempat di mana aku bisa jadi
                diri sendiri.
              </p>

              <p>
                Aku harap kita bisa saling support satu sama lain untuk reach mimpi kita
                masing-masing. Semoga kita bisa semakin wise dalam ngejalanin hubungan ini.
                Aku yakin kalau kita bisa saling mendukung dan mengerti.  
                All our dreams we can reach them together.
                Hihihihi, katanya mau ke Lake Como sama aku, kan?  
                Aku bakal selalu ngusahain itu. Tapi aku harap yang ngusahain itu bukan cuma aku
                tapi kita.
              </p>

              <p>
                Thank you for making me feel seen, heard, and loved in ways I didn’t even expect.
                Sama kamu, everything feels lighter, softer, and somehow… right.
              </p>

              <p className="font-semibold text-blue-700 text-lg text-center">
                I always love you to the moon and back.  
                <br />Keizory Adzra Davinka 💙
              </p>
            </div>

            {/* Glow Decorative */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      </section>


      {/* 📸 PHOTOBOOTH SECTION */}
      <section
        id="photobooth"
        className="relative py-32 text-center overflow-hidden bg-gradient-to-b from-[#e0f2ff] via-[#fdf2f8] to-[#ffe6f2]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: [0.3, 0.7, 0.3], y: [-10, -30, 0] }}
              transition={{
                repeat: Infinity,
                duration: 10 + i * 2,
                ease: "easeInOut",
              }}
              className="absolute text-pink-300 text-5xl"
              style={{
                left: `${20 + i * 30}%`,
                top: `${25 + i * 15}%`,
              }}
            >
              💞
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-blue-900 mb-3 tracking-tight">
            Our Lovely Photobooths 📸
          </h3>
          <p className="text-base text-blue-600 mb-10">
            “You once said we must take one photobooth every month so here’s
            our little time machine.”
          </p>

          <div className="flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setPhotoIndex((p) => (p - 1 + photobooth.length) % photobooth.length)
              }
              className="bg-white/80 backdrop-blur-md shadow-md border border-blue-100 p-3 rounded-full hover:bg-blue-50 transition-all"
            >
              <ChevronLeft size={26} className="text-blue-700" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={photoIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-[450px] h-[500px] bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden flex flex-col items-center justify-center"
              >
                <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 blur-xl" />
                <img
                  src={photobooth[photoIndex].img}
                  alt={`photo-${photoIndex}`}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute bottom-4 left-0 right-0 text-blue-800 font-medium italic text-sm bg-white/70 backdrop-blur-md py-2">
                  {photobooth[photoIndex].desc}
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhotoIndex((p) => (p + 1) % photobooth.length)}
              className="bg-white/80 backdrop-blur-md shadow-md border border-blue-100 p-3 rounded-full hover:bg-blue-50 transition-all"
            >
              <ChevronRight size={26} className="text-blue-700" />
            </motion.button>
          </div>
        </div>
      </section>


      {/* 💫 OUR JOURNEY + NOTES (Matching Theme) 💫 */}
      <section
        id="journey"
        className="relative py-32 text-center overflow-hidden bg-gradient-to-b from-[#e0f2ff] via-[#fdf2f8] to-[#ffe6f2]"
      >
        {/* Decorative Blur Hearts */}
        <div className="absolute inset-0 bg-[url('/hearts-bg.svg')] bg-cover bg-center opacity-10 pointer-events-none"></div>

      {/* --- OUR JOURNEY --- */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl text-center font-bold text-blue-800"
      >
        Our Journey
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-2 text-center text-base text-blue-500"
      >
        We've been through a lot, but I’d still choose you in every lifetime 💞
      </motion.p>

      <div className="relative max-w-3xl mx-auto mt-16">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-pink-400 shadow-[0_0_15px_#93c5fd] z-0" />

        <div className="space-y-16 relative z-10">
          {timelineItems.map((it, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`flex items-center gap-6 ${
                idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="bg-gradient-to-r from-blue-700 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg z-10">
                {it.step}
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 max-w-sm border border-blue-100">
                <h4 className="text-lg font-bold text-blue-800">{it.title}</h4>
                <p className="mt-2 text-gray-600">{it.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

        {/* 💌 NOTES SLIDER SECTION 💌 */}
        <div id="notes" className="pt-40">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-blue-800 text-center mb-4"
          >
            Little Notes for You 💌
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-blue-500 text-center mb-12"
          >
            Just some reminders of how much I love you, every single day 💙
          </motion.p>

          <div className="flex items-center justify-center gap-6 relative">
            {/* Left Button */}
            <button
              onClick={() =>
                setNoteIndex((p) => (p - 1 + notes.length) % notes.length)
              }
              className="bg-white/70 backdrop-blur-md shadow-md p-3 rounded-full hover:scale-110 transition-transform border border-blue-200"
            >
              <ChevronLeft size={26} className="text-blue-700" />
            </button>

            {/* Note Card */}
            <motion.div
              key={noteIndex}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative bg-white/80 backdrop-blur-lg border border-blue-100 shadow-xl rounded-3xl px-8 py-10 max-w-md text-center"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 to-pink-100/20 rounded-3xl opacity-40"></div>
              <p className="relative text-lg text-blue-800 italic leading-relaxed z-10">
                {notes[noteIndex]}
              </p>

              <div className="mt-6 flex justify-center">
                <span className="text-sm text-blue-400">
                  {noteIndex + 1} / {notes.length}
                </span>
              </div>
            </motion.div>

            {/* Right Button */}
            <button
              onClick={() => setNoteIndex((p) => (p + 1) % notes.length)}
              className="bg-white/70 backdrop-blur-md shadow-md p-3 rounded-full hover:scale-110 transition-transform border border-blue-200"
            >
              <ChevronRight size={26} className="text-blue-700" />
            </button>
          </div>
        </div>
      </section>

      {/* 💙 FOOTER 💙 */}
      <footer className="py-8 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-center text-white relative overflow-hidden">

        {/* Subtle shine animation (masih ada tapi soft) */}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.06)_80%)] animate-[shine_9s_linear_infinite]" />

        <p className="relative z-10 text-sm font-light tracking-wide opacity-90 leading-relaxed">
          Happy Anniversary 💖
        </p>

        <p className="relative z-10 text-xs opacity-80 mt-1">
          Made with love by <span className="font-semibold text-white">Dimas Aryo 💙</span>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
