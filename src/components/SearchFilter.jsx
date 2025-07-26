import { useState } from 'react'
import { hapticFeedback } from '../utils/haptics'

const SearchFilter = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => {
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterClick = (type) => {
    hapticFeedback.button()
    setFilterType(type)
    setShowFilters(false)
  }

  const hasActiveFilters = filterType !== 'all'

  return (
    <div className="relative">
      {/* Search Bar - Simplified */}
      <div className="relative">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full bg-[#202327] text-[15px] text-white placeholder-[#71767b] rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-[#1d9bf0] border-none"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71767b]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0] hover:text-[#1a8cd8] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Button - Only shown when needed */}
      {(searchTerm || hasActiveFilters) && (
        <div className="absolute right-0 top-0 -mr-12">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 text-[#1d9bf0] hover:bg-[#1d9bf01a] rounded-full transition-colors relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
            </svg>
            {hasActiveFilters && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1d9bf0] rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Filter Dropdown - Simplified */}
      {showFilters && (
        <div className="absolute right-0 mt-2 w-48 bg-black rounded-xl shadow-lg border border-[#2f3336] overflow-hidden z-20 animate-dropdown">
          <div className="py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`w-full px-4 py-3 text-left text-[15px] hover:bg-[#16181c] transition-colors ${
                filterType === 'all' ? 'text-[#1d9bf0]' : 'text-white'
              }`}
            >
              All posts
            </button>
            <button
              onClick={() => handleFilterClick('favorites')}
              className={`w-full px-4 py-3 text-left text-[15px] hover:bg-[#16181c] transition-colors ${
                filterType === 'favorites' ? 'text-[#1d9bf0]' : 'text-white'
              }`}
            >
              Liked posts
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilter