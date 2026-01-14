import { APIEvent } from "@solidjs/start/server";
import { getTil } from "~/lib/content.server";

export async function GET({ params }: APIEvent) {
  const { category, slug } = params;

  if (category !== "tech" && category !== "life") {
    return new Response(JSON.stringify({ error: "Invalid category" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const til = await getTil(category, slug);

  if (!til) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      title: til.title,
      date: til.date,
      category: til.category,
      slug: til.slug,
      content: til.content,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
