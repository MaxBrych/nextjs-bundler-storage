"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  async function upload() {
    if (!data) return;
    try {
      setData("");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  async function uploadFile() {
    if (!file) return;
    setData("");
    const buffer = await file.arrayBuffer();
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: buffer,
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  function handleFileChange(e: any) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <main className="flex flex-col items-center justify-between max-w-xl p-4">
      <input
        placeholder="Create a post"
        onChange={(e) => setData(e.target.value)}
        className="w-full h-12 max-w-full px-2 py-1 mt-6 mb-1 text-black bg-gray-700 rounded-xl"
      />
      <button
        onClick={upload}
        className="h-12 px-12 mt-2 font-semibold text-black bg-white rounded-full"
      >
        Upload text
      </button>
      <input
        type="file"
        placeholder="Upload a file"
        onChange={handleFileChange}
        className="flex flex-col items-center justify-center w-full h-40 max-w-full px-2 py-1 mt-6 mb-1 text-black text-white align-middle border-2 border-gray-700 border-dashed cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-800 rounded-xl"
      />
      <button
        onClick={uploadFile}
        className="h-12 px-12 mt-2 font-semibold text-black bg-white rounded-full"
      >
        Upload file
      </button>
      {transaction && (
        <a
          target="_blank"
          rel="no-opener"
          href={transaction}
          className="h-12 px-12 mt-2 font-semibold text-white bg-black border border-white rounded-full"
        >
          View Arweave Data
        </a>
      )}
    </main>
  );
}
