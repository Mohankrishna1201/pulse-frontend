# Pulse - Video Content Moderation Platform

A real-time video content moderation platform with AI-powered sensitivity detection and comprehensive video management capabilities.

## 🎯 Overview

Pulse is a full-stack application that allows users to upload videos, automatically analyze them for sensitive content using AI, and manage video libraries with role-based access control. The platform features real-time processing updates, frame-by-frame analysis, and a modern React interface.

## ✨ Key Features

### Video Management
- **Drag-and-drop Upload** - Intuitive video upload with progress tracking
- **Real-time Processing** - Live updates during video analysis via WebSocket
- **Video Library** - Browse, filter, and search uploaded videos
- **Detailed Video View** - View metadata, sensitivity analysis, and extracted frames
- **Video Streaming** - Built-in video player with seek support

### AI-Powered Content Moderation
- **Automated Sensitivity Detection** - AI analysis using Hugging Face models
- **Frame Extraction** - Multiple frames analyzed per video (configurable)
- **Confidence Scoring** - Detailed confidence metrics for each analysis
- **Visual Frame Review** - View extracted frames that triggered flags
- **Safe/Flagged Classification** - Clear content safety indicators

### User Management (Admin)
- **User Administration** - View and manage all platform users
- **Role Management** - Assign admin/user roles
- **User Analytics** - Track user activity and video uploads
- **Account Controls** - Enable/disable user accounts

### Authentication & Security
- **JWT Authentication** - Secure token-based auth system
- **Protected Routes** - Role-based access control
- **User Profiles** - Personal profile management
- **Secure Sessions** - Automatic token refresh and validation

### Real-time Features
- **Live Progress Updates** - WebSocket connection for instant feedback
- **Processing Status** - Track video processing stages in real-time
- **Notifications** - Success/error alerts with detailed messages
- **Background Processing** - Non-blocking video analysis

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API requests

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **Socket.io** - Real-time bidirectional communication
- **FFmpeg** - Video processing and frame extraction
- **Hugging Face Inference API** - AI content moderation
- **JWT** - Authentication tokens
- **Multer** - File upload handling

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or remote connection
- FFmpeg installed (auto-detected on Linux/Render)
- Hugging Face API key (for AI analysis)

## 🚀 Getting Started

### Frontend Setup
```bash
cd pulse-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd pulse-backend
npm install
# Configure .env file (see below)
npm run dev
```

### Environment Variables (Backend)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
FRONTEND_URL=http://localhost:5173
```

## 📱 Application Pages

- **Dashboard** - Video statistics and upload interface
- **Video Detail** - Detailed view with AI analysis results and frames
- **Profile** - User account management
- **User Management** - Admin panel for user administration (admin only)
- **Login/Register** - Authentication pages

## 🎨 Features in Detail

### Video Processing Pipeline
1. User uploads video via drag-and-drop or file picker
2. Video saved to server with metadata
3. FFmpeg extracts 5 frames from different timestamps
4. Each frame analyzed by Hugging Face NSFW detection model
5. Results aggregated with confidence scoring
6. Video flagged as safe/unsafe based on thresholds
7. All frames saved permanently for review

### AI Analysis Details
- Model: `Falconsai/nsfw_image_detection`
- Threshold: 50% average NSFW score
- Frame threshold: 60% individual frame score
- Frames analyzed: 5 per video (configurable)
- Fallback: Mock analysis if API unavailable

## 🔐 User Roles

- **User** - Upload videos, view own uploads, manage profile
- **Admin** - All user permissions + user management + view all videos

## 📦 Project Structure

```
pulse/
├── pulse-frontend/          # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # Context providers & API
│   │   └── assets/          # Static assets
│   └── public/
└── pulse-backend/           # Express backend
    ├── config/              # Database config
    ├── controllers/         # Route controllers
    ├── middleware/          # Auth middleware
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── utils/               # Video processor
    └── uploads/             # Video storage & frames
```

## 🌐 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/videos/upload` - Upload video
- `GET /api/videos` - List videos with filters
- `GET /api/videos/:id` - Get video details
- `GET /api/videos/:id/stream` - Stream video
- `GET /api/videos/:id/frames` - Get extracted frames
- `DELETE /api/videos/:id` - Delete video
- `GET /api/auth/users` - List all users (admin)
- `PATCH /api/auth/users/:id/role` - Update user role (admin)

## 📄 License

ISC
