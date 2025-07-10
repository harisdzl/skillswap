import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Skill,
  SkillType,
  UserSkill,
  UserWithDetailsAndSkills,
  UserWithSkills,
} from "@/types";

export function useCurrentUserWithSkills() {
  const [user, setUser] = useState<UserWithSkills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.user) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error: userError } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          bio,
          timeCredits,
          userSkills:user_skills (
            type,
            skill:skills (id, skill)
          )
        `
        )
        .eq("id", userId)
        .single();

      if (userError || !data) {
        setError("Failed to fetch user profile.");
        setLoading(false);
        return;
      }

      const currUserData = data as unknown as UserWithDetailsAndSkills;
      const canTeachSkills: Skill[] = currUserData.userSkills
        .filter((us: UserSkill) => us.type === SkillType.TEACH)
        .map((us: UserSkill) => us.skill);
      const interestedSkills: Skill[] = currUserData.userSkills
        .filter((us: UserSkill) => us.type === SkillType.LEARN)
        .map((us: UserSkill) => us.skill);

      const formattedUser: UserWithSkills = {
        id: currUserData.id,
        name: currUserData.name,
        bio: currUserData.bio,
        canTeachSkills,
        interestedSkills,
        timeCredits: currUserData.timeCredits,
      };

      setUser(formattedUser);
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  return { user, loading, error };
}
