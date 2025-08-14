# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript frontend for the CSI Project Manager (Gestor de Proyectos CSI), built with Vite and styled with Tailwind CSS 4. The application manages projects, users, areas, tools, repositories, and groups within an institutional context.

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 with Vite plugin
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Backend**: Django (separate repository)

### Project Structure
- `src/components/` - Reusable UI components organized by feature (areas, auth, common, groups, etc.)
- `src/pages/` - Route components for different views
- `src/services/` - API service layer with feature-specific modules
- `src/context/` - React contexts (AuthContext, ThemeContext)
- `src/hooks/` - Custom hooks organized by feature
- `src/types/` - TypeScript type definitions by feature
- `src/utils/` - Utility functions (storage, validation, helpers)

### Key Architectural Patterns

#### API Layer
- Centralized axios instance in `src/services/api.ts` with JWT token interceptors
- Feature-specific service modules (areas, auth, groups, projects, repositories, tools, users)
- Automatic token refresh and 401 handling that redirects to login
- Base URL configured via `VITE_API_URL` environment variable (defaults to `http://localhost:8000/api`)

#### Authentication
- JWT-based authentication with AuthContext provider
- Token storage supports both localStorage (remember me) and sessionStorage
- Automatic logout on 401 responses
- Protected routes through context state

#### State Management
- React Context for global state (auth, theme)
- Custom hooks for feature-specific data fetching and state
- Local state management with useState/useEffect patterns

#### Component Organization
- Feature-based folder structure under `src/components/`
- Common reusable components in `src/components/common/`
- Index files for clean imports
- Consistent naming conventions (PascalCase for components)

## Environment Configuration

Create `.env` file:
```bash
VITE_API_URL=http://localhost:8000/api
```

## Backend Integration

The application connects to a Django backend with separate branches for different features:
- Login functionality: `LogIn` branch
- User creation: `RamaAlanBack` branch
- Backend repository: https://github.com/jonatansilva22/gestor_proyectos_csi_back

Key API endpoints:
- Authentication: `/api/login/`, `/api/logout/`, `/api/token/refresh/`
- Users: `/api/create-user/`, `/api/users/`, `/api/user/{id}/`
- CRUD operations for areas, groups, projects, repositories, tools

## Common Patterns

### Service Layer Pattern
All API calls go through service modules that return promises. Services handle error formatting and response transformation.

### Custom Hooks Pattern
Data fetching logic is encapsulated in custom hooks (e.g., `useProjects`, `useAreas`) that return data, loading states, and CRUD operations.

### Modal Management
Reusable modal components with consistent patterns for create/edit/delete operations across entities.

### Form Handling
Consistent form components (`FormInput`, `FormSelect`, `FormTextarea`) with validation error display.

## Development Notes

- The README.md contains git merge conflict markers and needs cleanup
- No test framework is currently configured
- TypeScript build validation: `npm run build` includes `tsc -b` for type checking
- ESLint configuration includes TypeScript rules but allows some warnings for flexibility
- The application uses Tailwind CSS 4 with the new Vite plugin architecture
- API interceptors handle 401 responses by automatically redirecting to login

## Type Checking

Run TypeScript compiler to check for type errors:
```bash
npx tsc -b
```

This is automatically included in the build process.

## Debugging and Development Workflow

### Before Making Changes
1. Run `npm run lint` to check for code style issues
2. Run `npm run build` to validate TypeScript and build process
3. Start development server with `npm run dev` (typically runs on http://localhost:5173)

### Common Development Tasks
- **Adding new routes**: Update `src/pages/` and routing configuration
- **Adding new API endpoints**: Create services in `src/services/[feature]/` following existing patterns
- **Creating new components**: Use feature-based organization under `src/components/[feature]/`
- **State management**: Use custom hooks in `src/hooks/[feature]/` for data fetching
- **Form validation**: Leverage existing `ValidationErrorDisplay` and form components