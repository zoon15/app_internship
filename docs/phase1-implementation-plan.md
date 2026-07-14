# Phase 1 — Technical Foundation and MVP Architecture

## Objective
Build the initial technical foundation for the product so the core user journey can be tested end to end.

## Deliverables
- Frontend app shell with a basic mobile screen
- Backend service with health and readiness endpoints
- Environment configuration for local development
- Clear path for connecting Supabase and ChromaDB later

## Workstreams

### 1. Frontend setup
- Create a React Native app shell
- Add a basic screen that shows app status
- Prepare the app to call the backend API

### 2. Backend setup
- Create a FastAPI app
- Add API routes for health and readiness
- Add CORS support for mobile development
- Prepare configuration for Supabase and ChromaDB

### 3. Data and integrations
- Create a database schema plan for the MVP
- Add environment variables for Supabase
- Add placeholders for future vector search integration

### 4. Local development workflow
- Start the backend locally
- Run the frontend locally
- Verify the app can reach the backend

## Phase 1 success criteria
- The frontend launches locally
- The backend responds on a health endpoint
- The app can display backend status
- The project is ready for MVP feature implementation
