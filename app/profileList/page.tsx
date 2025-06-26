"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Profile = {
  _id: string;
  senderEmail: string;
  createdAt: string;
  sentHistory?: Array<{
    email: string;
    sentAt: string;
  }>;
};

export default function ProfileList() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("https://email-market.onrender.com/api/profile");
        const data = await res.json();
        if (res.ok) {
          setProfiles(data.profiles || []);
        } else {
          setError(data.error || "Failed to load profiles");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <div className="p-4">Loading profiles...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
    <Navbar />
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Profiles</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Sender Email</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Recipients</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{profile.senderEmail}</td>
                <td className="py-3 px-4">
                  {new Date(profile.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  {profile.sentHistory?.length || 0}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/profileDetail/${profile._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}