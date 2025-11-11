import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

interface SettingsDialogProps {
  focusTime: number;
  breakTime: number;
  onFocusTimeChange: (value: number) => void;
  onBreakTimeChange: (value: number) => void;
}

export const SettingsDialog = ({
  focusTime,
  breakTime,
  onFocusTimeChange,
  onBreakTimeChange,
}: SettingsDialogProps) => {
  const [localFocusTime, setLocalFocusTime] = useState(focusTime);
  const [localBreakTime, setLocalBreakTime] = useState(breakTime);

  const handleSave = () => {
    onFocusTimeChange(localFocusTime);
    onBreakTimeChange(localBreakTime);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-border hover:bg-accent transition-all"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground font-serif text-2xl">
            Timer Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your focus and break durations to match your rhythm.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="focus-time" className="text-foreground">
                Focus Duration
              </Label>
              <span className="text-sm font-medium text-foreground">
                {localFocusTime} min
              </span>
            </div>
            <Slider
              id="focus-time"
              min={5}
              max={60}
              step={5}
              value={[localFocusTime]}
              onValueChange={(value) => setLocalFocusTime(value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-time" className="text-foreground">
                Break Duration
              </Label>
              <span className="text-sm font-medium text-foreground">
                {localBreakTime} min
              </span>
            </div>
            <Slider
              id="break-time"
              min={1}
              max={20}
              step={1}
              value={[localBreakTime]}
              onValueChange={(value) => setLocalBreakTime(value[0])}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
