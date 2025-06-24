"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Define the profile type
interface Profile {
  senderEmail: string;
  pdfUrl: string;
  createdAt: string;
  _id: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://email-market.onrender.com/api/profile/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then(setProfile)
        .catch(() => setStatus("Failed to load profile"));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending email...");

    try {
      const res = await fetch(`https://email-market.onrender.com/api/profile/send/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ PDF sent to your email!");
        setEmail("");
      } else {
        setStatus(data?.error || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
      setStatus("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-4">Receive PDF</h1>

        {profile ? (
          <>
            <p className="text-sm mb-4">From: <strong>{profile.senderEmail}</strong></p>

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

        {status && (
          <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
}
