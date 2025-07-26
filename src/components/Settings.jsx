import { useState } from 'react'
import { exportConfessions, getExportStats } from '../utils/export'

const Settings = ({ confessions, onClose }) => {
  const [exportFormat, setExportFormat] = useState('json')
  const [isExporting, setIsExporting] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const stats = getExportStats(confessions)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportConfessions(confessions, exportFormat)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all confessions? This action cannot be undone.')) {
      localStorage.removeItem('snitchr-confessions')
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-strong">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-target"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Data</h3>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showStats ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Confessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalConfessions}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Reactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReactions}</p>
              </div>
            </div>

            {showStats && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With Reactions:</span>
                  <span className="text-gray-900 dark:text-white">{stats.confessionsWithReactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With Location:</span>
                  <span className="text-gray-900 dark:text-white">{stats.confessionsWithLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With Mood:</span>
                  <span className="text-gray-900 dark:text-white">{stats.confessionsWithMood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Reactions:</span>
                  <span className="text-gray-900 dark:text-white">{stats.averageReactionsPerConfession}</span>
                </div>
              </div>
            )}
          </div>

          {/* Export Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="json">JSON (Recommended)</option>
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="txt">Text (Readable)</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting || confessions.length === 0}
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 btn-press touch-target"
            >
              {isExporting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </div>
              ) : (
                'Export All Confessions'
              )}
            </button>

            {confessions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No confessions to export
              </p>
            )}
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Data</h3>
            
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Data Privacy</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    All your data is stored locally on your device. We don't collect or store any personal information.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={clearAllData}
              disabled={confessions.length === 0}
              className="w-full px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 btn-press touch-target"
            >
              Clear All Data
            </button>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <span>MIT</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span>Local Only</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Made with ❤️ for anonymous expression
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings