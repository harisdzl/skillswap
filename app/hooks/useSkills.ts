import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skill } from "@/types";

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setSkillsLoading(true);
      const { data, error } = await supabase.from("skills").select("*");
      if (error) {
        setError(error.message);
        setSkills([]);
      } else {
        setSkills(data as Skill[]);
        setError(null);
      }
      setSkillsLoading(false);
    };

    fetchSkills();
  }, []);

  return { skills, skillsLoading, error };
}
