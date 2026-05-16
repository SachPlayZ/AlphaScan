"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Search,
  Menu,
  X,
  ArrowRight,
  Activity,
  BookOpen,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";

const marketData = [
  { symbol: "BTC/USD", price: "68,245.32", change: "+2.4%", trend: "up" },
  { symbol: "ETH/USD", price: "3,782.15", change: "+1.8%", trend: "up" },
  { symbol: "AAPL", price: "187.32", change: "-0.5%", trend: "down" },
  { symbol: "MSFT", price: "415.75", change: "+1.2%", trend: "up" },
  { symbol: "TSLA", price: "178.54", change: "-2.1%", trend: "down" },
];

const insights = [
  {
    id: "insight1",
    title: "BTC showing bullish divergence",
    description:
      "Technical indicators suggest a potential upward movement in the next 24–48 hours.",
    timestamp: "10 min ago",
    confidence: "High",
  },
  {
    id: "insight2",
    title: "AAPL earnings impact analysis",
    description:
      "AI analysis of recent earnings call suggests positive long-term outlook despite short-term volatility.",
    timestamp: "2h ago",
    confidence: "Medium",
  },
  {
    id: "insight3",
    title: "Market volatility alert",
    description:
      "Increased market volatility expected due to upcoming Federal Reserve announcement.",
    timestamp: "1d ago",
    confidence: "High",
  },
];

const groupActivity = [
  {
    id: "activity1",
    user: "Alex Chen",
    action: "shared an analysis on BTC/USD",
    timestamp: "5m ago",
  },
  {
    id: "activity2",
    user: "Sarah Johnson",
    action: "asked about TSLA earnings impact",
    timestamp: "30m ago",
  },
  {
    id: "activity3",
    user: "Michael Wong",
    action: "posted a chart analysis for ETH/USD",
    timestamp: "2h ago",
  },
];

const navLinks = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard", active: true },
  { href: "/market-analysis", icon: LineChart, label: "Market Analysis" },
  { href: "/portfolio", icon: PieChart, label: "Portfolio" },
  { href: "/agent-actions", icon: Activity, label: "Agent Actions" },
  { href: "/agent-lessons", icon: BookOpen, label: "Agent Lessons" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
];

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <nav className="flex flex-col h-full">
      {mobile && (
        <div className="flex items-center justify-between px-4 py-4 border-b border-border mb-2">
          <span className="text-sm font-semibold">Navigation</span>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}
      <div className="flex-1 px-3 py-3 space-y-0.5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              link.active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span>{link.label}</span>
            {link.active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-card/70 backdrop-blur-xl md:flex">
          <Sidebar />
        </aside>

        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-[57px] left-0 z-40 flex items-center gap-2 px-3 py-2 bg-card border-b border-r border-border text-xs text-muted-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="w-56 bg-card border-r border-border h-full">
              <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
            </div>
            <div
              className="flex-1 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-8 p-5 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="section-label mb-3">Control Room</p>
              <h1 className="font-heading text-5xl leading-none tracking-tight">
                Dashboard
              </h1>
              <p className="mt-3 text-sm font-light text-muted-foreground">
                Your AI market intelligence overview
              </p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search markets, insights…"
                className="glass h-10 rounded-full pl-9 text-sm"
              />
            </div>
          </div>

          {/* Market ticker */}
          <div className="warm-card overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-heading text-2xl">Market Overview</h2>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Symbol</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Price</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">24h</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((item) => (
                    <tr key={item.symbol} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{item.symbol}</td>
                      <td className="px-4 py-3 text-right tabular-nums">${item.price}</td>
                      <td className={`px-4 py-3 text-right tabular-nums font-medium ${
                        item.trend === "up" ? "text-accent" : "text-destructive"
                      }`}>
                        {item.change}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-accent ml-auto" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive ml-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <div className="warm-card overflow-hidden rounded-3xl lg:col-span-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="font-heading text-2xl">AI Insights</h2>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  View All
                </Button>
              </div>
              <div className="divide-y divide-border">
                {insights.map((insight) => (
                  <div key={insight.id} className="px-4 py-4 hover:bg-muted/20 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium truncate">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {insight.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{insight.timestamp}</p>
                      </div>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                        insight.confidence === "High"
                          ? "bg-accent/10 text-accent"
                          : "bg-fuchsia-500/10 text-fuchsia-300"
                      }`}>
                        {insight.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Group Activity */}
              <div className="warm-card overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h2 className="font-heading text-2xl">Group Activity</h2>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {groupActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 px-4 py-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-medium text-muted-foreground">
                        {activity.user.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wallet Summary */}
              <div className="warm-card overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h2 className="font-heading text-2xl">Wallet</h2>
                  <Link href="/wallet">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                      Details
                    </Button>
                  </Link>
                </div>
                <div className="p-4 flex flex-col items-center gap-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage your assets and view transaction history
                  </p>
                  <Link href="/wallet" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-sm">
                      Go to Wallet
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex">
            <Button
              className="h-12 rounded-full bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Detailed Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
