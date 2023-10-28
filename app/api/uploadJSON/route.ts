// File path: app/api/uploadJSON/route.ts

import { NextResponse, NextRequest } from "next/server";
import Irys from "@irys/sdk";

const getIrys = async () => {
  const url = "https://node1.irys.xyz";
  const token = "matic";
  const privateKey = process.env.NEXT_PUBLIC_BUNDLR_KEY;

  const irys = new Irys({
    url,
    token,
    key: privateKey,
  });
  return irys;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const teaser = formData.get("teaser") as string;
  const message = formData.get("message") as string;
  const image = formData.get("image") as File;

  const metadata = {
    name: title,
    description: teaser,
    image: image,
    attributes: {
      content: message,
    },
  };

  const irys = await getIrys();

  try {
    let balance = await irys.getLoadedBalance();
    let readableBalance = irys.utils.fromAtomic(balance).toNumber();

    if (readableBalance < 0.1) {
      await irys.fund(irys.utils.toAtomic(0.05));
    }

    const metadataJSON = JSON.stringify(metadata);

    const response = await irys.upload(metadataJSON, {
      tags: [{ name: "Content-Type", value: "application/json" }],
    });

    console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
    return NextResponse.json({ txId: response.id });

  } catch (e) {
    console.log("Error uploading file ", e);
    return new NextResponse({
      status: 500,
      body: JSON.stringify({ error: "Error uploading metadata" })
    });
  }
}
