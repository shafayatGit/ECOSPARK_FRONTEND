"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, formatStatusLabel } from "@/lib/formatters";
import {
  CategoryCount,
  CountByStatus,
  DashboardTrends,
} from "@/types/dashboard.types";
import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartsProps {
  ideasByStatus: CountByStatus[];
  ideasByCategory: CategoryCount[];
  purchasesByStatus: CountByStatus[];
  trends: DashboardTrends;
}

const STATUS_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const ideasStatusConfig: ChartConfig = {
  count: { label: "Ideas" },
};

const categoryConfig: ChartConfig = {
  count: { label: "Ideas", color: "var(--chart-1)" },
};

const purchaseStatusConfig: ChartConfig = {
  count: { label: "Purchases" },
};

const trendsConfig: ChartConfig = {
  ideas: { label: "Ideas", color: "var(--chart-1)" },
  purchases: { label: "Purchases", color: "var(--chart-2)" },
  revenue: { label: "Revenue", color: "var(--chart-3)" },
};

function formatChartDate(date: string) {
  try {
    return format(parseISO(date), "MMM d");
  } catch {
    return date;
  }
}

const DashboardCharts = ({
  ideasByStatus,
  ideasByCategory,
  purchasesByStatus,
  trends,
}: DashboardChartsProps) => {
  const ideasStatusData = ideasByStatus.map((item) => ({
    ...item,
    label: formatStatusLabel(item.status),
  }));

  const categoryData = ideasByCategory.map((item) => ({
    name: item.name,
    count: item.count,
    fill: "var(--chart-1)",
  }));

  const purchaseStatusData = purchasesByStatus.map((item) => ({
    ...item,
    label: formatStatusLabel(item.status),
  }));

  const trendDates = new Set([
    ...trends.ideasLast30Days.map((d) => d.date),
    ...trends.purchasesLast30Days.map((d) => d.date),
    ...trends.revenueLast30Days.map((d) => d.date),
  ]);

  const combinedTrendData = Array.from(trendDates)
    .sort()
    .map((date) => ({
      date,
      label: formatChartDate(date),
      ideas:
        trends.ideasLast30Days.find((d) => d.date === date)?.count ?? 0,
      purchases:
        trends.purchasesLast30Days.find((d) => d.date === date)?.count ?? 0,
      revenue:
        trends.revenueLast30Days.find((d) => d.date === date)?.amount ?? 0,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Ideas by Status</CardTitle>
          <CardDescription>Distribution across workflow stages</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ideasStatusConfig} className="h-[280px] w-full">
            <BarChart data={ideasStatusData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
                fontSize={11}
              />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {ideasStatusData.map((_, index) => (
                  <Cell
                    key={`status-${index}`}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ideas by Category</CardTitle>
          <CardDescription>Content spread across categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ChartContainer config={categoryConfig} className="h-[280px] w-full">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No category data available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchases by Status</CardTitle>
          <CardDescription>Transaction outcomes overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={purchaseStatusConfig}
            className="mx-auto h-[280px] w-full max-w-sm"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={purchaseStatusData}
                dataKey="count"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {purchaseStatusData.map((_, index) => (
                  <Cell
                    key={`purchase-${index}`}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Activity</CardTitle>
          <CardDescription>Ideas, purchases, and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          {combinedTrendData.length > 0 ? (
            <ChartContainer config={trendsConfig} className="h-[280px] w-full">
              <LineChart data={combinedTrendData} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "revenue") {
                          return formatCurrency(value as number);
                        }
                        return value;
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="ideas"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No trend data for the last 30 days
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
