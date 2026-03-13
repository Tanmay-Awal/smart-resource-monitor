interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export default function MetricCard({
  title,
  value,
  unit,
  color = "blue",
}: MetricCardProps) {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
  }[color];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold ${colorClass}`}>
        {value}
        {unit && (
          <span className="ml-1 text-lg font-semibold text-gray-400">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

