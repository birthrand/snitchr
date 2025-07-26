# 🚀 Snitchr - Supabase Backend Integration Guide

## Overview

Snitchr now uses **Supabase** as its backend, providing real-time features, cloud storage, and enhanced analytics. This guide covers the complete setup and integration.

## 🏗️ Database Schema

### Tables Overview

The Supabase database includes the following tables:

#### 1. `confessions` - Main Confessions Table
```sql
CREATE TABLE confessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT,
  message TEXT NOT NULL,
  mood JSONB,
  location JSONB,
  reactions JSONB DEFAULT '{"heart": 0, "laugh": 0, "think": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Fields:**
- `id`: Unique UUID for each confession
- `nickname`: Optional user nickname (can be null for complete anonymity)
- `message`: The confession text (required)
- `mood`: JSON object containing mood emoji and name
- `location`: JSON object with latitude/longitude coordinates
- `reactions`: JSON object tracking reaction counts and user reactions
- `created_at`: Timestamp when confession was created
- `updated_at`: Timestamp when confession was last updated

#### 2. `user_sessions` - Anonymous User Sessions
```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);
```

**Fields:**
- `id`: Unique UUID for session
- `session_token`: Anonymous session identifier
- `nickname`: Optional nickname for the session
- `created_at`: Session creation timestamp
- `last_active`: Last activity timestamp

#### 3. `analytics` - App Analytics & Events
```sql
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Fields:**
- `id`: Unique UUID for analytics event
- `event_type`: Type of event (e.g., 'confession_created', 'reaction_added')
- `event_data`: JSON object with event-specific data
- `user_agent`: Browser/device information
- `ip_address`: Client IP address (for analytics)
- `created_at`: Event timestamp

## 🔐 Row Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### Confessions Table Policies
```sql
-- Allow public read access
CREATE POLICY "Allow public read access to confessions" ON confessions
FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access to confessions" ON confessions
FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access to confessions" ON confessions
FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access to confessions" ON confessions
FOR DELETE USING (true);
```

### User Sessions Table Policies
```sql
-- Allow public read access to own sessions
CREATE POLICY "Allow public read access to user_sessions" ON user_sessions
FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access to user_sessions" ON user_sessions
FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access to user_sessions" ON user_sessions
FOR UPDATE USING (true);
```

### Analytics Table Policies
```sql
-- Allow public insert access for analytics
CREATE POLICY "Allow public insert access to analytics" ON analytics
FOR INSERT WITH CHECK (true);
```

## 🔧 Supabase Configuration

### Project Setup
1. Create a new Supabase project
2. Note down your project URL and anon key
3. Create a `.env.local` file in your project root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Add `.env.local` to your `.gitignore` file
5. For production, set these environment variables in your hosting platform

### API Keys
- **NEVER** commit API keys to version control
- **NEVER** expose service role key in frontend code
- Use environment variables for all sensitive credentials
- Rotate keys regularly for security

## 📱 Frontend Integration

### Supabase Client Setup
The app uses a custom Supabase client configuration in `src/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### API Functions

#### Confession API
- `getConfessions(page, limit)` - Get paginated confessions
- `searchConfessions(searchTerm, page, limit)` - Search confessions
- `getConfessionsByFilter(filterType, page, limit)` - Filter confessions
- `createConfession(confession)` - Create new confession
- `updateReactions(confessionId, reactions)` - Update reactions
- `deleteConfession(confessionId)` - Delete confession
- `getConfessionById(confessionId)` - Get specific confession

#### Analytics API
- `trackEvent(eventType, eventData)` - Track custom events
- `trackConfessionCreated(confessionId)` - Track confession creation
- `trackReaction(confessionId, reactionType)` - Track reactions
- `trackAppUsage(action)` - Track app usage

#### Session API
- `createSession(sessionToken, nickname)` - Create/update session
- `getSession(sessionToken)` - Get session data
- `updateSessionActivity(sessionToken)` - Update last active

#### Real-time API
- `subscribeToNewConfessions(callback)` - Listen for new confessions
- `subscribeToConfessionUpdates(callback)` - Listen for updates
- `subscribeToConfessionDeletions(callback)` - Listen for deletions

### Custom Hook
The app uses `useConfessions()` hook for state management:

```javascript
const {
  confessions,
  loading,
  error,
  hasMore,
  loadMore,
  refresh,
  addConfession,
  updateReactions,
  deleteConfession
} = useConfessions()
```

## 🔄 Real-time Features

### Live Updates
- **New Confessions**: Automatically appear in real-time
- **Reaction Updates**: Reactions sync across all clients
- **Confession Deletions**: Removed confessions disappear instantly

### Subscription Channels
- `new_confessions` - New confession events
- `confession_updates` - Confession update events
- `confession_deletions` - Confession deletion events

## 📊 Analytics & Insights

### Tracked Events
- `app_launched` - App startup
- `confession_created` - New confession posted
- `confession_deleted` - Confession removed
- `reaction_added` - User reacted to confession
- `confessions_loaded` - Confessions fetched
- `confessions_refreshed` - Pull-to-refresh
- `screen_changed_to_*` - Navigation events
- `theme_changed_to_*` - Theme toggle events

### Analytics Data
- User agent information
- IP address (for analytics only)
- Event timestamps
- Custom event data

## 🚀 Performance Features

### Pagination
- 20 confessions per page
- Infinite scroll loading
- Optimized database queries

### Caching
- Local state management
- Optimistic updates
- Background refresh

### Offline Support
- Local storage fallback
- Queue system for offline actions
- Sync when connection restored

## 🔒 Privacy & Security

### Anonymous Design
- No user accounts required
- Optional nicknames
- Session-based tracking only

### Data Protection
- Row Level Security enabled
- Public read/write access for confessions
- IP addresses only for analytics
- No personal data collection

### GDPR Compliance
- No persistent user identification
- Anonymous session tokens
- Easy data deletion
- Transparent data usage

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI (optional)

### Installation
```bash
# Install dependencies
npm install

# Install Supabase client
npm install @supabase/supabase-js

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# NEVER commit this file to version control!

# Start development server
npm run dev
```

### Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📈 Monitoring & Maintenance

### Database Monitoring
- Monitor table sizes and growth
- Check query performance
- Review analytics data

### Real-time Monitoring
- Monitor subscription connections
- Check real-time event throughput
- Review error logs

### Backup Strategy
- Automatic daily backups
- Point-in-time recovery
- Data export capabilities

## 🔮 Future Enhancements

### Planned Features
- User accounts (optional)
- Cross-device sync
- Advanced analytics dashboard
- Moderation tools
- Content filtering
- Rate limiting
- Advanced search filters

### Scalability
- Database optimization
- CDN integration
- Edge function deployment
- Advanced caching strategies

## 📞 Support

For issues or questions:
1. Check the Supabase dashboard
2. Review database logs
3. Monitor real-time connections
4. Check analytics data

---

**Snitchr** - Anonymous confessions with real-time features powered by Supabase! 🎉