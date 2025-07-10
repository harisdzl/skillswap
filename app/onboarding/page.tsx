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
import { teachingSkills } from "@/constants";
import { SearchMultiSelectInput } from "@/components/searchMultipleSelectInput";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    canTeach: [] as string[],
    interestedIn: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
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
            <SearchMultiSelectInput
              label="What skills can you teach?"
              options={teachingSkills}
              selected={formData.canTeach}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, canTeach: selected }))
              }
            />

            <SearchMultiSelectInput
              label="What skills are you interested in learning?"
              options={teachingSkills}
              selected={formData.interestedIn}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, interestedIn: selected }))
              }
            />
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full text-base py-6"
                disabled={!formData.name.trim() || !formData.bio.trim()}
              >
                Complete Setup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
