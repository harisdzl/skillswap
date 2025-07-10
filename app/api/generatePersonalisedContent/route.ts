import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient";
import {
  PersonalisedContent,
  UserWithSkills,
  UserWithSkillsAndMatchScore,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      currentUser: UserWithSkills;
      matchUser: UserWithSkillsAndMatchScore;
    };

    const { currentUser, matchUser } = body;

    const prompt = `
        You are an intelligent learning companion helping users in a peer-learning platform. Based on two users' profiles, generate a personalised summary explaining why they are a great learning match, a 3-week learning roadmap, and a recommended way for the current user to connect with the other user.

        Use the following structure for your response:

        ---

        **Why this is a good match:**
        [Write a paragraph explaining the synergy between their skills and learning goals.] If match score is relatively low (e.g., below 50), focus on how they can complement each other rather than just matching skills.

        **Suggested Roadmap:**
        Week 1: [Overview of what the pair should focus on]\n
        Week 2: [Hands-on activities or discussions]\n
        Week 3: [Wrap-up, next steps, or advanced topics]\n

        **How to connect:**
        [Suggest a message or approach for reaching out to the match]

        ---

        Here is the information:

        **Current User**
        - Refer to this user as You (second person pronoun)
        - Bio: ${currentUser.bio}
        - Can Teach: ${currentUser.canTeachSkills
          .map((s) => s.skill)
          .join(", ")}
        - Wants to Learn: ${currentUser.interestedSkills
          .map((s) => s.skill)
          .join(", ")}

        **Matched User (User B)**
        - Name: ${matchUser.name}
        - Bio: ${matchUser.bio}
        - Can Teach: ${matchUser.canTeachSkills.map((s) => s.skill).join(", ")}
        - Wants to Learn: ${matchUser.interestedSkills
          .map((s) => s.skill)
          .join(", ")}

        Respond in a friendly and concise tone. For the paragraphs, make it maximum 3 sentences Return a JSON object with 3 fields without the extra code block: 
        - aiWhyMatch (the paragraph),
        - aiRoadmap (the roadmap in plain text),
        - aiConnectSuggestions (the way to connect).
        `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const completionText = response.choices[0].message.content;

    let parsed: PersonalisedContent;

    try {
      parsed = JSON.parse(completionText || "{}");
    } catch {
      return NextResponse.json(
        { error: "AI response was not valid JSON", raw: completionText },
        { status: 400 }
      );
    }

    if (currentUser.id && matchUser.id) {
      await supabase
        .from("user_matches")
        .update({
          personalisedContent: {
            aiWhyMatch: parsed.aiWhyMatch || "",
            aiRoadmap: parsed.aiRoadmap || "",
            aiConnectSuggestions: parsed.aiConnectSuggestions || "",
          },
        })
        .eq("userAId", currentUser.id)
        .eq("userBId", matchUser.id);
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Error generating match content", e);
    return NextResponse.json(
      { error: "Something went wrong while generating content." },
      { status: 500 }
    );
  }
}
