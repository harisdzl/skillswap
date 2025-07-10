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
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">👤 {user.name}</h1>
      <p className="text-gray-700 mb-2">
        <strong>Bio:</strong> {user.bio || "No bio available."}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Time Credits:</strong> {user.timeCredits ?? 0}
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🧑‍🏫 Can Teach</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {user.canTeachSkills.length > 0 ? (
            user.canTeachSkills.map((skill) => (
              <li key={skill.id}>{skill.skill}</li>
            ))
          ) : (
            <li>No teaching skills listed.</li>
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📚 Wants to Learn</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {user.interestedSkills.length > 0 ? (
            user.interestedSkills.map((skill) => (
              <li key={skill.id}>{skill.skill}</li>
            ))
          ) : (
            <li>No learning interests listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
