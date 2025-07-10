import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabaseClient";
import { SkillType } from "@/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function calculateAndStoreMatchScoresForNewUser(userId: string) {
  const { data: allUserSkills, error: skillsError } = await supabase
    .from("user_skills")
    .select("userId, skillId, type");

  if (skillsError) throw skillsError;

  const newUserTeach = new Set(
    allUserSkills
      .filter((s) => s.userId === userId && s.type === SkillType.TEACH)
      .map((s) => s.skillId)
  );

  const newUserLearn = new Set(
    allUserSkills
      .filter((s) => s.userId === userId && s.type === SkillType.LEARN)
      .map((s) => s.skillId)
  );

  const otherUserIds = Array.from(
    new Set(allUserSkills.map((s) => s.userId).filter((id) => id !== userId))
  );

  const matchInserts = [];

  for (const otherId of otherUserIds) {
    const otherTeach = new Set(
      allUserSkills
        .filter((s) => s.userId === otherId && s.type === SkillType.TEACH)
        .map((s) => s.skillId)
    );

    const otherLearn = new Set(
      allUserSkills
        .filter((s) => s.userId === otherId && s.type === SkillType.LEARN)
        .map((s) => s.skillId)
    );

    const teachMatchCount = Array.from(otherLearn).filter((id) =>
      newUserTeach.has(id)
    ).length;

    const learnMatchCount = Array.from(otherTeach).filter((id) =>
      newUserLearn.has(id)
    ).length;

    const totalScore = teachMatchCount + learnMatchCount;
    // Use an arbitrary scale of max 8 matching skills to scale to 100
    // Thus, if users have 8 or more matching skills, they get a perfect score
    const matchScore = Math.min(totalScore * 12.5, 100);

    matchInserts.push({
      userAid: userId,
      userBid: otherId,
      matchScore: matchScore,
    });
  }

  if (matchInserts.length > 0) {
    const { error: matchError } = await supabase
      .from("user_matches")
      .upsert(matchInserts, { onConflict: "userAid, userBid" });

    if (matchError) throw matchError;
  }
}
