# Match Upload Feature - Complete Implementation Guide

## Overview

The Match Upload feature is a comprehensive system for managing team lineups, match videos, goals tracking, and AI-powered performance analysis. This feature enables clubs to organize upcoming matches, notify players, upload match footage, and receive detailed performance insights.

---

## Feature Components

### 1. Team Lineup Upload System

#### User Flow
1. **Access**: Navigate to `/matches` in the application
2. **Create Lineup**: Click "Create Lineup" button
3. **Match Details**:
   - Select match date using date picker
   - Choose league/competition from dropdown
   - Search and select opponent club
   - Enter venue location

4. **Formation Selection**:
   - Choose from 6 tactical formations:
     - 4-4-2 (Classic)
     - 4-3-3 (Attacking)
     - 4-2-3-1 (Balanced)
     - 3-5-2 (Wing-focused)
     - 5-3-2 (Defensive)
     - 3-4-3 (Ultra attacking)

5. **Player Selection**:
   - View all available squad players
   - Click players to add/remove from lineup
   - See jersey numbers and positions
   - Real-time formation visual preview
   - Maximum 11 players per formation

6. **Save & Notify**:
   - Click "Save Lineup & Notify Players"
   - Automatic player notifications sent
   - Lineup locked and ready for video upload

#### Visual Formation Display
- Interactive pitch visualization
- Player positions shown with jersey numbers
- Color-coded player markers (blue for selected, gray for empty)
- Hover to see player names
- Real-time counter showing selected players (e.g., "8/11")

---

### 2. Player Notification System

#### Automatic Notifications
When a player is added to a match lineup, they automatically receive:

**Notification Content:**
- **Title**: "Match Lineup Confirmed"
- **Message**: Details including:
  - Opponent name
  - Match date
  - Assigned position
  - Jersey number

**Database Trigger:**
```sql
CREATE TRIGGER trigger_notify_player_lineup
  BEFORE INSERT ON match_lineup_players
  FOR EACH ROW
  EXECUTE FUNCTION notify_player_on_lineup_addition();
```

**Player Access:**
- Players see notifications in their dashboard
- Unread notifications highlighted
- Mark as read functionality
- Full notification history

---

### 3. Match Video Upload

#### Process Flow
1. **Prerequisites**: Lineup must be saved first
2. **Access**: Click "Upload Match Video" card
3. **File Selection**:
   - Supported formats: MP4, MOV, AVI
   - Maximum size: 2GB
   - Drag & drop or browse
4. **Upload**: Video processed for AI analysis
5. **Status Tracking**:
   - Pending → Processing → Analyzed

---

### 4. Recent Matches Dashboard

#### Display Information
Each match card shows:
- **Header**:
  - Match title (vs Opponent)
  - Date, venue, competition
- **Score**: Large display of final result
- **Status Badge**:
  - Blue: "Uploaded"
  - Yellow: "Processing"
  - Green: "Analyzed"
  - Red: "Failed"
- **Actions**:
  - "View" button to see detailed analysis

---

### 5. Detailed Match View (AI Analysis)

#### Three Collapsible Sections:

##### A. Match Overview
- **Final Score Display**
  - Large, prominent score
  - Result classification (Victory/Defeat/Draw)
  - Color-coded outcome

- **Match Information**
  - Teams, venue, competition
  - Match date and status

- **Goals Timeline**
  - Minute by minute breakdown
  - Scorer and assist information
  - Goal type indicators (penalty, free kick, header, etc.)

##### B. AI Performance Insights
Categorized recommendations:

**Insight Types:**
1. **Strengths** (Green icon)
   - Successful tactical implementations
   - Player excellence areas
   - Team performance highlights

2. **Weaknesses** (Red icon)
   - Defensive vulnerabilities
   - Tactical failures
   - Areas needing improvement

3. **Recommendations** (Blue icon)
   - Tactical adjustments
   - Formation suggestions
   - Strategic improvements

**Impact Levels:**
- High (Red badge): Critical issues
- Medium (Yellow badge): Important improvements
- Low (Green badge): Minor optimizations

##### C. Player Performance Analysis

**Individual Player Cards:**
- **Rating**: 0-10 scale, color-coded
  - 8.0+: Green (Excellent)
  - 6.0-7.9: Yellow (Good)
  - <6.0: Red (Needs improvement)

- **Strengths Section**:
  - Bullet-pointed list
  - Specific performance highlights
  - Quantified achievements

- **Improvements Section**:
  - Areas for development
  - Tactical positioning notes
  - Skill development suggestions

---

## Database Schema

### New Tables Created

#### 1. `match_lineups`
Stores formation and lineup configuration per match.

```sql
CREATE TABLE match_lineups (
  id uuid PRIMARY KEY,
  match_id uuid REFERENCES matches(id),
  formation text DEFAULT '4-4-2',
  lineup_saved_at timestamptz,
  created_by uuid REFERENCES profiles(id)
);
```

