// Confetti animation utility for celebration effects
// Creates a beautiful confetti burst when confessions are posted

export const createConfetti = (x = 0.5, y = 0.5) => {
  const colors = [
    '#0ea5e9', // Primary blue
    '#d946ef', // Secondary purple
    '#22c55e', // Success green
    '#f59e0b', // Warning yellow
    '#ef4444', // Error red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
  ]

  const confettiCount = 50
  const gravity = 0.5
  const terminalVelocity = 5
  const drag = 0.075
  const easeOut = 0.95

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  
  document.body.appendChild(canvas)

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  const confetti = []

  class ConfettiPiece {
    constructor() {
      this.x = x * canvas.width
      this.y = y * canvas.height
      this.w = Math.random() * 10 + 5
      this.h = Math.random() * 4 + 2
      this.rotation = Math.random() * 360
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.opacity = Math.random() + 0.5
      this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8 - 2
      }
      this.rotationVelocity = (Math.random() - 0.5) * 10
      this.gravity = gravity
      this.drag = drag
      this.easeOut = easeOut
    }

    update() {
      this.velocity.x *= this.drag
      this.velocity.y *= this.drag
      this.velocity.y += this.gravity
      
      if (this.velocity.y > terminalVelocity) {
        this.velocity.y = terminalVelocity
      }

      this.x += this.velocity.x
      this.y += this.velocity.y
      this.rotation += this.rotationVelocity
      this.opacity *= this.easeOut

      return this.opacity > 0.1 && this.y < canvas.height + 100
    }

    draw() {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.globalAlpha = this.opacity
      ctx.fillStyle = this.color
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
      ctx.restore()
    }
  }

  // Create confetti pieces
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new ConfettiPiece())
  }

  let animationId

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = confetti.length - 1; i >= 0; i--) {
      const piece = confetti[i]
      if (!piece.update()) {
        confetti.splice(i, 1)
      } else {
        piece.draw()
      }
    }

    if (confetti.length > 0) {
      animationId = requestAnimationFrame(animate)
    } else {
      cleanup()
    }
  }

  const cleanup = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
    window.removeEventListener('resize', resizeCanvas)
  }

  animate()

  // Auto cleanup after 5 seconds
  setTimeout(cleanup, 5000)
}

// Heart burst animation for reactions
export const createHeartBurst = (x, y) => {
  const hearts = ['❤️', '💖', '💝', '💕', '💗', '💓', '💞', '💘']
  const burstCount = 8

  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement('div')
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.position = 'fixed'
    heart.style.left = `${x}px`
    heart.style.top = `${y}px`
    heart.style.fontSize = '20px'
    heart.style.pointerEvents = 'none'
    heart.style.zIndex = '9999'
    heart.style.transform = 'translate(-50%, -50%)'
    heart.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    heart.style.opacity = '0'

    document.body.appendChild(heart)

    // Trigger animation
    setTimeout(() => {
      const angle = (i / burstCount) * 2 * Math.PI
      const distance = 100 + Math.random() * 50
      const endX = x + Math.cos(angle) * distance
      const endY = y + Math.sin(angle) * distance - 50

      heart.style.opacity = '1'
      heart.style.transform = `translate(${endX - x}px, ${endY - y}px) scale(1.5)`
    }, 10)

    // Remove heart after animation
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart)
      }
    }, 1000)
  }
}

// Success checkmark animation
export const createSuccessAnimation = (x, y) => {
  const checkmark = document.createElement('div')
  checkmark.innerHTML = `
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="30" fill="#22c55e"/>
      <path d="M20 30L27 37L40 24" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
  checkmark.style.position = 'fixed'
  checkmark.style.left = `${x}px`
  checkmark.style.top = `${y}px`
  checkmark.style.transform = 'translate(-50%, -50%) scale(0)'
  checkmark.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  checkmark.style.pointerEvents = 'none'
  checkmark.style.zIndex = '9999'

  document.body.appendChild(checkmark)

  // Trigger animation
  setTimeout(() => {
    checkmark.style.transform = 'translate(-50%, -50%) scale(1)'
  }, 10)

  // Remove after animation
  setTimeout(() => {
    checkmark.style.transform = 'translate(-50%, -50%) scale(0)'
    setTimeout(() => {
      if (checkmark.parentNode) {
        checkmark.parentNode.removeChild(checkmark)
      }
    }, 500)
  }, 1500)
}