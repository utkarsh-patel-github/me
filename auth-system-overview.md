# Daily Tools Authentication & Profile System

## Overview
The Daily Tools website features a complete authentication and profile management system built with:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, MongoDB
- Authentication: JWT (JSON Web Tokens)

## System Architecture

### Backend Components
1. **Database Connection** - MongoDB connection setup with a custom connection manager
2. **User Model** - Class-based model with password hashing via bcrypt and CRUD operations
3. **Authentication Controller** - Login, registration, token validation, and profile management
4. **Profile Management** - Complete user preferences and settings management
5. **Tools Controller** - Saved tools functionality with MongoDB integration
6. **API Routes** - RESTful endpoints for auth and user data operations

### Frontend Components
1. **Login/Registration Page** - Form validation and authentication with tab-switching UI
2. **User Profile Page** - Settings, preferences, saved tools with tabbed interface
3. **Authentication Module** - Local storage and cookie persistence with token validation
4. **Navigation Integration** - Dynamic user menu based on authentication state

## Key Features

### Authentication
- JWT-based authentication with 7-day expiration
- Password hashing with bcrypt (10 rounds)
- "Remember me" functionality with persistent cookies
- Session persistence across browser sessions
- Login/logout functionality with proper state management
- Registration with validation and duplicate checking
- Password strength meter during registration

### User Management
- Profile information (name, username, email, bio)
- Password change with current password verification
- Account deletion with confirmation
- Saved tools collection with add/remove functionality

### User Preferences
- Theme preferences (light/dark/system)
- Notification settings (email and site notifications)
- Tool layout preferences (grid/list view)
- Language preferences with persistence

### Saved Tools
- Add/remove tools from saved collection
- View saved tools in profile with sorting options
- Tool usage tracking
- Favorites management

## Data Flow

1. **Registration Flow**
   - Client submits registration form with validation
   - Server validates input and checks for existing users/emails
   - Password is hashed with bcrypt (10 rounds)
   - User is saved to MongoDB with default preferences
   - JWT token is generated with user ID payload
   - Client stores token in both localStorage and cookies
   - UI is updated to reflect logged-in state

2. **Login Flow**
   - Client submits login form with email/password
   - Server validates credentials against stored hash
   - JWT token is generated with user ID payload
   - Last login timestamp is updated
   - Client stores token in localStorage/cookies
   - UI is updated to show logged-in state with user data

3. **Authentication Verification**
   - Client includes token in Authorization header
   - Server middleware verifies token signature
   - User ID is extracted from token payload
   - Protected routes check for valid token before processing
   - Invalid tokens trigger redirect to login

4. **Profile Updates**
   - Form data validated client-side and server-side
   - Changes saved to database with MongoDB update operations
   - User object in localStorage/cookies updated to match
   - UI reflects changes immediately with success feedback

## Security Measures
- Passwords stored with bcrypt hashing (10 rounds)
- HTTPS for all communications (in production)
- JWT with 7-day expiration
- XSS protection through proper input sanitization
- CSRF protection via token-based authentication
- Password strength validation
- User input validation on both client and server

## DB Schema
The User model includes:
- username: Unique username
- email: Unique email address
- password: Bcrypt-hashed password
- name: Display name
- profilePicture: User avatar (optional)
- savedTools: Array of tool IDs
- preferences: Object containing user preferences
- createdAt: Account creation timestamp
- lastLogin: Last session timestamp

## Demo Data
The system includes seed data with demo accounts:
- Demo User: demo@example.com / password123
- Admin User: admin@dailytools.com / admin123

## API Endpoints

### Authentication
- POST /api/auth/register - Create new account
- POST /api/auth/login - Log in existing user
- GET /api/auth/me - Get current user data with token validation

### User Management
- PUT /api/auth/profile - Update user profile information
- PUT /api/auth/password - Change password with verification
- PUT /api/auth/preferences - Update user preferences
- DELETE /api/auth/account - Delete user account

### Saved Tools
- GET /api/tools/user/saved - Get user's saved tools
- POST /api/tools/user/save/:toolId - Save a tool to user profile
- DELETE /api/tools/user/save/:toolId - Remove a tool from saved collection 