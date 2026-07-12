import { supabase } from "@/lib/supabase/client";
import type { SocialLink } from "@/types/database";

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}
