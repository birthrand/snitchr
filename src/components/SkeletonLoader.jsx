import React from 'react'

const SkeletonLoader = ({ type = 'confession', count = 3 }) => {
  const renderConfessionSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      {/* Message */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      
      {/* Reactions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )

  const renderSearchSkeleton = () => (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      
      {/* Filter buttons */}
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
      </div>
    </div>
  )

  const renderFormSkeleton = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
      </div>
      
      {/* Message input */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
      
      {/* Mood picker */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      
      {/* Nickname input */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
      
      {/* Location status */}
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      
      {/* Buttons */}
      <div className="flex space-x-3">
        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  )

  const renderSettingsSkeleton = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>
      
      {/* Export section */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      
      {/* Privacy section */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'confession':
        return renderConfessionSkeleton()
      case 'search':
        return renderSearchSkeleton()
      case 'form':
        return renderFormSkeleton()
      case 'settings':
        return renderSettingsSkeleton()
      default:
        return renderConfessionSkeleton()
    }
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader