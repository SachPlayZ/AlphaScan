import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { type Chain } from "viem";

export const ogTestnet = {
  id: 16602,
  name: "0G-Galileo-Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: {
      name: "0G ChainScan",
      url: "https://chainscan-galileo.0g.ai",
    },
  },
} as const satisfies Chain;

export function getConfig() {
  return createConfig({
    chains: [ogTestnet],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [ogTestnet.id]: http(),
    },
  });
}
