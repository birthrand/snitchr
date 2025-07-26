import { useState } from 'react'
import { hapticFeedback } from './utils/haptics'
import Home from './components/Home'
import Trending from './components/Trending'
import Notifications from './components/Notifications'
import Profile from './components/Profile'
import AddConfession from './components/AddConfession'

const App = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [showAddConfession, setShowAddConfession] = useState(false)

  const handleTabChange = (tab) => {
    hapticFeedback.button()
    setActiveTab(tab)
  }

  const handleAddClick = () => {
    hapticFeedback.button()
    setShowAddConfession(true)
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Main Content */}
      <main className="pb-16">
        {activeTab === 'home' && <Home />}
        {activeTab === 'trending' && <Trending />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#2f3336] px-4 py-2">
        <div className="flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => handleTabChange('home')}
            className={`p-3 rounded-full ${
              activeTab === 'home' ? 'text-white' : 'text-[#71767b]'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {activeTab === 'home' ? (
                <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z" />
              ) : (
                <path d="M12 9c-1.933 0-3.5 1.567-3.5 3.5S10.067 16 12 16s3.5-1.567 3.5-3.5S13.933 9 12 9zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 11 12 11s1.5.673 1.5 1.5S12.827 14 12 14zm9.5-4.321V19.5c0 .827-.673 1.5-1.5 1.5h-13c-.827 0-1.5-.673-1.5-1.5V9.679l8-5.333 8 5.333zM12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696z" />
              )}
            </svg>
          </button>

          {/* Trending */}
          <button
            onClick={() => handleTabChange('trending')}
            className={`p-3 rounded-full ${
              activeTab === 'trending' ? 'text-white' : 'text-[#71767b]'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {activeTab === 'trending' ? (
                <path d="M8.5 2c1.5 2 2 3.5 2 5.5 0 2-1.5 4-3.5 4.5.5-1.5.5-3-.5-4.5-1.5-2-3-3-5-3 .5 4.5 2.5 7 5.5 8.5C4.5 15 2 18.5 2 22h2c.5-4.5 3.5-8 8-8.5 4 0 7.5-3 7.5-7C19.5 3 16.5 0 12.5 0S8.5 2 8.5 2zM12 9.5c-1.5 0-2.5-1-2.5-2.5S10.5 4.5 12 4.5s2.5 1 2.5 2.5S13.5 9.5 12 9.5z" />
              ) : (
                <path d="M8.5 2c1.5 2 2 3.5 2 5.5 0 2-1.5 4-3.5 4.5.5-1.5.5-3-.5-4.5-1.5-2-3-3-5-3 .5 4.5 2.5 7 5.5 8.5C4.5 15 2 18.5 2 22h2c.5-4.5 3.5-8 8-8.5 4 0 7.5-3 7.5-7C19.5 3 16.5 0 12.5 0S8.5 2 8.5 2zm3.5 7.5c-1.5 0-2.5-1-2.5-2.5S10.5 4.5 12 4.5s2.5 1 2.5 2.5S13.5 9.5 12 9.5z" />
              )}
            </svg>
          </button>

          {/* Add Button */}
          <button
            onClick={handleAddClick}
            className="p-3 bg-[#1d9bf0] rounded-full text-white shadow-lg transform active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            onClick={() => handleTabChange('notifications')}
            className={`p-3 rounded-full ${
              activeTab === 'notifications' ? 'text-white' : 'text-[#71767b]'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {activeTab === 'notifications' ? (
                <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z" />
              ) : (
                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z" />
              )}
            </svg>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleTabChange('profile')}
            className={`p-3 rounded-full ${
              activeTab === 'profile' ? 'text-white' : 'text-[#71767b]'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {activeTab === 'profile' ? (
                <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z" />
              ) : (
                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Add Confession Modal */}
      {showAddConfession && (
        <AddConfession onClose={() => setShowAddConfession(false)} />
      )}
    </div>
  )
}

export default App