"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/#features", label: "Signals" },
  { href: "/#how-it-works", label: "Process" },
  { href: "/#faq", label: "FAQ" },
  { href: "/dashboard", label: "Dashboard", requiresWallet: true },
  { href: "/agent-actions", label: "Agent Logs", requiresWallet: true },
];

export function Navbar() {
  const { address } = useAccount();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/30 bg-background/90 shadow-sm backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className={`font-heading text-3xl tracking-tight transition-opacity hover:opacity-80 ${
            isTransparent ? "text-white" : "text-foreground"
          }`}
        >
          AlphaScan
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.filter((link) => !link.requiresWallet || address).map(
            ({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                  })}
                >
                  {!connected ? (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-[1.03] ${
                        isTransparent
                          ? "liquid-glass text-white"
                          : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      }`}
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className={`hidden items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors sm:inline-flex ${
                          isTransparent
                            ? "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                            : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                      >
                        {chain.hasIcon && chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain"}
                            src={chain.iconUrl}
                            width={14}
                            height={14}
                            className="h-3.5 w-3.5"
                            unoptimized
                          />
                        )}
                        <span>{chain.name}</span>
                      </button>
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.03] ${
                          isTransparent
                            ? "liquid-glass text-white"
                            : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        }`}
                      >
                        {account.displayName}
                        {account.displayBalance ? ` · ${account.displayBalance}` : ""}
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <Link
            href={address ? "/dashboard" : "/login"}
            className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-[1.03] lg:inline-flex ${
              isTransparent
                ? "text-white/75 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
    {!isHome && <div className="h-20" aria-hidden />}
    </>
  );
}
