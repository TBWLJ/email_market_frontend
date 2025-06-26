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
      } catch {
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
    } catch {
      setStatus("❌ Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-100 to-green-50 px-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-800">Claim Your Free Gift</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : profile ? (
          <>
            <p className="mb-4 text-sm text-gray-500">Sent by <span className="font-semibold">{profile.senderEmail}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-green-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition"
              >
                Claim Your Gift
              </button>
            </form>
          </>
        ) : (
          <p className="text-red-500">{status || "Profile not found."}</p>
        )}

        {status && !loading && (
          <p className="mt-5 text-sm text-gray-700">{status}</p>
        )}
      </div>
    </main>
  );
}
