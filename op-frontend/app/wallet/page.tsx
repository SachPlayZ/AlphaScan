"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Wallet as WalletIcon,
  ExternalLink,
  Send,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addTransaction,
  getOrCreateWallet,
  WalletData,
  updateOGBalance,
  sendOGTokens,
} from "@/lib/wallet";
import { ogTestnet } from "@/app/config";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { abi, contractAddress } from "@/app/abi";
import {
  useAccount,
  useReadContract,
  useSendTransaction,
  useSignMessage,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isSendingTokens, setIsSendingTokens] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const [sendAmount, setSendAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const { writeContractAsync: mapWallet } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const { address: metaMaskAddress } = useAccount();

  const { data: isAlreadyMapped, isLoading: isMappingLoading } =
    useReadContract({
      address: contractAddress,
      abi: abi,
      functionName: "hasLinkedKeys",
      args: [metaMaskAddress as `0x${string}`],
      query: { enabled: !!metaMaskAddress },
    });

  useEffect(() => {
    const fetchWallet = async () => {
      const existingWallet = localStorage.getItem("agent-wallet");
      let walletData: WalletData;

      if (existingWallet) {
        const parsed = JSON.parse(existingWallet);
        walletData = {
          address: parsed.address,
          privateKey: parsed.privateKey,
          balance: 0,
          ogBalance: 0,
          transactions: [],
        };
      } else {
        walletData = getOrCreateWallet();
      }

      try {
        const updatedWallet = await updateOGBalance(walletData);
        setWallet(updatedWallet);
      } catch {
        setWallet(walletData);
      }

      setIsLoading(false);
    };

    fetchWallet();
  }, []);

  const refreshOGBalance = async () => {
    if (!wallet) return;

    setIsRefreshingBalance(true);

    try {
      const updatedWallet = await updateOGBalance(wallet);
      setWallet(updatedWallet);
    } catch (error) {
      console.error("Error refreshing 0G balance:", error);
    }

    setIsRefreshingBalance(false);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatKey = (key: string) => {
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  const getExplorerAddressUrl = (address: string) => {
    return `${ogTestnet.blockExplorers.default.url}/address/${address}`;
  };

  const handleDepositOG = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !metaMaskAddress) {
      toast({
        title: "Connect Wallet",
        description: "Connect your wallet before depositing 0G.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);

    try {
      const txHash = await sendTransactionAsync({
        to: wallet.address as `0x${string}`,
        value: parseEther(depositAmount),
      });

      const walletWithTx = addTransaction(wallet, {
        type: "deposit",
        amount,
        description: "Deposit from connected wallet",
        hash: txHash,
      });
      setWallet(walletWithTx);

      toast({
        title: "Deposit Submitted",
        description: "Your wallet was prompted to send 0G to the agent wallet.",
        variant: "default",
        action: (
          <ToastAction altText="View on Explorer">
            <a
              href={`${ogTestnet.blockExplorers.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </ToastAction>
        ),
      });

      setDepositAmount("");
      setDepositOpen(false);
      setTimeout(() => refreshOGBalance(), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit deposit";
      const rejected =
        message.includes("User rejected") ||
        message.includes("rejected") ||
        message.includes("denied");

      if (!rejected) {
        toast({
          title: "Deposit Failed",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawOG = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !metaMaskAddress) {
      toast({
        title: "Connect Wallet",
        description: "Connect your wallet before withdrawing 0G.",
        variant: "destructive",
      });
      return;
    }

    if (!sendAmount) {
      toast({
        title: "Error",
        description: "Please enter a withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(sendAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > wallet.ogBalance) {
      toast({
        title: "Error",
        description: "Insufficient 0G balance",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTokens(true);

    try {
      const result = await sendOGTokens(
        wallet,
        metaMaskAddress,
        amount,
        "Withdraw to connected wallet"
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "0G tokens sent successfully",
          variant: "default",
          action: result.txHash ? (
            <ToastAction altText="View on Explorer">
              <a
                href={`${ogTestnet.blockExplorers.default.url}/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
            </ToastAction>
          ) : undefined,
        });

        // Refresh wallet data
        const updatedWallet = await updateOGBalance(wallet);
        setWallet(updatedWallet);

        setSendAmount("");
        setWithdrawOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send 0G tokens",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending 0G tokens:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setIsSendingTokens(false);
  };

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="h-[calc(100vh-5rem)] overflow-hidden p-3 md:p-4">
        {wallet && (
          <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
            <div className="flex shrink-0 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <div>
                  <p className="section-label mb-1">Single Wallet Interface</p>
                  <h1 className="font-heading text-4xl leading-none md:text-5xl">
                    Agent Wallet
                  </h1>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border"
                disabled={isMappingLoading || !!isAlreadyMapped || !metaMaskAddress}
                onClick={async () => {
                  if (!wallet || !metaMaskAddress) return;

                  if (isAlreadyMapped) {
                    toast({
                      title: "Already Mapped",
                      description: "This wallet is already mapped to the agent service.",
                      variant: "default",
                    });
                    return;
                  }

                  try {
                    // Step 1: Sign a message proving MetaMask wallet ownership
                    const message = `AlphaScan:link:${metaMaskAddress}:${wallet.address}`;
                    const signature = await signMessageAsync({ message });

                    // Step 2: Store the encrypted private key in the backend (over HTTPS)
                    const res = await fetch(`${BACKEND_URL}/store-agent-key`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        user_wallet: metaMaskAddress,
                        agent_address: wallet.address,
                        agent_private_key: wallet.privateKey,
                        signature,
                      }),
                    });
                    if (!res.ok) {
                      throw new Error("Failed to store agent key in backend");
                    }

                    // Step 3: Register the link on-chain (only the agent address, no private key)
                    const tx = await mapWallet({
                      address: contractAddress,
                      abi: abi,
                      functionName: "linkKeys",
                      args: [wallet.address],
                    });

                    toast({
                      title: "Wallet Mapped Successfully",
                      description: "Your wallet has been linked to the agent service.",
                      variant: "default",
                      action: (
                        <ToastAction altText="View on Explorer">
                          <a
                            href={`${ogTestnet.blockExplorers.default.url}/tx/${tx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Explorer
                          </a>
                        </ToastAction>
                      ),
                    });

                    window.location.reload();
                  } catch (error) {
                    console.error("Error mapping wallet:", error);
                    toast({
                      title: "Error",
                      description: "Failed to map wallet. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                {isMappingLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : isAlreadyMapped ? (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Mapped
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Map Wallet
                  </>
                )}
              </Button>
            </div>

            <section className="glass-card grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden rounded-3xl p-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex min-h-0 flex-col gap-3">
                <div className="rounded-3xl bg-primary/15 p-5">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
                        <WalletIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          Available Balance
                        </p>
                        <p className="font-heading text-5xl leading-none text-foreground">
                          {wallet.ogBalance.toLocaleString()} 0G
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={refreshOGBalance}
                      disabled={isRefreshingBalance}
                      className="rounded-full hover:bg-primary/10"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshingBalance ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="relative grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Button
                        type="button"
                        className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                          setDepositOpen((open) => !open);
                          setWithdrawOpen(false);
                        }}
                      >
                        <ArrowDownCircle className="mr-2 h-4 w-4" />
                        Deposit
                      </Button>

                      {depositOpen && (
                        <form
                          onSubmit={handleDepositOG}
                          className="absolute left-0 top-14 z-20 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-primary/20 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
                        >
                          <div className="mb-3">
                            <p className="font-heading text-2xl leading-none">Deposit 0G</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Sends from your connected wallet to this agent wallet.
                            </p>
                          </div>
                          <Label htmlFor="deposit-amount">Amount</Label>
                          <Input
                            id="deposit-amount"
                            type="number"
                            step="0.000001"
                            min="0"
                            placeholder="0.0"
                            value={depositAmount}
                            onChange={(event) => setDepositAmount(event.target.value)}
                            className="glass mt-1 h-11 rounded-full"
                          />
                          <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
                            To: {wallet.address}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 flex-1 rounded-full"
                              onClick={() => setDepositOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-10 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={isDepositing}
                            >
                              {isDepositing ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="mr-2 h-4 w-4" />
                              )}
                              Send
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="relative">
                      <Button
                        type="button"
                        className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => {
                          setWithdrawOpen((open) => !open);
                          setDepositOpen(false);
                        }}
                      >
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Withdraw
                      </Button>

                      {withdrawOpen && (
                        <form
                          onSubmit={handleWithdrawOG}
                          className="absolute right-0 top-14 z-20 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-primary/20 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
                        >
                          <div className="mb-3">
                            <p className="font-heading text-2xl leading-none">Withdraw 0G</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Sends from the agent wallet back to your connected wallet.
                            </p>
                          </div>
                          <Label htmlFor="withdraw-amount">Amount</Label>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            step="0.000001"
                            min="0"
                            placeholder="0.0"
                            value={sendAmount}
                            onChange={(event) => setSendAmount(event.target.value)}
                            className="glass mt-1 h-11 rounded-full"
                          />
                          <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
                            To: {metaMaskAddress ?? "Connect wallet"}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 flex-1 rounded-full"
                              onClick={() => setWithdrawOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-10 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={isSendingTokens}
                            >
                              {isSendingTokens ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="mr-2 h-4 w-4" />
                              )}
                              Send
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      USD Balance
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">
                      ${wallet.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Network
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">0G</p>
                  </div>
                </div>

                <div className="glass min-h-0 flex-1 rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Wallet Address
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address, "address")}
                        className="h-7 rounded-full px-2 text-xs hover:bg-primary/10"
                      >
                        {copied === "address" ? "Copied" : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <a
                        href={getExplorerAddressUrl(wallet.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-full px-2 hover:bg-primary/10"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  <p className="break-all font-mono text-xs text-foreground/80">
                    {wallet.address}
                  </p>

                  <div className="mt-4 border-t border-border/60 pt-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Private Key
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="h-7 rounded-full px-2 hover:bg-primary/10"
                        >
                          {showPrivateKey ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.privateKey, "private")}
                          className="h-7 rounded-full px-2 hover:bg-primary/10"
                          disabled={!showPrivateKey}
                        >
                          {copied === "private" ? "Copied" : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    <p className="break-all font-mono text-xs text-foreground/80">
                      {showPrivateKey
                        ? wallet.privateKey
                        : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </p>
                    <p className="mt-3 text-xs text-fuchsia-300">
                      Never share your private key. Keep it secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass flex min-h-0 flex-col overflow-hidden rounded-3xl p-4">
                  <div className="mb-3 flex shrink-0 items-center justify-between">
                    <h2 className="font-heading text-3xl leading-none">Transactions</h2>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {wallet.transactions.length} total
                    </span>
                  </div>

                  {wallet.transactions.length > 0 ? (
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                      {wallet.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center rounded-2xl border border-border/60 bg-background/40 p-3"
                        >
                          <div
                            className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full ${
                              tx.type === "deposit"
                                ? "bg-green-500/20"
                                : "bg-red-500/20"
                            }`}
                          >
                            {tx.type === "deposit" ? (
                              <ArrowDownCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between gap-3">
                              <p className="truncate text-sm font-medium">{tx.description}</p>
                              <p
                                className={`text-sm font-semibold ${
                                  tx.type === "deposit" ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(tx.timestamp)}
                              {tx.hash ? ` · ${formatKey(tx.hash)}` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border/70 text-sm text-muted-foreground">
                      No transactions yet
                    </div>
                  )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
