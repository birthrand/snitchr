const Notifications = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 'n1',
      type: 'reaction',
      user: 'Alex',
      action: 'liked',
      target: 'your confession',
      time: '2m',
      read: false
    },
    {
      id: 'n2',
      type: 'comment',
      user: 'Sarah',
      action: 'replied to',
      target: 'your confession',
      time: '15m',
      read: false
    },
    {
      id: 'n3',
      type: 'mention',
      user: 'Mike',
      action: 'mentioned you in',
      target: 'a confession',
      time: '1h',
      read: true
    }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reaction':
        return (
          <div className="w-8 h-8 rounded-full bg-[#f918801a] flex items-center justify-center text-[#f91880]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z" />
            </svg>
          </div>
        )
      case 'comment':
        return (
          <div className="w-8 h-8 rounded-full bg-[#1d9bf01a] flex items-center justify-center text-[#1d9bf0]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
            </svg>
          </div>
        )
      case 'mention':
        return (
          <div className="w-8 h-8 rounded-full bg-[#00ba7c1a] flex items-center justify-center text-[#00ba7c]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1.75c-5.11 0-9.25 4.14-9.25 9.25 0 4.77 3.61 8.7 8.25 9.2v2.96l1.15-.17c1.88-.29 4.11-1.56 5.87-3.5 1.59-1.73 2.98-4.1 2.98-6.89 0-5.11-4.14-9.25-9.25-9.25zm4.54 12.51c-1.22 1.32-2.98 2.35-4.54 2.47V14.5h-1v2.24c-3.49-.43-6-3.37-6-6.99 0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5c0 2.14-1.02 4.12-2.46 5.51z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-[#2f3336]">
        <div className="px-4 py-3">
          <h2 className="text-[15px] font-medium text-[#71767b]">Notifications</h2>
        </div>
      </header>

      {/* Notifications List */}
      <div className="divide-y divide-[#2f3336]">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 flex items-start space-x-3 ${
              notification.read ? 'bg-black' : 'bg-[#16181c]'
            }`}
          >
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-white">
                <span className="font-bold hover:underline">{notification.user}</span>
                {' '}
                <span className="text-[#71767b]">{notification.action}</span>
                {' '}
                <span className="text-[#71767b] hover:underline">{notification.target}</span>
              </p>
              <span className="text-[13px] text-[#71767b]">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications 