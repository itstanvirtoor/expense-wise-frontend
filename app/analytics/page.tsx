"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, 
  BarChart3, CreditCard, Wallet, Filter, X, LucideIcon
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency, formatDate } from "@/lib/timezone";
import * as LucideIcons from "lucide-react";

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down";
  trendValue: number;
  color: string;
  icon: string;
}

interface TopExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<string>("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedCategory, selectedPayment]);

  useEffect(() => {
    fetchCategories();
    fetchPaymentMethods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      if (response.success && response.data) {
        setCategories(response.data.categories.map((cat: any) => cat.name));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.paymentMethods.getAll();
      if (response.success && response.data) {
        setPaymentMethods(response.data.paymentMethods);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await api.analytics.getOverview({
        timeRange,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        paymentMethod: selectedPayment !== 'all' ? selectedPayment : undefined,
      });
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
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
  ];

  // Get time period label
  const timePeriodLabel = timeRanges.find(range => range.value === timeRange)?.label || "Selected Period";

  const getIconComponent = (iconName: string): LucideIcon => {
    // @ts-ignore - dynamically accessing lucide icons
    const IconComponent = LucideIcons[iconName];
    return IconComponent || Wallet;
  };

  const activeFiltersCount = [selectedCategory !== "all", selectedPayment !== "all"].filter(Boolean).length;

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole={(user?.role.toLowerCase() as "user" | "admin") || "user"} />
        
        <main className="flex-1 p-6 overflow-auto bg-muted/30">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Expense Analytics</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Comprehensive analysis of your spending patterns
                </p>
              </div>

              {/* Filter Section */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Filter className="h-4 w-4" />
                      Filters:
                    </div>
                    
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRanges.map(range => (
                          <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="All Payment Methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payment Methods</SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedPayment("all");
                        }}
                        className="h-9"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear ({activeFiltersCount})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <>
                {/* Key Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-border/40 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatAmount(analyticsData.topExpenses.reduce((sum, exp) => sum + exp.amount, 0))}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {timePeriodLabel}
                      </p>
                      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${Math.min(analyticsData.insights.budgetUtilization, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                      <BarChart3 className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatAmount(analyticsData.insights.averageTransaction)}</div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        {analyticsData.insights.averageTransactionChange >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        {Math.abs(analyticsData.insights.averageTransactionChange)}% vs last period
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Most Used Payment</CardTitle>
                      <CreditCard className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.insights.mostUsedPayment}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {timePeriodLabel}
                      </p>
                      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all"
                          style={{ width: `${analyticsData.insights.mostUsedPaymentPercentage}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Peak Spending Day</CardTitle>
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.insights.highestSpendingDay}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {timePeriodLabel}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-5 lg:grid-cols-3">
                  {/* Left Column - Category Breakdown */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Category Distribution */}
                    <Card className="border-border/40 bg-card/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>Spending breakdown by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {analyticsData.categoryBreakdown?.map((category, i) => {
                            const Icon = getIconComponent(category.icon);
                            const isHovered = hoveredCategory === category.category;
                            
                            return (
                              <div
                                key={i}
                                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                  isHovered 
                                    ? 'border-primary bg-primary/5 scale-105' 
                                    : 'border-border/40 bg-background/30 hover:border-border hover:bg-background/50'
                                }`}
                                onMouseEnter={() => setHoveredCategory(category.category)}
                                onMouseLeave={() => setHoveredCategory(null)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div 
                                    className="p-2 rounded-lg"
                                  >
                                    <Icon 
                                      className="h-6 w-6" 
                                      style={{ color: category.color }}
                                    />
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-lg">{category.percentage.toFixed(0)}%</div>
                                    <div className="text-xs text-muted-foreground">of total</div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="font-semibold text-sm">{category.category}</div>
                                  <div className="text-xl font-bold">{formatAmount(category.amount)}</div>
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full transition-all duration-500"
                                      style={{ 
                                        width: `${category.percentage}%`,
                                        backgroundColor: category.color
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Trends */}
                    <Card className="border-border/40 bg-card/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Spending Trends</CardTitle>
                        <CardDescription>Monthly expense patterns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                          {analyticsData.monthlyTrends?.map((data, i) => {
                            const maxValue = Math.max(...(analyticsData.monthlyTrends?.map(d => d.expenses) || []), 1);
                            const heightPercent = maxValue > 0 ? (data.expenses / maxValue) * 100 : 0;
                            
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div 
                                  className="w-full relative group cursor-pointer" 
                                  style={{ height: '200px' }}
                                  onMouseEnter={() => setHoveredMonth(i)}
                                  onMouseLeave={() => setHoveredMonth(null)}
                                >
                                  {data.expenses > 0 && (
                                    <div
                                      className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:from-primary/90 hover:to-primary/60"
                                      style={{ height: `${heightPercent}%` }}
                                    />
                                  )}
                                  
                                  {hoveredMonth === i && (
                                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-xl p-3 z-10 whitespace-nowrap">
                                      <p className="font-semibold text-xs mb-1">{data.month}</p>
                                      <p className="text-sm font-bold">{formatAmount(data.expenses)}</p>
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {data.month.split('-')[1]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Top Expenses & Insights */}
                  <div className="space-y-5">
                    {/* Budget Overview */}
                    <Card className="border-border/40 bg-card/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-lg">Budget Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="relative h-40 flex items-center justify-center">
                            <svg className="transform -rotate-90 h-40 w-40">
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-muted"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - Math.min(analyticsData.insights.budgetUtilization / 100, 1))}`}
                                className={analyticsData.insights.budgetUtilization > 90 ? "text-red-500" : analyticsData.insights.budgetUtilization > 70 ? "text-orange-500" : "text-green-500"}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-3xl font-bold">{analyticsData.insights.budgetUtilization.toFixed(0)}%</span>
                              <span className="text-xs text-muted-foreground">Used</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Spent:</span>
                              <span className="font-semibold">{formatAmount(analyticsData.topExpenses.reduce((sum, exp) => sum + exp.amount, 0))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-semibold">{formatAmount(analyticsData.monthlyTrends.reduce((sum, trend) => sum + trend.income, 0))}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="text-muted-foreground">Remaining:</span>
                              <span className={`font-bold ${analyticsData.monthlyTrends.reduce((sum, trend) => sum + trend.income, 0) - analyticsData.topExpenses.reduce((sum, exp) => sum + exp.amount, 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatAmount(Math.max(0, analyticsData.monthlyTrends.reduce((sum, trend) => sum + trend.income, 0) - analyticsData.topExpenses.reduce((sum, exp) => sum + exp.amount, 0)))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Expenses */}
                    <Card className="border-border/40 bg-card/50 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-lg">Top Expenses</CardTitle>
                        <CardDescription>Largest transactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.topExpenses?.slice(0, 8).map((expense, i) => (
                            <div 
                              key={expense.id} 
                              className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-background/30 hover:bg-background/50 hover:border-border transition-all"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">#{i + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{expense.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    {expense.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-sm text-red-500">{formatAmount(expense.amount)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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

