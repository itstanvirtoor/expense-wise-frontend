"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { useState } from "react";

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  trend: "up" | "down";
  trendValue: number;
  color: string;
}

interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [viewType, setViewType] = useState("category");

  const categoryData: CategoryData[] = [
    { name: "Food & Dining", amount: 685, percentage: 35, trend: "up", trendValue: 12.5, color: "bg-primary" },
    { name: "Transportation", amount: 420, percentage: 25, trend: "down", trendValue: 5.2, color: "bg-accent" },
    { name: "Entertainment", amount: 315, percentage: 20, trend: "up", trendValue: 8.3, color: "bg-chart-3" },
    { name: "Utilities", amount: 280, percentage: 15, trend: "down", trendValue: 2.1, color: "bg-chart-4" },
    { name: "Others", amount: 150, percentage: 5, trend: "up", trendValue: 15.0, color: "bg-chart-5" },
  ];

  const monthlyData: MonthlyData[] = [
    { month: "Jul", expenses: 2100, income: 3500 },
    { month: "Aug", expenses: 2350, income: 3500 },
    { month: "Sep", expenses: 1950, income: 3500 },
    { month: "Oct", expenses: 2280, income: 3800 },
    { month: "Nov", expenses: 2450, income: 3800 },
    { month: "Dec", expenses: 2650, income: 4000 },
  ];

  const timeRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const topExpenses = [
    { description: "Grocery Shopping", amount: 125.50, date: "Jan 1, 2026", category: "Food & Dining" },
    { description: "Gas Station", amount: 85.00, date: "Dec 30, 2025", category: "Transportation" },
    { description: "Electric Bill", amount: 75.00, date: "Dec 29, 2025", category: "Utilities" },
    { description: "Restaurant", amount: 65.50, date: "Dec 28, 2025", category: "Food & Dining" },
    { description: "Movie Tickets", amount: 45.00, date: "Dec 27, 2025", category: "Entertainment" },
  ];

  const insights = [
    { title: "Highest Spending Day", value: "Fridays", change: "+25%", icon: Calendar },
    { title: "Average Transaction", value: "$45.20", change: "-5%", icon: DollarSign },
    { title: "Most Used Payment", value: "Credit Card", change: "68%", icon: BarChart3 },
    { title: "Budget Utilization", value: "78%", change: "+12%", icon: PieChartIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole="user" />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                  Gain insights into your spending patterns
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Custom
                </Button>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <Card key={index} className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{insight.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.change} from last period
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="category">By Category</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="comparison">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Spending Overview</CardTitle>
                      <CardDescription>Your expense distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryData.map((category, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${category.color}`} />
                                <span className="font-medium">{category.name}</span>
                              </div>
                              <span className="text-muted-foreground">${category.amount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                                <div
                                  className={`h-full ${category.color} transition-all duration-500`}
                                  style={{ width: `${category.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-12 text-right">
                                {category.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Top Expenses</CardTitle>
                      <CardDescription>Your largest transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topExpenses.map((expense, i) => (
                          <div key={i} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">{expense.date}</p>
                                <Badge variant="outline" className="text-xs">
                                  {expense.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="font-semibold text-red-500">${expense.amount}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Trend Chart Placeholder */}
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Income vs Expenses over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-end justify-between gap-2 px-4">
                      {monthlyData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex flex-col gap-1 items-center">
                            <div
                              className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer"
                              style={{ height: `${(data.expenses / 4000) * 250}px` }}
                              title={`Expenses: $${data.expenses}`}
                            />
                            <div
                              className="w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer"
                              style={{ height: `${(data.income / 4000) * 250}px` }}
                              title={`Income: $${data.income}`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{data.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-primary" />
                        <span className="text-sm text-muted-foreground">Expenses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-accent" />
                        <span className="text-sm text-muted-foreground">Income</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="category" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Category Analysis</CardTitle>
                    <CardDescription>Detailed breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categoryData.map((category, i) => (
                        <div key={i} className="space-y-3 p-4 rounded-lg border border-border/40 bg-background/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center`}>
                                <span className="text-white font-semibold">{category.percentage}%</span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-muted-foreground">${category.amount} spent</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {category.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-red-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-green-500" />
                              )}
                              <span className={`text-sm font-medium ${category.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                                {category.trendValue}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${category.color} transition-all duration-500`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                    <CardDescription>Track your spending patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Advanced trend visualization</p>
                        <p className="text-sm text-muted-foreground mt-2">Line charts and trend analysis will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Period Comparison</CardTitle>
                    <CardDescription>Compare spending across different time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Period 1</Label>
                          <Select defaultValue="thismonth">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="thismonth">This Month</SelectItem>
                              <SelectItem value="lastmonth">Last Month</SelectItem>
                              <SelectItem value="thisquarter">This Quarter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Period 2</Label>
                          <Select defaultValue="lastmonth">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="thismonth">This Month</SelectItem>
                              <SelectItem value="lastmonth">Last Month</SelectItem>
                              <SelectItem value="lastquarter">Last Quarter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="h-96 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg mt-6">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Comparison charts will be displayed here</p>
                          <p className="text-sm text-muted-foreground mt-2">Side-by-side analysis of selected periods</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
