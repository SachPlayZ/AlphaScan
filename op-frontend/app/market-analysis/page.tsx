"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarketAnalysisPage() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        <div className="grain-overlay" aria-hidden />
        <div className="glass-card w-full max-w-2xl rounded-3xl p-10 text-center">
          <p className="section-label mb-5 justify-center">Coming Soon</p>
          <h1 className="mb-6 font-heading text-6xl leading-none">
            <span className="text-foreground">Market Analysis</span>
          </h1>
          <p className="mb-8 text-lg font-light leading-relaxed text-muted-foreground">
            This page is under construction. Advanced market analysis features
            coming soon!
          </p>
          <Link href="/dashboard">
            <Button className="group relative h-12 rounded-full bg-primary px-8 text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
