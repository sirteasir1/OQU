# Quiz Page Documentation

## Page Route: `/lesson/[id]/quiz`

## Purpose
Interactive quiz component that tests user knowledge with **Socratic feedback** - when users select wrong answers, a modal explains why their choice was incorrect, helping them learn from mistakes.

## URL Parameters
- `[id]`: Topic ID (e.g., `g7-linear-eq`)

## UI Components
1. **Header**: Progress bar, question counter, score tracker
2. **Question Card**: Displays current question with options
3. **Feedback Modal**: (Managed by QuizQuestion component)

## System Logic

### 1. Quiz Data Loading
```typescript
const quizData = await fetchMockQuiz(topicId);
```

Fetches quiz from `QUIZ_DATABASE`:
```typescript
{
  topicId: 'g7-linear-eq',
  questions: [
    {
      question: 'Solve for x: 2x + 5 = 13',
      correctAnswer: 'opt-b',
      options: [
        { id: 'opt-a', text: 'x = 9', errorFeedback: '...' },
        { id: 'opt-b', text: 'x = 4' }, // No feedback = correct
        { id: 'opt-c', text: 'x = 6.5', errorFeedback: '...' },
        { id: 'opt-d', text: 'x = 3', errorFeedback: '...' }
      ]
    }
  ]
}
```

### 2. Question State Machine (CRITICAL LOGIC)

**State Flow in QuizQuestion Component:**

```
IDLE STATE
User can click any option
↓
USER CLICKS OPTION
↓
Is it correct? → YES                   → NO
↓                                      ↓
Button turns GREEN                     Button turns RED
+ Checkmark appears                    + X mark appears
↓                                      ↓
Wait 800ms                             Show FEEDBACK MODAL
↓                                      ↓
Call onCorrect() callback              Modal displays errorFeedback
↓                                      ↓
Quiz page: increment score             User reads explanation
Quiz page: move to next question       ↓
                                       User clicks "Try Again"
                                       ↓
                                       Modal closes
                                       ↓
                                       Reset to IDLE (can try again)
```

### 3. The "Socratic Feedback" Mechanic

**What makes this "Socratic"?**
- Instead of just marking wrong, the system EXPLAINS THE ERROR
- Feedback stored in `errorFeedback` field of each option

**Example:**
```typescript
{
  text: 'x = 9',
  errorFeedback: 'You added 5 to 13 instead of subtracting it. Remember: to isolate x, do the OPPOSITE operation. Since we have +5, we subtract 5 from both sides.'
}
```

**Why this works:**
1. **Identifies the mistake**: "You added..."
2. **Explains the correct method**: "do the OPPOSITE operation"
3. **Shows the right step**: "subtract 5 from both sides"

This is personalized tutoring, not just "Wrong! Try again."

### 4. Score Tracking
```typescript
const [correctAnswers, setCorrectAnswers] = useState(0);

// When user gets question right:
handleCorrect() {
  setCorrectAnswers(prev => prev + 1);
  // Move to next question or finish
}
```

### 5. Quiz Completion
When on last question AND user answers correctly:
```typescript
router.push(`/lesson/${topicId}/result?score=${correctAnswers + 1}&total=${quiz.questions.length}`);
```

Passes score via URL params to result page.

## Data Flow
```
Quiz loads → Fetch questions from mock database
↓
Display question 1 with 4 options
↓
User clicks option
↓
Correct? → Green + Next question
Wrong?   → Red + Modal with explanation → User tries again
↓
Repeat until all questions answered
↓
Navigate to /result with score in URL
```

## Component Dependencies
- `QuizQuestion`: Handles individual question logic and feedback modal
- `fetchMockQuiz`: Retrieves quiz data with Socratic feedback

## User Experience Notes
- **No punishment for wrong answers**: Users can retry immediately
- **Learning-focused**: Feedback explains the "why" behind mistakes
- **Visual feedback**: Color-coded buttons (green/red)
- **Progress tracking**: Shows current question and correct count
- **Encouraging tone**: "Take your time" hint reduces pressure

## Critical Implementation Detail
The quiz does NOT move to the next question on wrong answer. User must:
1. Read the feedback
2. Close the modal
3. Try again

This ensures they actually learn from the mistake before proceeding.
