import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description?: string;
  image?: string;
  is_vegetarian?: boolean;
};
