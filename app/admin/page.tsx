"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Uploading...");

    const formData = new FormData();
    if (file) {
      formData.append("pdf", file);
    } else {
      setStatus("No file selected.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("PDF uploaded successfully!");
        setFile(null);
      } else {
        const data = await res.json();
        setStatus("Error: " + data.error);
      }
    } catch (err) {
      setStatus("Error uploading PDF");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin PDF Upload</h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const files = e.target.files;
              setFile(files && files[0] ? files[0] : null);
            }}
            required
            className="w-full px-4 py-2 border rounded text-black"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Upload PDF
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}