# Dashboard Page Documentation

## Page Route: `/dashboard`

## Purpose
The dashboard is the central hub where users select topics to learn. It displays all available topics organized by grade, with **visual badges** indicating progress status.

## UI Components
1. **Header**: Shows app title and current interest
2. **Grade Selector**: Horizontal tabs for grades 7-11
3. **Topic List**: Vertical list of topic cards with badges

## System Logic

### 1. Badge State Calculation
The dashboard implements the **core "Score %" feature** through conditional rendering:

```typescript
const badgeState = getBadgeState(topic.id);
```

**Badge Logic (from GlobalContext):**
```typescript
// State A: No attempt yet
if (!scoreData || scoreData.score === null) {
  return 'not-started'; // Grey badge: "Not Started"
}

// State B: High score
if (scoreData.score >= 80) {
  return 'mastered'; // Green badge: "✓ 90%"
}

// State C: Low score - REVISION WARNING
if (scoreData.score < 50 && scoreData.attempts > 0) {
  return 'needs-revision'; // Red badge: "⚠ 40% - Revise!" (pulsing)
}
```

### 2. Topic Card Rendering
Each `TopicCard` receives:
- `title` & `description`: From mock data
- `badgeState`: Determines badge color and text
- `score`: Actual percentage (null if not started)
- `onClick`: Navigates to `/lesson/[topicId]`

### 3. Data Flow
```
Dashboard loads
↓
For each topic: Check GlobalContext for saved score
↓
Calculate badge state based on score rules
↓
Render appropriate badge (Grey/Green/Red)
↓
User clicks topic → Navigate to lesson
```

### 4. The "Revise!" Reminder
**Critical Feature**: When a user scores < 50% on a topic:
1. The `saveTopicScore` function marks `attempts > 0`
2. Dashboard re-renders (via context update)
3. `getBadgeState` returns `'needs-revision'`
4. TopicCard shows **RED pulsing badge** with "Revise!" text

This is the **personalized learning loop** - the system reminds users which topics need more practice.

## Component Dependencies
- `TopicCard`: Displays each topic with badge
- `GlobalProvider`: Provides `getBadgeState` and `getTopicScore`
- `getTopicsByGrade`: Fetches topic list from mock data

## State Management
- **Local State**: `selectedGrade` (which grade tab is active)
- **Global State**: 
  - `userInterest`: Display in header
  - `scores`: Used to determine badge states

## User Experience Notes
- Badge colors provide instant visual feedback on progress
- Pulsing animation on "Revise!" creates urgency
- Clean, scannable layout for quick topic selection
- Responsive grade selector (horizontal scroll on mobile)
