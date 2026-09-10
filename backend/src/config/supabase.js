const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
let isSupabaseConnected = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConnected = true;
    console.log('✅ Supabase client initialized with URL:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not fully configured. Using fallback memory data engine.');
}

module.exports = {
  supabase,
  isSupabaseConnected: () => isSupabaseConnected,
  supabaseUrl,
};
