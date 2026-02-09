# Lesson Content Page Documentation

## Page Route: `/lesson/[id]`

## Purpose
Display personalized lesson content based on the user's selected interest. The content is broken into 3 cards (Metaphor → Theory → Example) that the user navigates through before taking the quiz.

## URL Parameters
- `[id]`: Topic ID (e.g., `g7-linear-eq`)

## UI Components
1. **Header**: Topic title, back button, progress bar
2. **Lesson Card**: Single card display with type badge and content
3. **Navigation**: Previous/Next buttons

## System Logic

### 1. Content Fetching
On page load:
```typescript
const content = await fetchMockLesson(topicId, userInterest);
```

**How Mock AI Works:**
- Checks `INTEREST_METAPHORS[interest][topicId]`
- Returns 3 pre-written cards tailored to that interest
- Simulates 2-second "AI processing" delay

Example: If user interest is "Football" and topic is "Linear Equations":
```typescript
{
  cards: [
    { type: 'metaphor', content: "Think of equations like a perfect pass..." },
    { type: 'theory', content: "Balance both sides like a game plan..." },
    { type: 'example', content: "If a striker scores 3 goals per match..." }
  ]
}
```

### 2. Card Navigation State Machine
```
State: currentCardIndex = 0 (Metaphor card)
↓
User clicks "Next" → currentCardIndex = 1 (Theory card)
↓
User clicks "Next" → currentCardIndex = 2 (Example card)
↓
User clicks "Next" → Navigate to /lesson/[id]/quiz
```

**Previous Button:**
- Disabled when `currentCardIndex === 0`
- Decrements index when clicked

**Next Button:**
- Shows "Next →" for cards 1-2
- Shows "Start Quiz →" on final card
- Triggers navigation to quiz after last card

### 3. Progress Tracking
Progress percentage calculated as:
```typescript
progress = ((currentCardIndex + 1) / totalCards) * 100
```

Displayed as:
- Visual progress bar (blue fill)
- Text: "Card 2 of 3"

### 4. Loading State
Before content loads:
- Display `LoadingSpinner` component
- Dynamic text: "Converting [Topic] into [Interest] terms..."
- Simulates AI generation process

### 5. Interest Validation
```typescript
if (!userInterest) {
  router.push('/'); // Redirect to onboarding
}
```

Ensures user has selected an interest before viewing personalized content.

## Data Flow
```
Page loads with topicId parameter
↓
Check if userInterest exists in GlobalContext
↓
Call fetchMockLesson(topicId, userInterest)
↓
2-second simulated delay (spinner shows)
↓
Receive 3 personalized cards
↓
Display first card (Metaphor)
↓
User navigates through cards
↓
After card 3 → Navigate to quiz
```

## Component Dependencies
- `LoadingSpinner`: Shows during content fetch
- `GlobalProvider`: Provides `userInterest`
- `getTopicById`: Gets topic metadata
- `fetchMockLesson`: Generates personalized content

## User Experience Notes
- Smooth transitions between cards
- Color-coded badges for card types (purple/blue/green)
- Progress bar provides visual feedback
- "Previous" button allows review
- Clear call-to-action on final card
