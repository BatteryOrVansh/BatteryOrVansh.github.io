import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

/**
 * Supabase pauses Free Plan projects after ~7 days with no database
 * activity. Vercel invokes this once a day (see vercel.json) with a
 * `CRON_SECRET` bearer token so the timer never gets close — a plain
 * read is enough to count as activity, no writes needed.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const { error } = await supabase.from("site_settings").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
}