#### 2. `match_lineup_players`
Individual player assignments in lineup.

```sql
CREATE TABLE match_lineup_players (
  id uuid PRIMARY KEY,
  lineup_id uuid REFERENCES match_lineups(id),
  player_id uuid REFERENCES players(id),
  jersey_number integer,
  position_in_formation text,
  position_x integer, -- Visual X coordinate
  position_y integer, -- Visual Y coordinate
  is_starting boolean DEFAULT true,
  notified boolean DEFAULT false,
  notified_at timestamptz
);
```

#### 3. `match_goals`
Detailed goal tracking with timestamps.

```sql
CREATE TABLE match_goals (
  id uuid PRIMARY KEY,
  match_id uuid REFERENCES matches(id),
  player_id uuid REFERENCES players(id),
  assist_player_id uuid REFERENCES players(id),
  minute integer CHECK (minute BETWEEN 1 AND 120),
  goal_type text, -- normal, penalty, own_goal, free_kick, header, volley
  is_home_goal boolean,
  video_timestamp_seconds integer
);
```

#### 4. `player_notifications`
Notification delivery system.

```sql
CREATE TABLE player_notifications (
  id uuid PRIMARY KEY,
  player_id uuid REFERENCES players(id),
  match_id uuid REFERENCES matches(id),
  notification_type text,
  title text,
  message text,
  read boolean DEFAULT false,
  sent_at timestamptz
);
```

### Database Views

#### `match_lineup_details`
Combines lineup, match, and player information for easy querying:
```sql
SELECT * FROM match_lineup_details
WHERE match_id = 'xxx';
```

#### `match_goals_details`
Shows goals with scorer and assist names:
```sql
SELECT * FROM match_goals_details
WHERE match_id = 'xxx'
ORDER BY minute;
```

---

## Security (Row Level Security)

### Access Control Policies

#### Match Lineups
- ✅ Clubs can view/create/update their own match lineups
- ✅ Scouts can view all lineups (read-only)
- ❌ Players cannot create lineups

#### Player Notifications
- ✅ Players can view their own notifications
- ✅ Players can mark notifications as read
- ✅ Clubs can create notifications for their players
- ❌ Players cannot see other players' notifications

#### Match Goals
- ✅ Clubs can add/edit/delete goals for their matches
- ✅ Scouts can view goals (read-only)
- ❌ Unauthorized access prevented

---

## Component Architecture

### Created Files

#### 1. `FormationVisual.tsx`
**Location**: `/src/components/FormationVisual.tsx`

**Purpose**: Visual pitch representation with player positions

**Props**:
```typescript
interface FormationVisualProps {
  formation: string;         // e.g., "4-4-2"
  players: Player[];         // Array of selected players
  onPlayerClick?: (player: Player) => void;
  editable?: boolean;        // Allow interactions
}
```

**Features**:
- 6 pre-configured formations
- Pitch markings (goal boxes, center circle)
- Jersey number display
- Player name on hover
- Selection counter

#### 2. `MatchDetailsModal.tsx`
**Location**: `/src/components/modals/MatchDetailsModal.tsx`

**Purpose**: Comprehensive match analysis view

**Props**:
```typescript
interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchDetails | null;
}
```

**Features**:
- Collapsible sections with animations
- AI insights categorization
- Player performance cards
- Goals timeline
- Color-coded ratings

#### 3. `MatchesUploadEnhanced.tsx`
**Location**: `/src/pages/MatchesUploadEnhanced.tsx`

**Purpose**: Main match management interface

**Key Functions**:
- `loadPlayers()`: Fetches club's player roster
- `loadMatches()`: Retrieves match history
- `handleSaveLineup()`: Saves lineup and triggers notifications
- `handleVideoUpload()`: Processes video files
- `handleViewMatch()`: Opens detailed analysis modal

---

## API Integration Points

### Required Supabase Queries

#### Load Club Players
```typescript
const { data: players } = await supabase
  .from('players')
  .select('id, first_name, last_name, position, jersey_number')
  .eq('current_club_id', clubId);
```

#### Create Match Lineup
```typescript
// 1. Insert match
const { data: match } = await supabase
  .from('matches')
  .insert({
    club_id: clubId,
    match_date: date,
    opponent_name: opponent,
    formation: formation
  })
  .select()
  .single();

// 2. Create lineup record
const { data: lineup } = await supabase
  .from('match_lineups')
  .insert({
    match_id: match.id,
    formation: formation,
    created_by: userId
  })
  .select()
  .single();

// 3. Add players (triggers notifications automatically)
const { error } = await supabase
  .from('match_lineup_players')
  .insert(lineupPlayers);
```

#### Fetch Match with Analysis
```typescript
const { data } = await supabase
  .from('matches')
  .select(`
    *,
    match_lineups (
      formation,
      match_lineup_players (
        player_id,
        jersey_number,
        position_in_formation
      )
    ),
    match_goals (
      minute,
      player_id,
      assist_player_id
    ),
    ai_analyses (
      analysis_type,
      key_strengths,
      areas_for_improvement
    )
  `)
  .eq('id', matchId)
  .single();
```

