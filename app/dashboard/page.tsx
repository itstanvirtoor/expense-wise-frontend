"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { api, DashboardData } from "@/lib/api";

export default function UserDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.dashboard.getData();
      console.log('Dashboard API Response:', response);
      console.log('Dashboard Data:', response.data);
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    const value = amount ?? 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
    }).format(isNaN(value) ? 0 : value);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar userRole={(user?.role.toLowerCase() as "user" | "admin") || "user"} />
          
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {user?.name}! Here's an overview of your expenses.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
                </div>
              ) : dashboardData ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData?.totalExpenses ?? 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All time expenses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData?.monthlySpending ?? 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current month spending
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(user?.monthlyBudget ?? 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your monthly limit
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData?.budgetRemaining ?? 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user?.monthlyBudget && user.monthlyBudget > 0 && dashboardData?.budgetRemaining !== undefined
                      ? ((dashboardData.budgetRemaining / user.monthlyBudget) * 100).toFixed(0)
                      : 0}% of monthly budget
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Details */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Expenses */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentExpenses && dashboardData.recentExpenses.length > 0 ? (
                      dashboardData.recentExpenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {expense.category} • {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-semibold text-red-500">
                            -{formatCurrency(expense.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No expenses yet. Start tracking!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.categoryBreakdown && dashboardData.categoryBreakdown.length > 0 ? (
                      dashboardData.categoryBreakdown.slice(0, 5).map((cat) => (
                        <div key={cat.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{cat.category}</span>
                            <span className="text-muted-foreground">{formatCurrency(cat.total)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${Math.min(cat.percentage ?? 0, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {cat.count ?? 0} transaction{(cat.count ?? 0) !== 1 ? 's' : ''} • {(cat.percentage ?? 0).toFixed(1)}%
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No category data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            {dashboardData?.monthlyTrends && dashboardData.monthlyTrends.length > 0 && (
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Last 6 months spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.monthlyTrends.map((trend) => (
                      <div key={trend.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.month}</span>
                        <span className="text-sm font-semibold">{formatCurrency(trend.total ?? 0)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </main>
  </div>
</div>
</ProtectedRoute>
  );
}
