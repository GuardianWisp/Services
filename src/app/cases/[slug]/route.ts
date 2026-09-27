import { casePage, caseSlugs, htmlResponse } from "../../_home/render";

// A case opened as its own page: the homepage with that case's sheet open.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseSlugs().map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: RouteContext<"/cases/[slug]">) {
  const { slug } = await params;
  const html = casePage(slug);
  if (!html) return new Response("Not found", { status: 404 });
  return htmlResponse(html);
}
