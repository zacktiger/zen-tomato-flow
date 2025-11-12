import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Heart, ThumbsUp } from "lucide-react";

interface MoodPromptProps {
  onSubmit: (mood: number, note?: string) => void;
  sessionType: "focus" | "break";
}

const moodOptions = [
  { value: 1, icon: Frown, label: "Stressed", color: "text-destructive" },
  { value: 2, icon: Meh, label: "Okay", color: "text-muted-foreground" },
  { value: 3, icon: Smile, label: "Good", color: "text-primary" },
  { value: 4, icon: ThumbsUp, label: "Great", color: "text-primary" },
  { value: 5, icon: Heart, label: "Excellent", color: "text-primary" },
];

export const MoodPrompt = ({ onSubmit, sessionType }: MoodPromptProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood, note.trim() || undefined);
      setSelectedMood(null);
      setNote("");
    }
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">How are you feeling?</CardTitle>
        <p className="text-sm text-muted-foreground">
          {sessionType === "focus"
            ? "You just completed a focus session"
            : "Break time complete"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-around gap-2">
          {moodOptions.map(({ value, icon: Icon, label, color }) => (
            <button
              key={value}
              onClick={() => setSelectedMood(value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:scale-110 ${
                selectedMood === value
                  ? "bg-primary/20 scale-110"
                  : "bg-background/50 hover:bg-background/70"
              }`}
            >
              <Icon
                className={`h-8 w-8 ${
                  selectedMood === value ? "text-primary" : color
                }`}
              />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-background/50"
          rows={3}
        />

        <Button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className="w-full"
        >
          Save Mood
        </Button>
      </CardContent>
    </Card>
  );
};
