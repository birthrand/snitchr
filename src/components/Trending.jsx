import ConfessionPost from './ConfessionPost'

const Trending = () => {
  // Mock trending data
  const trendingConfessions = [
    {
      id: 't1',
      nickname: 'TrendSetter',
      message: 'Just discovered the most amazing hidden cafe in the city! The ambiance is unreal and their signature drink is a must-try! 🍵✨',
      created_at: '2024-02-20T10:00:00Z',
      reactions: {
        heart: 2891,
        heart_reacted: false
      },
      commentCount: 342,
      shares: 156
    },
    {
      id: 't2',
      nickname: 'ArtLover',
      message: 'Spent the whole day at the new art exhibition. Mind = blown! The way they combined traditional and digital art is revolutionary. 🎨',
      created_at: '2024-02-20T09:30:00Z',
      reactions: {
        heart: 1543,
        heart_reacted: true
      },
      commentCount: 89,
      shares: 234
    },
    {
      id: 't3',
      nickname: 'FoodieExplorer',
      message: 'PSA: That viral pasta recipe everyone\'s talking about? Just made it. It\'s actually worth the hype! Added my own twist with fresh basil and it\'s *chef\'s kiss* 🍝',
      created_at: '2024-02-20T08:45:00Z',
      reactions: {
        heart: 3102,
        heart_reacted: false
      },
      commentCount: 421,
      shares: 567
    }
  ]

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3">
          <h2 className="text-[15px] font-medium text-[#71767b]">Trending confessions</h2>
        </div>
      </header>

      {/* Trending Feed */}
      <div className="divide-y divide-[#2f3336]">
        {trendingConfessions.map(confession => (
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

export default Trending 