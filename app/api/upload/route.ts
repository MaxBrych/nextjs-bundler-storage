import { NextResponse, NextRequest } from "next/server";
import Bundlr from "@bundlr-network/client";

// process.env.BNDLR_KEY
const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

export async function POST(req: NextRequest) {
  const data = await req.text(); // Get the request data as text instead of JSON
  const bundlr = new Bundlr(
    "http://node1.bundlr.network",
    "matic",
    process.env.NEXT_PUBLIC_BUNDLR_KEY
  );
  await bundlr.ready();
  let balance = await bundlr.getLoadedBalance();
  let readableBalance = bundlr.utils.fromAtomic(balance).toNumber();

  if (readableBalance < MIN_FUNDS) {
    await bundlr.fund(TOP_UP);
  }

  const buffer = Buffer.from(data, "utf-8"); // Convert the text data to a Buffer

  const tx = await bundlr.upload(buffer, {
    // Upload the Buffer
    tags: [{ name: "Content-Type", value: "text/plain" }],
  });

  return NextResponse.json({ txId: `https://arweave.net/${tx.id}` });
}
