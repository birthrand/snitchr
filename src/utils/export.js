// Data export utilities for downloading confessions

export const exportConfessions = (confessions, format = 'json') => {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `snitchr-confessions-${timestamp}`

  switch (format) {
    case 'json':
      return exportAsJSON(confessions, filename)
    case 'csv':
      return exportAsCSV(confessions, filename)
    case 'txt':
      return exportAsTXT(confessions, filename)
    default:
      return exportAsJSON(confessions, filename)
  }
}

const exportAsJSON = (confessions, filename) => {
  const data = {
    exportDate: new Date().toISOString(),
    totalConfessions: confessions.length,
    confessions: confessions.map(confession => ({
      id: confession.id,
      message: confession.message,
      nickname: confession.nickname,
      timestamp: confession.timestamp,
      location: confession.location,
      mood: confession.mood,
      reactions: confession.reactions
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  
  downloadFile(blob, `${filename}.json`)
}

const exportAsCSV = (confessions, filename) => {
  const headers = ['ID', 'Message', 'Nickname', 'Timestamp', 'Location', 'Mood', 'Heart Reactions', 'Laugh Reactions', 'Think Reactions']
  
  const csvContent = [
    headers.join(','),
    ...confessions.map(confession => [
      confession.id,
      `"${confession.message.replace(/"/g, '""')}"`,
      confession.nickname || 'Anonymous',
      confession.timestamp,
      confession.location ? `${confession.location.latitude},${confession.location.longitude}` : '',
      confession.mood ? confession.mood.label : '',
      confession.reactions?.heart || 0,
      confession.reactions?.laugh || 0,
      confession.reactions?.think || 0
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  })
  
  downloadFile(blob, `${filename}.csv`)
}

const exportAsTXT = (confessions, filename) => {
  const content = confessions.map((confession, index) => {
    const reactions = confession.reactions || {}
    const reactionText = [
      reactions.heart ? `${reactions.heart}❤️` : '',
      reactions.laugh ? `${reactions.laugh}😂` : '',
      reactions.think ? `${reactions.think}🤔` : ''
    ].filter(Boolean).join(' ')
    
    return `${index + 1}. ${confession.message}
   By: ${confession.nickname || 'Anonymous'}
   Date: ${new Date(confession.timestamp).toLocaleString()}
   ${confession.mood ? `Mood: ${confession.mood.emoji} ${confession.mood.label}` : ''}
   ${reactionText ? `Reactions: ${reactionText}` : ''}
   ${confession.location ? `Location: ${confession.location.latitude}, ${confession.location.longitude}` : ''}
   
`
  }).join('')

  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  })
  
  downloadFile(blob, `${filename}.txt`)
}

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Get export statistics
export const getExportStats = (confessions) => {
  const totalConfessions = confessions.length
  const totalReactions = confessions.reduce((sum, confession) => {
    const reactions = confession.reactions || {}
    return sum + (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0)
  }, 0)
  
  const confessionsWithReactions = confessions.filter(confession => {
    const reactions = confession.reactions || {}
    return (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0) > 0
  }).length
  
  const confessionsWithLocation = confessions.filter(confession => confession.location).length
  const confessionsWithMood = confessions.filter(confession => confession.mood).length
  
  return {
    totalConfessions,
    totalReactions,
    confessionsWithReactions,
    confessionsWithLocation,
    confessionsWithMood,
    averageReactionsPerConfession: totalConfessions > 0 ? (totalReactions / totalConfessions).toFixed(1) : 0
  }
}