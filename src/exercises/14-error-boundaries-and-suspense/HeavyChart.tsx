// Pretend this file pulls in a big charting library. It's split into its own chunk via lazy().
const data = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 15 },
  { label: 'Fri', value: 22 },
]

export default function HeavyChart() {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <figure style={{ margin: 0 }}>
      <figcaption>
        <strong>Weekly sales</strong>
      </figcaption>
      <svg width={260} height={130} role="img" aria-label="Bar chart of weekly sales">
        {data.map((d, i) => {
          const h = (d.value / max) * 100
          return (
            <g key={d.label} transform={`translate(${i * 50 + 10}, 0)`}>
              <rect y={110 - h} width={32} height={h} rx={4} fill="var(--accent)" />
              <text x={16} y={125} textAnchor="middle" fontSize={11} fill="currentColor">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
