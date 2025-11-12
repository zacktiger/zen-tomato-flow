import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusSession, MoodEntry, Task } from "@/types";
import { Clock, Target, TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatsDashboardProps {
  sessions: FocusSession[];
  moodEntries: MoodEntry[];
  tasks: Task[];
}

export const StatsDashboard = ({
  sessions,
  moodEntries,
  tasks,
}: StatsDashboardProps) => {
  const focusSessions = sessions.filter((s) => s.type === "focus");
  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Calculate streak (consecutive days with at least one focus session)
  const getStreak = () => {
    if (focusSessions.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessionDates = focusSessions
      .map((s) => {
        const date = new Date(s.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .filter((time, index, arr) => arr.indexOf(time) === index)
      .sort((a, b) => b - a);

    let streak = 0;
    let checkDate = today.getTime();

    for (const sessionDate of sessionDates) {
      if (sessionDate === checkDate) {
        streak++;
        checkDate -= 24 * 60 * 60 * 1000; // Move to previous day
      } else if (sessionDate < checkDate) {
        break;
      }
    }

    return streak;
  };

  // Get last 7 days data
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = focusSessions.filter(
        (s) => s.completedAt >= date.getTime() && s.completedAt < nextDay.getTime()
      );

      const dayMoods = moodEntries.filter(
        (m) => m.timestamp >= date.getTime() && m.timestamp < nextDay.getTime()
      );

      const avgMood = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + m.mood, 0) / dayMoods.length
        : 0;

      data.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        sessions: daySessions.length,
        minutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
        mood: avgMood,
      });
    }

    return data;
  };

  const weekData = getLast7DaysData();
  const streak = getStreak();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{focusSessions.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Weekly Focus Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
