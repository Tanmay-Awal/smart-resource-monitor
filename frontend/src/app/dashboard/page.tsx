import CrashAlertBanner from "@/components/CrashAlertBanner";
import LearningHeatmap from "@/components/LearningHeatmap";
import MetricCard from "@/components/MetricCard";
import MetricChart from "@/components/MetricChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Smart Resource Monitor
      </h1>
      <CrashAlertBanner probability={87} timeMin={8} visible />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="CPU Usage" value={67} unit="%" color="blue" />
        <MetricCard title="RAM Usage" value={72} unit="%" color="green" />
        <MetricCard title="RAM Used" value={11.5} unit="GB" color="purple" />
        <MetricCard title="Disk Read" value={45} unit="MB/s" color="orange" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <MetricChart />
        </div>
        <LearningHeatmap />
      </div>
    </div>
  );
}

