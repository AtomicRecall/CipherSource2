# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CipherSource2 is a CS2 (Counter-Strike 2) ESEA statistics and team analysis application built with Next.js 15. The app displays detailed team profiles, match statistics, league standings, and interactive charts for Counter-Strike teams competing in ESEA leagues.

**Key Features:**
- Team profile analysis with FACEIT API integration
- Interactive match statistics with pie charts (using Nivo)
- Season-based filtering for different ESEA leagues
- Real-time data fetching for team standings and match history
- Custom theming with HeroUI components

## Development Commands

### Core Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint and auto-fix code issues
npm run lint
```

### Package Management
```bash
# Install dependencies
npm install

# For pnpm users (add to .npmrc if using pnpm)
echo "public-hoist-pattern[]=*@heroui/*" >> .npmrc
```

## Architecture & Code Structure

### Core Application Flow
1. **Entry Point**: `app/page.tsx` - Main landing page with team profile interface
2. **Profile Loading**: `components/FuckWithProfile.tsx` - Main orchestrator component that:
   - Fetches team data via `FetchProfile.js`
   - Manages season selection and UI state
   - Coordinates match data retrieval
3. **Data Pipeline**: External API calls → `GetAllThatFuckingShit.js` → Statistics processing
4. **Visualization**: `components/CreateStatsPage.tsx` - Complex statistics rendering with multiple chart types

### Key Data Flow Pattern
```
URL Params → FuckWithProfile → FetchProfile (FACEIT API) → Season Selection → 
GetAllThatFuckingShit (Match Data) → CreateStatsPage (Charts & Analytics)
```

### Critical Components

**`FuckWithProfile.tsx`** - Main container component
- Handles all application state management
- Manages dynamic season/league selection
- Coordinates between data fetching and visualization
- Contains complex SessionStorage logic for UI state persistence

**`CreateStatsPage.tsx`** - Statistics engine
- Processes raw match data into categorized statistics
- Handles BO1/BO3/BO5 match type differentiation
- Generates pie chart data with win rates, ban patterns, map preferences
- Contains extensive global arrays for statistical calculations

**Data Fetching Layer** (JavaScript files in `/components/`)
- `FetchProfile.js` - Primary team data fetching with FACEIT API
- `GetAllThatFuckingShit.js` - Match history and statistics aggregation
- `FetchGameStats.js`, `FetchUpcomingMatches.js` - Specialized data fetchers

### API Integration
- **FACEIT API**: Team profiles, player data, team statistics
- **Custom Proxy**: `cipher-virid.vercel.app/api/TeamLeagueProxy` for league data
- **Authentication**: Uses hardcoded API key (consider environment variables for production)

### State Management Patterns
- Heavy use of `useState` and `useEffect` hooks
- SessionStorage for UI state persistence across interactions
- Complex array manipulation for statistical calculations
- Real-time data processing and chart generation

### Styling & UI Framework
- **HeroUI v2**: Primary component library with custom theme configuration
- **Tailwind CSS**: Utility-first styling with custom color palette
- **Custom Theme**: Orange/dark theme (`#FF6900`) with transparency effects
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### TypeScript Configuration
- Path aliases: `@/*` maps to project root
- Strict mode enabled with comprehensive type checking
- Next.js plugin integration for enhanced development experience

## Development Guidelines

### Code Organization
- Components use descriptive (sometimes unconventional) naming
- Heavy use of inline functions and complex data transformations
- Extensive console logging for debugging (consider removing in production)
- Mixed JavaScript/TypeScript usage (`.js` files for data fetching, `.tsx` for components)

### Data Processing Patterns
- Statistics calculations happen in real-time during component rendering
- Global arrays are reset on each render to ensure fresh calculations
- Complex nested data structures from FACEIT API require careful handling

### Performance Considerations
- Large datasets processed client-side
- Multiple API calls coordinated sequentially
- Consider memoization for expensive calculations
- React.memo used for CreateStatsPage component

### API Key Management
- Currently uses hardcoded API key in `FetchProfile.js`
- **Important**: Move to environment variables before deployment

## Working with This Codebase

### Adding New Statistics
1. Extend global arrays in `CreateStatsPage.tsx`
2. Add data processing logic in the main statistics loop
3. Create new `PieChartWithLegend` instances for visualization
4. Update the reset function to include new arrays

### Modifying Data Sources
- Primary data fetching occurs in `components/*.js` files
- FACEIT API responses follow consistent patterns
- Proxy endpoints may require updates for new data types

### UI/UX Changes
- HeroUI components provide consistent styling
- Custom Tailwind classes handle theme-specific styling
- Responsive breakpoints already configured in most components

### Debugging Tips
- Extensive console.log statements throughout the codebase
- React Developer Tools essential for state inspection
- Network tab crucial for API call debugging
- SessionStorage inspection for UI state issues

## Build Troubleshooting

### Common Build Issues

1. **ESLint/TypeScript Errors**: Build is configured to ignore lint and type errors during production builds (see `next.config.js`)

2. **useSearchParams Suspense Error**: Fixed by wrapping components using `useSearchParams()` in `<Suspense>` boundary

3. **Console Statement Warnings**: Console statements are disabled during linting in development but will error in production

4. **Missing Key Props**: React components in iterators require unique `key` props

### Build Configuration
- `next.config.js` configured to ignore build errors for development workflow
- ESLint configured to allow console statements in development
- TypeScript strict mode enabled but build errors ignored
- Suspense boundaries required for client-side search params

### Build Success
After fixing critical syntax errors and Suspense boundary issues, the build compiles successfully with static page generation.
