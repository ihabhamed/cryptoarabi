
# Custom Hooks Documentation

This document provides an overview of the custom hooks used throughout the application, explaining their purpose, usage patterns, and important considerations.

## Table of Contents
1. [Data Fetching Hooks](#data-fetching-hooks)
2. [State Management Hooks](#state-management-hooks)
3. [UI Hooks](#ui-hooks)
4. [Form Hooks](#form-hooks)

## Data Fetching Hooks

### `useSiteSettings`
**Purpose**: Fetches and updates site settings from the database.

**Location**: `src/lib/hooks/useSiteSettings.ts`

**Usage**:
```tsx
const { data: settings, isLoading, isError } = useSiteSettings();
```

**Features**:
- Handles JSON parsing for the `about_features` field
- Provides loading and error states
- Caches data for 5 minutes

**Special Considerations**:
- The `about_features` field is stored as a JSON string in the database but used as an array in components

### `useBlogPosts`
**Purpose**: Fetches blog posts from the database.

**Location**: `src/lib/hooks/useBlogPosts.ts`

**Usage**:
```tsx
const { data: posts, isLoading, error } = useBlogPosts();
```

### `useBlogPost`
**Purpose**: Fetches a single blog post by slug.

**Usage**:
```tsx
const { data: post, isLoading, error } = useBlogPost(slug);
```

### `useAirdrops`
**Purpose**: Fetches airdrops from the database.

**Location**: `src/lib/hooks/useAirdrops.ts`

**Usage**:
```tsx
const { data: airdrops, isLoading, error } = useAirdrops();
```

### `useServices`
**Purpose**: Fetches services from the database.

**Location**: `src/lib/hooks/useServices.ts`

**Usage**:
```tsx
const { data: services, isLoading, error } = useServices();
```

### `useFooterLinks`
**Purpose**: Fetches and manages footer links from the database.

**Location**: `src/lib/hooks/useFooterLinks.ts`

**Usage**:
```tsx
const { data: footerLinks, isLoading, error } = useFooterLinks();
```

### `useSocialLinks`
**Purpose**: Fetches and manages social media links from the database.

**Location**: `src/lib/hooks/useSocialLinks.ts`

**Usage**:
```tsx
const { data: socialLinks, isLoading, error } = useSocialLinks();
```

## State Management Hooks

### `useAuth`
**Purpose**: Provides authentication state and methods.

**Location**: `src/context/AuthContext.tsx`

**Usage**:
```tsx
const { user, loading, isAdmin, signIn, signOut } = useAuth();
```

## UI Hooks

### `useToast`
**Purpose**: Provides toast notification functionality.

**Location**: `src/lib/hooks/useToast.ts`

**Usage**:
```tsx
const { toast } = useToast();
toast({ title: "Success", description: "Operation completed successfully" });
```

### `useMobile`
**Purpose**: Detects if the current viewport is mobile-sized.

**Location**: `src/hooks/use-mobile.tsx`

**Usage**:
```tsx
const isMobile = useMobile();
```

## Form Hooks

### `useAirdropForm`
**Purpose**: Manages airdrop form state.

**Location**: `src/hooks/useAirdropForm.ts`

**Usage**:
```tsx
const { formData, setFormData, handleChange, errors, validateForm } = useAirdropForm();
```

### `useBlogForm`
**Purpose**: Manages blog post form state.

**Location**: `src/hooks/useBlogForm.ts`

**Usage**:
```tsx
const { formData, setFormData, handleChange, errors, validateForm } = useBlogForm();
```

## Best Practices for Using Hooks

1. **Error Handling**: Always handle loading and error states when using data fetching hooks
   ```tsx
   if (isLoading) return <LoadingComponent />;
   if (error) return <ErrorComponent error={error} />;
   ```

2. **Default Values**: Provide default values when destructuring data from hooks
   ```tsx
   const { data: posts = [] } = useBlogPosts();
   ```

3. **Conditional Fetching**: Use the `enabled` option for queries that depend on other data
   ```tsx
   const { data: post } = useBlogPost(slug, { enabled: Boolean(slug) });
   ```

4. **Cache Invalidation**: Invalidate relevant queries after mutations
   ```tsx
   queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
   ```

5. **Prefetching**: Consider prefetching data for common user paths
   ```tsx
   queryClient.prefetchQuery({ queryKey: ['blog_posts'], queryFn: fetchBlogPosts });
   ```
