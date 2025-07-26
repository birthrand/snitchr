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

// Confession API functions
export const confessionAPI = {
  // Get all confessions with pagination
  async getConfessions(page = 0, limit = 20) {
    const from = page * limit
    const to = from + limit - 1
    
    const { data, error, count } = await supabase
      .from('confessions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    
    if (error) throw error
    return { data, count }
  },

  // Get confessions by search term
  async searchConfessions(searchTerm, page = 0, limit = 20) {
    const from = page * limit
    const to = from + limit - 1
    
    const { data, error, count } = await supabase
      .from('confessions')
      .select('*', { count: 'exact' })
      .or(`message.ilike.%${searchTerm}%,nickname.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(from, to)
    
    if (error) throw error
    return { data, count }
  },

  // Get confessions by filter
  async getConfessionsByFilter(filterType, page = 0, limit = 20) {
    const from = page * limit
    const to = from + limit - 1
    
    let query = supabase
      .from('confessions')
      .select('*', { count: 'exact' })
      .range(from, to)
    
    switch (filterType) {
      case 'popular':
        query = query.order('reactions->heart', { ascending: false })
        break
      case 'with_reactions':
        query = query.or('reactions->heart.gt.0,reactions->laugh.gt.0,reactions->think.gt.0')
        break
      case 'no_reactions':
        query = query.and('reactions->heart.eq.0,reactions->laugh.eq.0,reactions->think.eq.0')
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
    
    const { data, error, count } = await query
    
    if (error) throw error
    return { data, count }
  },

  // Create a new confession
  async createConfession(confession) {
    const { data, error } = await supabase
      .from('confessions')
      .insert([confession])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update confession reactions
  async updateReactions(confessionId, reactions) {
    const { data, error } = await supabase
      .from('confessions')
      .update({ reactions })
      .eq('id', confessionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a confession
  async deleteConfession(confessionId) {
    const { error } = await supabase
      .from('confessions')
      .delete()
      .eq('id', confessionId)
    
    if (error) throw error
    return true
  },

  // Get confession by ID
  async getConfessionById(confessionId) {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('id', confessionId)
      .single()
    
    if (error) throw error
    return data
  }
}

// Analytics API functions
export const analyticsAPI = {
  // Track an event
  async trackEvent(eventType, eventData = {}) {
    const { error } = await supabase
      .from('analytics')
      .insert([{
        event_type: eventType,
        event_data: eventData,
        user_agent: navigator.userAgent,
        ip_address: null // Will be set by Supabase function
      }])
    
    if (error) {
      console.error('Analytics error:', error)
      // Don't throw error for analytics failures
    }
  },

  // Track confession creation
  async trackConfessionCreated(confessionId) {
    await this.trackEvent('confession_created', { confession_id: confessionId })
  },

  // Track reaction
  async trackReaction(confessionId, reactionType) {
    await this.trackEvent('reaction_added', { 
      confession_id: confessionId, 
      reaction_type: reactionType 
    })
  },

  // Track app usage
  async trackAppUsage(action) {
    await this.trackEvent('app_usage', { action })
  }
}

// User session API functions
export const sessionAPI = {
  // Create or update user session
  async createSession(sessionToken, nickname = null) {
    const { data, error } = await supabase
      .from('user_sessions')
      .upsert([{
        session_token: sessionToken,
        nickname,
        last_active: new Date().toISOString()
      }], {
        onConflict: 'session_token'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get session by token
  async getSession(sessionToken) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()
    
    if (error) throw error
    return data
  },

  // Update session last active
  async updateSessionActivity(sessionToken) {
    const { error } = await supabase
      .from('user_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('session_token', sessionToken)
      .single()
    
    if (error) throw error
  }
}

// Real-time subscriptions
export const realtimeAPI = {
  // Subscribe to new confessions
  subscribeToNewConfessions(callback) {
    return supabase
      .channel('new_confessions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'confessions'
      }, callback)
      .subscribe()
  },

  // Subscribe to confession updates
  subscribeToConfessionUpdates(callback) {
    return supabase
      .channel('confession_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'confessions'
      }, callback)
      .subscribe()
  },

  // Subscribe to confession deletions
  subscribeToConfessionDeletions(callback) {
    return supabase
      .channel('confession_deletions')
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'confessions'
      }, callback)
      .subscribe()
  }
}

export default supabase