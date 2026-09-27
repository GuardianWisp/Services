import { homePage, htmlResponse } from "./_home/render";

// The homepage is a single hand-built HTML page, see ./_home/render.ts.
// The previous React homepage lives at /old.
export const dynamic = "force-static";

export function GET() {
  return htmlResponse(homePage());
}
