import { useState, useEffect, useRef } from "react";

interface CustomScrollbarProps {
  isNightMode?: boolean;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  isNightMode = false,
}) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const scrollbarRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPercentage(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastY.current = e.clientY;
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const delta = e.clientY - lastY.current;
      lastY.current = e.clientY;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollChange = (delta / windowHeight) * documentHeight;

      window.scrollBy(0, scrollChange);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "";
    };

    const scrollbarThumb = scrollbarRef.current;
    if (scrollbarThumb) {
      scrollbarThumb.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (scrollbarThumb) {
        scrollbarThumb.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === scrollbarRef.current) return;

    const trackRect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientY - trackRect.top) / trackRect.height;

    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTarget = clickPosition * (documentHeight - windowHeight);

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const clampedPercentage = Math.min(Math.max(scrollPercentage, 0), 100);
  const thumbTopPosition = `calc(${clampedPercentage}% - 30px)`;

  return (
    <div
      className={`fixed right-2 top-1/2 -translate-y-1/2 h-1/2 w-1 ${
        isNightMode ? "bg-indigo-900/20" : "bg-emerald-900/20"
      } rounded-full z-50 cursor-pointer transition-colors duration-1000`}
      onClick={handleTrackClick}
    >
      <div
        ref={scrollbarRef}
        className={`absolute w-2 -left-0.5 rounded-full cursor-pointer ${
          isNightMode
            ? "bg-indigo-400 hover:bg-indigo-300"
            : "bg-emerald-400 hover:bg-emerald-300"
        } shadow-[0_0_5px_rgba(0,0,0,0.3)] transition-colors duration-1000`}
        style={{
          height: "60px",
          top: thumbTopPosition,
        }}
      >
        <div
          className={`absolute -left-1 -right-1 top-1/2 -translate-y-1/2 h-10 opacity-0 ${
            isNightMode
              ? "bg-indigo-400/10 hover:bg-indigo-400/20"
              : "bg-emerald-400/10 hover:bg-emerald-400/20"
          } rounded-full transition-all duration-200 group-hover:opacity-100`}
        ></div>
      </div>
    </div>
  );
};

export default CustomScrollbar;
