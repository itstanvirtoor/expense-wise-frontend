"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Activity, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole="admin" />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  System overview and management panel
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">Administrator Access</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +18.2%
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,892</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    66.5% of total users
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">99.9%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uptime this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Management Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Johnson", email: "sarah.j@example.com", plan: "Premium", date: "2 hours ago" },
                      { name: "Mike Chen", email: "mike.c@example.com", plan: "Free", date: "5 hours ago" },
                      { name: "Emma Wilson", email: "emma.w@example.com", plan: "Premium", date: "1 day ago" },
                      { name: "Alex Turner", email: "alex.t@example.com", plan: "Basic", date: "1 day ago" },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{user.plan}</p>
                          <p className="text-xs text-muted-foreground">{user.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>User subscription breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Premium Plan", count: "1,245 users", percentage: 44, color: "bg-primary" },
                      { name: "Basic Plan", count: "892 users", percentage: 31, color: "bg-accent" },
                      { name: "Free Plan", count: "710 users", percentage: 25, color: "bg-chart-3" },
                    ].map((plan, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{plan.name}</span>
                          <span className="text-muted-foreground">{plan.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${plan.color} transition-all duration-500`}
                            style={{ width: `${plan.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Activity */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>Recent system events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "success", message: "Database backup completed successfully", time: "5 minutes ago" },
                    { type: "info", message: "New feature deployed: AI expense categorization", time: "2 hours ago" },
                    { type: "warning", message: "High API usage detected (85% of limit)", time: "3 hours ago" },
                    { type: "success", message: "System update completed", time: "1 day ago" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                      <div className={`h-2 w-2 mt-2 rounded-full ${
                        event.type === 'success' ? 'bg-green-500' :
                        event.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Placeholder for Charts */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>User Growth Analytics</CardTitle>
                <CardDescription>User acquisition and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/40 rounded-lg">
                  <p className="text-muted-foreground">Advanced analytics charts will be added here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
