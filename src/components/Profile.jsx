import ConfessionPost from './ConfessionPost'

const Profile = () => {
  // Mock profile data
  const profile = {
    nickname: 'Anonymous',
    joinDate: 'February 2024',
    stats: {
      confessions: 42,
      reactions: 156,
      views: '12.5K'
    }
  }

  // Mock user's confessions
  const userConfessions = [
    {
      id: 'p1',
      nickname: 'Anonymous',
      message: 'Finally took the leap and started my own podcast! First episode dropping next week. Nervous but excited! 🎙️',
      created_at: '2024-02-20T10:00:00Z',
      reactions: {
        heart: 89,
        heart_reacted: true
      },
      commentCount: 12,
      shares: 5
    },
    {
      id: 'p2',
      nickname: 'Anonymous',
      message: "Just finished a 30-day meditation challenge. Never thought I'd say this, but it's actually life-changing. My anxiety is down 50% 🧘‍♂️",
      created_at: '2024-02-19T15:30:00Z',
      reactions: {
        heart: 234,
        heart_reacted: false
      },
      commentCount: 28,
      shares: 15
    }
  ]

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3">
          <h2 className="text-[15px] font-medium text-[#71767b]">Profile</h2>
        </div>
      </header>

      {/* Profile Info */}
      <div className="px-4 py-4 border-b border-[#2f3336]">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-[#1d9bf01a] flex items-center justify-center text-[#1d9bf0]">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{profile.nickname}</h1>
            <p className="text-[#71767b] text-[15px]">Joined {profile.joinDate}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4">
          <div>
            <span className="text-white font-bold">{profile.stats.confessions}</span>
            <span className="text-[#71767b] text-[15px] ml-1">Confessions</span>
          </div>
          <div>
            <span className="text-white font-bold">{profile.stats.reactions}</span>
            <span className="text-[#71767b] text-[15px] ml-1">Reactions</span>
          </div>
          <div>
            <span className="text-white font-bold">{profile.stats.views}</span>
            <span className="text-[#71767b] text-[15px] ml-1">Views</span>
          </div>
        </div>
      </div>

      {/* User's Confessions */}
      <div className="divide-y divide-[#2f3336]">
        {userConfessions.map(confession => (
          <ConfessionPost
            key={confession.id}
            confession={confession}
            onReaction={() => {}}
            onComment={() => {}}
            onShare={() => {}}
          />
        ))}
      </div>
    </div>
  )
}

export default Profile 