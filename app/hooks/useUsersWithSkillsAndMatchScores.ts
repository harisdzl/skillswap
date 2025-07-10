"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MatchResult, Skill, SkillType, UserSkill } from "@/types";
import { UserWithSkillsAndMatchScore } from "@/types";

export function useUsersWithSkillsAndMatchScores() {
  const [users, setUsers] = useState<UserWithSkillsAndMatchScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (!sessionData?.session || sessionError) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const currentUserId = sessionData.session.user.id;

      const { data, error: matchError } = await supabase
        .from("user_matches")
        .select(
          `
        matchScore,
        userB:users (
            id,
            name,
            bio,
            userSkills:user_skills (
            type,
            skill:skills(id, skill)
            )
        )
        `
        )
        .eq("userAId", currentUserId)
        .order("matchScore", { ascending: false });

      if (matchError || !data) {
        setError("Error fetching matches");
        setLoading(false);
        return;
      }

      const matchData = data as unknown as MatchResult[];

      const formatted = matchData.map((match) => {
        const user = match.userB;

        const canTeachSkills: Skill[] = user.userSkills
          .filter((s: UserSkill) => s.type === SkillType.TEACH)
          .map((s: UserSkill) => s.skill);

        const interestedSkills: Skill[] = user.userSkills
          .filter((s: UserSkill) => s.type === SkillType.LEARN)
          .map((s: UserSkill) => s.skill);

        return {
          id: user.id,
          name: user.name,
          bio: user.bio,
          canTeachSkills,
          interestedSkills,
          matchScore: match.matchScore,
        };
      });

      setUsers(formatted);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return { users, loading, error };
}
