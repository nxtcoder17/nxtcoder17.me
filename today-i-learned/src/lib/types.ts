export interface TilEntry {
  title: string;
  date: string;
  slug: string;
  category: "tech" | "life";
  tags?: string[];
  content?: string;
}

export interface TilNavigation {
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}

export interface TilWithNavigation extends TilEntry {
  navigation: TilNavigation;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
