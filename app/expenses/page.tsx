"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api, Expense } from "@/lib/api";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";

const categories = ["Food & Dining", "Transportation", "Entertainment", "Utilities", "Shopping", "Healthcare", "Education", "Others"];
const paymentMethods = ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"];

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: "",
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, pagination.limit, filterCategory, searchQuery]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await api.expenses.getAll({
        page: pagination.page,
        limit: pagination.limit,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        setExpenses(response.data.expenses || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description,
        category: expense.category,
        amount: expense.amount.toString(),
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || "",
      });
    } else {
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: "",
        category: "",
        amount: "",
        paymentMethod: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.category || !formData.amount || !formData.paymentMethod) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const expensePayload = {
        date: formData.date,
        description: formData.description,
        category: formData.category,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
      };

      if (editingExpense) {
        await api.expenses.update(editingExpense.id, expensePayload);
      } else {
        await api.expenses.create(expensePayload);
      }

      setIsDialogOpen(false);
      fetchExpenses(); // Reload expenses
    } catch (error) {
      console.error('Failed to save expense:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await api.expenses.delete(id);
        fetchExpenses(); // Reload expenses
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
    }).format(amount);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, page: 1, limit: newLimit }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchExpenses();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-primary/10 text-primary border-primary/20",
      "Transportation": "bg-accent/10 text-accent border-accent/20",
      "Entertainment": "bg-chart-3/10 text-chart-3 border-chart-3/20",
      "Utilities": "bg-chart-4/10 text-chart-4 border-chart-4/20",
      "Shopping": "bg-chart-5/10 text-chart-5 border-chart-5/20",
      "Healthcare": "bg-red-500/10 text-red-500 border-red-500/20",
      "Education": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Others": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };
    return colors[category] || colors["Others"];
  };

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
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <p className="text-muted-foreground mt-2">
                  Track and manage all your expenses
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                    <DialogDescription>
                      {editingExpense ? "Update the expense details below." : "Fill in the details to add a new expense."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Grocery shopping"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      {editingExpense ? "Update" : "Add"} Expense
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters and Search */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>All Expenses</CardTitle>
                    <CardDescription>
                      Showing {expenses.length} of {pagination.total} expenses
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={pagination.limit.toString()} 
                      onValueChange={(value) => handleLimitChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                        <SelectItem value="100">100 per page</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} variant="secondary">
                      Search
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading expenses...</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-border/40 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No expenses found. Add your first expense to get started!
                              </TableCell>
                            </TableRow>
                          ) : (
                            expenses.map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell className="font-medium">
                                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{expense.description}</div>
                                    {expense.notes && (
                                      <div className="text-xs text-muted-foreground">{expense.notes}</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getCategoryColor(expense.category)}>
                                    {expense.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {expense.paymentMethod}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenDialog(expense)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(expense.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
