// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpwfvtzyajsmamgxmxyl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd2Z2dHp5YWpzbWFtZ3hteHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODQ3ODYsImV4cCI6MjA2NTg2MDc4Nn0.Ru80mcMwo_cmIOUgRMQeKedpFXBOvMUMBSlzjjK_GqU'; // tu clave anon completa
export const supabase = createClient(supabaseUrl, supabaseKey);
