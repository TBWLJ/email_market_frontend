"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function CreateProfile() {
  const [senderEmail, setSenderEmail] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf || !senderEmail) {
      setStatus("Please provide all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("senderEmail", senderEmail);

    try {
      const res = await fetch("https://email-market.onrender.com/api/profile/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const shareLink = `https://email-market-frontend.vercel.app/profile/${data.profile._id}`;
        setLink(shareLink);
        setStatus("✅ Profile created successfully!");
        setSenderEmail("");
        setPdf(null);
      } else {
        setStatus(data.error || "❌ Failed to create profile.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus("❌ Server error: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Sender Email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files?.[0] || null)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Profile
        </button>
      </form>

      {status && <p className="mt-4 text-sm">{status}</p>}
      {link && (
        <div className="mt-4">
          <p className="text-green-600">Share this link:</p>
          <a href={link} className="text-blue-500 underline break-words" target="_blank" rel="noreferrer">
            {link}
          </a>
        </div>
      )}
    </div>
    </>
  );
}
