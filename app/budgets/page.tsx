"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { api, MonthlyBudget } from "@/lib/api";
import { ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency } from "@/lib/timezone";

export default function BudgetsPage() {
  const { user, currency } = useUser();
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<MonthlyBudget | null>(null);

  const [formData, setFormData] = useState({
    month: "",
    budget: "",
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await api.budgets.getAll();
      if (response.success && response.data) {
        setBudgets(response.data.budgets || []);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (budget?: MonthlyBudget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        month: budget.month,
        budget: budget.budget.toString(),
      });
    } else {
      setEditingBudget(null);
      // Default to current month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setFormData({
        month: currentMonth,
        budget: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const budgetData = {
        month: formData.month,
        budget: parseFloat(formData.budget),
      };

      if (editingBudget) {
        await api.budgets.update(formData.month, { budget: budgetData.budget });
      } else {
        await api.budgets.create(budgetData);
      }

      fetchBudgets();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save budget');
    }
  };

  const handleDelete = async (month: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      await api.budgets.delete(month);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      alert('Failed to delete budget');
    }
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getMonthColor = (month: string) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (month === currentMonth) {
      return 'bg-primary/10 text-primary border-primary/20';
    } else if (month < currentMonth) {
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    } else {
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const averageBudget = budgets.length > 0 ? totalBudget / budgets.length : 0;

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
                  <h1 className="text-3xl font-bold tracking-tight">Monthly Budgets</h1>
                  <p className="text-muted-foreground mt-2">
                    Set and manage your budget for each month
                  </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{budgets.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Budgets configured</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{formatCurrency(totalBudget, currency)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all months</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(averageBudget, currency)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Per month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Budgets List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading budgets...</p>
                </div>
              ) : budgets.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Budgets</h3>
                  <p className="text-muted-foreground mb-4">Add your first monthly budget to start tracking</p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {budgets.map((budget) => (
                    <Card key={budget.id} className="border-border/40">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{formatMonth(budget.month)}</CardTitle>
                          </div>
                          <Badge variant="outline" className={getMonthColor(budget.month)}>
                            {budget.month}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Budget</span>
                            <span className="text-2l font-bold text-primary">{formatCurrency(budget.budget, currency)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(budget)} className="flex-1">
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(budget.month)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add/Edit Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingBudget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
                    <DialogDescription>
                      {editingBudget ? 'Update your monthly budget' : 'Set a budget for a specific month'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="month">Month *</Label>
                        <Input
                          id="month"
                          type="month"
                          value={formData.month}
                          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                          disabled={!!editingBudget}
                          required
                        />
                        {editingBudget && (
                          <p className="text-xs text-muted-foreground">Month cannot be changed when editing</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="budget">Budget Amount *</Label>
                        <Input
                          id="budget"
                          type="number"
                          step="0.01"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          placeholder="3000"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingBudget ? 'Update' : 'Add'} Budget
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
