import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbaijbhtkharypebhcff.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYWlqYmh0a2hhcnlwZWJoY2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDUyMDMsImV4cCI6MjA2ODk4MTIwM30.7tnxxji0NFMpHRMRHKduvu1wRvlTwdrU6vysh1Lt84g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to generate a session token for anonymous users
export const generateSessionToken = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

// Helper function to get or create anonymous session
export const getOrCreateSession = async () => {
  let sessionToken = localStorage.getItem('snitchr-session-token')
  
  if (!sessionToken) {
    sessionToken = generateSessionToken()
    localStorage.setItem('snitchr-session-token', sessionToken)
    
    // Create session in database
    try {
      await supabase
        .from('user_sessions')
        .insert({
          session_token: sessionToken,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Failed to create session in database:', error)
    }
  }
  
  return sessionToken
}

// Helper function to update session activity
export const updateSessionActivity = async (sessionToken) => {
  try {
    await supabase
      .from('user_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('session_token', sessionToken)
  } catch (error) {
    console.warn('Failed to update session activity:', error)
  }
}