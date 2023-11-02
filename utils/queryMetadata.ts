// utils/queryMetadata.ts
import Query from "@irys/query";

export interface MetadataEntry {
  name: string;
  description: string;
  image: string;
  id: string;
  timestamp: number;
  address: string;
}

export const queryMetadata = async (
  transactionIdOrUrl: string
): Promise<MetadataEntry | undefined> => {
  const transactionId: string = transactionIdOrUrl.includes("https")
    ? transactionIdOrUrl.split("/").pop() || "" // Provide a default value of '' in case pop() returns undefined
    : transactionIdOrUrl;

  const myQuery = new Query();

  try {
    const results = await myQuery
      .search("irys:transactions")
      .ids([transactionId]); // Fix here: pass transactionId within an array to ids()
    console.log(results);

    if (results && results.length > 0) {
      const result = results[0];
      const response = await fetch(`https://node1.irys.xyz/${result.id}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const fileContent = await response.json();
      return {
        id: result.id,
        timestamp: result.timestamp,
        address: result.address,
        name: fileContent.name,
        description: fileContent.description,
        image: fileContent.image,
      };
    }
  } catch (e) {
    console.error("Error querying metadata ", e);
  }
};
