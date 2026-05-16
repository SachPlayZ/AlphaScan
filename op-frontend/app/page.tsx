import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  MessageSquare,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

const tickerItems = [
  "Telegram Alpha",
  "Wallet Mapping",
  "Social Velocity",
  "0G Agent Wallets",
  "Sentiment Drift",
  "Execution Logs",
  "Market Memory",
  "Risk Filters",
  "Token Balance Checks",
  "Trust Layer",
];

const features = [
  {
    icon: Search,
    title: "Social Scanning",
    description:
      "Continuously watches Telegram communities and market chatter to catch early signals before they become obvious.",
  },
  {
    icon: BrainCircuit,
    title: "Agent Reasoning",
    description:
      "Routes raw group text through analysis, validation, historical context, and PNL estimation steps.",
  },
  {
    icon: Wallet,
    title: "Wallet-Aware Actions",
    description:
      "Links your agent wallet to balances, transactions, and execution readiness without exposing custody in the UI.",
  },
];

const steps = [
  {
    n: "01",
    title: "Connect your wallet",
    body: "Start with the same wallet you use for the 0G testnet and agent configuration.",
  },
  {
    n: "02",
    title: "Attach a Telegram source",
    body: "Pick the group and topic you want AlphaScan to monitor for emerging market narratives.",
  },
  {
    n: "03",
    title: "Agents analyze signal",
    body: "Text, tweets, trend data, balances, and historical context move through a visible agent pipeline.",
  },
  {
    n: "04",
    title: "Review actions",
    body: "Inspect the reasoning trail, confidence, output, and portfolio impact before acting on a signal.",
  },
];

const signalCards = [
  { label: "Social velocity", value: "+245%", fill: "85%", Icon: MessageSquare },
  { label: "Trust score", value: "0.82", fill: "74%", Icon: ShieldCheck },
  { label: "Volume momentum", value: "+178%", fill: "66%", Icon: BarChart3 },
];

const faq = [
  {
    q: "What does AlphaScan monitor?",
    a: "The current product centers on Telegram groups, agent logs, token balances, historical data, tweet analysis, and agent wallet activity.",
  },
  {
    q: "Does AlphaScan trade automatically?",
    a: "The interface exposes agent actions and wallet tools, but the UI keeps the reasoning and state visible before users rely on outputs.",
  },
  {
    q: "Why connect a wallet?",
    a: "Wallet connection powers the dashboard, agent-wallet mapping, balance checks, and 0G testnet workflows.",
  },
  {
    q: "Can I review what the agent did?",
    a: "Yes. The Agent Actions and Agent Lessons areas preserve the timeline, inputs, outputs, confidence, and learned patterns.",
  },
];

