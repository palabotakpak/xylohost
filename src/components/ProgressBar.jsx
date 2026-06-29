import { Card } from "./ui/card";

export default function ProgressBar({ percent, label }) {
  if (percent == null) return null;
  return (
    <Card className="p-4 mt-6">
      <div className="w-full h-1 bg-black">
        <div
          className="h-full bg-gold transition-all duration-300 ease-out"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 font-mono text-xs text-ash">
        <span className="uppercase tracking-[0.05em]">{label || "Uploading..."}</span>
        <span>{Math.round(percent)}%</span>
      </div>
    </Card>
  );
}
