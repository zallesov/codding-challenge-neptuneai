import { Symbol, SYMBOLS } from "./Symbol.ts";
import { BatchRequest } from "./BatchRequest.ts";
import { Memory } from "./Memory.ts";

// Regexp to match the path. Good enough for such small app.
const STATS_PATH = /^\/stats\/([a-zA-Z]+)\/(\d+)$/;
const ADD_BATCH_PATH = /^\/add_batch\/([a-zA-Z]+)$/;

const DEFAULT_K = 8; // 10^k is the max stats request length

// In memory storage for the stats.
// Allocates storage for each supported symbol
const memory = new Map<Symbol, Memory>(
  SYMBOLS.map(symbol => [symbol, new Memory(DEFAULT_K)])
);

// handler for the stats request
function handleStats(req: Request) {
  const url = new URL(req.url);
  const match = url.pathname.match(STATS_PATH);

  if (!match) {
    return new Response("Invalid URL format", { status: 400 });
  }

  const parsedSymbol = Symbol.safeParse(match[1]);

  if (!parsedSymbol.success) {
    return new Response("Unknown symbol", { status: 400 });
  }

  const k = parseInt(match[2], 10);

  if (isNaN(k) || k <= 0 || k > 8) {
    return new Response("Invalid k parameter", { status: 400 });
  }

  console.log(`Symbol: ${parsedSymbol.data}, k: ${k}`);

  const stats = memory.get(parsedSymbol.data)?.getStats(k);

  // console.log("Stats", stats);

  return new Response(stats?.toJSON(), { status: 200, headers: { "Content-Type": "application/json" } });
}

// handler for the add batch request
async function handleAddBatch(req: Request) {
  const url = new URL(req.url);
  const match = url.pathname.match(ADD_BATCH_PATH);

  if (!match) {
    return new Response("Symbol not provided", { status: 400 });
  }
  const parsedSymbol = Symbol.safeParse(match[1]);

  if (!parsedSymbol.success) {
    return new Response("Unknown symbol", { status: 400 });
  }

  if (req.body === null) {
    return new Response("Empty body", { status: 400 });
  }
  const body = await req.json();
  const parsedBatchRequest = BatchRequest.safeParse(body)

  if (!parsedBatchRequest.success) {
    return new Response("Malformed request", { status: 400 });
  }

  memory.get(parsedSymbol.data)?.addValues(parsedBatchRequest.data.values);

  console.log(`Add batch ${parsedSymbol.data} ${parsedBatchRequest.data.values.length} values`);

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}

// Entry point 
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const urlPath = url.pathname;
  const method = req.method;

  console.log(`Request ${urlPath} ${method}`);

  switch (true) {
    case ADD_BATCH_PATH.test(urlPath) && method === "POST":
      return await handleAddBatch(req);
    case STATS_PATH.test(urlPath) && method === "GET": {
      return await handleStats(req);
    }
  }

  return new Response("Not found", { status: 404 });
});
