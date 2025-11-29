"use client";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { MoreVertical, ArrowDown, ArrowUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6 @5xl/main:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <Skeleton className="h-8 w-32" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium w-full">
              <Skeleton className="h-4 flex-1" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function SectionCards() {
  const { data, isLoading } = useDashboardMetrics();

  if (isLoading) return <SectionCardsSkeleton />;

  const { revenue, users, accounts, growthRate } = data;

  const currentValue = 75.55;
  const maxValue = 100;

  const pieData = [
    { name: "Progress", value: currentValue },
    { name: "Remaining", value: maxValue - currentValue },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 w-full">
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${revenue.total.toLocaleString()}
            </CardTitle>

            <CardAction>
              <Badge variant="outline">
                {revenue.trendingUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {revenue.growth.toFixed(1)}%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              {revenue.trendingUp ? "Trending up" : "Trending down"} this month
              {revenue.trendingUp ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>

            <div className="text-muted-foreground">Total purchases last 30 days</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>New Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{users.new}</CardTitle>

            <CardAction>
              <Badge variant="outline">
                {users.trendingUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {users.prev === 0
                  ? "+100%"
                  : (((users.new - users.prev) / users.prev) * 100).toFixed(1) + "%"}
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              {users.trendingUp
                ? "More signups than last period"
                : "Fewer signups than last period"}
              {users.trendingUp ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>

            <div className="text-muted-foreground">Comparison with previous 30 days</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{accounts.active}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp /> Active
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="text-sm text-muted-foreground">
            Users with an active subscription
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {growthRate.percentage.toFixed(1)}%
            </CardTitle>

            <CardAction>
              <Badge variant="outline">
                {growthRate.trendingUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {growthRate.percentage.toFixed(1)}%
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              {growthRate.trendingUp ? "User growth improving" : "User growth slowing"}

              {growthRate.trendingUp ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>

            <div className="text-muted-foreground">Comparing 2 periods</div>
          </CardFooter>
        </Card>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Monthly Target</CardTitle>
              <CardDescription className="mt-1">Target you've set for each month</CardDescription>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </CardHeader>

        {/* Gráfico con Recharts */}
        <div className="h-[180px] w-full relative flex justify-center px-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Definición del Gradiente */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5B6AF0" />
                  <stop offset="100%" stopColor="#9CA6FF" />
                </linearGradient>
              </defs>

              <Pie
                data={pieData}
                cx="50%"
                cy="70%" // Bajamos el centro para que parezca un arco
                startAngle={180} // 180 grados (izquierda)
                endAngle={0} // 0 grados (derecha)
                innerRadius={85} // Radio interno (grosor)
                outerRadius={105} // Radio externo
                paddingAngle={0}
                dataKey="value"
                cornerRadius={10} // Bordes redondeados del arco
                stroke="none"
              >
                {/* Celda 1: El progreso (con gradiente) */}
                <Cell key="progress" fill="url(#blueGradient)" />
                {/* Celda 2: El fondo usando variable del tema */}
                <Cell key="remaining" fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Texto central superpuesto */}
          <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-4xl font-bold block tracking-tighter">{currentValue}%</span>
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded mt-1">
              +10%
            </div>
          </div>
        </div>

        {/* Texto descriptivo */}
        <CardContent>
          <p className="text-center text-muted-foreground text-sm mb-8 leading-relaxed -mt-4">
            You earn <span className="font-medium text-foreground">$3287</span> today, it's higher
            than last month.
            <br />
            Keep up your good work!
          </p>
        </CardContent>

        {/* Footer Stats */}
        <CardFooter className="grid grid-cols-3 gap-4 border-t pt-6">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs mb-1">Target</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">$20K</span>
              <ArrowDown size={14} className="text-destructive" />
            </div>
          </div>

          <div className="flex flex-col items-center border-l border-r border-border">
            <span className="text-muted-foreground text-xs mb-1">Revenue</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">$20K</span>
              <ArrowUp size={14} className="text-green-500" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs mb-1">Today</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">$20K</span>
              <ArrowUp size={14} className="text-green-500" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
