"use client";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  ThirdwebProvider,
  coinbaseWallet,
  localWallet,
  metamaskWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import { API_KEY, SMART_WALLET } from "../constants/addresses";
import { CacheProvider } from "@emotion/react";
import NavBar from "@/components/NavBar";
import createCache from "@emotion/cache";
const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

const inter = Inter({ subsets: ["latin"] });
const emotionCache = createCache({ key: "css" });
const activeChain = "mumbai";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CacheProvider value={emotionCache}>
        <ThirdwebProvider
          clientId={client}
          activeChain={activeChain}
          supportedWallets={[coinbaseWallet(), localWallet(), metamaskWallet()]}
        >
          <ChakraProvider>
            <body>
              {" "}
              <NavBar />
              {children}
            </body>
          </ChakraProvider>
        </ThirdwebProvider>
      </CacheProvider>
    </html>
  );
}
