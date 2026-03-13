# 🧑‍💻 HIMANSHU'S TASK SHEET — Smart Resource Monitor
**Duration:** 30 Days | **Teammate:** Tanmay
**Your Role:** Frontend core + Features 6, 7, 8, 9, 10 (out of 11)

---

> ⚠️ **HOW DEPENDENCY WORKS:**
> At several points you CANNOT move forward until Tanmay finishes his backend. These are marked 🔴 **BLOCKED — Wait for Tanmay**. Points where Tanmay is waiting on you are marked 🟢 **Tanmay is waiting on YOU**.

---

## 🗂️ YOUR FEATURE OWNERSHIP

You and Tanmay each own 5 features. You own the **full frontend + UI** for your 5 features, and you also connect Tanmay's backend APIs to the UI.

| # | Feature | What You Build |
|---|---------|---------------|
| 6 | Advanced Visualizations (Dashboard) | Heatmap, metric charts, process timeline, live graphs |
| 7 | Smart Notifications | Notification center, alert popups, quiet hours toggle |
| 8 | Auto-Pilot Mode UI | Toggle, action history feed, process kill button |
| 9 | Disk Health + Scheduled Optimization UI | Disk health card, schedule panel, task history |
| 10 | Resource Usage Stories UI | Daily story card, weekly summary, achievement badges |
| 11 | Personalized System Learning UI | Pattern heatmap, recommendation card (built together with Tanmay) |

---

## 📦 PHASE 1 — FOUNDATION (Days 1–4)

### ✅ Day 1 — Project & Repo Setup (TOGETHER with Tanmay)

Sit together and do this:

```bash
git clone <repo Tanmay created>
cd smart-resource-monitor
git checkout -b himanshu-dev
```

The repo structure will already have `/frontend` and `/backend` folders. Your work goes entirely in `/frontend`. Make sure `docs/api_contract.md` is in the shared `docs/` folder — Tanmay will fill this in as he builds APIs, and you will read it to know what to call.

---

### ✅ Days 2–4 — Frontend Project Setup (While Tanmay builds the backend)

You work on frontend setup in parallel — no backend needed yet.

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --eslint
npm install axios socket.io-client @tanstack/react-query recharts lucide-react
npx shadcn-ui@latest init
```

Install shadcn components:
```bash
npx shadcn-ui@latest add card button badge alert progress tabs switch
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

Create folder structure:
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← redirects to /dashboard
│   ├── login/page.tsx
│   ├── dashboard/page.tsx     ← Feature 6
│   ├── notifications/page.tsx ← Feature 7
│   ├── autopilot/page.tsx     ← Feature 8
│   ├── disk/page.tsx          ← Feature 9
│   └── stories/page.tsx       ← Feature 10
├── components/
│   ├── MetricCard.tsx
│   ├── MetricChart.tsx
│   ├── HeatmapChart.tsx
│   ├── ProcessTable.tsx
│   ├── CrashAlertBanner.tsx
│   ├── NotificationCenter.tsx
│   ├── AutoPilotPanel.tsx
│   ├── DiskHealthCard.tsx
│   ├── SchedulerPanel.tsx
│   ├── StoryCard.tsx
│   └── Sidebar.tsx
├── hooks/
│   ├── useMetrics.ts
│   └── useQuery.ts
└── lib/
    └── api.ts
```

---

### ✅ Days 3–4 — Build Static UI with Mock Data

Build all the components with hardcoded mock data so you can see them visually before Tanmay's backend is ready. This way you don't waste any time waiting.

**`components/MetricCard.tsx`:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props { title: string; value: number | string; unit: string; color?: string }

export default function MetricCard({ title, value, unit, color = "blue" }: Props) {
  return (
    <Card className="shadow-md">
      <CardHeader><CardTitle className="text-sm text-gray-500">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold text-${color}-600`}>
          {value}<span className="text-lg ml-1 text-gray-400">{unit}</span>
        </p>
      </CardContent>
    </Card>
  )
}
```

**`components/CrashAlertBanner.tsx`:**
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Props { probability: number; timeMin: number; visible: boolean; onFix?: () => void }

export default function CrashAlertBanner({ probability, timeMin, visible, onFix }: Props) {
  if (!visible || probability < 50) return null
  return (
    <Alert className="border-red-500 bg-red-50 animate-pulse mb-4">
      <AlertTitle className="text-red-700 font-bold text-lg">
        ⚠️ Crash Predicted! <Badge variant="destructive">{probability}% probability</Badge>
      </AlertTitle>
      <AlertDescription className="text-red-600 mt-1">
        System may crash in approximately <strong>{timeMin} minutes</strong>.
        <button onClick={onFix} className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
          Auto-Fix Now
        </button>
      </AlertDescription>
    </Alert>
  )
}
```

