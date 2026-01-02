"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Landmark, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { api, Loan, CreditCard } from "@/lib/api";
import { ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency } from "@/lib/timezone";

const paymentMethods = ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"];

export default function LoansPage() {
  const { user, currency } = useUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    loanAmount: "",
    interestRate: "",
    emiAmount: "",
    emiDate: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    creditCardId: "",
    status: "active",
    notes: "",
  });

  useEffect(() => {
    fetchLoans();
    fetchCreditCards();
  }, []);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const response = await api.loans.getAll();
      if (response.success && response.data) {
        setLoans(response.data.loans || []);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditCards = async () => {
    try {
      const response = await api.creditCards.getAll();
      if (response.success && response.data) {
        setCreditCards(response.data.cards || []);
      }
    } catch (error) {
      console.error('Failed to fetch credit cards:', error);
    }
  };

  const handleOpenDialog = (loan?: Loan) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({
        name: loan.name,
        loanAmount: loan.loanAmount.toString(),
        interestRate: loan.interestRate.toString(),
        emiAmount: loan.emiAmount.toString(),
        emiDate: loan.emiDate.toString(),
        startDate: loan.startDate.split('T')[0],
        endDate: loan.endDate.split('T')[0],
        paymentMethod: loan.paymentMethod,
        creditCardId: loan.creditCardId || "",
        status: loan.status,
        notes: loan.notes || "",
      });
    } else {
      setEditingLoan(null);
      setFormData({
        name: "",
        loanAmount: "",
        interestRate: "",
        emiAmount: "",
        emiDate: "",
        startDate: "",
        endDate: "",
        paymentMethod: "",
        creditCardId: "",
        status: "active",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLoan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loanData = {
        name: formData.name,
        loanAmount: parseFloat(formData.loanAmount),
        interestRate: parseFloat(formData.interestRate),
        emiAmount: parseFloat(formData.emiAmount),
        emiDate: parseInt(formData.emiDate),
        startDate: formData.startDate,
        endDate: formData.endDate,
        paymentMethod: formData.paymentMethod,
        creditCardId: formData.creditCardId || null,
        status: formData.status,
        notes: formData.notes,
      };

      if (editingLoan) {
        await api.loans.update(editingLoan.id, loanData);
      } else {
        await api.loans.create(loanData);
      }

      fetchLoans();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save loan:', error);
      alert('Failed to save loan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;

    try {
      await api.loans.delete(id);
      fetchLoans();
    } catch (error) {
      console.error('Failed to delete loan:', error);
      alert('Failed to delete loan');
    }
  };

  const getMonthsRemaining = (endDate: string): number => {
    const today = new Date();
    const end = new Date(endDate);
    const months = (end.getFullYear() - today.getFullYear()) * 12 +
      (end.getMonth() - today.getMonth());
    return Math.max(0, months);
  };

  const formatAmount = (amount: number) => formatCurrency(amount || 0, currency);

  const activeLoans = loans.filter(l => l.status === 'active');
  const summary = activeLoans.reduce((acc, loan) => {
    const monthsRemaining = getMonthsRemaining(loan.endDate);
    return {
      totalLoans: acc.totalLoans + 1,
      monthlyEMI: acc.monthlyEMI + loan.emiAmount,
      totalOutstanding: acc.totalOutstanding + (loan.emiAmount * monthsRemaining),
    };
  }, { totalLoans: 0, monthlyEMI: 0, totalOutstanding: 0 });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return '';
    }
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
                  <h1 className="text-3xl font-bold tracking-tight">Loans & EMI</h1>
                  <p className="text-muted-foreground mt-2">
                    Track your loans and manage EMI payments
                  </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Loan
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.totalLoans}</div>
                    <p className="text-xs text-muted-foreground mt-1">out of {loans.length} total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly EMI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{formatAmount(summary.monthlyEMI)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total monthly payment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{formatAmount(summary.totalOutstanding)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Remaining to pay</p>
                  </CardContent>
                </Card>
              </div>

              {/* Loans Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading loans...</p>
                </div>
              ) : loans.length === 0 ? (
                <Card className="p-12 text-center">
                  <Landmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Loans</h3>
                  <p className="text-muted-foreground mb-4">Add your first loan to start tracking EMIs</p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Loan
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {loans.map((loan) => {
                    const monthsRemaining = getMonthsRemaining(loan.endDate);
                    const totalPaid = (new Date().getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
                    const progress = loan.loanAmount > 0 ? Math.min(((totalPaid * loan.emiAmount) / loan.loanAmount) * 100, 100) : 0;
                    
                    return (
                      <Card key={loan.id} className="border-border/40">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Landmark className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{loan.name}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(loan)}>
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(loan.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(loan.status)}>
                              {getStatusIcon(loan.status)}
                              <span className="ml-1">{loan.status}</span>
                            </Badge>
                            <Badge variant="outline">{loan.paymentMethod}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Loan Amount</p>
                              <p className="text-lg font-bold">{formatAmount(loan.loanAmount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Interest Rate</p>
                              <p className="text-lg font-bold">{loan.interestRate}%</p>
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Monthly EMI</span>
                              <span className="text-xl font-bold text-orange-500">{formatAmount(loan.emiAmount)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Due on day {loan.emiDate} of every month</p>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Repayment Progress</span>
                              <span className="font-medium">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                            <div>
                              <p className="text-xs text-muted-foreground">Months Remaining</p>
                              <p className="text-sm font-semibold">{monthsRemaining} months</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Outstanding</p>
                              <p className="text-sm font-semibold text-red-500">
                                {formatAmount(loan.emiAmount * monthsRemaining)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Start: </span>
                              <span className="font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">End: </span>
                              <span className="font-medium">{new Date(loan.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {loan.notes && (
                            <p className="text-xs text-muted-foreground italic border-t border-border/40 pt-2">
                              {loan.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Add/Edit Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add Loan'}</DialogTitle>
                    <DialogDescription>
                      {editingLoan ? 'Update your loan details' : 'Add a new loan to track EMI payments'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Loan Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Home Loan, Car Loan"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="loanAmount">Loan Amount *</Label>
                          <Input
                            id="loanAmount"
                            type="number"
                            step="0.01"
                            value={formData.loanAmount}
                            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                            placeholder="500000"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                          <Input
                            id="interestRate"
                            type="number"
                            step="0.01"
                            value={formData.interestRate}
                            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                            placeholder="8.5"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="emiAmount">Monthly EMI *</Label>
                          <Input
                            id="emiAmount"
                            type="number"
                            step="0.01"
                            value={formData.emiAmount}
                            onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                            placeholder="15000"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="emiDate">EMI Date (1-31) *</Label>
                          <Input
                            id="emiDate"
                            type="number"
                            min="1"
                            max="31"
                            value={formData.emiDate}
                            onChange={(e) => setFormData({ ...formData, emiDate: e.target.value })}
                            placeholder="5"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                          />
                        </div>
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

                      {formData.paymentMethod === "Credit Card" && creditCards.length > 0 && (
                        <div className="grid gap-2">
                          <Label htmlFor="creditCard">Credit Card (Optional)</Label>
                          <Select value={formData.creditCardId} onValueChange={(value) => setFormData({ ...formData, creditCardId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select credit card" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {creditCards.map(card => (
                                <SelectItem key={card.id} value={card.id}>
                                  {card.name} (**** {card.lastFourDigits})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Add any additional notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingLoan ? 'Update' : 'Add'} Loan
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
