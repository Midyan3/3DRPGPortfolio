"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface Skill {
  name: string;
  value: number;
  color: string;
  nightModeColor?: string;
}

interface EquipmentItem {
  name: string;
  type: string;
  rarity: string;
  stat: string;
}

interface Quest {
  name: string;
  status: string;
  exp: number;
}

interface LoreStory {
  title: string;
  level: number;
  description: string;
  date: string;
}

interface CharacterStats {
  level: number;
  exp: number;
  hp: number;
  mp: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  vitality: number;
  luck: number;
}

interface RPGStatsProps {
  isVisible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  isNightMode?: boolean;
}

export default function RPGStats(props: RPGStatsProps) {
  const isVisible = props.isVisible ?? false;
  const isNightMode = props.isNightMode ?? false;
  const onClose = props.onClose;

  const [activeTab, setActiveTab] = useState("skills");
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>(
    {},
  );
  const [showStats, setShowStats] = useState(true);
  const [inInventory, setInInventory] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [openLoreIndex, setOpenLoreIndex] = useState<number | null>(null);

  const characterStats: CharacterStats = {
    level: 25,
    exp: 80,
    hp: 920,
    mp: 750,
    strength: 65,
    intelligence: 88,
    dexterity: 78,
    vitality: 70,
    luck: 45,
  };

  const skills: Skill[] = useMemo(
    () => [
      {
        name: "TypeScript/JavaScript",
        value: 92,
        color: "#3178C6",
        nightModeColor: "#4A8FFF",
      },
      {
        name: "Backend Development",
        value: 85,
        color: "#1565C0",
        nightModeColor: "#549BFF",
      },
      {
        name: "React & Angular",
        value: 80,
        color: "#61DAFB",
        nightModeColor: "#61DBFF",
      },
      {
        name: "Cloud & DevOps",
        value: 75,
        color: "#FF9900",
        nightModeColor: "#C47CFF",
      },
      {
        name: "Computer Vision",
        value: 70,
        color: "#9C27B0",
        nightModeColor: "#7E4DFF",
      },
      {
        name: "Database Systems",
        value: 65,
        color: "#00ACC1",
        nightModeColor: "#56C4FF",
      },
      {
        name: "Operating Systems",
        value: 62,
        color: "#4B0082",
        nightModeColor: "#7C4DFF",
      },
      {
        name: "UI/UX Design",
        value: 58,
        color: "#E91E63",
        nightModeColor: "#9859FF",
      },
      {
        name: "Machine Learning",
        value: 45,
        color: "#7B1FA2",
        nightModeColor: "#6E5DC6",
      },
    ],
    [],
  );

  const equipment: EquipmentItem[] = [
    {
      name: "Angular + TypeScript",
      type: "Legendary Sword",
      rarity: "Legendary",
      stat: "+40 Frontend Mastery",
    },
    {
      name: "Golang + GraphQL",
      type: "Enchanted Staff",
      rarity: "Legendary",
      stat: "+35 Backend Architecture",
    },
    {
      name: "AWS Services",
      type: "Celestial Armor",
      rarity: "Epic",
      stat: "+30 Cloud Infrastructure",
    },
    {
      name: "Docker",
      type: "Mythical Shield",
      rarity: "Epic",
      stat: "+25 Deployment Defense",
    },
    {
      name: "React",
      type: "Arcane Bow",
      rarity: "Epic",
      stat: "+30 UI Precision",
    },
    {
      name: "MongoDB + PostgreSQL",
      type: "Dual Daggers",
      rarity: "Epic",
      stat: "+28 Data Management",
    },
    {
      name: "Computer Vision",
      type: "Far-sight Lens",
      rarity: "Rare",
      stat: "+25 3D Reconstruction",
    },
    {
      name: "OAuth2 + JWT",
      type: "Sacred Amulet",
      rarity: "Rare",
      stat: "+22 Authentication",
    },
  ];

  const quests: Quest[] = [
    { name: "Build LeagueOS Platform", status: "Completed", exp: 3500 },
    { name: "Master Operating Systems Theory", status: "Completed", exp: 2500 },
    {
      name: "Explore DeepSDF Model Research",
      status: "In Progress",
      exp: 2200,
    },
    {
      name: "Create Spotify Visualization Tool",
      status: "Completed",
      exp: 1800,
    },
    { name: "Construct CLANOTEA Platform", status: "Completed", exp: 2600 },
    { name: "Design 3D Interactive Resume", status: "Completed", exp: 2000 },
    { name: "Optimize System Performance", status: "Recurring", exp: 800 },
    {
      name: "Integrate Third-Party API Systems",
      status: "Recurring",
      exp: 750,
    },
    { name: "Complete Master's Preparation", status: "In Progress", exp: 3000 },
  ];

  const lore: LoreStory[] = [
    {
      title: "Academic Foundations",
      level: 1,
      description:
        "Started my computer science journey at CUNY Hunter College, diving into the math and theory that would become the backbone of my technical approach to problem-solving.",
      date: "2021-08-25",
    },
    {
      title: "First Industry Experience",
      level: 5,
      description:
        "Cut my teeth at IT Universum as an intern, where I helped reduce system downtime by 80% through hands-on troubleshooting and maintenance optimization.",
      date: "2021-07-01",
    },
    {
      title: "Diving into Research",
      level: 10,
      description:
        "Joined a computational vision research team exploring DeepSDF models for 3D reconstruction, bridging the gap between theoretical concepts and real-world applications.",
      date: "2024-06-01",
    },
    {
      title: "Teaching & Knowledge Sharing",
      level: 15,
      description:
        "Became a teaching assistant for advanced CS courses, helping fellow students tackle complex concepts in computer theory and operating systems while reinforcing my own understanding.",
      date: "2024-09-01",
    },
    {
      title: "LeagueOS Platform Launch",
      level: 20,
      description:
        "Built and deployed LeagueOS from the ground up, a full-stack OS-inspired web platform using Angular, TypeScript, and Golang that now serves over 120 users with 95.7% uptime.",
      date: "2024-09-15",
    },
    {
      title: "Exploring User-Centered Tools",
      level: 23,
      description:
        "Developed targeted React applications including a Spotify data visualization tool and a task management system, focusing on responsive design and seamless API integration.",
      date: "2023-11-01",
    },
    {
      title: "Building Community Platforms",
      level: 24,
      description:
        "Created CLANOTEA, a collaborative platform supporting 175+ users with real-time note sharing and editing capabilities, secured with comprehensive authentication systems.",
      date: "2024-01-15",
    },
    {
      title: "Continuous Evolution",
      level: 25,
      description:
        "Constantly expanding my technical toolkit across the full development stack, from low-level systems to cloud infrastructure and modern frontend frameworks.",
      date: "2025-01-01",
    },
  ];

  const openBook = () => {
    setIsOpening(true);
    const openAudio = new Audio("Audio/OpenBook.mp3");
    openAudio.volume = 0.3;
    openAudio.playbackRate = 1.6;
    openAudio.play().catch((err) => console.log("Audio play failed:", err));
    setTimeout(() => {
      setInInventory(false);
      setPosition({
        x: Math.max(window.innerWidth / 4, 100),
        y: Math.max(window.innerHeight / 2 - 250, 50),
      });
      setTimeout(() => {
        setIsOpening(false);
      }, 600);
    }, 400);
  };

  const closeBook = () => {
    setIsClosing(true);
    const closeAudio = new Audio("Audio/CloseBook.mp3");
    closeAudio.volume = 0.3;
    closeAudio.playbackRate = 1.2;
    closeAudio.play().catch((err) => console.log("Audio play failed:", err));
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 100);

    setTimeout(() => {
      setInInventory(true);
      setPosition({ x: 0, y: 0 });
      setTimeout(() => {
        setIsClosing(false);
      }, 400);
    }, 600);
  };

  useEffect(() => {
    console.log("Effect triggered:", {
      isVisible,
      inInventory,
      isOpening,
      isClosing,
    });

    if (isVisible && inInventory && !isOpening && !isClosing) {
      console.log("Opening book");
      openBook();
    } else if (!isVisible && !inInventory && !isClosing && !isOpening) {
      console.log("Closing book");
      closeBook();
    }
  }, [isVisible, inInventory, isOpening, isClosing]);

  useEffect(() => {
    if (!inInventory) {
      const timers = skills.map((skill, index) => {
        return setTimeout(
          () => {
            setAnimatedStats((prev) => ({
              ...prev,
              [skill.name]: skill.value,
            }));
          },
          600 + index * 100,
        );
      });

      return () => timers.forEach((timer) => clearTimeout(timer));
    } else {
      setAnimatedStats({});
    }
  }, [inInventory, skills]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(".drag-handle")) {
      e.preventDefault();
      setIsDragging(true);

      const container = e.currentTarget as HTMLElement;
      const rect = container.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      if (newX < 120) {
        setIsDragging(false);
        closeBook();
      } else {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleTabClick = (tab: string) => {
    const switchPage = new Audio("Audio/PageTurning.mp3");
    switchPage.volume = 0.1;
    switchPage.playbackRate = 1.0;
    switchPage.play().catch((err) => console.log("Audio play failed:", err));
    setActiveTab(tab);
  };

  const getSkillLevelText = (value: number): string => {
    if (value < 20) return "Novice";
    if (value < 40) return "Apprentice";
    if (value < 60) return "Adept";
    if (value < 80) return "Expert";
    return "Master";
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none">
      <AnimatePresence>
        {!inInventory && !isClosing && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
            className="fixed left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div
              className={`h-96 w-8 bg-gradient-to-l ${
                isNightMode ? "from-indigo-900/30" : "from-amber-900/30"
              } to-transparent rounded-l-sm opacity-70 transition-colors duration-1000`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed group left-0 top-1/2 -translate-y-1/2 z-40">
        <div
          className={`w-16 h-96 rounded-r-md shadow-xl cursor-pointer pointer-events-auto relative overflow-hidden group hover:scale-105 transition-all duration-300 ${
            isOpening || isClosing || !inInventory
              ? "pointer-events-none opacity-90"
              : "opacity-100"
          }`}
          onClick={() => {
            if (inInventory && !isOpening && !isClosing) {
              if (props.onOpen) {
                props.onOpen();
              }
              openBook();
            }
          }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              isNightMode
                ? "from-indigo-900 to-indigo-800"
                : "from-amber-900 to-amber-800"
            } transition-colors duration-1000`}
          ></div>

          <div className="absolute inset-0 opacity-30">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='${isNightMode ? "%234f46e5" : "%23d97706"}' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          <div className="absolute inset-0">
            <div
              className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-b ${
                isNightMode
                  ? "from-indigo-400 to-indigo-500"
                  : "from-amber-400 to-amber-500"
              } opacity-70 transition-colors duration-1000`}
            ></div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t ${
                isNightMode
                  ? "from-indigo-400 to-indigo-500"
                  : "from-amber-400 to-amber-500"
              } opacity-70 transition-colors duration-1000`}
            ></div>

            <div
              className={`absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b ${
                isNightMode
                  ? "from-indigo-300 via-indigo-500 to-indigo-300"
                  : "from-amber-300 via-amber-500 to-amber-300"
              } transition-colors duration-1000`}
            ></div>

            <div className="absolute top-8 left-0 right-0 flex justify-center">
              <div
                className={`w-8 h-8 rounded-full border-2 ${
                  isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                } flex items-center justify-center transition-colors duration-1000`}
              >
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${
                    isNightMode
                      ? "from-indigo-300 to-indigo-500"
                      : "from-amber-300 to-amber-500"
                  } rounded-full transition-colors duration-1000`}
                ></div>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div
                className={`w-8 h-8 rounded-full border-2 ${
                  isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                } flex items-center justify-center transition-colors duration-1000`}
              >
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${
                    isNightMode
                      ? "from-indigo-300 to-indigo-500"
                      : "from-amber-300 to-amber-500"
                  } rounded-full transition-colors duration-1000`}
                ></div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
              <div
                className={`absolute inset-0 rounded-full border-2 ${
                  isNightMode
                    ? "border-indigo-300/90 bg-gradient-to-br from-indigo-700 to-indigo-900"
                    : "border-amber-300/90 bg-gradient-to-br from-amber-700 to-amber-900"
                } flex items-center justify-center transition-colors duration-1000`}
              >
                <div
                  className={`w-8 h-8 rounded-full border ${
                    isNightMode ? "border-indigo-400/60" : "border-amber-400/60"
                  } flex items-center justify-center overflow-hidden transition-colors duration-1000`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-6 h-6 bg-gradient-to-br ${
                        isNightMode
                          ? "from-indigo-400/80 to-indigo-600/80"
                          : "from-amber-400/80 to-amber-600/80"
                      } rounded-full transition-colors duration-1000`}
                    ></div>
                    <div
                      className={`absolute w-5 h-5 border-2 ${
                        isNightMode
                          ? "border-indigo-300/60"
                          : "border-amber-300/60"
                      } rounded-full transition-colors duration-1000`}
                    ></div>
                    <div
                      className={`absolute w-3 h-3 ${
                        isNightMode ? "bg-indigo-300/80" : "bg-amber-300/80"
                      } rounded-full animate-pulse transition-colors duration-1000`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0">
            <div
              className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-8 ${
                isNightMode ? "bg-blue-300/30" : "bg-amber-300/30"
              } rounded-full blur-md animate-pulse transition-colors duration-1000`}
            ></div>
            <div
              className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-8 h-8 ${
                isNightMode ? "bg-indigo-300/30" : "bg-blue-300/30"
              } rounded-full blur-md animate-pulse transition-colors duration-1000`}
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="absolute top-6 left-0 right-0 flex justify-center">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                isNightMode
                  ? "from-purple-500 to-purple-700 border-2 border-purple-300/80"
                  : "from-pink-500 to-pink-700 border-2 border-pink-300/80"
              } flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden transition-colors duration-1000`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isNightMode
                    ? "from-purple-300/60 to-transparent"
                    : "from-pink-300/60 to-transparent"
                } transition-colors duration-1000`}
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              ></div>
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full bg-white/20 opacity-60"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0% 70%)" }}
              ></div>

              <div
                className={`absolute inset-0 rounded-full ${
                  isNightMode ? "bg-purple-500/20" : "bg-pink-500/20"
                } animate-ping-slow transition-colors duration-1000`}
              ></div>

              <span className="relative z-10 text-xl drop-shadow-md">
                {characterStats.level}
              </span>
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-48 flex items-center justify-center">
            <div className="rotate-90 transform origin-center w-48 text-center">
              <div
                className={`${isNightMode ? "text-blue-200" : "text-amber-200"} font-bold tracking-wider text-xl transition-colors duration-1000`}
                style={{
                  textShadow: isNightMode
                    ? "0 0 8px rgba(50,150,255,0.7), 0 0 4px rgba(70,130,255,0.5)"
                    : "0 0 8px rgba(255,200,50,0.7), 0 0 4px rgba(255,170,0,0.5)",
                }}
              >
                Character Grimoire
              </div>
              <div
                className={`h-0.5 bg-gradient-to-r from-transparent ${
                  isNightMode ? "via-indigo-300/80" : "via-amber-300/80"
                } to-transparent mt-1 transition-colors duration-1000`}
              ></div>
            </div>
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-0 group-hover:opacity-90 transition-opacity">
            <div
              className={`w-4 h-8 ${
                isNightMode ? "bg-indigo-800/40" : "bg-amber-800/40"
              } rounded-full flex items-center justify-center transition-colors duration-1000`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 ${
                  isNightMode ? "text-blue-200" : "text-amber-200"
                } animate-pulse transition-colors duration-1000`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L3.707 10.707a1 1 0 01-1.414-1.414l6-6z"
                  clipRule="evenodd"
                  transform="rotate(90)"
                />
              </svg>
            </div>
            <span
              className={`${
                isNightMode ? "text-blue-200" : "text-amber-200"
              } text-[10px] mt-1 font-bold transition-colors duration-1000`}
              style={{
                textShadow: isNightMode
                  ? "0 0 4px rgba(37,99,235,0.8)"
                  : "0 0 4px rgba(217,119,6,0.8)",
              }}
            >
              OPEN
            </span>
          </div>

          <AnimatePresence>
            {isOpening && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${
                  isNightMode
                    ? "from-indigo-500/10 to-indigo-300/70"
                    : "from-amber-500/10 to-amber-300/70"
                } transition-colors duration-1000`}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 16 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${
                        isNightMode ? "bg-blue-200" : "bg-amber-200"
                      } rounded-full transition-colors duration-1000`}
                      animate={{
                        x: [0, Math.random() * 20 - 10],
                        y: [0, Math.random() * 40 - 20],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatDelay: Math.random() * 0.5,
                      }}
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, x: 0, width: 16 }}
            animate={{ opacity: 1, x: 80, width: 700 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed left-0 top-1/2 -translate-y-1/2 h-96 bg-gradient-to-r ${
              isNightMode
                ? "from-indigo-900/90 to-indigo-800/50"
                : "from-amber-900/90 to-amber-800/50"
            } rounded-r-md shadow-xl z-35 pointer-events-none transition-colors duration-1000`}
          ></motion.div>
        )}

        {isClosing && (
          <motion.div
            initial={{ opacity: 1, x: position.x, width: 700 }}
            animate={{ opacity: 0, x: 0, width: 16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-1/2 -translate-y-1/2 h-96 bg-gradient-to-r ${
              isNightMode
                ? "from-indigo-900/90 to-indigo-800/50"
                : "from-amber-900/90 to-amber-800/50"
            } rounded-r-md shadow-xl z-35 pointer-events-none transition-colors duration-1000`}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!inInventory && (
          <motion.div
            initial={{ opacity: 0, x: 0, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.5,
            }}
            className="pointer-events-auto absolute origin-left"
            style={{
              left:
                position.x === 0
                  ? Math.max(window.innerWidth / 4, 100)
                  : position.x,
              top:
                position.y === 0
                  ? Math.max(window.innerHeight / 2 - 250, 50)
                  : position.y,
              perspective: "1000px",
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="relative select-none">
              <div className="w-[700px] shadow-2xl">
                <div
                  className={`absolute -top-3 -left-3 -right-3 -bottom-3 bg-gradient-to-br ${
                    isNightMode
                      ? "from-indigo-800/70 to-indigo-950/70"
                      : "from-amber-800/70 to-amber-950/70"
                  } rounded-lg z-0 transition-colors duration-1000`}
                ></div>

                <div
                  className={`absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 ${
                    isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                  } rounded-tl-lg z-10 transition-colors duration-1000`}
                ></div>
                <div
                  className={`absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 ${
                    isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                  } rounded-tr-lg z-10 transition-colors duration-1000`}
                ></div>
                <div
                  className={`absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 ${
                    isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                  } rounded-bl-lg z-10 transition-colors duration-1000`}
                ></div>
                <div
                  className={`absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 ${
                    isNightMode ? "border-indigo-400/80" : "border-amber-400/80"
                  } rounded-br-lg z-10 transition-colors duration-1000`}
                ></div>

                <div
                  className={`absolute -top-1 -left-1 w-4 h-4 ${
                    isNightMode ? "bg-indigo-300/50" : "bg-amber-300/50"
                  } rounded-full animate-ping-slow transition-colors duration-1000`}
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 ${
                    isNightMode ? "bg-indigo-300/50" : "bg-blue-300/50"
                  } rounded-full animate-ping-slow transition-colors duration-1000`}
                  style={{ animationDelay: "1.2s" }}
                ></div>
                <div
                  className={`absolute -bottom-1 -left-1 w-3 h-3 ${
                    isNightMode ? "bg-purple-300/50" : "bg-pink-300/50"
                  } rounded-full animate-ping-slow transition-colors duration-1000`}
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                    isNightMode ? "bg-blue-300/50" : "bg-purple-300/50"
                  } rounded-full animate-ping-slow transition-colors duration-1000`}
                  style={{ animationDelay: "1.5s" }}
                ></div>

                <div
                  className={`drag-handle absolute top-0 left-0 right-0 h-8 bg-gradient-to-r ${
                    isNightMode
                      ? "from-indigo-800 to-indigo-700"
                      : "from-amber-800 to-amber-700"
                  } rounded-t-lg z-50 cursor-move flex items-center justify-center transition-colors duration-1000`}
                >
                  <div
                    className={`w-20 h-1 ${
                      isNightMode ? "bg-indigo-500/60" : "bg-amber-500/60"
                    } rounded-full transition-colors duration-1000`}
                  ></div>
                  <div
                    className={`absolute left-3 ${
                      isNightMode ? "text-indigo-200" : "text-amber-200"
                    } text-xs font-bold transition-colors duration-1000`}
                  >
                    Drag to move
                  </div>
                  <span
                    className={`absolute top-0 ${
                      isNightMode ? "text-indigo-100" : "text-amber-100"
                    } text-xs font-bold font-mono transition-opacity duration-400 ease-in-out ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {isVisible
                      ? "Book is open. To close, drag back to left "
                      : "Book is closed"}
                  </span>
                  <div
                    className={`absolute right-3 ${
                      isNightMode ? "text-indigo-200" : "text-amber-200"
                    } text-xs font-bold transition-colors duration-1000`}
                  >
                    Return to inventory
                  </div>
                </div>

                <button
                  className="absolute -top-3 -right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 transition-colors border border-red-300 shadow-md"
                  onClick={closeBook}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div
                  className={`flex pt-8 rounded-lg overflow-hidden border-4 ${
                    isNightMode
                      ? "border-indigo-800/80 bg-gradient-to-b from-indigo-100 to-indigo-50"
                      : "border-amber-800/80 bg-gradient-to-b from-amber-100 to-amber-50"
                  } relative transition-colors duration-1000`}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='${isNightMode ? "%23312e81" : "%23d97706"}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                  ></div>

                  <div
                    className={`w-[275px] p-5 relative border-r-2 ${
                      isNightMode ? "border-indigo-200" : "border-amber-200"
                    } transition-colors duration-1000`}
                  >
                    <div className="text-center mb-4">
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                          isNightMode
                            ? "from-purple-400 to-purple-600 border-2 border-purple-300"
                            : "from-pink-400 to-pink-600 border-2 border-pink-300"
                        } flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2 shadow-lg overflow-hidden transition-colors duration-1000`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div
                          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent"
                          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                        ></div>
                        {characterStats.level}
                      </motion.div>
                      <motion.h2
                        className={`text-xl font-bold ${
                          isNightMode ? "text-indigo-900" : "text-amber-900"
                        } transition-colors duration-1000`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        Midyan Elghazali
                      </motion.h2>
                      <motion.div
                        className={`${
                          isNightMode ? "text-purple-600" : "text-pink-600"
                        } text-sm transition-colors duration-1000`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        Full-Stack Developer • Level {characterStats.level}
                      </motion.div>

                      <div
                        className={`mt-2 bg-gradient-to-r ${
                          isNightMode
                            ? "from-purple-100 to-indigo-100 border border-purple-200"
                            : "from-pink-100 to-purple-100 border border-pink-200"
                        } h-2 w-44 rounded-full overflow-hidden mx-auto transition-colors duration-1000`}
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r ${
                            isNightMode
                              ? "from-purple-400 to-purple-500"
                              : "from-pink-400 to-pink-500"
                          } transition-colors duration-1000`}
                          initial={{ width: 0 }}
                          animate={{ width: `${characterStats.exp}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.6,
                            ease: "easeOut",
                          }}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent"></div>
                        </motion.div>
                      </div>
                      <div
                        className={`text-xs ${
                          isNightMode ? "text-indigo-800" : "text-amber-800"
                        } mt-1 transition-colors duration-1000`}
                      >
                        EXP: {characterStats.exp}/100
                      </div>
                    </div>

                    <motion.h3
                      className={`font-bold ${
                        isNightMode
                          ? "text-indigo-800 border-b border-indigo-300"
                          : "text-amber-800 border-b border-amber-300"
                      } mb-2 flex items-center transition-colors duration-1000`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${
                          isNightMode ? "text-indigo-700" : "text-amber-700"
                        } transition-colors duration-1000`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Status
                    </motion.h3>

                    <div className="flex justify-between mb-3">
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <div
                          className={`${
                            isNightMode ? "text-indigo-800" : "text-amber-800"
                          } text-xs font-bold transition-colors duration-1000`}
                        >
                          HP
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {characterStats.hp}
                        </div>
                      </motion.div>
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <div
                          className={`${
                            isNightMode ? "text-indigo-800" : "text-amber-800"
                          } text-xs font-bold transition-colors duration-1000`}
                        >
                          MP
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {characterStats.mp}
                        </div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <div>
                        <div className="flex justify-between">
                          <span
                            className={`${
                              isNightMode ? "text-indigo-800" : "text-amber-800"
                            } text-xs font-bold transition-colors duration-1000`}
                          >
                            STR
                          </span>
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-bold text-xs transition-colors duration-1000`}
                          >
                            {characterStats.strength}
                          </span>
                        </div>
                        <div
                          className={`h-2 bg-gradient-to-r ${
                            isNightMode
                              ? "from-purple-100 to-purple-50 border border-purple-200/70"
                              : "from-pink-100 to-pink-50 border border-pink-200/70"
                          } rounded-full overflow-hidden transition-colors duration-1000`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              isNightMode
                                ? "from-purple-500 to-purple-400"
                                : "from-pink-500 to-pink-400"
                            } transition-colors duration-1000`}
                            initial={{ width: 0 }}
                            animate={{ width: `${characterStats.strength}%` }}
                            transition={{ duration: 1, delay: 0.7 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span
                            className={`${
                              isNightMode ? "text-indigo-800" : "text-amber-800"
                            } text-xs font-bold transition-colors duration-1000`}
                          >
                            INT
                          </span>
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-bold text-xs transition-colors duration-1000`}
                          >
                            {characterStats.intelligence}
                          </span>
                        </div>
                        <div
                          className={`h-2 bg-gradient-to-r ${
                            isNightMode
                              ? "from-indigo-100 to-indigo-50 border border-indigo-200/70"
                              : "from-blue-100 to-blue-50 border border-blue-200/70"
                          } rounded-full overflow-hidden transition-colors duration-1000`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              isNightMode
                                ? "from-indigo-500 to-indigo-400"
                                : "from-blue-500 to-blue-400"
                            } transition-colors duration-1000`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${characterStats.intelligence}%`,
                            }}
                            transition={{ duration: 1, delay: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span
                            className={`${
                              isNightMode ? "text-indigo-800" : "text-amber-800"
                            } text-xs font-bold transition-colors duration-1000`}
                          >
                            DEX
                          </span>
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-bold text-xs transition-colors duration-1000`}
                          >
                            {characterStats.dexterity}
                          </span>
                        </div>
                        <div
                          className={`h-2 bg-gradient-to-r ${
                            isNightMode
                              ? "from-blue-100 to-blue-50 border border-blue-200/70"
                              : "from-green-100 to-green-50 border border-green-200/70"
                          } rounded-full overflow-hidden transition-colors duration-1000`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              isNightMode
                                ? "from-blue-500 to-blue-400"
                                : "from-green-500 to-green-400"
                            } transition-colors duration-1000`}
                            initial={{ width: 0 }}
                            animate={{ width: `${characterStats.dexterity}%` }}
                            transition={{ duration: 1, delay: 0.9 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span
                            className={`${
                              isNightMode ? "text-indigo-800" : "text-amber-800"
                            } text-xs font-bold transition-colors duration-1000`}
                          >
                            VIT
                          </span>
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-bold text-xs transition-colors duration-1000`}
                          >
                            {characterStats.vitality}
                          </span>
                        </div>
                        <div
                          className={`h-2 bg-gradient-to-r ${
                            isNightMode
                              ? "from-cyan-100 to-cyan-50 border border-cyan-200/70"
                              : "from-yellow-100 to-yellow-50 border border-yellow-200/70"
                          } rounded-full overflow-hidden transition-colors duration-1000`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              isNightMode
                                ? "from-cyan-500 to-cyan-400"
                                : "from-yellow-500 to-yellow-400"
                            } transition-colors duration-1000`}
                            initial={{ width: 0 }}
                            animate={{ width: `${characterStats.vitality}%` }}
                            transition={{ duration: 1, delay: 1.0 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between">
                          <span
                            className={`${
                              isNightMode ? "text-indigo-800" : "text-amber-800"
                            } text-xs font-bold transition-colors duration-1000`}
                          >
                            LUCK
                          </span>
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-bold text-xs transition-colors duration-1000`}
                          >
                            {characterStats.luck}
                          </span>
                        </div>
                        <div
                          className={`h-2 bg-gradient-to-r ${
                            isNightMode
                              ? "from-indigo-100 to-indigo-50 border border-indigo-200/70"
                              : "from-purple-100 to-purple-50 border border-purple-200/70"
                          } rounded-full overflow-hidden transition-colors duration-1000`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              isNightMode
                                ? "from-indigo-500 to-indigo-400"
                                : "from-purple-500 to-purple-400"
                            } transition-colors duration-1000`}
                            initial={{ width: 0 }}
                            animate={{ width: `${characterStats.luck}%` }}
                            transition={{ duration: 1, delay: 1.1 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>

                    <motion.h3
                      className={`font-bold ${
                        isNightMode
                          ? "text-indigo-800 border-b border-indigo-300"
                          : "text-amber-800 border-b border-amber-300"
                      } mb-2 flex items-center transition-colors duration-1000`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${
                          isNightMode ? "text-indigo-700" : "text-amber-700"
                        } transition-colors duration-1000`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1L6.257 7.757A6 6 0 1118 8zM16 8A4 4 0 1108 8a4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Equipment
                    </motion.h3>
                    <div className="space-y-1">
                      {equipment.slice(0, 3).map((item, index) => (
                        <motion.div
                          key={index}
                          className={`flex justify-between text-sm py-1 border-b ${
                            isNightMode
                              ? "border-indigo-200/50"
                              : "border-amber-200/50"
                          } transition-colors duration-1000`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.9 + index * 0.1,
                          }}
                        >
                          <span
                            className={`${
                              isNightMode ? "text-indigo-900" : "text-amber-900"
                            } font-medium transition-colors duration-1000`}
                          >
                            {item.name}
                          </span>
                          <span className="text-blue-600 font-medium">
                            {item.stat.split(" ")[0]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`w-[425px] relative right-1.5 p-5 border-l-2 ${
                      isNightMode ? "border-indigo-200" : "border-amber-200"
                    } transition-colors duration-1000`}
                  >
                    <div
                      className={`flex border-b ${
                        isNightMode
                          ? "border-indigo-300/50"
                          : "border-amber-300/50"
                      } transition-colors duration-1000`}
                    >
                      <button
                        className={`px-4 py-2 text-sm font-bold relative ${
                          activeTab === "skills"
                            ? isNightMode
                              ? "text-purple-600 bg-gradient-to-b from-indigo-100 to-indigo-50"
                              : "text-pink-600 bg-gradient-to-b from-amber-100 to-amber-50"
                            : isNightMode
                              ? "text-indigo-800 hover:text-purple-600 bg-gradient-to-b from-indigo-200/50 to-indigo-100/50"
                              : "text-amber-800 hover:text-pink-600 bg-gradient-to-b from-amber-200/50 to-amber-100/50"
                        } transition-colors duration-1000`}
                        onClick={() => handleTabClick("skills")}
                      >
                        <span className="relative z-10">Skills</span>
                        {activeTab === "skills" && (
                          <motion.div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                              isNightMode ? "bg-purple-500" : "bg-pink-500"
                            } transition-colors duration-1000`}
                            layoutId="activeTabLine"
                          ></motion.div>
                        )}
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-bold relative ${
                          activeTab === "equipment"
                            ? isNightMode
                              ? "text-purple-600 bg-gradient-to-b from-indigo-100 to-indigo-50"
                              : "text-pink-600 bg-gradient-to-b from-amber-100 to-amber-50"
                            : isNightMode
                              ? "text-indigo-800 hover:text-purple-600 bg-gradient-to-b from-indigo-200/50 to-indigo-100/50"
                              : "text-amber-800 hover:text-pink-600 bg-gradient-to-b from-amber-200/50 to-amber-100/50"
                        } transition-colors duration-1000`}
                        onClick={() => handleTabClick("equipment")}
                      >
                        <span className="relative z-10">Equipment</span>
                        {activeTab === "equipment" && (
                          <motion.div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                              isNightMode ? "bg-purple-500" : "bg-pink-500"
                            } transition-colors duration-1000`}
                            layoutId="activeTabLine"
                          ></motion.div>
                        )}
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-bold relative ${
                          activeTab === "quests"
                            ? isNightMode
                              ? "text-purple-600 bg-gradient-to-b from-indigo-100 to-indigo-50"
                              : "text-pink-600 bg-gradient-to-b from-amber-100 to-amber-50"
                            : isNightMode
                              ? "text-indigo-800 hover:text-purple-600 bg-gradient-to-b from-indigo-200/50 to-indigo-100/50"
                              : "text-amber-800 hover:text-pink-600 bg-gradient-to-b from-amber-200/50 to-amber-100/50"
                        } transition-colors duration-1000`}
                        onClick={() => handleTabClick("quests")}
                      >
                        <span className="relative z-10">Quests</span>
                        {activeTab === "quests" && (
                          <motion.div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                              isNightMode ? "bg-purple-500" : "bg-pink-500"
                            } transition-colors duration-1000`}
                            layoutId="activeTabLine"
                          ></motion.div>
                        )}
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-bold relative ${
                          activeTab === "Lore"
                            ? isNightMode
                              ? "text-purple-600 bg-gradient-to-b from-indigo-100 to-indigo-50"
                              : "text-pink-600 bg-gradient-to-b from-amber-100 to-amber-50"
                            : isNightMode
                              ? "text-indigo-800 hover:text-purple-600 bg-gradient-to-b from-indigo-200/50 to-indigo-100/50"
                              : "text-amber-800 hover:text-pink-600 bg-gradient-to-b from-amber-200/50 to-amber-100/50"
                        } transition-colors duration-1000`}
                        onClick={() => handleTabClick("Lore")}
                      >
                        <span className="relative z-10">Lore</span>
                        {activeTab === "Lore" && (
                          <motion.div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                              isNightMode ? "bg-purple-500" : "bg-pink-500"
                            } transition-colors duration-1000`}
                            layoutId="activeTabLine"
                          ></motion.div>
                        )}
                      </button>
                    </div>

                    <div className="p-4 overflow-y-auto h-[400px] fancy-scrollbar">
                      {activeTab === "skills" && (
                        <div className="space-y-6">
                          {skills.map((skill, index) => (
                            <motion.div
                              key={index}
                              className="mb-1"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.6 + index * 0.1,
                              }}
                            >
                              <div className="flex justify-between mb-1">
                                <span
                                  className={`font-bold ${
                                    isNightMode
                                      ? "text-indigo-900"
                                      : "text-amber-900"
                                  } transition-colors duration-1000`}
                                >
                                  {skill.name}
                                </span>
                                <span
                                  className={`font-bold 
                                  ${
                                    skill.value < 20
                                      ? isNightMode
                                        ? "text-gray-500"
                                        : "text-gray-600"
                                      : skill.value < 40
                                        ? isNightMode
                                          ? "text-cyan-600"
                                          : "text-green-600"
                                        : skill.value < 60
                                          ? isNightMode
                                            ? "text-indigo-600"
                                            : "text-blue-600"
                                          : skill.value < 80
                                            ? isNightMode
                                              ? "text-purple-600"
                                              : "text-purple-600"
                                            : isNightMode
                                              ? "text-blue-600"
                                              : "text-orange-600"
                                  } transition-colors duration-1000`}
                                >
                                  {getSkillLevelText(skill.value)}{" "}
                                  {Math.round(animatedStats[skill.name] || 0)}
                                  /100
                                </span>
                              </div>
                              <div
                                className={`relative h-2 bg-gradient-to-r ${
                                  isNightMode
                                    ? "from-gray-200 to-gray-100"
                                    : "from-gray-100 to-gray-50"
                                } rounded-full overflow-hidden border ${
                                  isNightMode
                                    ? "border-gray-300"
                                    : "border-gray-200"
                                } transition-colors duration-1000`}
                              >
                                <motion.div
                                  className="h-full"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${animatedStats[skill.name] || 0}%`,
                                  }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.8 + index * 0.1,
                                  }}
                                  style={{
                                    backgroundColor:
                                      isNightMode && skill.nightModeColor
                                        ? skill.nightModeColor
                                        : skill.color,
                                  }}
                                >
                                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-white/30 to-transparent"></div>
                                </motion.div>

                                <div className="absolute top-0 bottom-0 left-1/5 w-0.5 bg-gray-300/50"></div>
                                <div className="absolute top-0 bottom-0 left-2/5 w-0.5 bg-gray-300/50"></div>
                                <div className="absolute top-0 bottom-0 left-3/5 w-0.5 bg-gray-300/50"></div>
                                <div className="absolute top-0 bottom-0 left-4/5 w-0.5 bg-gray-300/50"></div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === "equipment" && (
                        <div className="space-y-2">
                          {equipment.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.6 + index * 0.1,
                              }}
                              className={`p-2 rounded bg-gradient-to-r ${
                                isNightMode
                                  ? "from-indigo-50 to-indigo-100 border border-indigo-200/60"
                                  : "from-amber-50 to-amber-100 border border-amber-200/60"
                              } relative overflow-hidden group hover:shadow-md transition-all duration-1000`}
                            >
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform"></div>

                              <div className="flex justify-between items-center">
                                <div>
                                  <div
                                    className={`font-bold ${
                                      isNightMode
                                        ? "text-indigo-900"
                                        : "text-amber-900"
                                    } transition-colors duration-1000`}
                                  >
                                    {item.name}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      isNightMode
                                        ? "text-indigo-700"
                                        : "text-amber-700"
                                    } italic transition-colors duration-1000`}
                                  >
                                    {item.type}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                      item.rarity === "Legendary"
                                        ? isNightMode
                                          ? "bg-yellow-100 text-yellow-600"
                                          : "bg-orange-100 text-orange-600"
                                        : item.rarity === "Epic"
                                          ? isNightMode
                                            ? "bg-indigo-100 text-indigo-600"
                                            : "bg-purple-100 text-purple-600"
                                          : item.rarity === "Rare"
                                            ? isNightMode
                                              ? "bg-cyan-100 text-cyan-600"
                                              : "bg-blue-100 text-blue-600"
                                            : isNightMode
                                              ? "bg-emerald-100 text-emerald-600"
                                              : "bg-green-100 text-green-600"
                                    } transition-colors duration-1000`}
                                  >
                                    {item.rarity}
                                  </div>
                                  <div className="text-sm text-blue-600 font-bold mt-1">
                                    {item.stat}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === "quests" && (
                        <div className="space-y-2">
                          {quests.map((quest, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.6 + index * 0.1,
                              }}
                              className={`p-3 rounded bg-gradient-to-r ${
                                isNightMode
                                  ? "from-indigo-50 to-indigo-100 border border-indigo-200/60"
                                  : "from-amber-50 to-amber-100 border border-amber-200/60"
                              } relative overflow-hidden group hover:shadow-md transition-all duration-1000`}
                            >
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform"></div>

                              <div className="flex justify-between">
                                <div
                                  className={`font-bold ${
                                    isNightMode
                                      ? "text-indigo-900"
                                      : "text-amber-900"
                                  } transition-colors duration-1000`}
                                >
                                  {quest.name}
                                </div>
                                <div
                                  className={`${
                                    quest.status === "Completed"
                                      ? isNightMode
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-green-100 text-green-600"
                                      : quest.status === "In Progress"
                                        ? isNightMode
                                          ? "bg-indigo-100 text-indigo-600"
                                          : "bg-amber-100 text-amber-600"
                                        : isNightMode
                                          ? "bg-blue-100 text-blue-600"
                                          : "bg-blue-100 text-blue-600"
                                  } text-xs font-bold px-2 py-0.5 rounded-full transition-colors duration-1000`}
                                >
                                  {quest.status}
                                </div>
                              </div>
                              <div
                                className={`text-xs ${
                                  isNightMode
                                    ? "text-indigo-700"
                                    : "text-amber-700"
                                } mt-2 flex items-center transition-colors duration-1000`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${
                                    isNightMode
                                      ? "text-indigo-600"
                                      : "text-amber-600"
                                  } mr-1 transition-colors duration-1000`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Reward: {quest.exp} EXP
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {activeTab === "Lore" && (
                        <div className="space-y-2 hover:cursor-[url('/pointcur.cur')_pointer]">
                          {lore.map((lore, index) => {
                            const open = openLoreIndex === index;
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.6 + index * 0.1,
                                }}
                                className={`p-4 rounded-lg bg-gradient-to-r ${
                                  isNightMode
                                    ? "from-indigo-50 to-indigo-100 border border-indigo-200/60"
                                    : "from-amber-50 to-amber-100 border border-amber-200/60"
                                } relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:cursor-[url('/pointcur.cur')_pointer] hover:scale-[1.02]`}
                                onClick={() =>
                                  setOpenLoreIndex(open ? null : index)
                                }
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent -translate-y-16 translate-x-16 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-500 rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-transparent translate-y-12 -translate-x-12 group-hover:-translate-x-5 group-hover:translate-y-5 transition-transform duration-500 rounded-full"></div>

                                <div className="flex items-center justify-between mb-1 relative z-10">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br ${
                                        isNightMode
                                          ? "from-indigo-400 to-purple-400"
                                          : "from-amber-400 to-orange-400"
                                      } text-white text-xs font-bold shadow-sm transition-colors duration-1000`}
                                    >
                                      {lore.level}
                                    </div>

                                    <h3
                                      className={`${
                                        isNightMode
                                          ? "text-indigo-800"
                                          : "text-amber-800"
                                      } font-bold text-lg transition-colors duration-1000`}
                                    >
                                      {lore.title}
                                    </h3>
                                  </div>

                                  <div
                                    className={`text-xs ${
                                      isNightMode
                                        ? "text-purple-600"
                                        : "text-orange-600"
                                    } font-medium transition-colors duration-1000`}
                                  >
                                    {lore.date}
                                  </div>
                                </div>

                                <div
                                  className={`absolute right-3 bottom-2 ${
                                    isNightMode
                                      ? "text-indigo-600/80"
                                      : "text-amber-600/80"
                                  } text-xs italic transition-colors duration-1000 opacity-70 group-hover:opacity-100`}
                                >
                                  {open == null
                                    ? "Click for details"
                                    : open
                                      ? "Click to close"
                                      : ""}
                                </div>

                                {open && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeOut",
                                    }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`mt-3 pt-3 ${
                                      isNightMode
                                        ? "border-t border-indigo-200/50"
                                        : "border-t border-amber-200/50"
                                    } overflow-hidden transition-colors duration-1000`}
                                  >
                                    <p
                                      className={`${
                                        isNightMode
                                          ? "text-indigo-700"
                                          : "text-amber-700"
                                      } leading-relaxed hover:cursor-[url('/pointcur.cur')_pointer] relative z-10 transition-colors duration-1000`}
                                    >
                                      {lore.description}
                                    </p>
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`absolute left-[275px] top-0 bottom-0 w-4 bg-gradient-to-r ${
                      isNightMode
                        ? "from-indigo-800 to-indigo-700"
                        : "from-amber-800 to-amber-700"
                    } z-10 flex flex-col justify-between py-8 transition-colors duration-1000`}
                  >
                    <div
                      className={`w-full h-1/4 border-t border-b ${
                        isNightMode
                          ? "border-indigo-600/30"
                          : "border-amber-600/30"
                      } transition-colors duration-1000`}
                    ></div>
                    <div
                      className={`w-full h-1/4 border-t border-b ${
                        isNightMode
                          ? "border-indigo-600/30"
                          : "border-amber-600/30"
                      } transition-colors duration-1000`}
                    ></div>
                  </div>

                  <div
                    className={`absolute -right-2 top-12 w-6 h-24 bg-gradient-to-b ${
                      isNightMode
                        ? "from-purple-500 to-purple-600"
                        : "from-pink-500 to-pink-600"
                    } rounded-r-sm shadow-md transition-colors duration-1000`}
                  ></div>
                  <div
                    className={`absolute -right-2 top-48 w-5 h-16 bg-gradient-to-b ${
                      isNightMode
                        ? "from-indigo-500 to-indigo-600"
                        : "from-blue-500 to-blue-600"
                    } rounded-r-sm shadow-md transition-colors duration-1000`}
                  ></div>

                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 ${
                          isNightMode ? "bg-indigo-300" : "bg-amber-300"
                        } rounded-full opacity-0 transition-colors duration-1000`}
                        animate={{
                          opacity: [0, 0.8, 0],
                          x: [0, Math.random() * 20 - 10],
                          y: [0, Math.random() * 20 - 10],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 3s infinite;
        }

        .fancy-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .fancy-scrollbar::-webkit-scrollbar-track {
          background: ${isNightMode
            ? "rgba(79, 70, 229, 0.1)"
            : "rgba(217, 119, 6, 0.1)"};
          border-radius: 4px;
          transition: background 1s;
        }

        .fancy-scrollbar::-webkit-scrollbar-thumb {
          background: ${isNightMode
            ? "linear-gradient(to bottom, rgba(79, 70, 229, 0.4), rgba(67, 56, 202, 0.4))"
            : "linear-gradient(to bottom, rgba(217, 119, 6, 0.4), rgba(180, 83, 9, 0.4))"};
          border-radius: 4px;
          transition: background 1s;
        }
      `}</style>
    </div>
  );
}
