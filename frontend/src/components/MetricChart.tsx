"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MOCK_POINTS = Array.from({ length: 24 }).map((_, idx) => {
  const hour = idx;
  const label = `${hour}:00`;
  const cpu = 20 + Math.round(Math.random() * 60);
  const ram = 30 + Math.round(Math.random() * 50);
  return { time: label, cpu, ram };
});

export default function MetricChart() {
  return (
    <div className="h-64 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <p className="mb-2 text-sm font-semibold text-[var(--text)]">
        CPU vs RAM (mock last 24 hours)
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_POINTS}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            interval={3}
            tickMargin={8}
          />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#3b82f6"
            dot={false}
            name="CPU %"
          />
          <Line
            type="monotone"
            dataKey="ram"
            stroke="#22c55e"
            dot={false}
            name="RAM %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

