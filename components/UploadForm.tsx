"use client";
import React, { ChangeEvent, useState, useRef } from "react";
import { uploadMetadata } from "../utils/uploadMetadata";
import TipTap from "./Editor/TipTap";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface MySmartContract extends ethers.Contract {
  propose: (url: string) => Promise<void>;
}

export const UploadForm = () => {
  const editorRef = useRef<{ getHTML: () => string } | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");

  const { contract: voteContract } = useContract(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const { mutateAsync: propose } = useContractWrite(voteContract, "propose");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Get the description from the editor
    const description = editorRef.current?.getHTML() || "";

    const metadata = { name, description, image };
    const url = await uploadMetadata(metadata);

    if (url && propose) {
      try {
        await propose({
          args: [url],
          overrides: {},
        });
        setMetadataUrl(url);
        console.log("Metadata uploaded and proposal created with URL:", url);
      } catch (err) {
        console.error("Failed to create proposal:", err);
      }
    } else {
      console.error("Failed to upload metadata or propose is not available");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />

        <TipTap ref={editorRef} />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Upload
        </button>
      </form>
      <div className="metadata-url-display">
        {metadataUrl && (
          <p>
            Metadata uploaded at:{" "}
            <a
              href={`https://gateway.irys.xyz/${metadataUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              https://gateway.irys.xyz/{metadataUrl}
            </a>
          </p>
        )}
      </div>
    </>
  );
};

export default UploadForm;
