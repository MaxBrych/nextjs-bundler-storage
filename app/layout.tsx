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

const inter = Inter({ subsets: ["latin"] });

const activeChain = "mumbai";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThirdwebProvider
        activeChain={activeChain}
        supportedWallets={[coinbaseWallet(), localWallet(), metamaskWallet()]}
      >
        <ChakraProvider>
          <NavBar />
          <body>{children}</body>
        </ChakraProvider>
      </ThirdwebProvider>
    </html>
  );
}
