import { APIEvent } from "@solidjs/start/server";
import { getTilBySlug } from "~/lib/content.server";

export async function GET({ params }: APIEvent) {
  const { slug } = params;

  const til = await getTilBySlug(slug);

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
