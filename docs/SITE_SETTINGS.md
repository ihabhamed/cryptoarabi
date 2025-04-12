
# Site Settings Architecture

## Overview
The site settings system provides a centralized way to manage configurable content throughout the application. This document explains the architecture, data flow, and key components involved.

## Data Structure
Site settings are stored in a single record in the `site_settings` table in Supabase, with the following key fields:

- General settings (site_name, etc.)
- Hero section content (hero_title, hero_subtitle, etc.)
- About section content (about_title, about_content, etc.)
- Footer content (footer_description, etc.)
- Legal content (privacy_policy, terms_conditions)

### Special Field: about_features
The `about_features` field requires special handling because it's:
- Stored as a JSON string in the database
- Used as a string array in the React application

## Key Components

### 1. useSiteSettings Hook
Located in `src/lib/hooks/useSiteSettings.ts`, this hook:
- Fetches site settings from Supabase
- Parses JSON fields (specifically about_features)
- Provides data and loading state to components
- Handles updates to site settings

### 2. Admin Settings Interface
Located in `src/pages/admin/SiteSettings.tsx` and component files in `src/components/admin/site-settings/`:
- Provides a tabbed interface for editing different sections
- Uses the useSiteSettings hook for data fetching and updates
- Handles form state and validation

### 3. Frontend Display Components
Components like `AboutSection.tsx` consume the site settings:
- Use the useSiteSettings hook to access current settings
- Fall back to default values when data is loading or unavailable
- Render the content from site settings

## Data Flow
1. Data is fetched from Supabase via the useSiteSettings hook
2. JSON fields are parsed into appropriate JavaScript types
3. Components receive the processed data
4. When updates are made, data is transformed back to database format
5. Updates are sent to Supabase and the cache is invalidated to refresh components

## Error Handling
The system includes several error handling mechanisms:
- Failed JSON parsing is gracefully handled with reasonable defaults
- Database fetch/update errors are logged and shown to users via toast notifications
- Components have fallback values for when data is loading or errors occur

## Type Safety
The `SiteSettings` interface ensures type safety throughout the application. Special handling is in place for fields like `about_features` that have different representations in the database versus the application.

## Best Practices
When working with site settings:
1. Always use the useSiteSettings hook rather than direct Supabase queries
2. Handle loading and error states in components
3. Provide fallback values for critical UI elements
4. Be careful with array/object fields that require parsing/stringifying
