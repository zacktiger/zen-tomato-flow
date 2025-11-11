import { useEffect, useState } from "react";

interface BreathingCircleProps {
  duration: number; // in seconds
}

export const BreathingCircle = ({ duration }: BreathingCircleProps) => {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [text, setText] = useState("Breathe In");

  useEffect(() => {
    const cycleTime = 12000; // 12 seconds per full cycle
    const inhale = 4000;
    const hold = 4000;
    const exhale = 4000;

    const cycle = () => {
      // Breathe in
      setPhase("in");
      setText("Breathe In");
      
      setTimeout(() => {
        // Hold
        setPhase("hold");
        setText("Hold");
        
        setTimeout(() => {
          // Breathe out
          setPhase("out");
          setText("Breathe Out");
        }, hold);
      }, inhale);
    };

    cycle();
    const interval = setInterval(cycle, cycleTime);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-sage-light to-sage transition-all duration-4000 ease-in-out flex items-center justify-center ${
            phase === "in"
              ? "animate-breathe-in"
              : phase === "out"
              ? "animate-breathe-out"
              : "scale-110"
          }`}
          style={{
            boxShadow: "0 0 60px rgba(120, 160, 140, 0.4)",
          }}
        >
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-serif text-foreground">
              {text}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-center max-w-md px-4 font-light">
        Take this moment to center yourself. Deep breathing calms the mind and refreshes your spirit.
      </p>
    </div>
  );
};
