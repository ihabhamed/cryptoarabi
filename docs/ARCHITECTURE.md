
# Application Architecture

## Overview
This application is a React-based web platform for crypto information and services, built with modern frontend technologies and Supabase as the backend.

## Technology Stack

### Frontend
- **React**: UI library
- **TypeScript**: Type safety and improved developer experience
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **TanStack Query (React Query)**: Data fetching, caching, and state management
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **Lucide React**: Icon library

### Backend
- **Supabase**: Backend-as-a-Service
  - Authentication
  - Database (PostgreSQL)
  - Storage
  - Realtime subscriptions

## Architecture Patterns

### 1. React Query for Data Management
The application uses React Query (TanStack Query) for data fetching, caching, and state management. This provides:
- Automatic background refetching
- Cache invalidation and refetching
- Optimistic updates
- Error handling

### 2. Custom Hooks Pattern
Custom hooks encapsulate specific functionality:
- Data fetching (useServices, useBlogPosts, etc.)
- State management (useSiteSettings, etc.)
- UI behavior (useToast, etc.)

### 3. Component Composition
The UI is structured using component composition:
- Layout components (AdminLayout, etc.)
- Section components (AboutSection, BlogSection, etc.)
- UI components (Card, Button, etc.)

### 4. Context for Global State
React Context is used for global state that needs to be accessed by multiple components:
- Authentication state (AuthContext)

## Directory Structure

- `src/`
  - `components/`: Reusable UI components
    - `ui/`: Base UI components
    - `admin/`: Admin interface components
  - `context/`: React contexts
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions, validation schemas
    - `hooks/`: Data fetching hooks
    - `utils/`: Helper functions
    - `validations/`: Validation schemas
  - `pages/`: Page components
    - `admin/`: Admin pages
  - `types/`: TypeScript type definitions
  - `integrations/`: Third-party integrations

## Key Subsystems

### Authentication
Uses Supabase Auth with JWT tokens. User roles and permissions are stored in a separate table.

### Content Management
Admin interface for managing:
- Site settings
- Blog posts
- Airdrops
- Services
- Footer and social links

### Public Site
Public-facing content including:
- Home page with hero section
- About section
- Services listings
- Blog posts
- Airdrop listings
- Contact form

## Data Flow

1. Components use custom hooks to fetch data
2. Custom hooks use React Query to interact with Supabase
3. React Query caches data and manages loading/error states
4. Components render based on data, loading state, and error state
5. User interactions trigger mutations which update the database
6. React Query invalidates relevant queries after mutations
7. Components re-render with fresh data

## State Management Strategy

The application uses a hybrid approach to state management:
- React Query for server state
- React Context for global application state
- Local component state for UI state
- URL parameters for navigation state

## Error Handling

The application implements several layers of error handling:
- React Query's built-in error handling
- Try/catch blocks for critical operations
- Toast notifications for user feedback
- Fallback UI for error states
- Console logging for debugging

## Internationalization

The application is built with RTL (Right-to-Left) support for Arabic language.
