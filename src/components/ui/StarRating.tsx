"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  name?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  name,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const iconSize = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-0.5">
      {name && <input type="hidden" name={name} value={value} />}
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly
          ? star <= value
          : star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform`}
          >
            <Star
              className={`${iconSize} ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-gray-300 dark:text-white/20"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
