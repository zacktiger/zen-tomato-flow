import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TomatoTimer } from "@/components/TomatoTimer";
import { BreathingCircle } from "@/components/BreathingCircle";
import { ProductivityQuote } from "@/components/ProductivityQuote";
import { SettingsDialog } from "@/components/SettingsDialog";
import { TodoManager } from "@/components/TodoManager";
import { StatsDashboard } from "@/components/StatsDashboard";
import { MoodPrompt } from "@/components/MoodPrompt";
import { MoodJournal } from "@/components/MoodJournal";
import { Play, Pause, RotateCcw, BarChart3, BookHeart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, FocusSession, MoodEntry } from "@/types";
import backgroundImage from "@/assets/calm-background.jpg";

const Index = () => {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [lastCompletedSessionType, setLastCompletedSessionType] = useState<"focus" | "break">("focus");
  const [activeTab, setActiveTab] = useState("home");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistent data
  const [tasks, setTasks] = useLocalStorage<Task[]>("serene-tasks", []);
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>("serene-sessions", []);
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>("serene-moods", []);

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
      playNotification();
      
      if (isBreak) {
        // Break complete
        const session: FocusSession = {
          id: Date.now().toString(),
          duration: breakTime,
          completedAt: Date.now(),
          type: "break",
        };
        setSessions([...sessions, session]);
        
        toast({
          title: "Break Complete! 🌱",
          description: "Ready to focus again? Your mind is refreshed.",
        });
        
        setLastCompletedSessionType("break");
        setShowMoodPrompt(true);
        setIsBreak(false);
        setTimeLeft(focusTime * 60);
        setIsRunning(false);
      } else {
        // Focus session complete
        const session: FocusSession = {
          id: Date.now().toString(),
          taskId: currentTask?.id,
          taskTitle: currentTask?.title,
          duration: focusTime,
          completedAt: Date.now(),
          type: "focus",
        };
        setSessions([...sessions, session]);
        
        // Mark current task as completed
        if (currentTask) {
          setTasks(tasks.map(t => 
            t.id === currentTask.id ? { ...t, completed: true } : t
          ));
        }
        
        toast({
          title: "Focus Session Complete! 🍅",
          description: "Time for a mindful break. Breathe and recharge.",
        });
        
        setLastCompletedSessionType("focus");
        setShowMoodPrompt(true);
        setIsBreak(true);
        setTimeLeft(breakTime * 60);
        setIsRunning(true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, focusTime, breakTime, currentTask, tasks, sessions]);

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
    if (!isBreak) {
      const session: FocusSession = {
        id: Date.now().toString(),
        taskId: currentTask?.id,
        taskTitle: currentTask?.title,
        duration: Math.ceil((focusTime * 60 - timeLeft) / 60),
        completedAt: Date.now(),
        type: "focus",
      };
      setSessions([...sessions, session]);
    }
    
    setIsBreak(true);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    toast({
      title: "Break Started 🌿",
      description: "Taking a well-deserved break early.",
    });
  };

  // Task management
  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (currentTask?.id === id) {
      setCurrentTask(null);
    }
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const startFocusWithTask = (task: Task) => {
    setCurrentTask(task);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusTime * 60);
    setActiveTab("home");
    toast({
      title: "Focus Session Ready",
      description: `Press play to start focusing on: ${task.title}`,
    });
  };

  const handleMoodSubmit = (mood: number, note?: string) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      note,
      timestamp: Date.now(),
    };
    setMoodEntries([...moodEntries, entry]);
    setShowMoodPrompt(false);
    toast({
      title: "Mood Saved",
      description: "Thank you for tracking your wellbeing!",
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
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground">
            Serene Focus
          </h1>
          <SettingsDialog
            focusTime={focusTime}
            breakTime={breakTime}
            onFocusTimeChange={setFocusTime}
            onBreakTimeChange={setBreakTime}
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookHeart className="h-4 w-4" />
              Journal
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Mood Prompt */}
              {showMoodPrompt && (
                <MoodPrompt
                  onSubmit={handleMoodSubmit}
                  sessionType={lastCompletedSessionType}
                />
              )}

              {/* Todo Manager */}
              <TodoManager
                tasks={tasks}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onStartFocus={startFocusWithTask}
              />

              {/* Current Task Display */}
              {currentTask && !currentTask.completed && (
                <div className="text-center text-sm text-muted-foreground">
                  Focusing on: <span className="font-medium text-foreground">{currentTask.title}</span>
                </div>
              )}

              {/* Timer Section */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-serif text-center text-foreground">
                  {isBreak ? "Time to Breathe" : "Focus Timer"}
                </h2>

                <div className="flex flex-col items-center space-y-6">
                  {isBreak ? (
                    <BreathingCircle duration={breakTime} />
                  ) : (
                    <>
                      <TomatoTimer isRunning={isRunning} isBreak={isBreak} />
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

                  <div className="text-6xl md:text-8xl font-light text-foreground tabular-nums">
                    {formatTime(timeLeft)}
                  </div>

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
              </div>

              {/* Quote */}
              {!isRunning && !isBreak && (
                <div className="mt-8">
                  <ProductivityQuote />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="max-w-6xl mx-auto">
              <StatsDashboard
                sessions={sessions}
                moodEntries={moodEntries}
                tasks={tasks}
              />
            </div>
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal">
            <div className="max-w-4xl mx-auto">
              <MoodJournal entries={moodEntries} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
