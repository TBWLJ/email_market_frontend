"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Profile = {
  senderEmail: string;
  pdfUrl: string;
};

export default function ProfilePage() {
  // const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`https://email-market.onrender.com/api/profile/${id}`)
        .then((res) => res.json())
        .then((data) => setProfile(data.profile))
        .catch(() => setStatus("Profile not found."));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending PDF...");
    try {
      const res = await fetch(`https://email-market.onrender.com/api/profile/send/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("PDF sent to your email!");
        setEmail("");
      } else {
        setStatus(data.error || "Failed to send PDF.");
      }
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Access Your PDF</h1>
      {profile ? (
        <>
          <p className="text-sm mb-4">From: {profile.senderEmail}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Send PDF
            </button>
          </form>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
}
