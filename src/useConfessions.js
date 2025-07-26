import { useState, useEffect, useCallback } from 'react'
import { confessionAPI, analyticsAPI, realtimeAPI } from './supabase'

export const useConfessions = () => {
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const ITEMS_PER_PAGE = 20

  // Load confessions from Supabase
  const loadConfessions = useCallback(async (page = 0, reset = false) => {
    try {
      setLoading(true)
      setError(null)

      let result
      if (searchTerm) {
        result = await confessionAPI.searchConfessions(searchTerm, page, ITEMS_PER_PAGE)
      } else if (filterType !== 'all') {
        result = await confessionAPI.getConfessionsByFilter(filterType, page, ITEMS_PER_PAGE)
      } else {
        result = await confessionAPI.getConfessions(page, ITEMS_PER_PAGE)
      }

      const { data, count } = result
      
      if (reset) {
        setConfessions(data || [])
      } else {
        setConfessions(prev => [...prev, ...(data || [])])
      }

      setHasMore((page + 1) * ITEMS_PER_PAGE < (count || 0))
      setCurrentPage(page)
      
      // Track analytics
      analyticsAPI.trackAppUsage('confessions_loaded')
    } catch (err) {
      console.error('Error loading confessions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterType])

  // Load more confessions (pagination)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadConfessions(currentPage + 1, false)
    }
  }, [loading, hasMore, currentPage, loadConfessions])

  // Refresh confessions
  const refresh = useCallback(() => {
    loadConfessions(0, true)
  }, [loadConfessions])

  // Search confessions
  const search = useCallback((term) => {
    setSearchTerm(term)
    setCurrentPage(0)
    setHasMore(true)
    loadConfessions(0, true)
  }, [loadConfessions])

  // Filter confessions
  const filter = useCallback((type) => {
    setFilterType(type)
    setCurrentPage(0)
    setHasMore(true)
    loadConfessions(0, true)
  }, [loadConfessions])

  // Add new confession
  const addConfession = useCallback(async (confession) => {
    try {
      const newConfession = await confessionAPI.createConfession(confession)
      
      // Add to local state
      setConfessions(prev => [newConfession, ...prev])
      
      // Track analytics
      analyticsAPI.trackConfessionCreated(newConfession.id)
      
      return newConfession
    } catch (err) {
      console.error('Error adding confession:', err)
      setError(err.message)
      throw err
    }
  }, [])

  // Update confession reactions
  const updateReactions = useCallback(async (confessionId, reactionType) => {
    try {
      // Find the confession in local state
      const confessionIndex = confessions.findIndex(c => c.id === confessionId)
      if (confessionIndex === -1) return

      const confession = confessions[confessionIndex]
      const reactions = confession.reactions || {}
      const currentCount = reactions[reactionType] || 0
      const hasReacted = reactions[`${reactionType}_reacted`] || false

      // Optimistically update local state
      const updatedReactions = {
        ...reactions,
        [reactionType]: hasReacted ? currentCount - 1 : currentCount + 1,
        [`${reactionType}_reacted`]: !hasReacted
      }

      const updatedConfession = {
        ...confession,
        reactions: updatedReactions
      }

      setConfessions(prev => 
        prev.map(c => c.id === confessionId ? updatedConfession : c)
      )

      // Update in Supabase
      await confessionAPI.updateReactions(confessionId, updatedReactions)
      
      // Track analytics
      analyticsAPI.trackReaction(confessionId, reactionType)
    } catch (err) {
      console.error('Error updating reactions:', err)
      // Revert optimistic update
      refresh()
    }
  }, [confessions, refresh])

  // Delete confession
  const deleteConfession = useCallback(async (confessionId) => {
    try {
      await confessionAPI.deleteConfession(confessionId)
      
      // Remove from local state
      setConfessions(prev => prev.filter(c => c.id !== confessionId))
      
      // Track analytics
      analyticsAPI.trackAppUsage('confession_deleted')
    } catch (err) {
      console.error('Error deleting confession:', err)
      setError(err.message)
      throw err
    }
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    const subscriptions = []

    // Subscribe to new confessions
    const newConfessionsSub = realtimeAPI.subscribeToNewConfessions((payload) => {
      setConfessions(prev => [payload.new, ...prev])
    })
    subscriptions.push(newConfessionsSub)

    // Subscribe to confession updates
    const updatesSub = realtimeAPI.subscribeToConfessionUpdates((payload) => {
      setConfessions(prev => 
        prev.map(c => c.id === payload.new.id ? payload.new : c)
      )
    })
    subscriptions.push(updatesSub)

    // Subscribe to confession deletions
    const deletionsSub = realtimeAPI.subscribeToConfessionDeletions((payload) => {
      setConfessions(prev => prev.filter(c => c.id !== payload.old.id))
    })
    subscriptions.push(deletionsSub)

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe()
        }
      })
    }
  }, [])

  // Load initial confessions
  useEffect(() => {
    loadConfessions(0, true)
  }, [loadConfessions])

  return {
    confessions,
    loading,
    error,
    hasMore,
    currentPage,
    searchTerm,
    filterType,
    loadMore,
    refresh,
    search,
    filter,
    addConfession,
    updateReactions,
    deleteConfession
  }
}