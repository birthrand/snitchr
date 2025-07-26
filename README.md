# Snitchr - Anonymous Confessions Platform

A mobile-first anonymous confession web app built with React, Vite, and Tailwind CSS. Share your thoughts anonymously with location-based feeds, emoji reactions, and a beautiful dark mode interface.

## ✨ Features

- **🔒 Complete Anonymity**: No accounts required, optional nicknames
- **📱 Mobile-First Design**: Optimized for one-handed mobile use
- **🌙 Dark Mode**: Beautiful dark/light theme with system preference detection
- **📍 Location-Based**: Optional geolocation tagging for confessions
- **😊 Emoji Reactions**: React with ❤️ 😂 🤔 on confessions
- **🎨 Mood Picker**: Select your mood when sharing confessions
- **💾 Local Storage**: All data stays on your device
- **📱 PWA Ready**: Install as a native app
- **♿ Accessible**: WCAG compliant with keyboard navigation
- **🎭 Smooth Animations**: Delightful micro-interactions

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **PWA** - Progressive Web App support
- **Geolocation API** - Location detection
- **LocalStorage** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/birthrand/snitchr.git
cd snitchr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage

### Sharing a Confession
1. Tap the "+" button or "Add" button
2. Write your confession (max 280 characters)
3. Optionally select a mood emoji
4. Optionally add a nickname (or stay completely anonymous)
5. Allow location access for location tagging
6. Tap "Post Confession"

### Interacting with Confessions
- **React**: Tap the emoji buttons (❤️ 😂 🤔) to react
- **Delete**: Tap the trash icon to delete your own confessions
- **Location**: See where confessions were shared from

### Dark Mode
- Toggle between light and dark themes using the moon/sun button
- Automatically respects your system preference

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (`#0ea5e9`)
- **Secondary**: Magenta (`#d946ef`)
- **Neutral**: Comprehensive gray scale
- **Status**: Success (green), Warning (yellow), Error (red)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Touch Targets**: 44px minimum
- **Card Padding**: 20px
- **Section Spacing**: 24px

## 🔒 Privacy & Security

- **No User Accounts**: Complete anonymity
- **Local Storage**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **Optional Location**: Location data never leaves your device
- **Self-Moderation**: Users control their own content

## 📱 Mobile Optimization

- **One-Handed Use**: All interactions accessible with thumb
- **Touch Targets**: 44px minimum for all buttons
- **Gesture Support**: Swipe and tap interactions
- **Safe Areas**: Respects device notches and home indicators
- **Responsive Design**: Works on all screen sizes

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: High contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Focus Indicators**: Clear focus states
- **Reduced Motion**: Respects user preferences

## 🎭 Animations

- **Fade In Up**: Card entrance animations
- **Slide In Right**: Screen transitions
- **Hover Effects**: Subtle card interactions
- **Button Press**: Tactile feedback
- **Loading States**: Smooth loading indicators

## 📁 Project Structure

```
snitchr/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── vite.svg              # App icon
├── src/
│   ├── components/
│   │   ├── AddConfession.jsx  # Confession form
│   │   ├── DarkModeToggle.jsx # Theme switcher
│   │   ├── EmojiPicker.jsx    # Mood selector
│   │   ├── Home.jsx          # Main feed
│   │   └── ReactionButton.jsx # Emoji reactions
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # React entry point
├── index.html                # HTML template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### GitHub Pages
1. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
2. Run: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Inter Font** - For the beautiful typography

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for anonymous expression