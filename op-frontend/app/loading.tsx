import { BrainCircuit } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-background">
      <div className="flex flex-col items-center gap-6">
        <BrainCircuit className="h-10 w-10 text-primary" />

        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">Loading</p>
          <p className="text-xs text-muted-foreground mt-1">
            Analyzing market data…
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </div>
  );
}
