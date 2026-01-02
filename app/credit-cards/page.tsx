"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard as CreditCardIcon, Trash2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { api, CreditCard } from "@/lib/api";
import { ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency, formatDate } from "@/lib/timezone";

export default function CreditCardsPage() {
  const { user, currency, timezone } = useUser();
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lastFourDigits: "",
    issuer: "",
    billingCycle: "",
    dueDate: "",
    creditLimit: "",
    currentBalance: "",
    previousOutstanding: "",
  });

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const fetchCreditCards = async () => {
    setIsLoading(true);
    try {
      const response = await api.creditCards.getAll();
      if (response.success && response.data) {
        setCreditCards(response.data.cards || []);
      }
    } catch (error) {
      console.error('Failed to fetch credit cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (card?: CreditCard) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        name: card.name,
        lastFourDigits: card.lastFourDigits,
        issuer: card.issuer,
        billingCycle: card.billingCycle.toString(),
        dueDate: card.dueDate.toString(),
        creditLimit: card.creditLimit.toString(),
        currentBalance: card.currentBalance.toString(),
        previousOutstanding: (card.previousOutstanding || 0).toString(),
      });
    } else {
      setEditingCard(null);
      setFormData({
        name: "",
        lastFourDigits: "",
        issuer: "",
        billingCycle: "",
        dueDate: "",
        creditLimit: "",
        currentBalance: "",
        previousOutstanding: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCard(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cardData = {
        name: formData.name,
        lastFourDigits: formData.lastFourDigits,
        issuer: formData.issuer,
        billingCycle: parseInt(formData.billingCycle),
        dueDate: parseInt(formData.dueDate),
        creditLimit: parseFloat(formData.creditLimit),
        currentBalance: parseFloat(formData.currentBalance),
        previousOutstanding: parseFloat(formData.previousOutstanding || "0"),
      };

      if (editingCard) {
        await api.creditCards.update(editingCard.id, cardData);
      } else {
        await api.creditCards.create(cardData);
      }

      fetchCreditCards();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save credit card:', error);
      alert('Failed to save credit card');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credit card?')) return;

    try {
      await api.creditCards.delete(id);
      fetchCreditCards();
    } catch (error) {
      console.error('Failed to delete credit card:', error);
      alert('Failed to delete credit card');
    }
  };

  const handleClearOutstanding = async (cardId: string) => {
    try {
      const card = creditCards.find(c => c.id === cardId);
      const previousOutstanding = card?.previousOutstanding || 0;
      
      if (previousOutstanding <= 0) {
        alert('No outstanding balance to clear');
        return;
      }
      
      if (!confirm(`Clear previous outstanding of ${formatCurrency(previousOutstanding, currency)}?`)) {
        return;
      }

      const response = await api.creditCards.clearOutstanding(cardId);
      
      if (response.success) {
        alert(response.message || 'Outstanding cleared successfully');
        fetchCreditCards();
      } else {
        alert(response.message || 'Failed to clear outstanding');
      }
    } catch (error) {
      console.error('Error clearing outstanding:', error);
      alert('Failed to clear outstanding');
    }
  };

  const formatAmount = (amount: number) => formatCurrency(amount || 0, currency);

  const summary = creditCards.reduce((acc, card) => ({
    totalLimit: acc.totalLimit + card.creditLimit,
    totalBalance: acc.totalBalance + card.currentBalance,
    totalPreviousOutstanding: acc.totalPreviousOutstanding + (card.previousOutstanding || 0),
  }), { totalLimit: 0, totalBalance: 0, totalPreviousOutstanding: 0 });

  const overallUtilization = summary.totalLimit > 0 ? (summary.totalBalance / summary.totalLimit) * 100 : 0;

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
                  <h1 className="text-3xl font-bold tracking-tight">Credit Cards</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage your credit cards and track balances
                  </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credit Card
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{creditCards.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit Limit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatAmount(summary.totalLimit)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{formatAmount(summary.totalBalance + summary.totalPreviousOutstanding)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      overallUtilization > 80 ? 'text-red-500' : 
                      overallUtilization > 50 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {overallUtilization.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Credit Cards Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading credit cards...</p>
                </div>
              ) : creditCards.length === 0 ? (
                <Card className="p-12 text-center">
                  <CreditCardIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Credit Cards</h3>
                  <p className="text-muted-foreground mb-4">Add your first credit card to start tracking</p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Credit Card
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {creditCards.map((card) => {
                    const utilizationPercentage = card.creditLimit > 0 ? (card.currentBalance / card.creditLimit) * 100 : 0;
                    const totalOutstanding = card.currentBalance + (card.previousOutstanding || 0);
                    
                    return (
                      <Card key={card.id} className="border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{card.name}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(card)}>
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(card.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <CardDescription>**** **** **** {card.lastFourDigits}</CardDescription>
                            <Badge variant="outline" className="text-xs">
                              {card.issuer}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            {(card.previousOutstanding || 0) > 0 && (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Previous Outstanding</span>
                                  <span className="font-semibold text-red-500">
                                    {formatAmount(card.previousOutstanding || 0)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-xs text-red-500">Payment overdue</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Current Outstanding</span>
                              <span className="font-semibold text-orange-500">
                                {formatAmount(card.currentBalance)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-border/40 pt-2 mt-2">
                              <span className="text-muted-foreground">Credit Limit</span>
                              <span className="font-semibold">
                                {formatAmount(card.creditLimit)}
                              </span>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Current Utilization</span>
                                <span className={`font-medium ${
                                  utilizationPercentage > 80 ? 'text-red-500' : 
                                  utilizationPercentage > 50 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                  {utilizationPercentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    utilizationPercentage > 80 ? 'bg-red-500' : 
                                    utilizationPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border/40">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Billing Cycle</span>
                              <span className="font-medium">Day {card.billingCycle}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-muted-foreground">Due Date</span>
                              <span className="font-medium">+{card.dueDate} days</span>
                            </div>
                          </div>
                          {(card.previousOutstanding || 0) > 0 && (
                            <div className="pt-3 border-t border-border/40">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleClearOutstanding(card.id)}
                              >
                                Clear Previous Outstanding
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Add/Edit Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCard ? 'Edit Credit Card' : 'Add Credit Card'}</DialogTitle>
                    <DialogDescription>
                      {editingCard ? 'Update your credit card details' : 'Add a new credit card to track'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Card Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Chase Sapphire"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="lastFourDigits">Last 4 Digits *</Label>
                          <Input
                            id="lastFourDigits"
                            value={formData.lastFourDigits}
                            onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
                            placeholder="1234"
                            maxLength={4}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="issuer">Issuer *</Label>
                          <Input
                            id="issuer"
                            value={formData.issuer}
                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                            placeholder="Visa"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="billingCycle">Billing Day *</Label>
                          <Input
                            id="billingCycle"
                            type="number"
                            min="1"
                            max="31"
                            value={formData.billingCycle}
                            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                            placeholder="1"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Due Days *</Label>
                          <Input
                            id="dueDate"
                            type="number"
                            min="1"
                            max="31"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            placeholder="25"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="creditLimit">Credit Limit *</Label>
                        <Input
                          id="creditLimit"
                          type="number"
                          step="0.01"
                          value={formData.creditLimit}
                          onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                          placeholder="10000"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="currentBalance">Current Outstanding</Label>
                        <Input
                          id="currentBalance"
                          type="number"
                          step="0.01"
                          value={formData.currentBalance}
                          onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="previousOutstanding">Previous Outstanding</Label>
                        <Input
                          id="previousOutstanding"
                          type="number"
                          step="0.01"
                          value={formData.previousOutstanding}
                          onChange={(e) => setFormData({ ...formData, previousOutstanding: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingCard ? 'Update' : 'Add'} Card
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
