import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TomatoTimer } from "@/components/TomatoTimer";
import { BreathingCircle } from "@/components/BreathingCircle";
import { ProductivityQuote } from "@/components/ProductivityQuote";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import backgroundImage from "@/assets/calm-background.jpg";

const Index = () => {
  const [focusTime, setFocusTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(focusTime * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for notification
    audioRef.current = new Audio();
    // Using a simple oscillator-based tone instead of external audio file
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(isBreak ? breakTime * 60 : focusTime * 60);
  }, [focusTime, breakTime, isBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      playNotification();
      
      if (isBreak) {
        toast({
          title: "Break Complete! 🌱",
          description: "Ready to focus again? Your mind is refreshed.",
        });
        setIsBreak(false);
        setTimeLeft(focusTime * 60);
        setIsRunning(false);
      } else {
        toast({
          title: "Focus Session Complete! 🍅",
          description: "Time for a mindful break. Breathe and recharge.",
        });
        setIsBreak(true);
        setTimeLeft(breakTime * 60);
        setIsRunning(true); // Auto-start break
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, focusTime, breakTime]);

  const playNotification = () => {
    // Create a pleasant notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 528; // C note, calming frequency
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusTime * 60);
  };

  const skipToBreak = () => {
    setIsBreak(true);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    toast({
      title: "Break Started 🌿",
      description: "Taking a well-deserved break early.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100
    : ((focusTime * 60 - timeLeft) / (focusTime * 60)) * 100;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="absolute top-6 right-6">
          <SettingsDialog
            focusTime={focusTime}
            breakTime={breakTime}
            onFocusTimeChange={setFocusTime}
            onBreakTimeChange={setBreakTime}
          />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-serif text-center text-foreground animate-fade-in">
            {isBreak ? "Time to Breathe" : "Calm Focus"}
          </h1>

          {/* Timer Display */}
          <div className="flex flex-col items-center space-y-6">
            {isBreak ? (
              <BreathingCircle duration={breakTime} />
            ) : (
              <>
                <TomatoTimer isRunning={isRunning} isBreak={isBreak} />
                
                {/* Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Time Display */}
            <div className="text-6xl md:text-8xl font-light text-foreground tabular-nums">
              {formatTime(timeLeft)}
            </div>

            {/* Status Text */}
            <p className="text-lg md:text-xl text-muted-foreground font-light">
              {isBreak
                ? "Break Time - Restore Your Energy"
                : isRunning
                ? "Focus Mode - You're Doing Great"
                : "Ready to Begin?"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all hover:scale-105"
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 border-border hover:bg-accent transition-all hover:scale-105"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            {isRunning && !isBreak && (
              <Button
                onClick={skipToBreak}
                size="lg"
                variant="secondary"
                className="rounded-full px-6 h-16 shadow-lg transition-all hover:scale-105"
              >
                Start Break
              </Button>
            )}
          </div>

          {/* Quote */}
          {!isRunning && !isBreak && (
            <div className="mt-8">
              <ProductivityQuote />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
