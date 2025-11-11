import { useEffect, useState } from "react";

interface TomatoTimerProps {
  isRunning: boolean;
  isBreak: boolean;
}

export const TomatoTimer = ({ isRunning, isBreak }: TomatoTimerProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isRunning && !isBreak) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRunning, isBreak]);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full transition-all duration-500 ${
          isRunning && !isBreak ? "animate-pulse-gentle" : ""
        }`}
        style={
          isRunning && !isBreak
            ? { transform: `rotate(${rotation}deg)` }
            : undefined
        }
      >
        {/* Tomato body */}
        <ellipse
          cx="100"
          cy="110"
          rx="70"
          ry="75"
          className="fill-tomato-primary"
          style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}
        />
        
        {/* Tomato shine */}
        <ellipse
          cx="80"
          cy="90"
          rx="20"
          ry="25"
          className="fill-tomato-secondary opacity-40"
        />
        
        {/* Stem */}
        <rect
          x="95"
          y="30"
          width="10"
          height="25"
          rx="2"
          className="fill-tomato-leaf"
        />
        
        {/* Leaves */}
        <ellipse
          cx="85"
          cy="40"
          rx="15"
          ry="8"
          className="fill-tomato-leaf"
          transform="rotate(-30 85 40)"
        />
        <ellipse
          cx="115"
          cy="40"
          rx="15"
          ry="8"
          className="fill-tomato-leaf"
          transform="rotate(30 115 40)"
        />
      </svg>
    </div>
  );
};
