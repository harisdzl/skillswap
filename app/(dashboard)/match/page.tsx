"use client";

import React, { useEffect, useState } from "react";
import { UserCard } from "@/components/userCard";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useUsersWithSkillsAndMatchScores } from "@/app/hooks/useUsersWithSkillsAndMatchScores";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useCurrentUserWithSkills } from "@/app/hooks/useCurrentUserWithSkills";

export default function Page() {
  const { users, loading } = useUsersWithSkillsAndMatchScores();
  const { user: currUser, loading: currUserLoading } =
    useCurrentUserWithSkills();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiWhyMatch, setAiWhyMatch] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState("");
  const [aiConnectSuggestions, setAiConnectSuggestions] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);

  const currentUser = users[currentIndex];

  useEffect(() => {
    async function generateContent() {
      if (!currUser || !currentUser) {
        setAiWhyMatch("");
        setAiRoadmap("");
        setAiConnectSuggestions("");
        return;
      }

      setLoadingContent(true);

      try {
        const res = await fetch("/api/generatePersonalisedContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUser: currUser,
            matchUser: currentUser,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch personalised content");
        }

        const content = await res.json();

        setAiWhyMatch(content.aiWhyMatch);
        setAiRoadmap(content.aiRoadmap);
        setAiConnectSuggestions(content.aiConnectSuggestions);
      } catch (error) {
        console.error("Failed to generate personalized content:", error);
        setAiWhyMatch("Failed to generate match explanation.");
        setAiRoadmap("Failed to generate roadmap.");
        setAiConnectSuggestions("Failed to generate connection suggestions.");
      }

      setLoadingContent(false);
    }

    generateContent();
  }, [currUser, currentUser]);

  if (loading || currUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-muted-foreground text-sm">
            Loading your best matches...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground text-lg">
          No matches found. Please try again later or explore{" "}
          <Link href="/explore" className="text-blue-500 hover:underline mt-4">
            here!
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="h-lvh min-w-screen bg-muted p-8 flex max-w-6xl ">
      <div className="w-1/2 flex flex-col justify-center items-center mb-48">
        <h1 className="text-3xl font-bold mb-6 text-center">🎯 Best Matches</h1>

        <div className="w-1/2 flex flex-row gap-10 items-center justify-center">
          <Button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 rounded cursor-pointer bg-blue-500 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <motion.div
            key={currentUser.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="min-w-sm"
          >
            <UserCard
              name={currentUser.name}
              bio={currentUser.bio}
              canTeach={currentUser.canTeachSkills.map((s) => s.skill)}
              interestedIn={currentUser.interestedSkills.map((s) => s.skill)}
              matchScore={currentUser.matchScore}
            />
          </motion.div>
          <Button
            disabled={currentIndex === users.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-4 py-2 rounded cursor-pointer bg-blue-500 hover:bg-blue-700"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col gap-6 h-full overflow-auto">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Why this is a good match
          </h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {loadingContent ? "Generating match explanation..." : aiWhyMatch}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Suggested Roadmap</h2>
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap text-gray-700">
            {loadingContent ? "Generating roadmap..." : aiRoadmap}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How to connect</h2>
          <p className="text-gray-700">
            {loadingContent
              ? "Generating connection suggestions..."
              : aiConnectSuggestions}
          </p>
        </section>
      </div>
    </div>
  );
}
