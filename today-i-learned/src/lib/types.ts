export interface TilEntry {
  title: string;
  date: string;
  slug: string;
  category: "tech" | "life";
  content?: string;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
