"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole="user" />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here's an overview of your expenses.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450.00</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5%
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,350.00</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-red-500 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      +8.2%
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$78.33</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Left</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,650.00</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    55% of monthly budget
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Grocery Shopping", amount: "-$125.50", category: "Food", date: "Today" },
                      { name: "Netflix Subscription", amount: "-$15.99", category: "Entertainment", date: "Yesterday" },
                      { name: "Gas Station", amount: "-$45.00", category: "Transportation", date: "2 days ago" },
                      { name: "Coffee Shop", amount: "-$8.50", category: "Food", date: "2 days ago" },
                    ].map((expense, i) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{expense.name}</p>
                          <p className="text-xs text-muted-foreground">{expense.category} • {expense.date}</p>
                        </div>
                        <p className="font-semibold text-red-500">{expense.amount}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Spending by category this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Food & Dining", amount: "$685", percentage: 35, color: "bg-primary" },
                      { name: "Transportation", amount: "$420", percentage: 25, color: "bg-accent" },
                      { name: "Entertainment", amount: "$315", percentage: 20, color: "bg-chart-3" },
                      { name: "Utilities", amount: "$280", percentage: 15, color: "bg-chart-4" },
                      { name: "Others", amount: "$150", percentage: 5, color: "bg-chart-5" },
                    ].map((category, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground">{category.amount}</span>
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
            </div>

            {/* Placeholder for Charts */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Your expense patterns over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg">
                  <p className="text-muted-foreground">Chart visualization will be added here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