---

## User Experience Flow Diagram

```
┌─────────────────────────────────────────────────┐
│         Club Manager Dashboard                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│      Navigate to Match Management               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  STEP 1: Create Team Lineup                     │
│  ├─ Select Match Date                           │
│  ├─ Choose League/Competition                   │
│  ├─ Search Opponent Club                        │
│  ├─ Enter Venue                                 │
│  ├─ Select Formation (4-4-2, 4-3-3, etc.)       │
│  └─ Choose 11 Players from Squad                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Visual Formation Preview                       │
│  [Interactive pitch with player positions]      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Save Lineup & Notify Players                   │
│  [Database saves + automatic notifications]     │
└──────────────────┬──────────────────────────────┘
                   │
                   ├──────────────────────────────┐
                   │                              │
                   ▼                              ▼
    ┌──────────────────────────┐  ┌──────────────────────────┐
    │  STEP 2: Upload Video    │  │  Player Notifications    │
    │  (Optional)               │  │  Sent Automatically      │
    └──────────────────────────┘  └──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Match appears in Recent Matches                │
│  Status: Uploaded → Processing → Analyzed       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  STEP 3: View Detailed Analysis                 │
│  ├─ Match Overview (Score, Goals)               │
│  ├─ AI Insights (Strengths, Weaknesses)         │
│  └─ Player Performance (Ratings, Suggestions)   │
└─────────────────────────────────────────────────┘
```

---

## Technical Implementation Notes

### Performance Optimizations
1. **Database Indexes**: Created on all foreign keys
2. **Composite Indexes**: For common query patterns
3. **RLS Policies**: Optimized with `EXISTS` clauses
4. **Views**: Pre-computed joins for complex queries

### Error Handling
- Form validation before submission
- Database transaction rollback on errors
- User-friendly error messages
- Console logging for debugging

### State Management
- React hooks for local state
- Supabase for persistent data
- Real-time updates supported (can be enabled)
- Loading states for async operations

---

## Future Enhancements

### Potential Additions
1. **Video Storage**: Integration with Supabase Storage
2. **Real-time Updates**: Live match status updates
3. **Advanced Analytics**:
   - Heat maps
   - Pass completion diagrams
   - Shot maps
4. **Player Substitutions**: Track in-game changes
5. **Match Reports**: PDF export functionality
6. **Historical Comparisons**: Compare performances across matches
7. **Team Statistics**: Aggregated season analytics
8. **Formation Builder**: Custom formation creator
9. **Injury Tracking**: Link to player availability
10. **Calendar Integration**: Match schedule management

---

## Testing Scenarios

### Test Case 1: Create Complete Lineup
1. Navigate to `/matches`
2. Click "Create Lineup"
3. Fill all match details
4. Select 4-4-2 formation
5. Add 11 players
6. Verify visual preview updates
7. Save lineup
8. Check database for:
   - Match record created
   - Lineup record created
   - 11 lineup_player records
   - 11 player_notification records

### Test Case 2: Player Notification Delivery
1. Create lineup with Player A
2. Log in as Player A
3. Navigate to notifications
4. Verify notification exists with:
   - Correct match details
   - Position assignment
   - Jersey number

### Test Case 3: Match Detail View
1. Create match with goals
2. Mark as "analyzed"
3. Click "View" on match
4. Verify all sections display:
   - Overview with score
   - AI insights (if analyzed)
   - Player performances (if analyzed)

### Test Case 4: Formation Switching
1. Start creating lineup
2. Select 4-4-2, add 8 players
3. Switch to 3-5-2
4. Verify players cleared
5. Add 11 new players
6. Verify visual updates correctly

---

## Deployment Checklist

- [x] Database migration applied
- [x] RLS policies enabled and tested
- [x] Component files created
- [x] App.tsx updated with new route
- [x] Build successful
- [x] No TypeScript errors
- [x] Responsive design tested
- [ ] User acceptance testing
- [ ] Performance monitoring setup
- [ ] Analytics tracking configured

---

## Support & Troubleshooting

### Common Issues

**Issue**: Players not showing in lineup selector
- **Solution**: Verify players have `current_club_id` set to club's ID

**Issue**: Notifications not sending
- **Solution**: Check database trigger is enabled:
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_notify_player_lineup';
  ```

**Issue**: Formation visual not displaying correctly
- **Solution**: Verify formation string matches one of: 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 3-4-3

**Issue**: Can't save lineup
- **Solution**: Check all required fields filled and at least 1 player selected

---

## Conclusion

The Match Upload feature provides clubs with a professional-grade system for managing match lineups, player notifications, video uploads, and performance analysis. The system is built with security, performance, and user experience as top priorities.

For additional support or feature requests, contact the development team.
