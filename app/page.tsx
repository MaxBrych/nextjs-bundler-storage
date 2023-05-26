"use client";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [data, setData] = useState("");
  const [category, setCategory] = useState("");
  const [headline, setHeadline] = useState("");
  const [teaser, setTeaser] = useState("");
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

  async function uploadBoth() {
    if (!file || !category || !headline || !teaser) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("headline", headline);
    formData.append("teaser", teaser);
    try {
      const response = await fetch("/api/uploadBoth", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <main className="flex flex-col items-center justify-between max-w-xl p-4">
      <input
        placeholder="Enter category"
        onChange={(e) => setCategory(e.target.value)}
        className="w-full h-12 max-w-full px-2 py-1 mt-6 mb-1 text-black bg-gray-700 rounded-xl"
      />
      <input
        placeholder="Enter headline"
        onChange={(e) => setHeadline(e.target.value)}
        className="w-full h-12 max-w-full px-2 py-1 mt-6 mb-1 text-black bg-gray-700 rounded-xl"
      />
      <input
        placeholder="Enter teaser"
        onChange={(e) => setTeaser(e.target.value)}
        className="w-full h-12 max-w-full px-2 py-1 mt-6 mb-1 text-black bg-gray-700 rounded-xl"
      />
      <input
        type="file"
        placeholder="Upload a file"
        onChange={handleFileChange}
        className="flex flex-col items-center justify-center w-full h-40 max-w-full px-2 py-1 mt-6 mb-1 text-black text-white align-middle border-2 border-gray-700 border-dashed cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-800 rounded-xl"
      />
      <button
        onClick={uploadBoth}
        className="h-12 px-12 mt-2 font-semibold text-black bg-white rounded-full"
      >
        Upload All
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
