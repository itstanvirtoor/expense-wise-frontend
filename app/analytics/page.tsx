"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency, formatDate } from "@/lib/timezone";

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down";
  trendValue: number;
  color: string;
}

interface TopExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface MonthlyTrend {
  month: string;
  expenses: number;
  income: number;
}

interface AnalyticsData {
  insights: {
    highestSpendingDay: string;
    highestSpendingDayChange: number;
    averageTransaction: number;
    averageTransactionChange: number;
    mostUsedPayment: string;
    mostUsedPaymentPercentage: number;
    budgetUtilization: number;
    budgetUtilizationChange: number;
  };
  categoryBreakdown: CategoryData[];
  topExpenses: TopExpense[];
  monthlyTrends: MonthlyTrend[];
}

export default function AnalyticsPage() {
  const { user: authUser } = useAuth();
  const { user, currency, timezone } = useUser();
  const [timeRange, setTimeRange] = useState("30days");
  const [viewType, setViewType] = useState("category");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showIncome, setShowIncome] = useState(true);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [period1, setPeriod1] = useState("30days");
  const [period2, setPeriod2] = useState("7days");
  const [period1Data, setPeriod1Data] = useState<AnalyticsData | null>(null);
  const [period2Data, setPeriod2Data] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  useEffect(() => {
    fetchComparisonData();
  }, [period1, period2]);

  const fetchComparisonData = async () => {
    try {
      const [p1Response, p2Response] = await Promise.all([
        api.analytics.getOverview({ timeRange: period1 }),
        api.analytics.getOverview({ timeRange: period2 })
      ]);
      if (p1Response.success && p1Response.data) {
        setPeriod1Data(p1Response.data);
      }
      if (p2Response.success && p2Response.data) {
        setPeriod2Data(p2Response.data);
      }
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await api.analytics.getOverview({ timeRange });
      if (response.success && response.data) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return formatCurrency(amount || 0, currency);
  };

  const timeRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole={(user?.role.toLowerCase() as "user" | "admin") || "user"} />
        
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Highest Spending Day</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.insights.highestSpendingDay}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +{analyticsData.insights.highestSpendingDayChange}% from last period
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatAmount(analyticsData.insights.averageTransaction)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analyticsData.insights.averageTransactionChange >= 0 ? '+' : ''}{analyticsData.insights.averageTransactionChange}% from last period
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Most Used Payment</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.insights.mostUsedPayment}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analyticsData.insights.mostUsedPaymentPercentage.toFixed(0)}% of transactions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                      <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.insights.budgetUtilization.toFixed(0)}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +{analyticsData.insights.budgetUtilizationChange}% from last period
                      </p>
                    </CardContent>
                  </Card>
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
                        {analyticsData.categoryBreakdown?.map((category, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full" 
                                  style={{ backgroundColor: category?.color ?? '#3b82f6' }}
                                />
                                <span className="font-medium">{category.category}</span>
                              </div>
                              <span className="text-muted-foreground">{formatAmount(category.amount)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                                <div
                                  className="h-full transition-all duration-500"
                                  style={{ 
                                    width: `${category.percentage}%`,
                                    backgroundColor: category?.color ?? '#3b82f6'
                                  }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-12 text-right">
                                {category.percentage.toFixed(1)}%
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
                        {analyticsData.topExpenses?.slice(0, 5).map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {expense.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="font-semibold text-red-500">{formatAmount(expense.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Trend Chart Placeholder */}
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>Income vs Expenses over time</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={showExpenses ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowExpenses(!showExpenses)}
                        >
                          Expenses
                        </Button>
                        <Button
                          variant={showIncome ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowIncome(!showIncome)}
                        >
                          Income
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-end justify-center gap-4 px-4">
                      {analyticsData.monthlyTrends?.map((data, i) => {
                        const maxValue = Math.max(
                          ...(analyticsData.monthlyTrends?.map(d => {
                            const values = [];
                            if (showExpenses) values.push(d.expenses);
                            if (showIncome) values.push(d.income);
                            return Math.max(...values, 1);
                          }) || [1])
                        );
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div 
                              className="w-full relative group" 
                              style={{ height: '250px' }}
                              onMouseEnter={() => setHoveredMonth(i)}
                              onMouseLeave={() => setHoveredMonth(null)}
                            >
                              {/* Income bar (rendered first, will be below) */}
                              {showIncome && (
                                <div
                                  className="absolute bottom-0 w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-md transition-opacity cursor-pointer"
                                  style={{ 
                                    height: `${(data.income / maxValue) * 250}px`,
                                    opacity: showExpenses ? 0.7 : 1
                                  }}
                                />
                              )}
                              {/* Expenses bar (rendered second, will be on top) */}
                              {showExpenses && (
                                <div
                                  className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-md transition-opacity cursor-pointer"
                                  style={{ 
                                    height: `${(data.expenses / maxValue) * 250}px`,
                                    opacity: showIncome ? 0.7 : 1
                                  }}
                                />
                              )}
                              {/* Hover Tooltip */}
                              {hoveredMonth === i && (
                                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg p-3 z-10 whitespace-nowrap">
                                  <p className="font-semibold text-sm mb-2">{data.month}</p>
                                  {showExpenses && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="h-2 w-2 rounded bg-primary" />
                                      <span className="text-xs">Expenses: {formatAmount(data.expenses)}</span>
                                    </div>
                                  )}
                                  {showIncome && (
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded bg-accent" />
                                      <span className="text-xs">Income: {formatAmount(data.income)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{data.month}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                      {showExpenses && (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded bg-primary" />
                          <span className="text-sm text-muted-foreground">Expenses</span>
                        </div>
                      )}
                      {showIncome && (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded bg-accent" />
                          <span className="text-sm text-muted-foreground">Income</span>
                        </div>
                      )}
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
                      {analyticsData?.categoryBreakdown?.map((category, i) => (
                        <div key={i} className="space-y-3 p-4 rounded-lg border border-border/40 bg-background/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: category?.color ?? '#3b82f6' }}>
                                <span className="text-white font-semibold">{category.percentage.toFixed(0)}%</span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.category}</p>
                                <p className="text-sm text-muted-foreground">{formatAmount(category.amount)} spent</p>
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
                              style={{ 
                                width: `${category.percentage}%`,
                                backgroundColor: category?.color ?? '#3b82f6'
                              }}
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
                    <div className="space-y-6">
                      {analyticsData.categoryBreakdown?.map((category, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="h-10 w-10 rounded-lg flex items-center justify-center"
                                style={{ 
                                  backgroundColor: category.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                                        category.color.includes('purple') ? '#a855f7' : 
                                        category.color.includes('green') ? '#22c55e' : 
                                        category.color.includes('orange') ? '#f97316' : 
                                        category.color.includes('pink') ? '#ec4899' : 
                                        category.color.includes('yellow') ? '#eab308' : '#6366f1'
                                }}
                              >
                                <span className="text-white font-semibold text-sm">{category.percentage.toFixed(0)}%</span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.category}</p>
                                <p className="text-sm text-muted-foreground">{formatAmount(category.amount)} spent</p>
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
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${category.percentage}%`,
                                backgroundColor: category.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                                      category.color.includes('purple') ? '#a855f7' : 
                                      category.color.includes('green') ? '#22c55e' : 
                                      category.color.includes('orange') ? '#f97316' : 
                                      category.color.includes('pink') ? '#ec4899' : 
                                      category.color.includes('yellow') ? '#eab308' : '#6366f1'
                              }}
                            />
                          </div>
                        </div>
                      ))}
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
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Period 1</Label>
                          <Select value={period1} onValueChange={setPeriod1}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7days">Last 7 Days</SelectItem>
                              <SelectItem value="30days">Last 30 Days</SelectItem>
                              <SelectItem value="90days">Last 3 Months</SelectItem>
                              <SelectItem value="6months">Last 6 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Period 2</Label>
                          <Select value={period2} onValueChange={setPeriod2}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7days">Last 7 Days</SelectItem>
                              <SelectItem value="30days">Last 30 Days</SelectItem>
                              <SelectItem value="90days">Last 3 Months</SelectItem>
                              <SelectItem value="6months">Last 6 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Period 1 */}
                        <div className="space-y-4">
                          <div className="text-center pb-3 border-b">
                            <p className="font-semibold">
                              {period1 === "7days" ? "Last 7 Days" : period1 === "30days" ? "Last 30 Days" : period1 === "90days" ? "Last 3 Months" : "Last 6 Months"}
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {formatAmount(period1Data?.categoryBreakdown?.reduce((sum, cat) => sum + cat.amount, 0) || 0)}
                            </p>
                          </div>
                          {period1Data?.categoryBreakdown?.slice(0, 5).map((category, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{category.category}</span>
                                <span className="text-muted-foreground">{formatAmount(category.amount)}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all"
                                  style={{ 
                                    width: `${category.percentage}%`,
                                    backgroundColor: category.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                                          category.color.includes('purple') ? '#a855f7' : 
                                          category.color.includes('green') ? '#22c55e' : 
                                          category.color.includes('orange') ? '#f97316' : 
                                          category.color.includes('pink') ? '#ec4899' : 
                                          category.color.includes('yellow') ? '#eab308' : '#6366f1'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Period 2 */}
                        <div className="space-y-4">
                          <div className="text-center pb-3 border-b">
                            <p className="font-semibold">
                              {period2 === "7days" ? "Last 7 Days" : period2 === "30days" ? "Last 30 Days" : period2 === "90days" ? "Last 3 Months" : "Last 6 Months"}
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {formatAmount(period2Data?.categoryBreakdown?.reduce((sum, cat) => sum + cat.amount, 0) || 0)}
                            </p>
                          </div>
                          {period2Data?.categoryBreakdown?.slice(0, 5).map((category, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{category.category}</span>
                                <span className="text-muted-foreground">{formatAmount(category.amount)}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all"
                                  style={{ 
                                    width: `${category.percentage}%`,
                                    backgroundColor: category.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                                          category.color.includes('purple') ? '#a855f7' : 
                                          category.color.includes('green') ? '#22c55e' : 
                                          category.color.includes('orange') ? '#f97316' : 
                                          category.color.includes('pink') ? '#ec4899' : 
                                          category.color.includes('yellow') ? '#eab308' : '#6366f1'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No analytics data available</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

