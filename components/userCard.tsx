"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  name: string;
  bio: string;
  canTeach: string[];
  interestedIn: string[];
  matchScore?: number;
  onConnect?: () => void;
}

export function UserCard({
  name,
  bio,
  canTeach,
  interestedIn,
  onConnect,
  matchScore = undefined,
}: UserCardProps) {
  const getMatchColor = () => {
    if (matchScore === undefined) return "bg-gray-300 text-gray-800";
    if (matchScore >= 75) return "bg-green-100 text-green-800";
    if (matchScore >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  return (
    <Card className="w-full max-w-md shadow-md flex flex-col justify-between h-full relative">
      <div>
        {matchScore !== undefined && (
          <div className="absolute top-2 right-2">
            <Badge className={getMatchColor()}>
              Match Score: {matchScore}%
            </Badge>
          </div>
        )}
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarFallback className="text-2xl">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {bio}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
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
      </div>

      <CardFooter className="pt-4">
        <Button
          className="w-full bg-blue-700 hover:bg-blue-800 cursor-pointer"
          variant="default"
          onClick={onConnect}
        >
          Connect with 10 time credits
        </Button>
      </CardFooter>
    </Card>
  );
}
