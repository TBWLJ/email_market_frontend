"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfile() {
  const [senderEmail, setSenderEmail] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!senderEmail || !pdfFile) return alert("All fields are required");

    const formData = new FormData();
    formData.append("senderEmail", senderEmail);
    formData.append("pdf", pdfFile);

    setStatus("Creating profile...");
    try {
      const res = await fetch("https://email-market.onrender.com/api/profile/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/profile/${data.id}`);
      } else {
        setStatus(data.error || "Failed to create profile");
      }
    } catch (err) {
      setStatus("Error creating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-4 text-blue-700">Create Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Sender Email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded text-blue-700"
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            className="w-full px-4 py-2 border rounded text-black"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Profile
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
