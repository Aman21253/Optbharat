import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvbxzrblwaanuawqyelm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Ynh6cmJsd2FhbnVhd3F5ZWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTg3OTYsImV4cCI6MjA2Nzg3NDc5Nn0.s8SIuCKGzXiMxpzldGuHQP5WwUu6UZnGkbrq4YlMk3g';

export const supabase = createClient(supabaseUrl, supabaseKey);