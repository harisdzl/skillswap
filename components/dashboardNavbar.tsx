"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSignOut } from "@/app/hooks/useSignout";

const navItems = [
  { label: "Match", href: "/match" },
  { label: "Explore", href: "/explore" },
  { label: "Profile", href: "/profile" },
];

export function DashboardNavbar() {
  const pathname = usePathname();
  const { signOut } = useSignOut();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <nav className="w-full bg-blue-200 border-b shadow-sm">
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <div className="text-2xl font-bold text-blue-600">SkillSwap</div>
        <div className="flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium hover:text-indigo-600 transition",
                pathname === item.href ? "text-indigo-600" : "text-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button onClick={handleSignOut} className="text-sm cursor-pointer">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
