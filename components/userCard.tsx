"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserCardProps {
  name: string;
  bio: string;
  canTeach: string[];
  interestedIn: string[];
}

export function UserCard({ name, bio, canTeach, interestedIn }: UserCardProps) {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-2">
          <AvatarFallback className="text-2xl">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {bio}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-blue-700">
            <GraduationCap className="w-4 h-4" />
            Can Teach
          </div>
          <div className="flex flex-wrap gap-2">
            {canTeach.length > 0 ? (
              canTeach.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No teaching skills listed.
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-green-700">
            <BookOpen className="w-4 h-4" />
            Wants to Learn
          </div>
          <div className="flex flex-wrap gap-2">
            {interestedIn.length > 0 ? (
              interestedIn.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No learning interests listed.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
