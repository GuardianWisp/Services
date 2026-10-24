import { promises as fs } from "fs";
import path from "path";

// Remembers which forwarded message in the owner's chat belongs to which
// visitor, so a reply to it can be routed back. One PM2 process serves the
// site, so a JSON file next to the app is enough.
const STORE_PATH =
  process.env.TELEGRAM_RELAY_STORE ??
  path.join(process.cwd(), ".data", "telegram-relay.json");
const MAX_LINKS = 5000;

type Store = {
  // owner-chat message id -> visitor chat id
  links: Record<string, number>;
  // visitor chat ids we've already introduced to the owner
  known: number[];
};

let cache: Store | null = null;
let writing: Promise<void> = Promise.resolve();

async function load(): Promise<Store> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    cache = { links: parsed.links ?? {}, known: parsed.known ?? [] };
  } catch {
    cache = { links: {}, known: [] };
  }
  return cache;
}

function save(store: Store): Promise<void> {
  writing = writing
    .then(async () => {
      await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
      const tmp = `${STORE_PATH}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(store));
      await fs.rename(tmp, STORE_PATH);
    })
    .catch((error) => console.error("telegram relay store write failed", error));
  return writing;
}

export async function linkMessage(ownerMessageId: number, visitorChatId: number) {
  const store = await load();
  store.links[String(ownerMessageId)] = visitorChatId;
  const keys = Object.keys(store.links);
  if (keys.length > MAX_LINKS) {
    // Message ids grow over time, so the smallest ones are the oldest.
    keys
      .map(Number)
      .sort((a, b) => a - b)
      .slice(0, keys.length - MAX_LINKS)
      .forEach((id) => delete store.links[String(id)]);
  }
  await save(store);
}

export async function visitorFor(ownerMessageId: number): Promise<number | undefined> {
  const store = await load();
  return store.links[String(ownerMessageId)];
}

// Returns true the first time a visitor is seen.
export async function markKnown(visitorChatId: number): Promise<boolean> {
  const store = await load();
  if (store.known.includes(visitorChatId)) return false;
  store.known.push(visitorChatId);
  await save(store);
  return true;
}
