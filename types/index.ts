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

export interface UserWithDetailsAndSkills {
  id: string;
  name: string;
  bio: string;
  userSkills: UserSkill[];
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

export interface PersonalisedContent {
  aiWhyMatch: string;
  aiRoadmap: string;
  aiConnectSuggestions: string;
}

export interface MatchResult {
  matchScore: number;
  personalisedContent?: PersonalisedContent;
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
  personalisedContent: PersonalisedContent;
}
