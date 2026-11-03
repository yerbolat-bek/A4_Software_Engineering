# Smart Campus Room Availability Checker

A small web app that checks if a room is free for a time slot.
It uses fictional data only. There is no login, no payment, no API and no database.

## Requirements
- Node.js 18 or newer
- npm

## Setup
```
npm install
```

## Run
```
npm run dev
```
Open the address shown in the terminal (usually http://localhost:5173).

## Test and check
```
npm test             # 39 automated tests (Vitest)
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run build        # production build
```

## How to use
1. Optional: enter the number of attendees and choose required equipment.
2. Choose a room from the list.
3. Enter start and end time in minutes after midnight (540 = 9:00 AM).
4. Press "Check Availability".

The fixed current time is 540 (9:00 AM). Maximum booking length is 120 minutes.

## Project structure
```
src/
  App.tsx
  components/
    RoomChecker.tsx    state and layout
    RoomFilters.tsx    attendees and equipment filters
    RoomSelector.tsx   room list and empty state
    TimeInput.tsx      start/end time input
    ResultPanel.tsx    result message
    Timeline.tsx       24-hour bar
  lib/
    constants.ts       shared numbers
    rooms.ts           room type, fictional rooms, adapter
    availability.ts    booking rules and formatting
    filterRooms.ts     capacity and equipment filter
```

## Versions
- Initial version: tag `v0-initial` (commit d27f1d2)
- Final version: branch `main`

## Note about numbering
The assignment says AC5 = booking data is not changed. An old code comment says "AC5: Available".
The tests use the numbering from the assignment.
