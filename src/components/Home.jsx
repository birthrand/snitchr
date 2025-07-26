import { useState, useRef, useCallback } from 'react'
import ConfessionPost from './ConfessionPost'
import SearchFilter from './SearchFilter'
import { hapticFeedback } from '../utils/haptics'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const observer = useRef()

  // Mock confessions data
  const [confessions] = useState([
    {
      id: 'h1',
      nickname: 'CoffeeAddict',
      message: "Just discovered that my local coffee shop has been secretly using decaf all this time. My whole life has been a lie! ☕️😱",
      created_at: '2024-02-20T11:00:00Z',
      reactions: {
        heart: 423,
        heart_reacted: false
      },
      commentCount: 56,
      shares: 23
    },
    {
      id: 'h2',
      nickname: 'NightOwl',
      message: "To the person who plays piano at 3 AM in my apartment building - your music is beautiful, but please... some of us are trying to sleep! 🎹😴",
      created_at: '2024-02-20T10:30:00Z',
      reactions: {
        heart: 892,
        heart_reacted: true
      },
      commentCount: 134,
      shares: 45
    },
    {
      id: 'h3',
      nickname: 'BookWorm',
      message: "Finally finished reading that 1000-page book that\\'s been sitting on my shelf for two years. Plot twist: it was actually worth it! 📚✨",
      created_at: '2024-02-20T09:15:00Z',
      reactions: {
        heart: 567,
        heart_reacted: false
      },
      commentCount: 78,
      shares: 12
    }
  ])

  const [loading] = useState(false)
  const [hasMore] = useState(true)

  const loadMore = useCallback(() => {
    // Mock loading more data
    console.log('Loading more confessions...')
  }, [])

  const lastConfessionRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, loadMore])

  const filteredConfessions = confessions.filter(confession => {
    const matchesSearch = confession.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (confession.nickname && confession.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
    
    switch (filterType) {
      case 'favorites':
        return matchesSearch && confession.reactions?.heart_reacted
      case 'trending':
        return matchesSearch && confession.reactions?.heart > 500
      default:
        return matchesSearch
    }
  })

  const handleReaction = (confessionId) => {
    hapticFeedback.button()
    // Handle reaction
  }

  const handleComment = (confessionId) => {
    hapticFeedback.button()
    // Handle comment
  }

  const handleShare = (confessionId) => {
    hapticFeedback.button()
    // Handle share
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#f918801a] flex items-center justify-center text-[#f91880] mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Snitchr</h1>
          </div>
          <div className="flex items-center space-x-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-[#f918801a] text-[#f91880] rounded-full">BETA</span>
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="px-4 py-2 border-b border-[#2f3336]">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />
      </div>

      {/* Feed */}
      <div className="divide-y divide-[#2f3336]">
        {loading && filteredConfessions.length === 0 ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse p-4 border-b border-[#2f3336]">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-[#2f3336] rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[#2f3336] rounded w-3/4" />
                  <div className="h-4 bg-[#2f3336] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filteredConfessions.length === 0 ? (
          <div className="p-4 text-center text-[#71767b]">
            {searchTerm ? 'No confessions found' : 'No confessions yet'}
          </div>
        ) : (
          filteredConfessions.map((confession, index) => (
            <div
              key={confession.id}
              ref={index === filteredConfessions.length - 1 ? lastConfessionRef : null}
            >
              <ConfessionPost
                confession={confession}
                onReaction={handleReaction}
                onComment={handleComment}
                onShare={handleShare}
              />
            </div>
          ))
        )}

        {/* Loading indicator at bottom */}
        {loading && filteredConfessions.length > 0 && (
          <div className="p-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-t-[#1d9bf0] border-r-[#1d9bf0] border-b-[#1d9bf0] border-l-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home