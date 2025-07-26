import { useState, useEffect, useCallback } from 'react'
import { confessionService } from '../services/confessionService'

export const useConfessions = () => {
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalConfessions: 0,
    todayConfessions: 0,
    totalReactions: 0
  })

  // Initialize service and load confessions
  useEffect(() => {
    const initService = async () => {
      try {
        await confessionService.init()
        const initialConfessions = await confessionService.getConfessions(handleRealtimeUpdate)
        setConfessions(initialConfessions)
        
        // Load stats
        const initialStats = await confessionService.getStats()
        setStats(initialStats)
        
        setLoading(false)
      } catch (err) {
        console.error('Failed to initialize confession service:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    initService()

    // Cleanup on unmount
    return () => {
      confessionService.cleanup()
    }
  }, [])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload) => {
    setConfessions(prevConfessions => {
      switch (payload.eventType) {
        case 'INSERT':
          return [payload.new, ...prevConfessions]
        
        case 'UPDATE':
          return prevConfessions.map(confession => 
            confession.id === payload.new.id ? payload.new : confession
          )
        
        case 'DELETE':
          return prevConfessions.filter(confession => 
            confession.id !== payload.old.id
          )
        
        default:
          return prevConfessions
      }
    })
  }, [])

  // Add new confession
  const addConfession = useCallback(async (confessionData) => {
    try {
      setLoading(true)
      const newConfession = await confessionService.addConfession(confessionData)
      
      // Update stats
      const updatedStats = await confessionService.getStats()
      setStats(updatedStats)
      
      return newConfession
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update reactions
  const updateReactions = useCallback(async (confessionId, reactionType) => {
    try {
      await confessionService.updateReactions(confessionId, reactionType)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Delete confession
  const deleteConfession = useCallback(async (confessionId) => {
    try {
      setLoading(true)
      await confessionService.deleteConfession(confessionId)
      
      // Update stats
      const updatedStats = await confessionService.getStats()
      setStats(updatedStats)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Search confessions
  const searchConfessions = useCallback(async (query) => {
    try {
      setLoading(true)
      const results = await confessionService.searchConfessions(query)
      return results
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh confessions
  const refreshConfessions = useCallback(async () => {
    try {
      setLoading(true)
      const freshConfessions = await confessionService.getConfessions(handleRealtimeUpdate)
      setConfessions(freshConfessions)
      
      const updatedStats = await confessionService.getStats()
      setStats(updatedStats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [handleRealtimeUpdate])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    confessions,
    loading,
    error,
    stats,
    addConfession,
    updateReactions,
    deleteConfession,
    searchConfessions,
    refreshConfessions,
    clearError
  }
}