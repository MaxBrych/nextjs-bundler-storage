// utils/queryMetadata.ts
import Query from "@irys/query";
export interface MetadataEntry {
  name: string;
  description: string;
  // ... other fields you expect to receive
}

export const queryMetadata = async (): Promise<MetadataEntry[] | undefined> => {
  async function fetchFileContent(transactionId: string) {
    try {
      const response = await fetch(`https://node1.irys.xyz/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const fileContent = await response.json(); // assuming the file content is in JSON format
      return fileContent;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  const myQuery = new Query();
  try {
    const results = await myQuery
      .search("irys:transactions")
      .tags([{ name: "AppName", values: ["Netizen"] }])
      .limit(20);
    console.log(results);

    const metadataEntries = await Promise.all(
      results.map(async (result) => {
        const fileContent = await fetchFileContent(result.id); // assume fetchFileContent is a function to get the file content
        return {
          id: result.id,
          timestamp: result.timestamp,
          address: result.address,
          name: fileContent.name,
          description: fileContent.description,
          image: fileContent.image,
        };
      })
    );

    return metadataEntries;
  } catch (e) {
    console.error("Error querying metadata ", e);
    return [];
  }
};
