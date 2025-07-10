"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SearchMultiSelectInputProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function SearchMultiSelectInput({
  label,
  options,
  selected,
  onChange,
  placeholder = "Type a skill...",
}: SearchMultiSelectInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredOptions = options.filter(
    (skill) =>
      skill.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(skill)
  );

  const handleSelect = (skill: string) => {
    onChange([...selected, skill]);
    setQuery("");
  };

  const handleRemove = (skill: string) => {
    onChange(selected.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0]);
      } else if (query.trim() && !selected.includes(query.trim())) {
        handleSelect(query.trim());
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {selected.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemove(skill)}
                  className="ml-2 hover:text-destructive cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              No skills selected yet...
            </p>
          </div>
        )}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="mt-2"
        />

        {(isFocused || query.length > 0) && filteredOptions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((skill) => (
              <div
                key={skill}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(skill);
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
