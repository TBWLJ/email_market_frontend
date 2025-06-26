"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Profile = {
  _id: string;
  senderEmail: string;
  pdfUrl: string;
  sentHistory?: Array<{
    email: string;
    sentAt: string;
  }>;
};

export default function ProfileDetails() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://email-market.onrender.com/api/profile/getone/${id}`);
        const data = await res.json();
        if (res.ok && data.profile) {
          setProfile(data.profile);
        } else {
          setError(data.error || "Profile not found");
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!profile) return <div className="p-4">Profile not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/profileList" className="text-blue-600 hover:underline">
          &larr; Back to all profiles
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Sender Email:</p>
            <p className="font-medium">{profile.senderEmail}</p>
          </div>
          <div>
            <p className="text-gray-600">PDF Link:</p>
            <a 
              href={profile.pdfUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              View PDF
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sent Emails</h2>
        
        {profile.sentHistory?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Recipient Email</th>
                  <th className="py-2 px-4 text-left">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profile.sentHistory.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{entry.email}</td>
                    <td className="py-2 px-4">
                      {new Date(entry.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No emails sent yet</p>
        )}
      </div>
    </div>
  );
}
