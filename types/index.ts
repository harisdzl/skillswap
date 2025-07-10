// DATABASE SCHEMA TYPES

// USER TYPE
export interface User {
  id: string;
  createdAt: string;
  name: string;
  bio: string | null;
  timeCredits: number;
}

// SKILLS inters
export interface Skill {
  id: string;
  skill: string;
}

export enum SkillType {
  TEACH = "teach",
  LEARN = "learn",
}

export interface UserSkill {
  skill: Skill;
  type: SkillType;
}
export interface UserWithSkills {
  id: string;
  name: string;
  bio: string;
  canTeachSkills: Skill[];
  interestedSkills: Skill[];
}

export interface MatchResult {
  matchScore: number;
  userB: {
    id: string;
    name: string;
    bio: string;
    userSkills: UserSkill[];
  };
}

export interface UserWithSkillsAndMatchScore {
  id: string;
  name: string;
  bio: string;
  canTeachSkills: Skill[];
  interestedSkills: Skill[];
  matchScore: number;
}
