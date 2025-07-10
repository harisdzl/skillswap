"use client";

import { useUsersWithSkills } from "@/app/hooks/useUsersWithSkills";
import { UserCard } from "@/components/userCard";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Page() {
  const { users, loading } = useUsersWithSkills();

  const skeletonCards = Array.from({ length: 6 }).map((_, index) => (
    <div key={index} className="p-4 bg-white rounded-lg shadow space-y-3">
      <Skeleton className="h-8 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen flex p-6 gap-6 bg-muted">
      <section className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Explore Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {loading
            ? skeletonCards
            : users.map((user) => (
                <UserCard
                  key={user.id}
                  name={user.name}
                  bio={user.bio}
                  canTeach={user.canTeachSkills.map((s) => s.skill)}
                  interestedIn={user.interestedSkills.map((s) => s.skill)}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
