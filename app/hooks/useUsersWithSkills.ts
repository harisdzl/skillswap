import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SkillType, UserWithSkills } from "@/types";

export function useUsersWithSkills() {
  const [users, setUsers] = useState<UserWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersWithSkills = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          bio,
          timeCredits,
          user_skills (
            type,
            skills:skills (
              id,
              skill
            )
          )
        `
        )
        .neq("name", "") // Temporary filter to exclude users without names
        .neq("id", user?.user?.id);

      if (error) {
        setError(error.message);
        setUsers([]);
      } else if (data) {
        const formattedUsers: UserWithSkills[] = data.map((user) => {
          const canTeachSkills = user.user_skills
            .filter((us) => us.type === SkillType.TEACH)
            .flatMap((us) => us.skills);
          const interestedSkills = user.user_skills
            .filter((us) => us.type === SkillType.LEARN)
            .flatMap((us) => us.skills);
          return {
            id: user.id,
            name: user.name,
            bio: user.bio,
            timeCredits: user.timeCredits,
            canTeachSkills,
            interestedSkills,
          };
        });

        setUsers(formattedUsers);
        setError(null);
      }

      setLoading(false);
    };

    fetchUsersWithSkills();
  }, []);

  return { users, loading, error };
}
