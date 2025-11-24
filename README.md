# Cipher Source 2 (CS2)

Cipher Source 2 is a web application for viewing Counter-Strike 2 (CS2) team profiles, statistics, and match information using the FACEIT API. It allows users to search for teams by name, FACEIT URL, or team ID, and provides detailed insights into team performance, rosters, and league standings.

## Technologies Used

- **Next.js 15** - React framework for server-side rendering and routing
- **HeroUI v2** - UI component library for React
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Typed JavaScript for better development experience
- **Framer Motion** - Animation library for React
- **Nivo** - Data visualization library (@nivo/bar, @nivo/core, @nivo/icicle, @nivo/pie)
- **ApexCharts** - Chart library for interactive visualizations
- **AG Grid** - Data grid component for tables
- **React Country Flag** - Component for displaying country flags
- **FACEIT API** - External API for CS2 team and match data

## How to Use

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

## Application Logic

Cipher Source 2 consists of two main parts:

1. **Search Interface** (`public/home.html`) - A static HTML page that allows users to search for CS2 teams
2. **Team Profile Viewer** - A Next.js application that displays detailed team information

### Search Flow

- Users enter a team name, FACEIT team URL, team ID, or match ID in the search box
- The application queries the FACEIT API to find matching teams
- If a match ID is provided, it extracts the participating team IDs from the match data
- Upon successful search, users are redirected to the team profile page

### Team Profile Display

- Team pages are dynamically generated using Next.js routing (`/[team_id]`)
- Each page fetches comprehensive team data from multiple sources:
  - Team basic info and roster from FACEIT API
  - Team statistics from FACEIT API
  - League standings from a custom proxy API

## File Structure and Functionality

### Root Level Configuration
- `package.json` - Project dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `tsconfig.json` - TypeScript configuration
- `next-env.d.ts` - Next.js TypeScript declarations

### App Directory (`app/`)
- `page.tsx` - Main page that redirects to `/home`
- `layout.tsx` - Root layout component
- `error.tsx` - Error boundary component
- `providers.tsx` - Context providers
- `[team_id]/page.tsx` - Dynamic route for team profile pages

### Components (`components/`)
- `CreateTeamProfile.tsx` - Main component for rendering team profiles, handles data fetching and layout
- `CreateStatsPage.tsx` - Displays team statistics with charts and graphs
- `CreateMatchNavbar.tsx` - Navigation component for match-related pages
- `CreateBarGraph.tsx`, `CreateIcicleGraph.tsx` - Chart components using Nivo
- `CreateTable.tsx` - Data table component using AG Grid
- `FetchProfile.js` - API client for fetching team profile data
- `FetchGameStats.js` - API client for fetching game statistics
- `FetchLatestUsername.js` - API client for fetching player username updates
- `FetchUpcomingMatches.js` - API client for fetching upcoming matches
- `FetchVetoInformation.js` - API client for fetching veto information
- `Flag.tsx` - Component for displaying country flags
- `ProfileCard.tsx` - Component for player profile cards
- Various skeleton components for loading states

### Configuration (`config/`)
- `api-keys.ts` - FACEIT API key configuration
- `fonts.ts` - Font configuration
- `site.ts` - Site-wide configuration

### Public Assets (`public/`)
- `home.html` - Static search interface
- `search.html` - Alternative search page
- `images/` - Static images (team logos, season logos, etc.)
- `src/` - Client-side JavaScript for the static pages
  - `searchLogic.js` - Search functionality and FACEIT API integration
  - `api-config.js` - API configuration
  - `front-end-styling.css` - Styles for static pages
  - `version-config.js` - Version information

### Styles (`styles/`)
- `globals.css` - Global CSS styles

### Types (`types/`)
- `index.ts` - TypeScript type definitions

## Data Flow and Communication

### API Communication
- **FACEIT API**: Primary data source for team info, stats, matches, and player data
- **Custom Proxy API** (`cipher-virid.vercel.app`): Provides league standings data
- All API calls use Bearer token authentication with the FACEIT API key

### Component Communication
- Data flows from API fetch functions to React components via props and state
- Parent components (like `CreateTeamProfile`) manage state and pass data to child components
- Components use React hooks (`useState`, `useEffect`) for state management
- Some components directly manipulate the DOM for dynamic content (e.g., roster rendering)

### Routing
- Static search page redirects to dynamic Next.js routes
- Next.js handles client-side navigation between team pages
- URL parameters (team_id) determine which team's data to display

## Development Notes

- The application uses both static HTML pages and Next.js for different functionalities
- API keys are currently hardcoded (not recommended for production)
- Some components use direct DOM manipulation alongside React's virtual DOM
- The app focuses on CS2 esports data visualization and team analysis
