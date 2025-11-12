import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "@/types";
import { Smile, Meh, Frown, Heart, ThumbsUp } from "lucide-react";

interface MoodJournalProps {
  entries: MoodEntry[];
}

const moodIcons = {
  1: Frown,
  2: Meh,
  3: Smile,
  4: ThumbsUp,
  5: Heart,
};

const moodLabels = {
  1: "Stressed",
  2: "Okay",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export const MoodJournal = ({ entries }: MoodJournalProps) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Mood Journal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your emotional wellbeing over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {sortedEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No mood entries yet. Complete a session to get started!
              </p>
            ) : (
              sortedEntries.map((entry) => {
                const Icon = moodIcons[entry.mood as keyof typeof moodIcons];
                const label = moodLabels[entry.mood as keyof typeof moodLabels];
                const date = new Date(entry.timestamp);

                return (
                  <div
                    key={entry.id}
                    className="flex gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <Icon className="h-8 w-8 text-primary" />
                      <span className="text-xs font-medium">{label}</span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {entry.note && (
                        <p className="text-sm text-foreground">{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
