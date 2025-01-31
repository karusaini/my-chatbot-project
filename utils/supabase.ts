import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://dmewxzjhvzxzdrwdnceb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZXd4empodnp4emRyd2RuY2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNjAzNzUsImV4cCI6MjA1MzczNjM3NX0.NyiGBxNiggmutGvyB_Kmef2H5AgjZAetpH690j6JYkw',
          {
                    auth: {
                              persistSession: true, // Enable session persistence
                              autoRefreshToken: true, // Automatically refresh token
                              detectSessionInUrl: true, // Detect session from URL on auth redirects
                            },
          }
)

export default supabase

