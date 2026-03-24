interface ResponseTimeChartProps {
  history: number[];
}

export function ResponseTimeChart({ history }: ResponseTimeChartProps) {
  const values = history.slice(-32);
  const width = 340;
  const height = 90;
  const pad = 8;

  if (!values.length) {
    return (
      <div className="flex items-center justify-center h-[90px] text-sm text-muted-foreground">
        No history yet
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - 2 * pad) / Math.max(values.length - 1, 1);

  const points = values
    .map((v, i) => {
      const x = pad + i * step;
      const norm = (v - min) / range;
      const y = height - pad - norm * (height - 2 * pad);
      return `${x},${y}`;
    })
    .join(' ');

  const baselineY = height - pad;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Each point = last N health checks</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded bg-accent" />
            Response time (ms)
          </span>
        </div>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-[90px]">
        {/* Baseline */}
        <line
          x1={pad}
          y1={baselineY}
          x2={width - pad}
          y2={baselineY}
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        
        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Min/Max labels */}
        <text x={pad} y={pad + 10} fill="hsl(var(--muted-foreground))" fontSize="10">
          max ~ {max} ms
        </text>
        <text x={pad} y={height - 2} fill="hsl(var(--muted-foreground))" fontSize="10">
          min ~ {min} ms
        </text>
        <text
          x={width - pad}
          y={height - 2}
          fill="hsl(var(--muted-foreground))"
          fontSize="9"
          textAnchor="end"
        >
          latest
        </text>
      </svg>
    </div>
  );
}
