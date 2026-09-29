export default function ScoreGauge({
  score,
  size = 140,
  strokeWidth = 10,
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s) => {
    if (s >= 80) return "#10b981";
    if (s >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition:
                "stroke-dashoffset 1.5s ease-in-out, stroke 1.5s ease-in-out",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-medium"
            style={{ fontSize: size * 0.28, color }}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
