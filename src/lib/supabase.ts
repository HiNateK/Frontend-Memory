import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeoppgzlmmcujnwtuemc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb3BwZ3psbW1jdWpud3R1ZW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MjE0NDAsImV4cCI6MjA1MjM5NzQ0MH0.tgaFkK3Dr3kU-EYpfhWqWO76AJWW5W5c50QovwZlXZM';

if (!supabaseKey) {
  throw new Error('Missing Supabase key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);