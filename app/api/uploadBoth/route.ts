import { NextResponse, NextRequest } from "next/server";
import Bundlr from "@bundlr-network/client";

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.1;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as any;
  const category = formData.get("category") as string;
  const headline = formData.get("headline") as string;
  const teaser = formData.get("teaser") as string;
  const buffer = Buffer.from(await file.arrayBuffer());
  //const body = formData.get("body") as any;

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

  const tx = await bundlr.upload(buffer, {
    tags: [
      { name: "Content-Type", value: "image/png" },
      { name: "Category", value: category },
      { name: "Headline", value: headline },
      { name: "Teaser", value: teaser },
      //{ name: "Body", value: body },
    ],
  });

  return NextResponse.json({ txId: `https://arweave.net/${tx.id}` });
}
