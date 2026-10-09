import { htmlResponse, staticPage } from "../_home/render";

// Contacts: the homepage with the contacts sheet already open.
export const dynamic = "force-static";

export function GET() {
  return htmlResponse(staticPage("contacts"));
}