**`app/dashboard/page.tsx`** (with mock data for now):
```tsx
"use client"
import MetricCard from "@/components/MetricCard"
import CrashAlertBanner from "@/components/CrashAlertBanner"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Resource Monitor</h1>
      <CrashAlertBanner probability={87} timeMin={8} visible={true} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value={67} unit="%" color="blue" />
        <MetricCard title="RAM Usage" value={72} unit="%" color="green" />
        <MetricCard title="RAM Used" value={11.5} unit="GB" color="purple" />
        <MetricCard title="Disk Read" value={45} unit="MB/s" color="orange" />
      </div>
    </div>
  )
}
```

Run `npm run dev` → open `http://localhost:3000/dashboard` and verify everything looks good visually.

---

**`app/login/page.tsx`:**
```tsx
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password })
      localStorage.setItem("token", res.data.access_token)
      router.push("/dashboard")
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader><CardTitle className="text-center">🖥️ Smart Resource Monitor</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input className="w-full border rounded p-2 text-sm" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded p-2 text-sm" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Login</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🔌 PHASE 2 — CONNECT TO BACKEND + FEATURE 6: DASHBOARD (Days 5–9)

### 🔴 Days 5–6 — BLOCKED — Wait for Tanmay
> Tanmay is still building the backend (Days 5–7). You use these days to polish your static UI, add more mock states (loading states, empty states), and write the `lib/api.ts` file that you'll switch on once Tanmay is ready.

---

**`lib/api.ts`** (write this now, it'll work once Tanmay's server is running):
```typescript
import axios from "axios"

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

// Auth
export const login = (email: string, password: string) =>
  API.post("/auth/login", { email, password })

// Metrics
export const getCurrentMetrics = () => API.get("/metrics/current")
export const getProcesses = () => API.get("/metrics/processes")
export const getHistory = (hours = 24) => API.get(`/metrics/history?hours=${hours}`)
export const getRootCause = () => API.get("/metrics/root-cause")

// Predictions
export const getCrashPrediction = () => API.get("/predict/crash")

// Autopilot
export const toggleAutopilot = (enable: boolean) => API.post(`/metrics/autopilot/toggle?enable=${enable}`)
export const killProcess = (pid: number) => API.post(`/metrics/autopilot/kill/${pid}`)
export const getAutopilotHistory = () => API.get("/metrics/autopilot/history")

// Temperature & Battery
export const getTemperature = () => API.get("/metrics/temperature")
export const getTempPrediction = () => API.get("/metrics/temperature/predict")
export const getBattery = () => API.get("/metrics/battery")

// AI
export const sendChat = (message: string) => API.post("/ai/chat", { message })
export const getDailyStory = () => API.get("/ai/daily-story")

// Learning
export const getLearningPattern = () => API.get("/metrics/learning/pattern")
```

---

### ✅ Days 7–8 — Connect WebSocket + Live Dashboard (After Tanmay shares API contract)

**`hooks/useMetrics.ts`:**
```typescript
"use client"
import { useEffect, useState } from "react"

export interface Metrics {
  time: string
  cpu_percent: number
  ram_percent: number
  ram_used_gb: number
  disk_read_mb: number
  disk_write_mb: number
  network_sent_mb: number
  network_recv_mb: number
  cpu_temp: number | null
  anomaly: boolean
  anomaly_message: string | null
}

