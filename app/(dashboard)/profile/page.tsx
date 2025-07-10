"use client";

import React from "react";
import { useCurrentUserWithSkills } from "@/app/hooks/useCurrentUserWithSkills";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { user, loading, error } = useCurrentUserWithSkills();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
        <p className="ml-2 text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Failed to load profile."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 flex items-center gap-2">
            👤 {user.name}
          </h1>
          <p className="text-gray-600">{user.bio || "No bio available."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              🧑‍🏫 Can Teach
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {user.canTeachSkills.length > 0 ? (
                user.canTeachSkills.map((skill) => (
                  <li key={skill.id}>{skill.skill}</li>
                ))
              ) : (
                <li className="text-gray-500">No teaching skills listed.</li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              📚 Wants to Learn
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {user.interestedSkills.length > 0 ? (
                user.interestedSkills.map((skill) => (
                  <li key={skill.id}>{skill.skill}</li>
                ))
              ) : (
                <li className="text-gray-500">No learning interests listed.</li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700">⏱️ Time Credits</h2>
          <p className="text-2xl font-semibold text-gray-900">
            {user.timeCredits ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
