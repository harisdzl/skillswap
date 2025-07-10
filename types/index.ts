// DATABASE SCHEMA TYPES

// USER TYPE
export type User = {
  id: string;
  createdAt: string;
  name: string;
  bio: string | null;
  timeCredits: number;
};

// SKILLS types
export type Skill = {
  id: string;
  skill: string;
};

export enum SkillType {
  TEACH = "teach",
  LEARN = "learn",
}
