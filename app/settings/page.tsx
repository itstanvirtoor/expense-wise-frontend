"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Pencil, Trash2, Bell, Lock, User, Palette, Calendar } from "lucide-react";
import { useState } from "react";

interface CreditCardData {
  id: string;
  name: string;
  lastFourDigits: string;
  billingCycle: number;
  dueDate: number;
  creditLimit: number;
  currentBalance: number;
  issuer: string;
}

export default function SettingsPage() {
  const [cards, setCards] = useState<CreditCardData[]>([
    {
      id: "1",
      name: "Chase Sapphire",
      lastFourDigits: "4532",
      billingCycle: 1,
      dueDate: 25,
      creditLimit: 10000,
      currentBalance: 2350,
      issuer: "Visa"
    },
    {
      id: "2",
      name: "Amex Gold",
      lastFourDigits: "1008",
      billingCycle: 15,
      dueDate: 10,
      creditLimit: 15000,
      currentBalance: 4200,
      issuer: "American Express"
    }
  ]);

  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCardData | null>(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    billReminders: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [cardForm, setCardForm] = useState({
    name: "",
    lastFourDigits: "",
    billingCycle: "1",
    dueDate: "25",
    creditLimit: "",
    currentBalance: "",
    issuer: "",
  });

  const handleOpenCardDialog = (card?: CreditCardData) => {
    if (card) {
      setEditingCard(card);
      setCardForm({
        name: card.name,
        lastFourDigits: card.lastFourDigits,
        billingCycle: card.billingCycle.toString(),
        dueDate: card.dueDate.toString(),
        creditLimit: card.creditLimit.toString(),
        currentBalance: card.currentBalance.toString(),
        issuer: card.issuer,
      });
    } else {
      setEditingCard(null);
      setCardForm({
        name: "",
        lastFourDigits: "",
        billingCycle: "1",
        dueDate: "25",
        creditLimit: "",
        currentBalance: "",
        issuer: "",
      });
    }
    setIsCardDialogOpen(true);
  };

  const handleSubmitCard = () => {
    if (!cardForm.name || !cardForm.lastFourDigits || !cardForm.issuer) {
      alert("Please fill all required fields");
      return;
    }

    const cardData: CreditCardData = {
      id: editingCard?.id || Date.now().toString(),
      name: cardForm.name,
      lastFourDigits: cardForm.lastFourDigits,
      billingCycle: parseInt(cardForm.billingCycle),
      dueDate: parseInt(cardForm.dueDate),
      creditLimit: parseFloat(cardForm.creditLimit) || 0,
      currentBalance: parseFloat(cardForm.currentBalance) || 0,
      issuer: cardForm.issuer,
    };

    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? cardData : c));
    } else {
      setCards([...cards, cardData]);
    }

    setIsCardDialogOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this credit card?")) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const calculateNextDueDate = (billingCycle: number, dueDate: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextDue = new Date(currentYear, currentMonth, dueDate);
    if (nextDue < today) {
      nextDue = new Date(currentYear, currentMonth + 1, dueDate);
    }
    
    return nextDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dueDate: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextDue = new Date(currentYear, currentMonth, dueDate);
    if (nextDue < today) {
      nextDue = new Date(currentYear, currentMonth + 1, dueDate);
    }
    
    const diff = nextDue.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar userRole="user" />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account, preferences, and credit cards
              </p>
            </div>

            <Tabs defaultValue="cards" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
                <TabsTrigger value="cards">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </TabsTrigger>
              </TabsList>

              {/* Credit Cards Tab */}
              <TabsContent value="cards" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Credit Card Management</CardTitle>
                        <CardDescription>Track billing cycles and payment due dates</CardDescription>
                      </div>
                      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleOpenCardDialog()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Card
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>{editingCard ? "Edit Credit Card" : "Add Credit Card"}</DialogTitle>
                            <DialogDescription>
                              {editingCard ? "Update your credit card details." : "Add a new credit card to track."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="cardName">Card Name *</Label>
                              <Input
                                id="cardName"
                                placeholder="e.g., Chase Sapphire"
                                value={cardForm.name}
                                onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="issuer">Card Issuer *</Label>
                              <Select value={cardForm.issuer} onValueChange={(value) => setCardForm({ ...cardForm, issuer: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issuer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Visa">Visa</SelectItem>
                                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                                  <SelectItem value="American Express">American Express</SelectItem>
                                  <SelectItem value="Discover">Discover</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="lastFour">Last 4 Digits *</Label>
                              <Input
                                id="lastFour"
                                placeholder="1234"
                                maxLength={4}
                                value={cardForm.lastFourDigits}
                                onChange={(e) => setCardForm({ ...cardForm, lastFourDigits: e.target.value.replace(/\D/g, '') })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="billingCycle">Billing Cycle Day</Label>
                                <Input
                                  id="billingCycle"
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={cardForm.billingCycle}
                                  onChange={(e) => setCardForm({ ...cardForm, billingCycle: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="dueDate">Payment Due Day</Label>
                                <Input
                                  id="dueDate"
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={cardForm.dueDate}
                                  onChange={(e) => setCardForm({ ...cardForm, dueDate: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="creditLimit">Credit Limit</Label>
                                <Input
                                  id="creditLimit"
                                  type="number"
                                  placeholder="10000"
                                  value={cardForm.creditLimit}
                                  onChange={(e) => setCardForm({ ...cardForm, creditLimit: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="currentBalance">Current Balance</Label>
                                <Input
                                  id="currentBalance"
                                  type="number"
                                  placeholder="2500"
                                  value={cardForm.currentBalance}
                                  onChange={(e) => setCardForm({ ...cardForm, currentBalance: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmitCard} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                              {editingCard ? "Update" : "Add"} Card
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cards.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-lg">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No credit cards added yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Add your first card to track billing cycles</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {cards.map((card) => {
                          const daysUntilDue = getDaysUntilDue(card.dueDate);
                          const utilization = (card.currentBalance / card.creditLimit) * 100;
                          
                          return (
                            <Card key={card.id} className="border-border/40 bg-background/50">
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                      <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{card.name}</CardTitle>
                                      <p className="text-sm text-muted-foreground">•••• {card.lastFourDigits}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{card.issuer}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Current Balance</span>
                                    <span className="font-semibold">${card.currentBalance.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Credit Limit</span>
                                    <span className="font-semibold">${card.creditLimit.toLocaleString()}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Utilization</span>
                                      <span className={`font-medium ${utilization > 70 ? 'text-red-500' : utilization > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {utilization.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-500 ${utilization > 70 ? 'bg-red-500' : utilization > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(utilization, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-border/40 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Billing Cycle: Day {card.billingCycle}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Bell className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">Due Date: {calculateNextDueDate(card.billingCycle, card.dueDate)}</span>
                                    </div>
                                    <Badge variant={daysUntilDue <= 7 ? "destructive" : "secondary"} className="text-xs">
                                      {daysUntilDue} days
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button variant="outline" size="sm" onClick={() => handleOpenCardDialog(card)} className="flex-1">
                                    <Pencil className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteCard(card.id)} className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="inr">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monthlyBudget">Monthly Budget</Label>
                      <Input id="monthlyBudget" type="number" defaultValue="3000" />
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive alerts and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email updates about your expenses</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you exceed budget limits</p>
                      </div>
                      <Switch
                        id="budgetAlerts"
                        checked={notifications.budgetAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="billReminders">Bill Reminders</Label>
                        <p className="text-sm text-muted-foreground">Reminders for upcoming bill payments</p>
                      </div>
                      <Switch
                        id="billReminders"
                        checked={notifications.billReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, billReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReport">Weekly Summary</Label>
                        <p className="text-sm text-muted-foreground">Weekly expense reports via email</p>
                      </div>
                      <Switch
                        id="weeklyReport"
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="monthlyReport">Monthly Summary</Label>
                        <p className="text-sm text-muted-foreground">Detailed monthly expense reports</p>
                      </div>
                      <Switch
                        id="monthlyReport"
                        checked={notifications.monthlyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>2FA Status</Label>
                        <p className="text-sm text-muted-foreground">Two-factor authentication is currently disabled</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Theme Preferences</CardTitle>
                    <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Theme Mode</Label>
                      <Select defaultValue="dark">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Accent Color</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-red-500"].map((color, i) => (
                          <button
                            key={i}
                            className={`h-10 rounded-md ${color} hover:opacity-80 transition-opacity border-2 border-border/40`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
