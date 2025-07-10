import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">SkillSwap</div>
        <nav className="space-x-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="cursor-pointer hover:bg-gray-300"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="cursor-pointer hover:bg-gray-500">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Learn New Skills, Share Your Expertise
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Join our community to exchange skills with others. Teach what you
          know, learn what you want—no money required, just time and passion.
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-700 cursor-pointer"
          >
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}
