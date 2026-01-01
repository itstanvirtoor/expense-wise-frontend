import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Sparkles,
  Globe,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative px-4 md:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Financial Management</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Master Your Finances
              </span>
              <br />
              <span className="text-foreground">With AI-Powered Insights</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              ExpenseWise combines cutting-edge technology with intuitive design to give you complete control over your expenses. Track, analyze, and optimize your spending like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 h-12 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span>Real-time sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Multi-currency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Powerful Features for
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Modern Finance</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to take control of your financial future, powered by cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Real-time expense tracking with instant synchronization across all your devices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  AI-powered insights that help you understand spending patterns and make better decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Bank-Grade Security</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-level encryption and security protocols.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Predictive Budgeting</CardTitle>
                <CardDescription>
                  Get ahead of your finances with AI predictions and personalized recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share expenses and budgets with family or team members seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Automated Tracking</CardTitle>
                <CardDescription>
                  Set it and forget it. Automatically categorize and track your expenses.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        
        <div className="relative px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Financial Future?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who are already managing their finances smarter with ExpenseWise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 h-12">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
