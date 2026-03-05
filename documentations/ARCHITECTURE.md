# Admin Panel Architecture

## 🏗️ Project Structure Philosophy

This admin panel follows a **feature-based architecture** with strict separation of concerns.

### Core Principles

1. **Pages are route-level only** - No business logic
2. **Features contain domain logic** - Components, hooks, utilities per feature
3. **Shared components are pure UI** - No feature-specific logic
4. **API layer is feature-based** - One API file per domain
5. **Types mirror backend exactly** - No frontend naming conventions

## 📁 Directory Structure

```
src/
├── api/                    # API client layer
│   ├── index.ts           # Axios client with interceptors
│   ├── auth.api.ts        # Authentication endpoints
│   ├── users.api.ts       # User management endpoints
│   ├── listings.api.ts    # Listing management endpoints
│   ├── bookings.api.ts    # Booking management endpoints
│   └── stats.api.ts       # Statistics endpoints
│
├── types/                  # TypeScript definitions
│   ├── auth.types.ts      # Auth & token types
│   ├── user.types.ts      # User & profile types
│   ├── listing.types.ts   # Listing types (discriminated unions)
│   ├── booking.types.ts   # Booking types
│   └── stats.types.ts     # Statistics types
│
├── features/               # Feature modules (business logic)
│   ├── auth/
│   │   ├── components/    # Auth-specific components
│   │   └── hooks/         # Auth-specific hooks
│   ├── users/
│   │   ├── components/    # UserTable, UserDetails, etc.
│   │   └── hooks/         # useUsers, useUpdateUser, etc.
│   ├── listings/
│   │   ├── components/    # ListingTable, ListingDetails, etc.
│   │   └── hooks/         # useListings, useApprove, etc.
│   ├── bookings/
│   │   ├── components/    # BookingTable, BookingDetails, etc.
│   │   └── hooks/         # useBookings, useUpdateStatus, etc.
│   └── stats/
│       ├── components/    # StatsGrid, StatCard, etc.
│       └── hooks/         # useDashboardStats
│
├── pages/                  # Route-level components
│   ├── Login/
│   │   ├── LoginPage.tsx
│   │   └── LoginPage.module.css
│   ├── Dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── DashboardPage.module.css
│   ├── Users/
│   ├── Listings/
│   └── Bookings/
│
├── components/             # Shared UI components
│   ├── Layout/            # App layout with sidebar
│   ├── Table/             # Generic table component
│   ├── Modal/             # Generic modal component
│   ├── Loader/            # Loading spinner
│   └── Pagination/        # Pagination controls
│
├── hooks/                  # Global hooks
│   ├── useAuth.ts         # Authentication context
│   └── useTheme.ts        # Theme management
│
├── routes/                 # Routing configuration
│   ├── AppRoutes.tsx      # Route definitions
│   └── ProtectedRoute.tsx # Auth guards
│
└── styles/                 # Global styles
    ├── variables.css      # CSS custom properties
    ├── themes.css         # Light/dark theme definitions
    └── globals.css        # Global resets & base styles
```

## 🎯 Data Flow

```
User Interaction
     ↓
  Page Component (routing)
     ↓
  Feature Component (UI + logic)
     ↓
  Feature Hook (React Query)
     ↓
  API Function (axios)
     ↓
  Backend API
```

## 🔑 Key Architectural Decisions

### 1. Feature-Based Organization

**Why?**

- Scales better than layer-based structure
- Easy to locate related code
- Can extract features into packages later

**Rules:**

- Features NEVER import from pages
- Pages import from features
- Features can import from shared components
- Shared components NEVER import from features

### 2. CSS Modules Only

**Why?**

- Scoped styles prevent conflicts
- No runtime overhead
- Type-safe with TypeScript
- No external dependencies

**Rules:**

- Every component has its own `.module.css`
- No inline styles
- No global class names except in `globals.css`
- Use CSS variables for theming

### 3. React Query for Server State

**Why?**

- Built-in caching
- Automatic refetching
- Loading/error states
- Optimistic updates

**Rules:**

- All API calls through React Query
- Mutations invalidate relevant queries
- No manual cache management
- Use query keys consistently

### 4. TypeScript Discriminated Unions

**Why?**

- Type-safe polymorphic data (listings)
- No runtime type checking needed
- Better IDE autocomplete

**Example:**

```typescript
type Listing =
  | PropertyListing
  | HotelRoomListing
  | HostelBedListing
  | TravelPackageListing;

// TypeScript knows which fields exist based on listing_type
if (listing.listing_type === "PropertyListing") {
  // listing.bedrooms is available here
}
```

### 5. Axios Interceptors for Auth

**Why?**

- Centralized token management
- Automatic token refresh
- Consistent error handling

**Implementation:**

- Request interceptor attaches access token
- Response interceptor handles 401 errors
- Automatically refreshes and retries failed requests

## 🎨 Styling Architecture

### Theme System

```css
/* variables.css - Spacing, typography, etc. */
:root {
  --spacing-md: 1rem;
  --font-md: 1rem;
}

/* themes.css - Color definitions */
[data-theme="light"] {
  --bg-main: #f5f5f5;
  --text-main: #1a1a1a;
}

[data-theme="dark"] {
  --bg-main: #1a1a1a;
  --text-main: #e8e8e8;
}
```

**Theme switching:**

```typescript
document.documentElement.setAttribute("data-theme", "dark");
```

### Component Styling Pattern

```typescript
// Component.tsx
import styles from "./Component.module.css";

export default function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
    </div>
  );
}
```

```css
/* Component.module.css */
.container {
  padding: var(--spacing-lg);
  background: var(--bg-surface);
}

.title {
  color: var(--text-main);
  font-size: var(--font-2xl);
}
```

## 🔐 Authentication Flow

1. User logs in → `POST /api/v1/users/login/`
2. Backend returns `{ access, refresh }` tokens
3. Frontend stores both in localStorage
4. Every request includes: `Authorization: Bearer {access}`
5. On 401 error:
   - Try to refresh token → `POST /api/v1/users/refresh/`
   - Update access token
   - Retry original request
   - If refresh fails → redirect to login

## 📊 State Management Strategy

### Server State (React Query)

- User lists
- Listings
- Bookings
- Statistics

### Client State (React Context)

- Authentication state
- Theme preference

### Local Component State (useState)

- Form inputs
- Modal open/closed
- UI interactions

**No Redux/Zustand needed** - React Query handles 90% of state needs

## 🚀 Performance Optimizations

1. **Code Splitting** - Pages loaded on demand via React Router
2. **React Query Caching** - Reduced API calls
3. **CSS Modules** - Smaller CSS bundles
4. **Memoization** - `useMemo`/`useCallback` for expensive computations
5. **Vite + SWC** - Fast build times

## 🧪 Testing Strategy (Future)

```
components/
├── Table/
│   ├── Table.tsx
│   ├── Table.module.css
│   └── Table.test.tsx

features/users/hooks/
├── useUsers.ts
└── useUsers.test.ts
```

**Testing libraries to add:**

- Vitest (unit tests)
- React Testing Library (component tests)
- MSW (API mocking)

## 📦 Build Output

```bash
npm run build
```

Produces:

- `dist/assets/` - Chunked JS/CSS
- `dist/index.html` - Entry point
- Source maps for debugging

## 🔄 Deployment

1. Build: `npm run build`
2. Upload `dist/` to static hosting
3. Configure environment variables
4. Ensure `VITE_API_BASE_URL` points to production backend

## 🎓 Learning Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)
- [React Router v6](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
