import { NextRequest } from "next/server";

// get day
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date } = body;
}