export function useMetrics(): Metrics | null {
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + "/ws/metrics")
    ws.onmessage = (e) => setMetrics(JSON.parse(e.data))
    ws.onerror = () => console.error("WebSocket error")
    return () => ws.close()
  }, [])

  return metrics
}
```

Update `app/dashboard/page.tsx` to use real data:
```tsx
"use client"
import { useMetrics } from "@/hooks/useMetrics"
import MetricCard from "@/components/MetricCard"
import CrashAlertBanner from "@/components/CrashAlertBanner"
import { useQuery } from "@tanstack/react-query"
import { getCrashPrediction } from "@/lib/api"

export default function Dashboard() {
  const metrics = useMetrics()
  const { data: crashData } = useQuery({
    queryKey: ['crash'],
    queryFn: getCrashPrediction,
    refetchInterval: 15000
  })

  if (!metrics) return <div className="p-6 text-gray-500">Connecting to system monitor...</div>

  const crash = crashData?.data

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Resource Monitor</h1>
      <CrashAlertBanner
        probability={crash?.crash_probability || 0}
        timeMin={crash?.time_to_crash_min || 30}
        visible={(crash?.crash_probability || 0) >= 50}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value={metrics.cpu_percent} unit="%" color="blue" />
        <MetricCard title="RAM Usage" value={metrics.ram_percent} unit="%" color="green" />
        <MetricCard title="RAM Used" value={metrics.ram_used_gb} unit="GB" color="purple" />
        <MetricCard title="Disk Read" value={metrics.disk_read_mb} unit="MB/s" color="orange" />
      </div>
    </div>
  )
}
```

---

### ✅ Day 9 — Advanced Charts (Feature 6)

Build a CPU/RAM line chart with Recharts:
```tsx
// components/MetricChart.tsx
"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getHistory } from "@/lib/api"

