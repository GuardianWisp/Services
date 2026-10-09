import { htmlResponse, staticPage } from "../_home/render";

// All works: the homepage with the works sheet already open.
export const dynamic = "force-static";

export function GET() {
  return htmlResponse(staticPage("cases"));
}
