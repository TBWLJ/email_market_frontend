"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Profile = {
  senderEmail: string;
  pdfUrl: string;
};

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://email-market.onrender.com/api/profile/${id}`);
        const data = await res.json();
        if (res.ok && data.profile) {
          setProfile(data.profile);
        } else {
          setStatus("Profile not found.");
        }
      } catch (err) {
        setStatus("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("Sending PDF...");
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
        setStatus(data.error || "❌ Failed to send PDF.");
      }
    } catch (err) {
      setStatus("❌ Something went wrong.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto flex justify-center">
      <h1 className="text-xl font-semibold mb-4">Access Your Free Gift</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : profile ? (
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
              Claim now
            </button>
          </form>
        </>
      ) : (
        <p className="text-red-500">{status}</p>
      )}

      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
}
