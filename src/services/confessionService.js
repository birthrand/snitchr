import { supabase, getOrCreateSession, updateSessionActivity } from '../lib/supabase'

export class ConfessionService {
  constructor() {
    this.sessionToken = null
    this.realtimeSubscription = null
  }

  // Initialize the service
  async init() {
    this.sessionToken = await getOrCreateSession()
    await updateSessionActivity(this.sessionToken)
  }

  // Get all confessions with real-time updates
  async getConfessions(callback) {
    try {
      // Get initial data
      const { data: confessions, error } = await supabase
        .from('confessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Set up real-time subscription
      this.realtimeSubscription = supabase
        .channel('confessions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'confessions'
          },
          (payload) => {
            console.log('Realtime update:', payload)
            callback(payload)
          }
        )
        .subscribe()

      return confessions || []
    } catch (error) {
      console.error('Error fetching confessions:', error)
      return []
    }
  }

  // Add a new confession
  async addConfession(confession) {
    try {
      await updateSessionActivity(this.sessionToken)

      const { data, error } = await supabase
        .from('confessions')
        .insert({
          nickname: confession.nickname,
          message: confession.message,
          mood: confession.mood,
          location: confession.location,
          reactions: {
            heart: 0,
            laugh: 0,
            think: 0
          }
        })
        .select()
        .single()

      if (error) throw error

      // Track analytics
      await this.trackEvent('confession_created', {
        confession_id: data.id,
        has_nickname: !!confession.nickname,
        has_mood: !!confession.mood,
        has_location: !!confession.location
      })

      return data
    } catch (error) {
      console.error('Error adding confession:', error)
      throw error
    }
  }

  // Update confession reactions
  async updateReactions(confessionId, reactionType) {
    try {
      await updateSessionActivity(this.sessionToken)

      // Get current confession
      const { data: confession, error: fetchError } = await supabase
        .from('confessions')
        .select('reactions')
        .eq('id', confessionId)
        .single()

      if (fetchError) throw fetchError

      const reactions = confession.reactions || {}
      const currentCount = reactions[reactionType] || 0
      const hasReacted = reactions[`${reactionType}_reacted`] || false

      // Update reactions
      const updatedReactions = {
        ...reactions,
        [reactionType]: hasReacted ? currentCount - 1 : currentCount + 1,
        [`${reactionType}_reacted`]: !hasReacted
      }

      const { error } = await supabase
        .from('confessions')
        .update({ reactions: updatedReactions })
        .eq('id', confessionId)

      if (error) throw error

      // Track analytics
      await this.trackEvent('reaction_updated', {
        confession_id: confessionId,
        reaction_type: reactionType,
        action: hasReacted ? 'remove' : 'add'
      })

      return updatedReactions
    } catch (error) {
      console.error('Error updating reactions:', error)
      throw error
    }
  }

  // Delete a confession
  async deleteConfession(confessionId) {
    try {
      await updateSessionActivity(this.sessionToken)

      const { error } = await supabase
        .from('confessions')
        .delete()
        .eq('id', confessionId)

      if (error) throw error

      // Track analytics
      await this.trackEvent('confession_deleted', {
        confession_id: confessionId
      })

      return true
    } catch (error) {
      console.error('Error deleting confession:', error)
      throw error
    }
  }

  // Search confessions
  async searchConfessions(query) {
    try {
      await updateSessionActivity(this.sessionToken)

      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .or(`message.ilike.%${query}%,nickname.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error searching confessions:', error)
      return []
    }
  }

  // Get confession statistics
  async getStats() {
    try {
      await updateSessionActivity(this.sessionToken)

      const { data, error } = await supabase
        .from('confessions')
        .select('created_at, reactions')

      if (error) throw error

      const totalConfessions = data.length
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayConfessions = data.filter(confession => 
        new Date(confession.created_at) >= today
      ).length

      const totalReactions = data.reduce((sum, confession) => {
        const reactions = confession.reactions || {}
        return sum + (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0)
      }, 0)

      return {
        totalConfessions,
        todayConfessions,
        totalReactions
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      return {
        totalConfessions: 0,
        todayConfessions: 0,
        totalReactions: 0
      }
    }
  }

  // Track analytics events
  async trackEvent(eventType, eventData = {}) {
    try {
      await supabase
        .from('analytics')
        .insert({
          event_type: eventType,
          event_data: eventData,
          user_agent: navigator.userAgent
        })
    } catch (error) {
      console.warn('Failed to track analytics event:', error)
    }
  }

  // Cleanup real-time subscription
  cleanup() {
    if (this.realtimeSubscription) {
      supabase.removeChannel(this.realtimeSubscription)
      this.realtimeSubscription = null
    }
  }
}

// Export singleton instance
export const confessionService = new ConfessionService()