# Pulse Frontend - Video Content Moderation Platform

A modern React-based user interface for the Pulse video content moderation platform with AI-powered sensitivity detection and real-time processing updates.

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [User Manual](#user-manual)
6. [Component Documentation](#component-documentation)
7. [Design Decisions](#design-decisions)
8. [Deployment](#deployment)

---

## 🎯 Overview

Pulse Frontend is a React 19 application built with Vite and Tailwind CSS that provides an intuitive interface for video content moderation. Users can upload videos, monitor AI analysis in real-time, review results, and manage their video library through a modern, responsive UI.

### Key Capabilities
- 🎥 Drag-and-drop video upload with progress tracking
- 🔄 Real-time processing updates via WebSocket
- 🎬 Built-in video player with HTTP range request streaming
- 🤖 AI analysis result visualization with confidence scores
- 🖼️ Extracted frame viewer for flagged content
- 🔒 JWT authentication with protected routes
- 👥 Admin user management dashboard
- 📊 Video statistics and analytics

---

## ✨ Features

### Video Management
- **Drag-and-Drop Upload** - Intuitive modal interface with file picker fallback
- **Upload Progress** - Real-time upload percentage display
- **Video Library** - Grid/list view with thumbnails and metadata
- **Advanced Filters** - Filter by status (pending, processing, completed, failed)
- **Search** - Full-text search across video titles and filenames
- **Sorting** - Sort by upload date, title, size, or duration
- **Pagination** - Efficient loading with configurable page size

### AI-Powered Content Moderation
- **Real-time Processing** - Live progress bar (0-100%) with stage descriptions
- **Confidence Scoring** - Detailed AI confidence metrics displayed
- **Visual Frame Review** - Gallery view of extracted frames
- **Safe/Flagged Badges** - Color-coded status indicators
- **Detailed Analysis** - View NSFW scores, flagged frames, and detection criteria
- **Frame Navigation** - Scroll through extracted frames with zoom capability

### User Management (Admin Only)
- **User List** - View all users in organization with roles
- **Role Management** - Change user roles (admin, editor, viewer, user)
- **Activity Tracking** - Monitor user video uploads and activity
- **Account Status** - View active/inactive status
- **Search Users** - Find users by username or email

### Authentication & Security
- **JWT Token Management** - Automatic token storage and refresh
- **Protected Routes** - Route guards prevent unauthorized access
- **Auto-Logout** - Redirect to login on 401/403 errors
- **Password Change** - Secure password update flow
- **Profile Management** - Update username and email

### Real-time Features
- **WebSocket Connection** - Automatic connection to Socket.io server
- **Live Notifications** - Toast/alert messages for events
- **Progress Streaming** - Frame-by-frame AI analysis updates
- **Background Processing** - Non-blocking uploads with status tracking

### UI/UX Enhancements
- **Responsive Design** - Mobile, tablet, and desktop layouts
- **Gradient Themes** - Modern purple/blue gradient color scheme
- **Loading States** - Spinners and skeletons during data fetching
- **Error Handling** - User-friendly error messages
- **Accessibility** - Semantic HTML and ARIA labels

---

## 🏗️ Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       App.jsx (Router)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AuthProvider (Context)                    │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │          SocketProvider (Context)                 │ │  │
│  │  │  ┌────────────────────────────────────────────┐  │ │  │
│  │  │  │         Routes & Pages                      │  │ │  │
│  │  │  │  ┌──────────────┐  ┌──────────────────┐   │  │ │  │
│  │  │  │  │   Login      │  │ Dashboard        │   │  │ │  │
│  │  │  │  │   Register   │  │ VideoDetail      │   │  │ │  │
│  │  │  │  │   Profile    │  │ UserManagement   │   │  │ │  │
│  │  │  │  └──────────────┘  └──────────────────┘   │  │ │  │
│  │  │  │           │                 │              │  │ │  │
│  │  │  │           ▼                 ▼              │  │ │  │
│  │  │  │  ┌──────────────────────────────────┐     │  │ │  │
│  │  │  │  │  Shared Components               │     │  │ │  │
│  │  │  │  │  - VideoList                     │     │  │ │  │
│  │  │  │  │  - UploadModal                   │     │  │ │  │
│  │  │  │  │  - ProtectedRoute                │     │  │ │  │
│  │  │  │  │  - UI Components (Card, Button)  │     │  │ │  │
│  │  │  │  └──────────────────────────────────┘     │  │ │  │
│  │  │  └────────────────────────────────────────────┘  │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │      API Layer (api.js)               │
        │  - axios instance with interceptors   │
        │  - authAPI, videoAPI helpers          │
        │  - JWT token management               │
        │  - Error handling                     │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │      Backend API (REST + WebSocket)   │
        │  - HTTP: localhost:3000/api           │
        │  - WS: localhost:3000 (Socket.io)     │
        └───────────────────────────────────────┘
```

### State Management

#### 1. **AuthContext** - Global authentication state
- Current user object
- Login/logout functions
- Token persistence (localStorage)
- Loading state during auth checks

#### 2. **SocketContext** - WebSocket connection
- Socket.io client instance
- Connection status
- Event listeners setup
- Automatic reconnection

#### 3. **Component State** - Local React state
- Form inputs (useState)
- Loading indicators
- Error messages
- Pagination state

### Routing Structure

```
/                          → Redirect to /dashboard
/login                     → Public - Login page
/register                  → Public - Registration page
/dashboard                 → Protected - Video library & upload
/video/:id                 → Protected - Video detail & player
/profile                   → Protected - User profile management
/users                     → Protected (Admin) - User management
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Backend API** running (see pulse-backend README)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Mohankrishna1201/pulse-frontend.git
cd pulse-frontend
```

#### 2. Install Dependencies
```bash
npm install
```

Installs:
- `react` & `react-dom` 19 - UI library
- `react-router-dom` 7 - Routing
- `socket.io-client` 4 - WebSocket client
- `axios` 1.13 - HTTP client
- `tailwindcss` 4 - CSS framework
- `vite` 5 - Build tool & dev server

#### 3. Configure Environment Variables
Create `.env` file in root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# For production:
# VITE_API_URL=https://your-backend.onrender.com
```

⚠️ **Important:** Vite requires `VITE_` prefix for environment variables!

#### 4. Run Development Server
```bash
npm run dev
```

Application will start at `http://localhost:5173`

#### 5. Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder.

#### 6. Preview Production Build
```bash
npm run preview
```

---

## 📖 User Manual

### Getting Started

#### 1. **Registration**
1. Navigate to `http://localhost:5173/register`
2. Fill in:
   - Username (3+ characters)
   - Email (valid format)
   - Password (6+ characters)
   - Organization name
3. Click "Create Account"
4. Automatically logged in and redirected to Dashboard

#### 2. **Login**
1. Navigate to `http://localhost:5173/login`
2. Enter email and password
3. Click "Login"
4. Redirected to Dashboard

### Video Upload

#### 1. **Open Upload Modal**
- Click "Upload Video" button on Dashboard
- Upload modal appears

#### 2. **Select Video**
- Drag and drop video file onto upload area
- Or click "Browse Files" to select from file picker
- Supported formats: MP4, AVI, MOV, MKV, WebM

#### 3. **Enter Details**
- Enter video title (required)
- Description optional (for future feature)

#### 4. **Upload**
- Click "Upload Video" button
- Watch upload progress bar (0-100%)
- Video appears in library with "Pending" status

#### 5. **Monitor Processing**
- Processing starts automatically
- Real-time progress bar updates (powered by WebSocket)
- Stages:
  1. **0-20%** - Extracting metadata
  2. **20-30%** - Extracting frames
  3. **30-90%** - AI analyzing frames
  4. **90-100%** - Finalizing
- Status changes to "Completed" or "Failed"

### Video Library

#### 1. **Browse Videos**
- Dashboard displays all videos in grid layout
- Each card shows:
  - Title
  - Upload date
  - Status badge (Pending/Processing/Completed/Failed)
  - Sensitivity flag (Safe/Flagged)
  - Size and duration (if available)

#### 2. **Filter & Search**
- Use filter dropdown to show:
  - All videos
  - Pending only
  - Processing only
  - Completed only
  - Failed only
  - Safe videos
  - Flagged videos
- Search bar: Type to filter by title/filename
- Sort by: Upload date, title, size

#### 3. **View Video Details**
- Click on video card
- Navigates to `/video/:id`
- Displays:
  - Video player (if completed)
  - AI analysis results
  - Extracted frames
  - Metadata (duration, resolution, codec)
  - Confidence scores

### Video Player

#### 1. **Playback**
- Click play button
- Use standard HTML5 video controls
- Seek by dragging timeline scrubber
- Adjust volume

#### 2. **Seeking** (HTTP Range Requests)
- Click anywhere on timeline
- Video instantly jumps to that position
- No need to buffer entire video first

#### 3. **Download**
- Click "Download Video" button
- Opens stream URL in new tab
- Browser handles download

### Video Analysis Results

#### 1. **Sensitivity Status**
- **Safe (Green)** - AI confidence < 50% NSFW
- **Flagged (Red)** - AI confidence ≥ 50% NSFW

#### 2. **Confidence Score**
- Percentage (0-100%)
- Higher = more certain about classification
- Based on average of all analyzed frames

#### 3. **Detected Issues**
- List of flagged frames
- Example: "Frame 3: High sensitivity content detected (85% confidence)"

#### 4. **Extracted Frames**
- View all 5 extracted frames
- Click to zoom
- Frames saved permanently for audit

### Profile Management

#### 1. **View Profile**
- Click "Profile" in navigation
- Displays:
  - Username
  - Email
  - Role (Admin/User)
  - Organization

#### 2. **Update Profile**
- Edit username or email
- Click "Save Changes"
- Confirmation message appears

#### 3. **Change Password**
- Enter current password
- Enter new password (6+ characters)
- Confirm new password
- Click "Change Password"

### User Management (Admin Only)

#### 1. **Access User List**
- Admins see "User Management" in navigation
- Navigate to `/users`

#### 2. **View Users**
- Table displays all users in organization:
  - Username
  - Email
  - Role
  - Status (Active/Inactive)
  - Video count

#### 3. **Change User Role**
- Click "Change Role" button
- Select new role from dropdown:
  - Admin - Full control
  - Editor - Upload and edit
  - Viewer - Read-only
  - User - Standard access
- Confirm change

#### 4. **Search Users**
- Use search bar to find users by username/email

### Statistics Dashboard

- **Total Videos** - Count of all videos in organization
- **By Status**:
  - Pending
  - Processing
  - Completed
  - Failed
- **By Safety**:
  - Safe count
  - Flagged count
- **Storage** - Total size used

---

## 🧩 Component Documentation

### Pages

#### `Login.jsx`
- Email/password form
- Token storage on success
- Redirect to dashboard

#### `Register.jsx`
- User registration form
- Organization input
- Auto-login after signup

#### `Dashboard.jsx`
- Video statistics cards
- Upload button → opens UploadModal
- VideoList component integration

#### `VideoDetail.jsx`
- Video player with range request streaming
- AI analysis display
- Extracted frames gallery
- Metadata table
- Delete button

#### `Profile.jsx`
- User info display
- Update username/email form
- Change password form

#### `UserManagement.jsx` (Admin)
- User table
- Role change dropdown
- Search functionality

### Components

#### `UploadModal.jsx`
**Purpose:** Video upload interface  
**Props:**
- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close callback
- `onUploadComplete` (function) - Success callback

**Features:**
- Drag-and-drop file input
- File validation
- Upload progress bar
- Title input field

#### `VideoList.jsx`
**Purpose:** Display video grid/list  
**Props:**
- `onVideoUploaded` (function) - Refresh callback

**Features:**
- Fetch videos from API
- Filter by status/sensitivity
- Search functionality
- Pagination
- Loading states
- Empty state message

#### `ProtectedRoute.jsx`
**Purpose:** Route authentication guard  
**Props:**
- `children` (ReactNode) - Wrapped component

**Logic:**
- Check if user logged in
- Show loading while checking
- Redirect to `/` if not authenticated
- Render children if authenticated

#### UI Components (`components/ui/`)

**`Card.jsx`** - Container with shadow/hover effects  
**`Button.jsx`** - Variants: primary, secondary, outline, danger, ghost  
**`Badge.jsx`** - Status/role indicators with color variants  
**`Input.jsx`** - Form input with label and error display  
**`LoadingSpinner.jsx`** - Animated spinner (sm/md/lg sizes)  
**`Alert.jsx`** - Success/error/warning/info messages  
**`Modal.jsx`** - Backdrop + centered modal container

### Context Providers

#### `AuthContext.jsx`
**Exported:**
- `useAuth()` hook
- `AuthProvider` component

**State:**
- `user` - Current user object or null
- `loading` - Auth check in progress

**Methods:**
- `login(email, password)` - Login and store token
- `logout()` - Clear token and user state
- `updateUser(newData)` - Update user object

#### `SocketContext.jsx`
**Exported:**
- `useSocket()` hook
- `SocketProvider` component

**State:**
- `socket` - Socket.io client instance
- `connected` - Connection status

**Lifecycle:**
- Connects on mount (if authenticated)
- Disconnects on unmount
- Auto-reconnects on token change

### API Layer (`context/api.js`)

#### `authAPI`
- `register(userData)` - POST /auth/register
- `login(credentials)` - POST /auth/login
- `getCurrentUser()` - GET /auth/me
- `updateProfile(updates)` - PUT /auth/profile
- `changePassword(passwords)` - PUT /auth/change-password
- `getAllUsers()` - GET /auth/users (admin)
- `updateUserRole(userId, role)` - PATCH /auth/users/:id/role

#### `videoAPI`
- `upload(formData, onProgress)` - POST /videos/upload
- `getAll(params)` - GET /videos (with filters)
- `getById(id)` - GET /videos/:id
- `deleteVideo(id)` - DELETE /videos/:id
- `getStats()` - GET /videos/stats
- `getFrames(id)` - GET /videos/:id/frames
- `getStreamUrl(id)` - Generate stream URL with token

#### Axios Interceptors

**Request Interceptor:**
- Attach JWT token to Authorization header

**Response Interceptor:**
- Handle 401/403 → redirect to `/`
- Extract error messages
- Format errors for display

---

## 🎨 Design Decisions

### Frontend Architecture Decisions

#### 1. **React 19 with Vite**
**Decision:** Use latest React with Vite build tool  
**Rationale:**
- React 19: Latest features, performance improvements
- Vite: Faster dev server than Create React App
- Hot Module Replacement (HMR) for instant updates
- Optimized production builds

#### 2. **Context API for State Management**
**Decision:** Use React Context instead of Redux  
**Rationale:**
- Simpler for small/medium apps
- No extra dependencies
- Auth and Socket state are global and rarely change
- Local state (useState) sufficient for components

#### 3. **Tailwind CSS 4**
**Decision:** Utility-first CSS framework  
**Rationale:**
- Rapid prototyping with utility classes
- No CSS file bloat (purges unused styles)
- Consistent design system
- Responsive modifiers built-in (`sm:`, `md:`, `lg:`)

**Example:**
```jsx
<div className="bg-gradient-to-r from-purple-500 to-blue-600 p-4 rounded-lg shadow-lg">
```

#### 4. **Socket.io Client Integration**
**Decision:** WebSocket connection managed by context  
**Rationale:**
- Single connection shared across app
- Auto-connect on login, disconnect on logout
- Event listeners in components use same socket instance
- Prevents multiple connections

#### 5. **JWT Token in localStorage**
**Decision:** Store token in localStorage  
**Rationale:**
- Persists across page refreshes
- Easy access for axios interceptors
- Standard approach for SPAs

**Security Trade-off:**
- Vulnerable to XSS attacks (accepted for demo)
- Production: Use httpOnly cookies + CSRF tokens

#### 6. **Protected Route Pattern**
**Decision:** Wrapper component for auth guards  
**Rationale:**
- Declarative route protection
- Centralized auth logic
- Easy to add role-based checks

**Implementation:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

#### 7. **Real-time Progress Updates**
**Decision:** WebSocket for video processing progress  
**Rationale:**
- Better UX than polling
- Instant feedback (0-100% with stages)
- Low server overhead
- Standard for real-time apps

#### 8. **Video Player with Range Requests**
**Decision:** Use HTML5 `<video>` tag with src pointing to API  
**Rationale:**
- Browser handles range requests automatically
- No custom player needed
- Seek functionality built-in
- Works on all modern browsers

**Token Handling:**
```javascript
src={`${API_BASE}/api/videos/${id}/stream?token=${token}`}
```

#### 9. **Component Structure**
**Decision:** Separate UI components from page components  
**Rationale:**
- **Pages** - Route-level, fetch data, business logic
- **Components** - Reusable, presentational, props-driven
- **UI** - Generic (Button, Card) used across app

**Benefits:**
- Easy to test UI components in isolation
- Pages stay focused on data flow
- Consistent UI elements

#### 10. **Error Handling Strategy**
**Decision:** Axios interceptor + component-level try-catch  
**Rationale:**
- Interceptor: Global 401/403 handling (auto-logout)
- Component: Specific error messages per action
- User sees friendly error text from API

**Example:**
```javascript
try {
  await videoAPI.upload(formData);
  setSuccess('Video uploaded!');
} catch (error) {
  setError(error.message); // Formatted by interceptor
}
```

### UI/UX Design Choices

#### 1. **Gradient Theme**
**Colors:** Purple (#796ce7) to Blue (#3a6cee)  
**Rationale:**
- Modern, professional look
- Stands out from generic blue themes
- Purple associated with creativity/media

#### 2. **Card-Based Layout**
**Decision:** All content in Card components with shadows  
**Rationale:**
- Clear visual hierarchy
- Separates content sections
- Hover effects for interactivity

#### 3. **Status Badges**
**Decision:** Color-coded badges for video status  
**Rationale:**
- **Yellow** - Pending (waiting)
- **Blue** - Processing (in progress)
- **Green** - Completed/Safe (success)
- **Red** - Failed/Flagged (attention needed)

#### 4. **Loading States**
**Decision:** Spinner components during data fetching  
**Rationale:**
- Prevents perceived lag
- User knows action in progress
- Better than blank screen

#### 5. **Empty States**
**Decision:** Friendly messages when no data  
**Rationale:**
- "No videos yet. Upload your first video!"
- Guides user to next action
- Prevents confusion

---

## 🚀 Deployment

### Deploy to Render

1. **Create Render Account** at [render.com](https://render.com)

2. **Create Static Site**
   - Connect GitHub repository
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://your-backend-api.onrender.com
   ```

4. **Deploy**
   - Render auto-builds on git push
   - Site available at `https://your-app.onrender.com`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variable in Vercel dashboard:
```
VITE_API_URL=https://your-backend-api.onrender.com
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --dir=dist
```

Or use Netlify UI:
1. Drag `dist/` folder to Netlify
2. Set environment variable `VITE_API_URL`

### Deploy with Docker

```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📞 Support & Resources

- **Backend Repository:** [github.com/Mohankrishna1201/pulse-backend](https://github.com/Mohankrishna1201/pulse-backend)
- **Frontend Repository:** [github.com/Mohankrishna1201/pulse-frontend](https://github.com/Mohankrishna1201/pulse-frontend)
- **Issues:** Report bugs via GitHub Issues
- **Documentation:** This README + Backend README

---

## 📄 License

ISC License
