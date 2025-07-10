# Peer Learning Match Platform

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/harisdzl/skillswap.git
cd peer-learning-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a Supabase project**

- Follow the instructions in the [Supabase documentation](https://supabase.com/docs) to create a new Supabase project and obtain the necessary keys.

4. **Configure the environment variables**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

If you do not have an openai api key, there just wont be any personalised content generated for the matches.

5. **Ensure your Supabase schema includes**

- The supabase schema is defined in the `schemas.sql` file.

## Overview

In this POC, I created a peer-to-peer learning platform that connects users based on the skills they want to learn and the skills they can teach.

My main objective of this POC is to explore a new way of matching users based on their skills and interests, while also utilizing generative AI to provide personalised content for each match. Although I did not tackle the process of skill learning itself and the time banking aspect, this POC serves as a proof of concept for the concept of a medium for peer-to-peer learning, and how the experience can be enhanced by utilizing AI.

## User Flow

The user flow is as follows:

1. User signs up with their email and password.
2. They then complete their onboarding process, which includes filling up their name, their bio and the skills they can teach and want to learn.
3. Once the onboarding process is complete, the user is redirected to the match page, where they can browse through their top matches in a sliding-like fashion.
4. If they are interested to explore more they can explore in the explore page.
5. They can see their own details under the profile page.

---

## Features

- **Authentication**: Secure login and sign up with Supabase
- **User Profiles**: Users create a profile with their name, bio, and skills they can teach or want to learn.
- **Skill-Based Matching**: Matches are ranked based on overlapping and complementary skills.
  - The main logic behind the match scoring is simple, where the function calculates a compatibility score between a new user and all existing users by comparing their teach and learn skills, then stores the results in the user_matches table. The score is based on how many overlapping skills they can teach and learn from each other, scaled to a maximum of 100.
- **AI-Generated Match Content**:
  - A personalised explanation of why the match is a good fit
  - A suggested 3-week learning roadmap
  - A suggested message for reaching out
- **Interactive Match Navigation**: Users can browse through their top matches with an interface that updates in real-time.

---

## Tech Stack

- **Frontend**: NextJS, TailwindCSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth), OpenAI API
- **Data Management**: React Hooks, Supabase client
- **Deployment**: Vercel
- **My development stack**: I used VSCode with Supermaven (free) extension, and mainly ChatGPT to help accelerate the code process and brainstorm new ideas.
- I decided to use Supabase instead of building a backend from scratch, as it provides a lot of functionalities and is easy to integrate with other technologies, which would allow me to focus on the functionality of the POC. NextJS is something I'm just familiar with.

---

## Entity Relationship Diagram

## Project Plan

1. Initial Plan

- The initial plan was to create a marketplace for peer-to-peer learning, where users can create profiles, explore matches, and connect with others based on their skills and interests.
- Then I realised that I could be more creative and explore a tinder-like swiping experience, which I eventually did in a simpler way buy using the skill matching score to be able to help the user focus on the most relevant matches.

2. During the implementation

- While implementing the match page, I was wondering where AI could be used to help the user understand the matches.
- I decided to use OpenAI's GPT-4 API to generate personalised content for each match, which would be stored in the user_matches table.

3. Future extensions

- Of course, there are many features and improvements that could be added to this POC but the main focus would be to:
  - Explore how users can interact with each other to learn, and where time credits would be rewarded.
  - Explore how communities can be created from the platform, to drive engagement and foster a sense of community.
  - Explore how the platform could be used to support skill acquisition and learning, by providing resources and tools for users to improve their skills, where AI can be a valuable resource.

---

## Conclusion

This POC was a fun and challenging project that allowed me to explore new technologies and learn about peer-to-peer learning.
