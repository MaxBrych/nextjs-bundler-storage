"use client";
import React, { ChangeEvent, useState, useRef } from "react";
import { uploadMetadata } from "../utils/uploadMetadata";
import TipTap from "./Editor/TipTap";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

export const UploadForm = () => {
  const editorRef = useRef<{ getHTML: () => string } | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const { contract: voteContract } = useContract(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );
  const vote = voteContract as any;

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

    if (url) {
      try {
        await vote.propose(url); // use the vote instance you already have
        setMetadataUrl(url);
        console.log("Metadata uploaded and proposal created with URL:", url);
        window.location.reload();
      } catch (err) {
        console.error("Failed to create proposal:", err);
      }
    } else {
      console.error("Failed to upload metadata or propose is not available");
    }

    if (!vote) {
      console.error("Contract not defined.");
      return;
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
