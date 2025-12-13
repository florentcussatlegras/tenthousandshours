"use client";

type Topic = {
  totalSeconds: number;
};

const HOUR = 3600;
const CONSISTENT_HOURS = 100 * HOUR;
const PERSEVERANT_HOURS = 1000 * HOUR;
const TEN_K_HOURS = 10000 * HOUR;

export function BadgesHeader({
  mastered = [],
  inProgress = [],
}: {
  mastered: Topic[];
  inProgress: Topic[];
}) {
  const allTopics = [...mastered, ...inProgress];

  let tenKCount = 0;
  let perseverantCount = 0;
  let consistentCount = 0;

  for (const t of allTopics) {
    if (t.totalSeconds >= TEN_K_HOURS) {
      tenKCount++;
    } else if (t.totalSeconds >= PERSEVERANT_HOURS) {
      perseverantCount++;
    } else if (t.totalSeconds >= CONSISTENT_HOURS) {
      consistentCount++;
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 10k Master */}
      <span
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          bg-yellow-100 text-yellow-800 ${tenKCount === 0 ? "opacity-40" : ""}`}
      >
        🏆 10k Master
        <span className="font-semibold">({tenKCount})</span>
      </span>

      {/* Consistent */}
      <span
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          bg-sky-100 text-sky-800 ${consistentCount === 0 ? "opacity-40" : ""}`}
      >
        🔁 Consistent
        <span className="font-semibold">({consistentCount})</span>
      </span>

      {/* Perseverant */}
      <span
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          bg-emerald-100 text-emerald-800 ${perseverantCount === 0 ? "opacity-40" : ""}`}
      >
        💪 Perseverant
        <span className="font-semibold">({perseverantCount})</span>
      </span>
    </div>
  );
}
