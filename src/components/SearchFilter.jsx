import { useState } from 'react'

const SearchFilter = ({ onSearch, onFilter, totalCount }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilter = (type) => {
    setFilterType(type)
    onFilter(type)
  }

  const filterOptions = [
    { value: 'all', label: 'All', icon: '📝' },
    { value: 'recent', label: 'Recent', icon: '🕐' },
    { value: 'popular', label: 'Popular', icon: '🔥' },
    { value: 'with-reactions', label: 'With Reactions', icon: '❤️' },
    { value: 'no-reactions', label: 'No Reactions', icon: '🤷' }
  ]

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          placeholder="Search confessions..."
          aria-label="Search confessions"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('')
              onSearch('')
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalCount} confession{totalCount !== 1 ? 's' : ''}
          </span>
          {(searchTerm || filterType !== 'all') && (
            <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
              Filtered
            </span>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Toggle filters"
        >
          <span>Filters</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Filter by
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilter(option.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                  filterType === option.value
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`Filter by ${option.label}`}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          
          {/* Clear Filters */}
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
                onSearch('')
                onFilter('all')
              }}
              className="w-full mt-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter