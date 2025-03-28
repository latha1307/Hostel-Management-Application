import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://sfbfnjktqfzijmwnotza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYmZuamt0cWZ6aWptd25vdHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NDk5NTksImV4cCI6MjA1NDIyNTk1OX0.250G8-9dwvufgqvACNr6Zx-x8hBOeRAsVR3-apoLclA';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
