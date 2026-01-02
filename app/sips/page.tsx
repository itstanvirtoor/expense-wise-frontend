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
import { Plus, TrendingUp, Trash2, Play, Pause, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { api, SIP, CreditCard } from "@/lib/api";
import { ProtectedRoute } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency } from "@/lib/timezone";

const paymentMethods = ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"];

export default function SIPsPage() {
  const { user, currency } = useUser();
  const [sips, setSips] = useState<SIP[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSIP, setEditingSIP] = useState<SIP | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    fundName: "",
    sipAmount: "",
    sipDate: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    creditCardId: "",
    status: "active",
    notes: "",
  });

  useEffect(() => {
    fetchSIPs();
    fetchCreditCards();
  }, []);

  const fetchSIPs = async () => {
    setIsLoading(true);
    try {
      const response = await api.sips.getAll();
      if (response.success && response.data) {
        setSips(response.data.sips || []);
      }
    } catch (error) {
      console.error('Failed to fetch SIPs:', error);
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

  const handleOpenDialog = (sip?: SIP) => {
    if (sip) {
      setEditingSIP(sip);
      setFormData({
        name: sip.name,
        fundName: sip.fundName,
        sipAmount: sip.sipAmount.toString(),
        sipDate: sip.sipDate.toString(),
        startDate: sip.startDate.split('T')[0],
        endDate: sip.endDate.split('T')[0],
        paymentMethod: sip.paymentMethod,
        creditCardId: sip.creditCardId || "",
        status: sip.status,
        notes: sip.notes || "",
      });
    } else {
      setEditingSIP(null);
      setFormData({
        name: "",
        fundName: "",
        sipAmount: "",
        sipDate: "",
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
    setEditingSIP(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sipData = {
        name: formData.name,
        fundName: formData.fundName,
        sipAmount: parseFloat(formData.sipAmount),
        sipDate: parseInt(formData.sipDate),
        startDate: formData.startDate,
        endDate: formData.endDate,
        paymentMethod: formData.paymentMethod,
        creditCardId: formData.creditCardId || null,
        status: formData.status,
        notes: formData.notes,
      };

      if (editingSIP) {
        await api.sips.update(editingSIP.id, sipData);
      } else {
        await api.sips.create(sipData);
      }

      fetchSIPs();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save SIP:', error);
      alert('Failed to save SIP');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SIP?')) return;

    try {
      await api.sips.delete(id);
      fetchSIPs();
    } catch (error) {
      console.error('Failed to delete SIP:', error);
      alert('Failed to delete SIP');
    }
  };

  const getMonthsInvested = (startDate: string): number => {
    const today = new Date();
    const start = new Date(startDate);
    const months = (today.getFullYear() - start.getFullYear()) * 12 +
      (today.getMonth() - start.getMonth());
    return Math.max(0, months);
  };

  const formatAmount = (amount: number) => formatCurrency(amount || 0, currency);

  const activeSIPs = sips.filter(s => s.status === 'active');
  const summary = activeSIPs.reduce((acc, sip) => {
    const monthsInvested = getMonthsInvested(sip.startDate);
    return {
      totalSIPs: acc.totalSIPs + 1,
      monthlyInvestment: acc.monthlyInvestment + sip.sipAmount,
      totalInvested: acc.totalInvested + (sip.sipAmount * monthsInvested),
    };
  }, { totalSIPs: 0, monthlyInvestment: 0, totalInvested: 0 });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'stopped': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'paused': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'stopped': return 'bg-red-500/10 text-red-500 border-red-500/20';
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
                  <h1 className="text-3xl font-bold tracking-tight">SIPs & Mutual Funds</h1>
                  <p className="text-muted-foreground mt-2">
                    Track your systematic investment plans and mutual fund investments
                  </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add SIP
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active SIPs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.totalSIPs}</div>
                    <p className="text-xs text-muted-foreground mt-1">out of {sips.length} total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{formatAmount(summary.monthlyInvestment)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total monthly SIP amount</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{formatAmount(summary.totalInvested)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Cumulative investment</p>
                  </CardContent>
                </Card>
              </div>

              {/* SIPs Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading SIPs...</p>
                </div>
              ) : sips.length === 0 ? (
                <Card className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No SIPs</h3>
                  <p className="text-muted-foreground mb-4">Add your first SIP to start tracking investments</p>
                  <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add SIP
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {sips.map((sip) => {
                    const monthsInvested = getMonthsInvested(sip.startDate);
                    const totalInvested = sip.sipAmount * monthsInvested;
                    const endDate = new Date(sip.endDate);
                    const today = new Date();
                    const monthsRemaining = Math.max(0, (endDate.getFullYear() - today.getFullYear()) * 12 + (endDate.getMonth() - today.getMonth()));
                    const totalDuration = Math.max(1, (endDate.getFullYear() - new Date(sip.startDate).getFullYear()) * 12 + (endDate.getMonth() - new Date(sip.startDate).getMonth()));
                    const progress = Math.min(100, (monthsInvested / totalDuration) * 100);
                    
                    return (
                      <Card key={sip.id} className="border-border/40">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-500" />
                              <CardTitle className="text-lg">{sip.name}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(sip)}>
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(sip.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(sip.status)}>
                              {getStatusIcon(sip.status)}
                              <span className="ml-1">{sip.status}</span>
                            </Badge>
                            <Badge variant="outline">{sip.paymentMethod}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Fund Name</p>
                            <p className="text-sm font-semibold">{sip.fundName}</p>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Monthly SIP</span>
                              <span className="text-xl font-bold text-green-500">{formatAmount(sip.sipAmount)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Auto-debit on day {sip.sipDate} of every month</p>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Investment Progress</span>
                              <span className="font-medium">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <p className="text-xs text-muted-foreground">Total Invested</p>
                              <p className="text-lg font-bold text-blue-500">{formatAmount(totalInvested)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{monthsInvested} months</p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                              <p className="text-xs text-muted-foreground">Months Left</p>
                              <p className="text-lg font-bold text-purple-500">{monthsRemaining}</p>
                              <p className="text-xs text-muted-foreground mt-1">remaining</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs border-t border-border/40 pt-3">
                            <div>
                              <span className="text-muted-foreground">Start: </span>
                              <span className="font-medium">{new Date(sip.startDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">End: </span>
                              <span className="font-medium">{new Date(sip.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {sip.notes && (
                            <p className="text-xs text-muted-foreground italic border-t border-border/40 pt-2">
                              {sip.notes}
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
                    <DialogTitle>{editingSIP ? 'Edit SIP' : 'Add SIP'}</DialogTitle>
                    <DialogDescription>
                      {editingSIP ? 'Update your SIP details' : 'Add a new SIP to track investments'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">SIP Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., My Monthly SIP, Emergency Fund"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="fundName">Mutual Fund Name *</Label>
                        <Input
                          id="fundName"
                          value={formData.fundName}
                          onChange={(e) => setFormData({ ...formData, fundName: e.target.value })}
                          placeholder="e.g., HDFC Equity Fund, SBI BlueChip Fund"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="sipAmount">Monthly SIP Amount *</Label>
                          <Input
                            id="sipAmount"
                            type="number"
                            step="0.01"
                            value={formData.sipAmount}
                            onChange={(e) => setFormData({ ...formData, sipAmount: e.target.value })}
                            placeholder="5000"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sipDate">SIP Date (1-31) *</Label>
                          <Input
                            id="sipDate"
                            type="number"
                            min="1"
                            max="31"
                            value={formData.sipDate}
                            onChange={(e) => setFormData({ ...formData, sipDate: e.target.value })}
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
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="stopped">Stopped</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Add any additional notes about this SIP..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500">
                        {editingSIP ? 'Update' : 'Add'} SIP
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