export default function Home() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <div className="grain-overlay" aria-hidden />

      <main className="flex-1">
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 18%, rgba(139,92,246,0.48), transparent 28rem), radial-gradient(circle at 82% 20%, rgba(217,70,239,0.28), transparent 26rem), linear-gradient(140deg, #080313 0%, #17102d 48%, #2a1248 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-36 pt-36 text-center">
            <div className="animate-fade-rise liquid-glass mb-10 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
              Agentic market intelligence · Built for 0G
            </div>

            <h1
              className="animate-fade-rise editorial-title max-w-6xl text-white"
              style={{ fontSize: "clamp(3.8rem, 10vw, 9rem)" }}
            >
              Find alpha
              <br />
              <span className="italic opacity-80">before it moves.</span>
            </h1>

            <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
              AlphaScan turns noisy Telegram groups, market traces, and wallet
              context into auditable AI-agent decisions. Follow every signal from
              raw conversation to validated action.
            </p>

            <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="liquid-glass rounded-full px-14 py-5 text-base font-medium text-white transition-transform hover:scale-[1.03]"
              >
                Start scanning
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-light tracking-wide text-white/50 transition-colors hover:text-white/80"
              >
                Open dashboard →
              </Link>
            </div>
          </div>
        </section>

        <div className="w-full overflow-hidden bg-primary py-4">
          <div className="flex w-max animate-[ticker_34s_linear_infinite]">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-5 whitespace-nowrap px-6 text-sm font-medium tracking-wide text-primary-foreground"
              >
                {item}
                <span className="text-xl leading-none text-primary-foreground/35">·</span>
              </span>
            ))}
          </div>
        </div>

        <section className="w-full bg-foreground py-24 text-background">
          <div className="container mx-auto max-w-5xl px-6">
            <p className="mb-16 text-center text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Live signal preview
            </p>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-background/10 bg-background/[0.04] p-7">
                <div className="mb-6 flex items-center justify-between border-b border-background/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-background/50">
                      Telegram trend
                    </span>
                  </div>
                  <span className="font-heading text-3xl">ABC/0G</span>
                </div>
                <div className="space-y-5">
                  {signalCards.map(({ label, value, fill, Icon }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-background/70">
                          <Icon className="h-4 w-4" />
                          {label}
                        </span>
                        <span className="font-medium tabular-nums text-background">
                          {value}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-background/10">
                        <div className="h-full rounded-full bg-primary" style={{ width: fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-background/10 bg-background/[0.04] p-7">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-background/50">
                  Agent reading
                </p>
                <h2 className="font-heading text-5xl leading-[0.95]">
                  Signal looks
                  <br />
                  <span className="italic opacity-80">actionable.</span>
                </h2>
                <p className="mt-6 text-sm font-light leading-relaxed text-background/65">
                  Community velocity is rising while validation remains above
                  threshold. The next step is checking wallet readiness and
                  historical volatility before execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-background py-28">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Signals
              </p>
              <h2
                className="editorial-title text-foreground"
                style={{ fontSize: "clamp(2.8rem, 5vw, 4.8rem)" }}
              >
                From chatter
                <br />
                <span className="italic">to conviction.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="warm-card group space-y-5 p-8 hover:bg-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-muted/60 transition-colors group-hover:border-primary/30">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full bg-muted py-28">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Process
              </p>
              <h2
                className="editorial-title text-foreground"
                style={{ fontSize: "clamp(2.8rem, 5vw, 4.8rem)" }}
              >
                Your agent,
                <br />
                <span className="italic">fully visible.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-20 gap-y-14 md:grid-cols-2">
              {steps.map((step) => (
                <div key={step.n} className="group flex gap-6">
                  <span
                    className="shrink-0 font-heading leading-none text-foreground/20 transition-colors duration-500 group-hover:text-primary/40"
                    style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)" }}
                  >
                    {step.n}
                  </span>
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl font-medium text-foreground">{step.title}</h3>
                    <p className="text-[0.95rem] font-light leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full bg-background py-28">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                FAQ
              </p>
              <h2
                className="editorial-title text-foreground"
                style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
              >
                Questions,
                <br />
                <span className="italic">answered plainly.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.q} className="warm-card p-7">
                  <h3 className="font-medium text-foreground">{item.q}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative w-full overflow-hidden bg-foreground py-32 text-background">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 select-none font-heading leading-none text-background"
            style={{ fontSize: "clamp(6rem, 18vw, 18rem)", opacity: 0.04 }}
          >
            alpha
          </div>
          <div className="container relative z-10 mx-auto max-w-4xl space-y-8 px-6 text-center">
            <h2
              className="editorial-title text-background"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Ready to
              <br />
              <span className="italic">scan?</span>
            </h2>
            <p className="mx-auto max-w-lg text-lg font-light text-background/75">
              Connect your wallet, attach your Telegram source, and let the
              AlphaScan agent pipeline start building a visible market memory.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full bg-background px-10 text-[0.95rem] font-semibold text-foreground shadow-sm hover:bg-background/90"
                asChild
              >
                <Link href="/login">
                  Start scanning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-background/20 px-10 text-[0.95rem] font-medium text-background hover:bg-background/10"
                asChild
              >
                <Link href="/agent-actions">View agent logs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-background/10 bg-foreground py-12">
        <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <span className="font-heading text-3xl text-background">AlphaScan.</span>
          <div className="flex items-center gap-8 text-sm font-light text-background/65">
            <Link href="/dashboard" className="transition-colors hover:text-background">
              Dashboard
            </Link>
            <Link href="/wallet" className="transition-colors hover:text-background">
              Wallet
            </Link>
            <Link href="/agent-lessons" className="transition-colors hover:text-background">
              Lessons
            </Link>
          </div>
          <p className="text-xs font-light text-background/50">
            © {new Date().getFullYear()} AlphaScan. Built on 0G.
          </p>
        </div>
      </footer>
    </div>
  );
}
