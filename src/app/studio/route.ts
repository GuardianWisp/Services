import { htmlResponse, staticPage } from "../_home/render";

// Studio: the homepage with the studio sheet already open. Not in the menu or the sitemap yet.
export const dynamic = "force-static";

export function GET() {
  return htmlResponse(staticPage("studio"));
}
