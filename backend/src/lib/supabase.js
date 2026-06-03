const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

console.log("Supabase Config:");
console.log("URL:", process.env.SUPABASE_URL);
console.log("Key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

let supabase;
try {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    },
  );
  console.log("Supabase client created successfully");
} catch (err) {
  console.error("Failed to create Supabase client:", err.message);
  // Create a mock client that returns empty data
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          then: (cb) => cb({ data: [] }),
          catch: () => {},
        }),
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  };
}

module.exports = supabase;
