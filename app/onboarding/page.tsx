"use client";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchMultiSelectInput } from "@/components/searchMultipleSelectInput";
import { useSkills } from "../hooks/useSkills";
import { Skeleton } from "@/components/ui/skeleton";
import { Skill, SkillType } from "@/types";
import { calculateAndStoreMatchScoresForNewUser } from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [currUserId, setCurrUserId] = useState<string>("");
  const [formData, setFormData] = useState<{
    name: string;
    bio: string;
    canTeach: Skill[];
    interestedIn: Skill[];
  }>({
    name: "",
    bio: "",
    canTeach: [],
    interestedIn: [],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const { skills, skillsLoading } = useSkills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.bio.trim()) {
      alert("Please fill in your name and bio.");
      return;
    }

    try {
      setSubmitLoading(true);
      const { error: profileError } = await supabase.from("users").upsert({
        id: currUserId,
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      });

      if (profileError) throw profileError;

      const teachingSkillsInserts = formData.canTeach.map((skill) => ({
        userId: currUserId,
        skillId: skill.id,
        type: SkillType.TEACH,
      }));

      const learningSkillsInserts = formData.interestedIn.map((skill) => ({
        userId: currUserId,
        skillId: skill.id,
        type: SkillType.LEARN,
      }));

      const { error: insertError } = await supabase
        .from("user_skills")
        .insert([...teachingSkillsInserts, ...learningSkillsInserts]);

      if (insertError) throw insertError;

      // Calculate match scores for this user, and all other users
      await calculateAndStoreMatchScoresForNewUser(currUserId);
      setSubmitLoading(false);

      router.push("/match");
    } catch (error: any) {
      console.error("Error submitting profile:", error);
      alert(`Error submitting profile: ${error.message || error}`);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setCurrUserId(data.session.user.id);

        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Welcome! Let&apos;s get you set up
          </CardTitle>
          <CardDescription className="text-lg">
            Tell us about yourself so we can match you with the right people!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                What&apos;s your name?
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-medium">
                Tell us about yourself
              </Label>
              <p className="text-sm text-muted-foreground">
                This helps others understand your background and goals
              </p>
              <Textarea
                id="bio"
                placeholder="Share a bit about your background, interests, or what you're hoping to achieve..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="min-h-[100px] text-base resize-none"
              />
            </div>
            {skillsLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            ) : (
              <>
                <SearchMultiSelectInput
                  label="What skills can you teach?"
                  options={skills}
                  selected={formData.canTeach}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, canTeach: selected }))
                  }
                />

                <SearchMultiSelectInput
                  label="What skills are you interested in learning?"
                  options={skills}
                  selected={formData.interestedIn}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, interestedIn: selected }))
                  }
                />
              </>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full text-base py-6 cursor-pointer"
                disabled={
                  !formData.name.trim() ||
                  !formData.bio.trim() ||
                  formData.canTeach.length === 0 ||
                  formData.interestedIn.length === 0
                }
              >
                {submitLoading ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  "Complete Onboarding"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
