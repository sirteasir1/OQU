# Result Page Documentation

## Page Route: `/lesson/[id]/result`

## Purpose
Display quiz results, save score to global state, and trigger the **Revision Mechanic** if the user scored poorly.

## URL Parameters
- `[id]`: Topic ID
- **Query Params**:
  - `score`: Number of correct answers
  - `total`: Total number of questions

Example: `/lesson/g7-linear-eq/result?score=1&total=3`

## UI Components
1. **Score Circle**: Large visual display of percentage
2. **Result Message**: Contextual feedback based on score
3. **Revision Warning**: Special alert if score < 50%
4. **Action Buttons**: Return to dashboard or review lesson

## System Logic

### 1. Score Persistence (CRITICAL)
On page mount:
```typescript
useEffect(() => {
  saveTopicScore(topicId, percentage);
}, []);
```

**What happens in GlobalContext:**
```typescript
saveTopicScore(topicId, percentage) {
  scores[topicId] = {
    score: percentage,
    attempts: existingAttempts + 1,
    lastAttempt: new Date()
  }
  // Auto-saves to localStorage
}
```

This single function call triggers the entire **Dashboard Badge Update** chain.

### 2. The "Revision" Logic

**Decision Tree:**
```
Calculate percentage from URL params
↓
percentage >= 80? → "Mastery Achieved!" (Green message)
↓
percentage >= 50? → "Good Progress!" (Yellow message)
↓
percentage < 50? → "Needs Revision" (Red message + Warning Box)
```

**When score < 50%:**
1. Display red message: "Your knowledge of this topic is shaky"
2. Show pulsing warning box: "Marked for revision"
3. Save score triggers `getBadgeState` update
4. **Dashboard will now show RED pulsing badge** for this topic

### 3. Message Customization

Each score range has:
- **Emoji**: Visual reinforcement (🎉 / 👍 / 📚)
- **Title**: Clear verdict
- **Message**: Actionable feedback
- **Color scheme**: Matches badge colors

```typescript
{
  emoji: '📚',
  title: 'Needs Revision',
  message: 'Your knowledge of this topic is shaky. We have marked this for Revision. Please review the lesson carefully and try again.',
  color: 'text-red-600',
  bgColor: 'bg-red-50'
}
```

### 4. The Complete Flow

```
Quiz finishes → Navigate to /result with score in URL
↓
Result page mounts
↓
Parse score from URL (e.g., 1/3 = 33%)
↓
Call saveTopicScore(topicId, 33)
↓
GlobalContext updates scores object
↓
localStorage saves new data
↓
Display result message based on 33%
↓
Show "Needs Revision" warning (score < 50)
↓
User returns to Dashboard
↓
Dashboard checks getBadgeState(topicId)
↓
getBadgeState sees: score = 33, attempts = 1
↓
Returns 'needs-revision'
↓
TopicCard renders RED pulsing badge "⚠ 33% - Revise!"
```

## Data Flow
```
URL params: score=1, total=3
↓
Calculate: percentage = 33%
↓
Save to GlobalContext:
{
  scores: {
    'g7-linear-eq': {
      score: 33,
      attempts: 1,
      lastAttempt: Date
    }
  }
}
↓
Auto-save to localStorage
↓
Dashboard updates via context
```

## Component Dependencies
- `ScoreCircle`: Visual score display
- `GlobalProvider`: `saveTopicScore` function
- `getTopicById`: Get topic metadata

## User Experience Notes
- **Immediate feedback**: Score saved on page load
- **Visual hierarchy**: Score circle draws attention first
- **Contextual messaging**: Different messages for different scores
- **Clear next steps**: Buttons for dashboard or lesson review
- **Revision awareness**: Warning box ensures user understands status

## Why This Matters
This page is the **bridge between quiz and dashboard**. The score saved here:
1. Updates the user's progress record
2. Triggers badge color changes
3. Powers the revision reminder system
4. Provides data for future analytics

Without this page, the entire "Quality" criterion (personalized revision tracking) fails.
