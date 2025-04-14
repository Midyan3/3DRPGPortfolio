"use client";
import { useState, useRef, useEffect } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import RPGStats from "./components/skills";
import CustomScrollbar from "./components/Scrollbar";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const terminalRef = useRef(null);
  const bootSequenceComplete = useRef(false);
  const [count, setCount] = useState(0);

  const [scrollDismissed, setScrollDismissed] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  const [backgroundAudio, setBackgroundAudio] =
    useState<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [campfireAudio, setCampfireAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const [NightModeAudio, setNightModeAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const clickableClass = "clickable";
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/Audio/BackgroundMain.mp3");
      audio.loop = true;
      audio.volume = 0.7;

      const handlePlay = () => setAudioPlaying(true);
      const handlePause = () => setAudioPlaying(false);

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      setBackgroundAudio(audio);
      setAudioLoaded(true);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.pause();
      };
    }
  }, []);
  const playSound = (
    soundPath: string,
    volume = 0.1,
    rate = 1.0,
    loop = false,
  ) => {
    try {
      const sound = new Audio(soundPath);
      sound.volume = volume;
      sound.playbackRate = rate;
      if (loop) {
        sound.loop = true;
      }
      sound.play().catch((err) => console.log("Audio play failed:", err));
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const toggleAudio = () => {
    if (!backgroundAudio || !audioLoaded) return;
    
    if (audioPlaying) {
      backgroundAudio.pause();
    } else {
      backgroundAudio.volume = isNightMode ? 0 : 0.7;
      backgroundAudio.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  useEffect(() => {
    if (!terminalRef.current || bootSequenceComplete.current) return;

    if (!campfireAudio) {
      setCampfireAudio(new Audio("/Audio/Campfire.mp3"));
    }

    if (!NightModeAudio) {
      setNightModeAudio(new Audio("/Audio/Night.mp3"));
    }

    const startAudio = () => {
      if (backgroundAudio && audioLoaded && !audioPlaying) {
        backgroundAudio.play().catch((err) => {
          console.log("Auto-play prevented:", err);
        });
      }
    };

    setTimeout(startAudio, 1000);

    const lines = [
      "> Initializing development environment...",
      "> Loading portfolio assets: [████████████████] 100%",
      "> Mounting 3D rendering pipeline...",
      "> Configuring immersive experience parameters...",
      "> Establishing secure connection to project database...",
      "> Running final system diagnostics...",
      "> All systems operational. Welcome to Midyan's digital realm.",
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let terminalContent = "";

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        bootSequenceComplete.current = true;
        setTimeout(() => setIsVisible(true), 1000);
        return;
      }

      if (charIndex < lines[lineIndex].length) {
        terminalContent += lines[lineIndex][charIndex];
        if (terminalRef.current) {
          (terminalRef.current as HTMLDivElement).innerHTML =
            `${terminalContent}<span class="blink">_</span>`;
        }
        charIndex++;
        setTimeout(typeNextChar, 20 + Math.random() * 30);
      } else {
        terminalContent += "<br>";
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 200);
      }
    };

    setTimeout(typeNextChar, 500);
  }, [
    backgroundAudio,
    audioLoaded,
    audioPlaying,
    campfireAudio,
    NightModeAudio,
  ]);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      let element = event.target as Element;
      let isClickable = false;

      while (element && element !== document.body) {
        const style = window.getComputedStyle(element);
        if (
          style.cursor &&
          (style.cursor.includes("pointcur.cur") || style.cursor === "pointer")
        ) {
          isClickable = true;
          break;
        }

        const tagName = element.tagName.toLowerCase();
        if (
          tagName === "button" ||
          tagName === "a" ||
          tagName === "input" ||
          element.getAttribute("role") === "button" ||
          element.hasAttribute("onclick") ||
          element.className.includes("clickable") ||
          element.className.includes("hover:")
        ) {
          isClickable = true;
          break;
        }

        if (element.parentElement) {
          element = element.parentElement;
        } else {
          break;
        }
      }

      if (isClickable) {
        playSound("/Audio/Click.mp3", 0.1, 0.8);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    if (!backgroundAudio || !audioLoaded) return;

    let fadeOutInterval: NodeJS.Timeout | null = null;
    let fadeInInterval: NodeJS.Timeout | null = null;

    if (isNightMode) {
      if (audioPlaying) {
        fadeOutInterval = setInterval(() => {
          if (backgroundAudio.volume > 0.01) {
            backgroundAudio.volume = Math.max(0, backgroundAudio.volume - 0.01);
          } else {
            backgroundAudio.volume = 0;
            if (fadeOutInterval) clearInterval(fadeOutInterval);
          }
        }, 100);
      }
    } else {
      if (audioPlaying) {
        backgroundAudio.volume = 0.1;
        backgroundAudio
          .play()
          .catch((err) => console.log("Audio play failed:", err));

        fadeInInterval = setInterval(() => {
          if (backgroundAudio.volume < 0.7) {
            backgroundAudio.volume = Math.min(
              0.7,
              backgroundAudio.volume + 0.01,
            );
          } else {
            if (fadeInInterval) clearInterval(fadeInInterval);
          }
        }, 100);
      }
    }

    return () => {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
      if (fadeInInterval) clearInterval(fadeInInterval);
    };
  }, [isNightMode, backgroundAudio, audioLoaded, audioPlaying]);
  useEffect(() => {
    if (!campfireAudio && typeof window !== "undefined") {
      setCampfireAudio(new Audio("/Audio/Campfire.mp3"));
    }

    if (!NightModeAudio && typeof window !== "undefined") {
      setNightModeAudio(new Audio("/Audio/Night.mp3"));
    }

    if (!campfireAudio || !NightModeAudio) return;

    campfireAudio.loop = true;
    NightModeAudio.loop = true;
    campfireAudio.playbackRate = 1.0;

    let campfireInterval: NodeJS.Timeout | null = null;
    let nightModeInterval: NodeJS.Timeout | null = null;

    if (isNightMode) {
      setTimeout(() => {
        campfireAudio.volume = 0;
        NightModeAudio.volume = 0;

        campfireAudio
          .play()
          .catch((err) => console.log("Audio play failed:", err));
        NightModeAudio.play().catch((err) =>
          console.log("Audio play failed:", err),
        );

        campfireInterval = setInterval(() => {
          if (campfireAudio.volume < 0.6) {
            campfireAudio.volume = Math.min(0.6, campfireAudio.volume + 0.01);
          } else {
            if (campfireInterval) clearInterval(campfireInterval);
          }
        }, 100);

        nightModeInterval = setInterval(() => {
          if (NightModeAudio.volume < 0.4) {
            NightModeAudio.volume = Math.min(0.4, NightModeAudio.volume + 0.01);
          } else {
            if (nightModeInterval) clearInterval(nightModeInterval);
          }
        }, 100);
      }, 1000);
    } else {
      if (campfireAudio.volume > 0) {
        campfireInterval = setInterval(() => {
          if (campfireAudio.volume > 0) {
            campfireAudio.volume = Math.max(0, campfireAudio.volume - 0.01);
          } else {
            campfireAudio.pause();
            if (campfireInterval) clearInterval(campfireInterval);
          }
        }, 100);
      }

      if (NightModeAudio.volume > 0) {
        nightModeInterval = setInterval(() => {
          if (NightModeAudio.volume > 0) {
            NightModeAudio.volume = Math.max(0, NightModeAudio.volume - 0.01);
          } else {
            NightModeAudio.pause();
            if (nightModeInterval) clearInterval(nightModeInterval);
          }
        }, 100);
      }
    }

    return () => {
      if (campfireInterval) clearInterval(campfireInterval);
      if (nightModeInterval) clearInterval(nightModeInterval);
    };
  }, [isNightMode, campfireAudio, NightModeAudio]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && backgroundAudio) {
        if (audioPlaying) {
          backgroundAudio.pause();
        } else {
          backgroundAudio
            .play()
            .catch((err) => console.log("Audio play failed:", err));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [backgroundAudio, audioPlaying]);

  return (
    <main className="min-h-screen w-full bg-cover bg-center text-white relative font-sans overflow-hidden">
      <CustomScrollbar isNightMode={isNightMode} />

      <div
        className={`absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 ${
          isNightMode ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: "url('/Back.png')",
        }}
      />

      <div
        className={`absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 ${
          isNightMode ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: "url('/BackDark.png')",
        }}
      />

      <div
        className={`absolute inset-0 ${
          isNightMode
            ? "bg-purple-900/10 backdrop-blur-[1px]"
            : "bg-black/20 backdrop-blur-[1px]"
        } z-0 transition-colors duration-1000`}
      />

      <div
        className={`absolute inset-0 bg-black flex flex-col items-center justify-center z-50 text-pink-400 font-mono
          ${isVisible ? "opacity-0 pointer-events-none" : "opacity-100"}
          transition-opacity duration-1000`}
      >
        <div ref={terminalRef} className="max-w-lg text-sm md:text-base"></div>
      </div>

      {isVisible && scrollVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setScrollVisible(false);
            setScrollDismissed(true);
          }}
        >
          <div
            className="relative max-w-xl w-full mx-4 animate-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-8 ${
                isNightMode
                  ? "bg-indigo-900/80 border-t border-x border-indigo-600/80"
                  : "bg-amber-800/80 border-t border-x border-amber-600/80"
              } rounded-t-lg flex items-center justify-center transition-colors duration-1000`}
            >
              <span
                className={`${
                  isNightMode ? "text-indigo-200" : "text-amber-200"
                } text-xs font-semibold transition-colors duration-1000`}
              >
                ADVENTURE GUIDE
              </span>
            </div>

            <div
              className={`${
                isNightMode
                  ? "bg-gradient-to-b from-indigo-100 to-indigo-200 border-2 border-indigo-700/80"
                  : "bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-600/80"
              } rounded-lg shadow-2xl overflow-hidden transition-colors duration-1000`}
            >
              <div
                className={`h-3 w-full ${
                  isNightMode
                    ? "bg-gradient-to-r from-indigo-600/40 via-indigo-800/60 to-indigo-600/40"
                    : "bg-gradient-to-r from-amber-600/40 via-amber-800/60 to-amber-600/40"
                } transition-colors duration-1000`}
              ></div>

              <div
                className={`p-6 pt-8 ${
                  isNightMode ? "text-indigo-900" : "text-amber-900"
                } relative transition-colors duration-1000`}
              >
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    isNightMode ? "text-indigo-800/5" : "text-amber-800/5"
                  } text-[180px] font-serif select-none pointer-events-none transition-colors duration-1000`}
                >
                  ME
                </div>

                <h2
                  className={`text-center text-2xl font-bold mb-4 ${
                    isNightMode ? "text-indigo-800" : "text-amber-800"
                  } font-serif transition-colors duration-1000`}
                >
                  Greetings, Brave Traveler!
                </h2>

                <div className="space-y-4 relative z-10 font-serif">
                  <p>
                    Welcome to my magical domain! This interactive portfolio is
                    a gateway to my adventures as a developer and digital
                    craftsman.
                  </p>

                  <div
                    className={`border-l-4 ${
                      isNightMode
                        ? "border-indigo-800/30"
                        : "border-amber-800/30"
                    } pl-4 py-2 my-4 transition-colors duration-1000`}
                  >
                    <p
                      className={`italic ${
                        isNightMode ? "text-indigo-800" : "text-amber-800"
                      } transition-colors duration-1000`}
                    >
                      "Click on different sections of the resume to unveil the
                      chapters of my journey. Each section contains precious
                      knowledge about my skills and experiences."
                    </p>
                  </div>

                  <p className="font-medium">
                    🔍{" "}
                    <span
                      className={`underline ${
                        isNightMode
                          ? "decoration-indigo-600"
                          : "decoration-amber-600"
                      } transition-colors duration-1000`}
                    >
                      How to Navigate:
                    </span>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Use <span className="font-bold">WASD</span> or{" "}
                      <span className="font-bold">arrow keys</span> to move
                      through the realm
                    </li>
                    <li>
                      <span className="font-bold">Click</span> on resume
                      sections to discover detailed lore
                    </li>
                    <li>
                      Press <span className="font-bold">T</span> to toggle
                      between{" "}
                      <span
                        className={`${
                          isNightMode ? "text-indigo-600" : "text-blue-600"
                        } transition-colors duration-1000`}
                      >
                        Orbital
                      </span>{" "}
                      and{" "}
                      <span
                        className={`${
                          isNightMode ? "text-purple-600" : "text-pink-600"
                        } transition-colors duration-1000`}
                      >
                        Immersive
                      </span>{" "}
                      view modes
                    </li>
                    <li>
                      Click the <span className="font-bold">sword icon</span> to
                      increase your power level
                    </li>
                    <li>
                      Toggle between <span className="font-bold">Day</span> and{" "}
                      <span className="font-bold">Night</span> to change the
                      ambiance
                    </li>
                  </ul>

                  <div
                    className={`relative my-6 p-4 ${
                      isNightMode
                        ? "bg-indigo-800/10 border border-indigo-800/20"
                        : "bg-amber-800/10 border border-amber-800/20"
                    } rounded-lg transition-colors duration-1000`}
                  >
                    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 animate-pulse-x hidden md:block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`${
                          isNightMode ? "text-indigo-600" : "text-amber-600"
                        } transition-colors duration-1000`}
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 5 12 12 19"></polyline>
                      </svg>
                    </div>

                    <p
                      className={`font-medium text-center mb-2 ${
                        isNightMode ? "text-indigo-800" : "text-amber-800"
                      } transition-colors duration-1000`}
                    >
                      ✨{" "}
                      <span
                        className={`underline ${
                          isNightMode
                            ? "decoration-indigo-600"
                            : "decoration-amber-600"
                        } transition-colors duration-1000`}
                      >
                        The Character Grimoire
                      </span>{" "}
                      ✨
                    </p>
                    <p>
                      While exploring my resume, check out the character book
                      icon on the left side of your screen. This magical
                      grimoire contains all my stats, powers, and achievements
                      presented in classic RPG style. Click it to see my skills,
                      tech stack, and completed projects translated into fantasy
                      game elements - it's a fun way to get to know my developer
                      journey!
                    </p>
                  </div>
                  <p>
                    I hope you enjoy your journey through my portfolio. May your
                    path be filled with knowledge and inspiration. Below you'll
                    find links to my GitHub, LinkedIn, and contact information.
                    Feel free to reach out if you have any questions, thoughts,
                    or if you want to collaborate on a project. I'm always open
                    to new adventures!
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <a
                      href="https://github.com/Midyan3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 ${
                        isNightMode
                          ? "bg-indigo-800 text-indigo-100 hover:bg-indigo-700"
                          : "bg-amber-800 text-amber-100 hover:bg-amber-700"
                      } rounded-md transition-colors shadow-md flex items-center cursor-[url('/pointcur.cur')_pointer]`}
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/midyan-elghazali-901b06247/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 ${
                        isNightMode
                          ? "bg-indigo-800 text-indigo-100 hover:bg-indigo-700"
                          : "bg-amber-800 text-amber-100 hover:bg-amber-700"
                      } rounded-md transition-colors shadow-md flex items-center cursor-[url('/pointcur.cur')_pointer]`}
                    >
                      LinkedIn
                    </a>
                    <a
                      href="mailto:midyanelghazali2003@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 ${
                        isNightMode
                          ? "bg-indigo-800 text-indigo-100 hover:bg-indigo-700"
                          : "bg-amber-800 text-amber-100 hover:bg-amber-700"
                      } rounded-md transition-colors shadow-md flex items-center cursor-[url('/pointcur.cur')_pointer]`}
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>

              <div
                className={`h-3 w-full ${
                  isNightMode
                    ? "bg-gradient-to-r from-indigo-600/40 via-indigo-800/60 to-indigo-600/40"
                    : "bg-gradient-to-r from-amber-600/40 via-amber-800/60 to-amber-600/40"
                } transition-colors duration-1000`}
              ></div>
            </div>

            <button
              onClick={() => {
                playSound("/Audio/CloseScroll.mp3", 0.3, 1);
                setScrollVisible(false);
                setScrollDismissed(true);
              }}
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${
                isNightMode
                  ? "from-purple-600 to-purple-800 border-2 border-purple-400"
                  : "from-red-600 to-red-800 border-2 border-red-400"
              } rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 cursor-[url('/pointcur.cur')_pointer]`}
            >
              <span
                className={`${
                  isNightMode ? "text-indigo-200" : "text-amber-200"
                } text-xs font-bold transition-colors duration-1000`}
              >
                CLOSE
              </span>
            </button>
          </div>
        </div>
      )}

      <nav
        className={`relative top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 transition-colors duration-1000 ${
          isNightMode ? "bg-indigo-900/10" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`absolute -inset-1 rounded-full ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-500"
                  : "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500"
              } animate-pulse opacity-70 transition-colors duration-1000`}
            ></div>
            <div
              className={`h-12 w-12 rounded-full ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-500"
                  : "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500"
              } p-[2px] relative shadow-lg transition-colors duration-1000`}
            >
              <div
                className={`h-full w-full rounded-full ${
                  isNightMode
                    ? "bg-gradient-to-br from-indigo-300/30 to-blue-300/30"
                    : "bg-gradient-to-br from-pink-300/30 to-blue-300/30"
                } backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/70 transition-colors duration-1000`}
              >
                <span className="text-white font-bold text-xl drop-shadow-lg">
                  ME
                </span>
              </div>
              <div
                className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ${
                  isNightMode
                    ? "bg-gradient-to-br from-indigo-400 to-blue-400"
                    : "bg-gradient-to-br from-pink-400 to-blue-400"
                } border-2 border-white shadow-lg flex items-center justify-center transition-colors duration-1000`}
              >
                <span className="text-[10px] font-bold text-white">
                  {count}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <span
              className={`text-xl font-extrabold tracking-tight bg-gradient-to-br ${
                isNightMode
                  ? "from-indigo-300 to-blue-200"
                  : "from-pink-400 to-blue-300"
              } bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] transition-colors duration-1000`}
            >
              Midyan Elghazali
            </span>
            <span className="text-xs text-gray-200">Legendary Developer</span>
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <div className="relative px-3 py-1">
            <div
              className={`absolute inset-0 ${
                isNightMode
                  ? "bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-blue-500/20"
                  : "bg-gradient-to-r from-pink-500/20 via-purple-500/30 to-blue-500/20"
              } rounded-lg border border-white/30 shadow-lg transition-colors duration-1000`}
            ></div>
            <div className="relative flex items-center space-x-2 px-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-blue-200">
                  CURRENT QUEST
                </span>
                <span className="text-sm font-bold text-white">
                  Portfolio Development
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/20"></div>
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-medium text-green-300">
                  IN PROGRESS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block relative group">
            <div
              className={`absolute -inset-1 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/60 to-purple-500/60"
                  : "bg-gradient-to-br from-blue-500/60 to-purple-500/60"
              } opacity-75 blur-sm rounded-lg transition-colors duration-1000`}
            ></div>
            <div
              className={`relative px-3 py-1.5 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
                  : "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
              } backdrop-blur-sm rounded-lg border border-white/30 flex items-center transition-colors duration-1000`}
            >
              <div className="mr-2 relative">
                <div className="absolute inset-0 bg-pink-500/30 rounded-full animate-ping opacity-30"></div>
                <div
                  className={`h-7 w-7 rounded-full ${
                    isNightMode
                      ? "bg-gradient-to-br from-indigo-400 to-purple-400"
                      : "bg-gradient-to-br from-pink-400 to-purple-400"
                  } flex items-center justify-center transition-colors duration-1000`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.003-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-semibold ${
                      isNightMode ? "text-indigo-200" : "text-blue-200"
                    } transition-colors duration-1000`}
                  >
                    Skill
                  </span>
                  <span className="text-xs font-bold text-white ml-1">
                    {Math.floor(count / 5) + 10}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-semibold ${
                      isNightMode ? "text-purple-200" : "text-pink-200"
                    } transition-colors duration-1000`}
                  >
                    Magic
                  </span>
                  <span className="text-xs font-bold text-white ml-1">
                    {Math.floor(count / 3) + 15}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div
              className={`absolute -inset-1 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500 to-blue-500"
                  : "bg-gradient-to-br from-pink-500 to-blue-500"
              } opacity-75 blur-sm rounded-lg transition-colors duration-1000`}
            ></div>
            <button
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-400/20 to-blue-400/20"
                  : "bg-gradient-to-br from-pink-400/20 to-blue-400/20"
              } backdrop-blur-sm border border-white/40 cursor-[url('/pointcur.cur')_pointer] hover:border-white/70 transition-all duration-300`}
              onClick={() => setCount(count + 1)}
            >
              <img
                src="sword.png"
                alt="sword"
                width="28"
                className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              />
            </button>

            <div
              className={`absolute -bottom-16 right-0 w-40 px-3 py-2 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/30 to-blue-500/30"
                  : "bg-gradient-to-br from-pink-500/30 to-blue-500/30"
              } backdrop-blur-md text-white text-xs rounded-lg border border-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-lg`}
            >
              <div className="text-center">
                <span
                  className={`font-bold bg-gradient-to-r ${
                    isNightMode
                      ? "from-indigo-400 to-blue-300"
                      : "from-pink-400 to-blue-300"
                  } bg-clip-text text-transparent transition-colors duration-1000`}
                >
                  Legendary Sword
                </span>
                <div className="text-xs text-gray-200 mt-1">
                  Enhance your power!
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div
              className={`absolute -inset-1 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500 to-purple-700"
                  : "bg-gradient-to-br from-blue-500 to-pink-500"
              } opacity-75 blur-sm rounded-lg transition-colors duration-1000`}
            ></div>
            <button
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/20 to-purple-700/20"
                  : "bg-gradient-to-br from-blue-400/20 to-pink-400/20"
              } backdrop-blur-sm border border-white/40 cursor-[url('/pointcur.cur')_pointer] hover:border-white/70 transition-all duration-300`}
              onClick={() => {
                playSound("/Audio/Click.mp3", 0.1, 0.8);
                setScrollVisible(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white mb-0.5"
              >
                <path d="M11.25 4.533A9.707 9.707 0 006 3c-2.756 0-5.217.48-7.534 1.345a.75.75 0 00-.51.707v14.25a.75.75 0 001.004.707A11.955 11.955 0 016 18.75c1.996 0 3.827.479 5.25 1.281V4.533zM12.75 4.533A9.707 9.707 0 0118 3c2.756 0 5.217.48 7.534 1.345a.75.75 0 01.51.707v14.25a.75.75 0 01-1.004.707A11.955 11.955 0 0018 18.75c-1.996 0-3.827.479-5.25 1.281V4.533z" />
              </svg>
              <span className="text-[9px] text-white font-semibold">Guide</span>
            </button>

            <div
              className={`absolute -bottom-16 right-0 w-28 px-3 py-2 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/30 to-purple-500/30"
                  : "bg-gradient-to-br from-blue-500/30 to-pink-500/30"
              } backdrop-blur-md text-white text-xs rounded-lg border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg`}
            >
              <div className="text-center">
                <span
                  className={`font-bold bg-gradient-to-r ${
                    isNightMode
                      ? "from-indigo-400 to-purple-300"
                      : "from-blue-400 to-pink-300"
                  } bg-clip-text text-transparent transition-colors duration-1000`}
                >
                  Adventure Guide
                </span>
                <div className="text-xs text-gray-200 mt-1">
                  Open the scroll
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-br ${
                isNightMode
                  ? "from-indigo-500 to-purple-700"
                  : "from-blue-500 to-pink-500"
              } opacity-75 blur-sm rounded-lg transition-colors duration-1000`}
            ></div>
            <button
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${
                isNightMode
                  ? "from-indigo-500/20 to-purple-700/20"
                  : "from-blue-400/20 to-pink-400/20"
              } backdrop-blur-sm border border-white/40 cursor-[url('/pointcur.cur')_pointer] hover:border-white/70 transition-all duration-300`}
              onClick={() => {
                playSound("/Audio/BackSwitch.mp3", 1, 1);
                setIsNightMode((prev) => !prev);
              }}
            >
              {isNightMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-100 mb-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white mb-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <span className="text-[9px] text-white font-semibold">
                {isNightMode ? "Day" : "Night"}
              </span>
            </button>

            <div
              className={`absolute -bottom-16 right-0 w-32 px-3 py-2 ${
                isNightMode
                  ? "bg-gradient-to-br from-indigo-500/30 to-purple-500/30"
                  : "bg-gradient-to-br from-blue-500/30 to-pink-500/30"
              } backdrop-blur-md text-white text-xs rounded-lg border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg`}
            >
              <div className="text-center">
                <span
                  className={`font-bold bg-gradient-to-r ${
                    isNightMode
                      ? "from-indigo-400 to-purple-300"
                      : "from-blue-400 to-pink-300"
                  } bg-clip-text text-transparent transition-colors duration-1000`}
                >
                  {isNightMode ? "Switch to Day" : "Switch to Night"}
                </span>
                <div className="text-xs text-gray-200 mt-1">
                  {isNightMode ? "Return to daylight" : "Rest by the campfire"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`relative z-10 ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      >
        <div className="flex flex-col items-center justify-center px-6 pt-20 text-center gap-4">
          <h1
            className={`text-6xl font-extrabold tracking-tight drop-shadow-xl bg-gradient-to-br ${
              isNightMode
                ? "from-indigo-300 to-purple-200"
                : "from-pink-400 to-blue-300"
            } bg-clip-text text-transparent transition-colors duration-1000`}
          >
            Midyan Elghazali
          </h1>
          <p
            className={`text-xl max-w-2xl ${
              isNightMode ? "text-gray-300" : "text-gray-200"
            } drop-shadow-md transition-colors duration-1000`}
          >
            Welcome to my interactive 3D resume. I'm a developer, creative
            technologist, and builder of bold ideas
            <span
              className={`blink ${
                isNightMode ? "text-purple-300" : "text-pink-300"
              } transition-colors duration-1000`}
            >
              _
            </span>
          </p>
          <p
            className={`text-sm ${
              isNightMode ? "text-gray-400" : "text-gray-300"
            } transition-colors duration-1000`}
          >
            Scroll and explore the space below{" "}
            <span className="inline-block animate-bounce">👇</span>
          </p>
        </div>

        <div className="relative z-10 w-full">
          <ThreeCanvas isNightMode={isNightMode} />
        </div>

        <div
          className={`relative z-10 mt-6 pb-10 text-center text-sm ${
            isNightMode ? "text-gray-400" : "text-gray-300"
          } transition-colors duration-1000`}
        >
          Made with <span className="text-red-400 animate-pulse">❤️</span> by
          Midyan Elghazali
        </div>
      </div>

      <RPGStats
        isVisible={showStats}
        onClose={() => setShowStats(false)}
        onOpen={() => setShowStats(true)}
        isNightMode={isNightMode}
      />

      <button
        onClick={() => setShowStats(true)}
        className={`fixed bottom-4 left-16 z-30 w-10 h-10 rounded-full flex items-center justify-center ${
          isNightMode ? "bg-indigo-800/70" : "bg-pink-600/70"
        } backdrop-blur-sm border border-white/30 shadow-lg cursor-[url('/pointcur.cur')_pointer] transition-colors duration-1000`}
        title="Open Character Stats"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      </button>

      {isVisible && scrollDismissed && (
        <button
          onClick={() => setScrollVisible(true)}
          className={`fixed bottom-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center ${
            isNightMode ? "bg-indigo-800/70" : "bg-pink-600/70"
          } backdrop-blur-sm border border-white/30 shadow-lg cursor-[url('/pointcur.cur')_pointer] transition-colors duration-1000`}
          title="Show Adventure Guide"
        >
          <span className="text-white text-xl">?</span>
        </button>
      )}

      <button 
        onClick={toggleAudio}
        className={`fixed bottom-4 left-4 z-30 w-10 h-10 rounded-full flex items-center justify-center ${
          isNightMode ? 'bg-indigo-800/70' : 'bg-pink-600/70'
        } backdrop-blur-sm border border-white/30 shadow-lg cursor-[url('/pointcur.cur')_pointer] transition-colors duration-1000`}
        title={audioPlaying ? "Pause Music" : "Play Music"}
      >
        {!audioPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        )}
      </button>

      <style jsx global>{`
        .blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes pulse-x {
          0%,
          100% {
            transform: translateX(0) translateY(-50%);
          }
          50% {
            transform: translateX(-5px) translateY(-50%);
          }
        }

        .animate-pulse-x {
          animation: pulse-x 1.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