export default function MetricChart() {
  const { data } = useQuery({ queryKey: ['history'], queryFn: () => getHistory(1), refetchInterval: 10000 })
  const chartData = (data?.data || []).slice(-30).map((r: any) => ({
    time: new Date(r.recorded_at).toLocaleTimeString(),
    cpu: r.cpu_percent,
    ram: r.ram_percent
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" dot={false} />
        <Line type="monotone" dataKey="ram" stroke="#22c55e" name="RAM %" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

🟢 **END OF DAY 9 — Tanmay is waiting on YOU**
> After Day 8, Tanmay needs to verify that his WebSocket data is actually rendering correctly on your dashboard. Sit together and confirm everything works end-to-end before he continues building Features 2–5.

---

## 🔔 PHASE 3 — FEATURE 7: SMART NOTIFICATIONS (Days 10–12)

### ✅ Days 10–11 — Notification Center Component

This feature automatically uses Tanmay's anomaly detection — whenever his WebSocket sends `anomaly: true`, your notification center fires.

**`components/NotificationCenter.tsx`:**
```tsx
"use client"
import { useEffect, useState } from "react"
import { useMetrics } from "@/hooks/useMetrics"

interface Notification {
  id: number
  message: string
  type: "warning" | "critical" | "info"
  time: string
}

export default function NotificationCenter() {
  const metrics = useMetrics()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [quietMode, setQuietMode] = useState(false)
  const [dismissed, setDismissed] = useState<number[]>([])

  useEffect(() => {
    if (metrics?.anomaly && metrics.anomaly_message && !quietMode) {
      const newNotif: Notification = {
        id: Date.now(),
        message: metrics.anomaly_message,
        type: metrics.cpu_percent > 90 ? "critical" : "warning",
        time: new Date().toLocaleTimeString()
      }
      setNotifications(prev => [newNotif, ...prev].slice(0, 20))
    }
  }, [metrics?.anomaly, metrics?.anomaly_message])

  const visible = notifications.filter(n => !dismissed.includes(n.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">🔔 Notifications</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Quiet Mode</span>
          <button
            onClick={() => setQuietMode(!quietMode)}
            className={`w-10 h-5 rounded-full transition-colors ${quietMode ? 'bg-gray-400' : 'bg-green-500'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-transform ${quietMode ? '' : 'translate-x-5'}`} />
          </button>
        </div>
      </div>

      {visible.length === 0 && (
        <p className="text-gray-400 text-sm">No alerts. System is running normally.</p>
      )}

      {visible.map(n => (
        <div key={n.id} className={`p-3 rounded-lg border text-sm flex justify-between items-start ${
          n.type === 'critical' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div>
            <p className="font-medium">{n.type === 'critical' ? '🚨' : '⚠️'} {n.message}</p>
            <p className="text-gray-500 text-xs mt-1">{n.time}</p>
          </div>
          <button onClick={() => setDismissed(p => [...p, n.id])} className="text-gray-400 hover:text-gray-700 ml-2">✕</button>
        </div>
      ))}
    </div>
  )
}
```

---

### ✅ Day 12 — Root Cause Card (Connects to Tanmay's Feature 2)

```tsx
// components/RootCauseCard.tsx
"use client"
import { useQuery } from "@tanstack/react-query"
import { getRootCause } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RootCauseCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['rootcause'],
    queryFn: getRootCause,
    refetchInterval: 15000
  })

  const rc = data?.data

  return (
    <Card className={`border-2 ${rc?.status === 'healthy' ? 'border-green-300' : 'border-orange-300'}`}>
      <CardHeader>
        <CardTitle className="text-base">🔍 Why is my system slow?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && <p className="text-gray-400 text-sm">Analyzing...</p>}
        {rc && (
          <>
            <p className={`font-medium text-sm ${rc.status === 'healthy' ? 'text-green-600' : 'text-orange-600'}`}>
              {rc.summary}
            </p>
            <ul className="text-sm space-y-1">
              {rc.issues?.map((issue: string, i: number) => (
                <li key={i} className="text-gray-700">• {issue}</li>
              ))}
            </ul>
            {rc.suggestions?.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-gray-500 font-semibold mb-1">Suggestions:</p>
                {rc.suggestions.map((s: string, i: number) => (
                  <p key={i} className="text-xs text-blue-600">→ {s}</p>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
```

Add this card to `app/dashboard/page.tsx`.

---

## ⚙️ PHASE 4 — FEATURE 8: AUTO-PILOT MODE UI (Days 13–16)

### ✅ Days 13–14 — Process Table with Kill Button

**`components/ProcessTable.tsx`:**
```tsx
"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProcesses, killProcess } from "@/lib/api"
import { useState } from "react"

export default function ProcessTable() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['processes'], queryFn: getProcesses, refetchInterval: 5000 })
  const [killing, setKilling] = useState<number | null>(null)

  const killMutation = useMutation({
    mutationFn: (pid: number) => killProcess(pid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] })
      setKilling(null)
    }
  })

  const processes = data?.data || []

  return (
    <div className="overflow-auto rounded border">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2 text-left">PID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">CPU %</th>
            <th className="p-2 text-left">RAM (MB)</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p: any) => (
            <tr key={p.pid} className="border-t hover:bg-gray-50">
              <td className="p-2 text-gray-500">{p.pid}</td>
              <td className="p-2 font-medium">{p.name}</td>
              <td className={`p-2 font-semibold ${p.cpu_percent > 20 ? 'text-red-600' : p.cpu_percent > 10 ? 'text-orange-500' : 'text-gray-700'}`}>
                {p.cpu_percent}%
              </td>
              <td className="p-2">{p.ram_mb}</td>
              <td className="p-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {p.status}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => { setKilling(p.pid); killMutation.mutate(p.pid) }}
                  disabled={killing === p.pid}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                >
                  {killing === p.pid ? "Killing..." : "Kill"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

### ✅ Days 15–16 — Auto-Pilot Toggle + Action History Feed

**`app/autopilot/page.tsx`:**
```tsx
"use client"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toggleAutopilot, getAutopilotHistory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProcessTable from "@/components/ProcessTable"

export default function AutoPilotPage() {
  const [enabled, setEnabled] = useState(false)

  const toggleMutation = useMutation({
    mutationFn: (enable: boolean) => toggleAutopilot(enable),
    onSuccess: (_, enable) => setEnabled(enable)
  })

  const { data: historyData } = useQuery({
    queryKey: ['autopilot-history'],
    queryFn: getAutopilotHistory,
    refetchInterval: 5000
  })

  const history = historyData?.data || []

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Auto-Pilot Mode</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-lg">Auto-Pilot</p>
              <p className="text-sm text-gray-500">When enabled, AI will automatically terminate processes causing performance issues.</p>
            </div>
            <button
              onClick={() => toggleMutation.mutate(!enabled)}
              className={`ml-auto w-16 h-8 rounded-full transition-colors relative ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${enabled ? 'left-9' : 'left-1'}`} />
            </button>
            <span className={`font-semibold ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
              {enabled ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>📋 Action History</CardTitle></CardHeader>
        <CardContent>
          {history.length === 0 && <p className="text-gray-400 text-sm">No actions taken yet.</p>}
          {history.map((h: any, i: number) => (
            <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
              <span>Terminated <strong>{h.name}</strong> (PID {h.pid})</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${h.by === 'autopilot' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {h.by}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🗂️ Running Processes</CardTitle></CardHeader>
        <CardContent><ProcessTable /></CardContent>
      </Card>
    </div>
  )
}
```

---

🟢 **Day 16 — Tanmay is waiting on YOU**
> By end of Day 16, sit together with Tanmay and verify:
> - Crash alert banner shows from his `/predict/crash` endpoint ✅
> - Anomaly notifications fire from WebSocket ✅
> - Kill button works and process disappears from table ✅
> - Auto-pilot toggle updates his backend state ✅

---

## 💾 PHASE 5 — FEATURE 9: DISK HEALTH + SCHEDULED OPTIMIZATION UI (Days 17–19)

### ✅ Days 17–18 — Disk Health Card

**`components/DiskHealthCard.tsx`:**
```tsx
"use client"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import axios from "axios"

export default function DiskHealthCard() {
  const { data } = useQuery({
    queryKey: ['disk-health'],
    queryFn: () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/disk/health`),
    refetchInterval: 30000
  })

  const disk = data?.data

  return (
    <Card>
      <CardHeader><CardTitle>💾 Disk Health</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!disk && <p className="text-gray-400 text-sm">Loading disk health...</p>}
        {disk && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Health</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                disk.health === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>{disk.health || "Unknown"}</span>
            </div>
            {disk.model && <p className="text-sm text-gray-500">Model: {disk.model}</p>}
            {disk.temperature && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Temperature</span><span>{disk.temperature}°C</span>
                </div>
                <Progress value={Math.min((disk.temperature / 60) * 100, 100)} className="h-2" />
              </div>
            )}
            {disk.health !== 'PASS' && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                ⚠️ Disk health warning detected. Consider backing up your data soon.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
```

---

### ✅ Day 19 — Scheduled Optimization Panel (Feature 9)

**`components/SchedulerPanel.tsx`:**
```tsx
"use client"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

const tasks = [
  { id: "cleanup", label: "🧹 Cache Cleanup", description: "Clears temp files and cached data" },
  { id: "memory", label: "💾 Memory Optimization", description: "Frees up unused RAM allocations" },
]

export default function SchedulerPanel() {
  const [results, setResults] = useState<{task: string; result: string}[]>([])

  const runTask = async (taskId: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/scheduler/run-${taskId}`)
      setResults(prev => [{ task: taskId, result: res.data.status || "Done" }, ...prev])
    } catch {
      setResults(prev => [{ task: taskId, result: "Failed to run task" }, ...prev])
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>🗓️ Scheduled Optimization</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">{t.label}</p>
              <p className="text-xs text-gray-500">{t.description}</p>
            </div>
            <button
              onClick={() => runTask(t.id)}
              className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
            >Run Now</button>
          </div>
        ))}

        {results.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">Recent Task Results:</p>
            {results.slice(0, 5).map((r, i) => (
              <p key={i} className="text-xs text-green-700">✅ {r.task}: {r.result}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

Build `app/disk/page.tsx` combining `DiskHealthCard` and `SchedulerPanel`.

---

## 📖 PHASE 6 — FEATURE 10: RESOURCE USAGE STORIES + CHATBOT (Days 20–23)

### ✅ Days 20–21 — Daily Story Card + Chatbot UI

**`components/StoryCard.tsx`:**
```tsx
"use client"
import { useQuery } from "@tanstack/react-query"
import { getDailyStory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StoryCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['story'],
    queryFn: getDailyStory,
    staleTime: 1000 * 60 * 30
  })

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="text-purple-700">📖 Today's System Story</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-gray-400 animate-pulse text-sm">Generating your story...</p>}
        {data && <p className="text-gray-700 leading-relaxed text-sm">{data.data.story}</p>}
      </CardContent>
    </Card>
  )
}
```

**`components/Chatbot.tsx`:**
```tsx
"use client"
import { useState, useRef, useEffect } from "react"
import { sendChat } from "@/lib/api"

interface Message { role: "user" | "ai"; text: string }

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm your system assistant. Ask me anything — 'Why is my CPU high?', 'Is my disk healthy?', 'Why is it hot?'" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await sendChat(input)
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden shadow">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 font-semibold">
        🤖 AI System Assistant
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
            }`}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm px-3 py-2 rounded-2xl rounded-bl-sm text-gray-400 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask: Why is my laptop hot?"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
        >Send</button>
      </div>
    </div>
  )
}
```

Build `app/stories/page.tsx` combining `StoryCard` and `Chatbot`. Also add an achievement/badge row:
```tsx
// Simple achievement badges
const badges = [
  { emoji: "🏆", label: "System Stable", desc: "No crashes this week" },
  { emoji: "❄️", label: "Cool Runner", desc: "Temp below 70°C all day" },
  { emoji: "⚡", label: "Optimizer", desc: "Used auto-pilot 5 times" },
]
// Render as a horizontal card row above the story card
```

---

### ✅ Days 22–23 — Sidebar Navigation + Polish

Build `components/Sidebar.tsx`:
```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/autopilot", label: "Auto-Pilot", icon: "⚙️" },
  { href: "/disk", label: "Disk & Tasks", icon: "💾" },
  { href: "/stories", label: "AI Stories", icon: "📖" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 h-screen bg-gray-900 text-white flex flex-col p-4 fixed left-0 top-0">
      <p className="text-sm font-bold mb-6 text-blue-400">🖥️ Resource Monitor</p>
      <nav className="space-y-1">
        {nav.map(n => (
          <Link key={n.href} href={n.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              path === n.href ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <span>{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

Add `<Sidebar />` to `app/layout.tsx` with a `ml-56` wrapper for content.

---

🟢 **Day 23 — Tanmay is waiting on YOU**
> By end of Day 23, sit together with Tanmay:
> - Chatbot sends real messages and AI replies correctly ✅
> - Daily story loads from his `/ai/daily-story` endpoint ✅
> - All sidebar pages navigate correctly ✅

---

## 🧠 PHASE 7 — FEATURE 11: PERSONALIZED LEARNING UI (Days 24–25, TOGETHER)

### ✅ Your Part — Learning Pattern Heatmap + Recommendation Card

Build `components/LearningHeatmap.tsx`:
```tsx
"use client"
import { useQuery } from "@tanstack/react-query"
import { getLearningPattern } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LearningHeatmap() {
  const { data, isLoading } = useQuery({
    queryKey: ['learning'],
    queryFn: getLearningPattern,
    refetchInterval: 60000
  })

  const result = data?.data
  const pattern = result?.pattern || {}

  return (
    <Card>
      <CardHeader><CardTitle>🧠 Your Usage Pattern (Learning)</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-gray-400 text-sm">Learning your patterns...</p>}
        {result?.message && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
            💡 {result.message}
          </div>
        )}

        {/* 24-hour grid */}
        <div>
          <p className="text-xs text-gray-500 mb-2">CPU Usage by Hour (today)</p>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, h) => {
              const hourData = pattern[String(h)]
              const cpu = hourData?.avg_cpu || 0
              const intensity = Math.min(cpu / 100, 1)
              const bg = cpu === 0 ? 'bg-gray-100'
                : intensity > 0.7 ? 'bg-red-500'
                : intensity > 0.4 ? 'bg-orange-400'
                : 'bg-green-400'
              return (
                <div key={h} title={`${h}:00 — avg CPU: ${cpu}%`}
                  className={`h-8 rounded ${bg} cursor-pointer transition-opacity hover:opacity-80`} />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

Add this to the dashboard page.

---

## 🧪 PHASE 8 — TESTING + FINAL (Days 26–30)

### ✅ Days 26–27 — Frontend Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Create `tests/MetricCard.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import MetricCard from "../components/MetricCard"

describe("MetricCard", () => {
  it("renders the title and value", () => {
    render(<MetricCard title="CPU Usage" value={75} unit="%" />)
    expect(screen.getByText("CPU Usage")).toBeTruthy()
    expect(screen.getByText("75")).toBeTruthy()
  })
})
```

Also manually test every page and every button. Write a checklist:
- [ ] Login works with correct creds
- [ ] Login shows error with wrong creds
- [ ] Dashboard loads live CPU/RAM data
- [ ] Crash alert appears when probability > 50%
- [ ] Kill button removes process from table
- [ ] Auto-pilot toggle persists state
- [ ] Notifications fire on anomaly
- [ ] Quiet mode suppresses notifications
- [ ] Chatbot sends and receives messages
- [ ] Story card loads AI-generated text
- [ ] Disk health shows card
- [ ] Heatmap renders color grid

---

🔴 **Day 27 — BLOCKED — Wait for Tanmay**
> Tanmay finishes backend tests and bug fixes. Then both of you go through the full checklist above together, end-to-end.

---

### ✅ Days 28–29 — Final Polish + User Guide

- Add loading skeleton components for all data-fetching cards:
```tsx
// Simple skeleton
<div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
```
- Make layout responsive (`md:` breakpoints so it works on smaller screens)
- Run `npm run build` and fix any TypeScript errors

Write `docs/USER_GUIDE.md`:
- Screenshots of each page with explanations
- "What does each metric mean?" section
- "How to read the crash prediction?" explanation
- FAQ

---

### ✅ Day 30 — Final Demo Prep (Together with Tanmay)

Walk through the demo:
1. **Dashboard** — show live CPU/RAM and crash banner
2. **Notifications** — trigger an anomaly and show notification popup
3. **Root Cause** — show why system is slow card
4. **Auto-Pilot** — kill a process, show action history
5. **Disk & Scheduler** — show disk health + run a cleanup task
6. **AI Stories** — show daily story card and chatbot in action
7. **Learning** — show heatmap of usage pattern

Prepare Q&A:
- "Why did you choose Next.js?" → SSR, performance, React ecosystem, easy routing
- "How does the notification system work?" → WebSocket streams `anomaly: true` → frontend detects and fires
- "What if the AI API is down?" → Fallback response is shown, app doesn't crash
- "How does quiet mode work?" → Simply stops new notifications from being added to state

---

## 📋 HIMANSHU'S COMPLETE SUMMARY

| Days | Task | Feature | Dependency |
|------|------|---------|-----------|
| 1 | Repo setup | Foundation | Together |
| 2–4 | Next.js setup, static UI, mock components | Foundation | Parallel with Tanmay |
| 5–6 | 🔴 Blocked / Write api.ts | — | Wait for Tanmay's backend |
| 7–8 | WebSocket hook + live dashboard | Feature 6 | Tanmay's WS must be ready |
| 9 | Charts + connect to history API | Feature 6 | 🟢 Tanmay waiting |
| 10–11 | Notification center | Feature 7 | Uses Tanmay's anomaly WS field |
| 12 | Root Cause card | Feature 2 UI | Tanmay's `/root-cause` must be ready |
| 13–14 | Process table with kill button | Feature 8 | Tanmay's autopilot API |
| 15–16 | Auto-pilot toggle + history feed | Feature 8 | 🟢 Tanmay waiting on Day 16 |
| 17–18 | Disk health card | Feature 9 | Tanmay's `/disk/health` API |
| 19 | Scheduler panel | Feature 9 | Tanmay's `/scheduler` endpoints |
| 20–21 | Story card + Chatbot UI | Feature 10 | Tanmay's `/ai/*` endpoints |
| 22–23 | Sidebar + layout polish | Feature 10 | 🟢 Tanmay waiting on Day 23 |
| 24–25 | Learning heatmap UI | Feature 11 | Together with Tanmay |
| 26–27 | Frontend tests + full checklist | Testing | 🔴 Blocked Day 27 for E2E |
| 28–29 | Build, polish, user guide | Docs | Solo |
| 30 | Demo prep | Final | Together |

---

*Good luck Himanshu! You're the face of the project — the UI is what the judges see first.* 🎨✨
