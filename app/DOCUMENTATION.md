# Onboarding Page Documentation

## Page Route: `/`

## Purpose
The onboarding page is the entry point of the application. Its sole purpose is to capture the user's **interest** (Football, Minecraft, K-Pop, or Space), which will be used throughout the app to personalize math content.

## UI Components
- **Header**: Welcome message with app branding
- **Interest Grid**: 4 clickable cards displaying interest options
- **Start Button**: Disabled until an interest is selected

## System Logic

### 1. Interest Selection
When a user clicks an interest card:
```typescript
setSelected(interest) // Local state for UI feedback
```

### 2. Persistence
When the user clicks "Start Learning":
```typescript
setUserInterest(selected) // Saves to GlobalContext
// GlobalContext automatically persists to localStorage
router.push('/dashboard') // Navigate to dashboard
```

### 3. State Flow
```
User clicks interest → Local state updates (UI turns blue)
↓
User clicks "Start" → Global context updated
↓
Data saved to localStorage (key: 'oqu_user_progress')
↓
Navigate to /dashboard
```

## Data Persistence
- **Storage Key**: `oqu_user_progress`
- **Storage Method**: localStorage (automatic via GlobalProvider)
- **Data Structure**: 
  ```json
  {
    "interest": "Football",
    "scores": {}
  }
  ```

## Component Dependencies
- `InterestCard`: Reusable component for each interest option
- `GlobalProvider`: Context provider for state management
- `useRouter`: Next.js navigation

## User Experience Notes
- The "Start" button is disabled until an interest is selected
- Selected card has blue background and checkmark indicator
- Hover effects provide visual feedback
- Smooth transitions enhance the premium feel
