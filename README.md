# DAGVerse - Decentralized Development Platform

A full-stack decentralized development platform built with React, Node.js, and MongoDB. DAGVerse provides authentication, wallet integration, and project management for blockchain developers.

## 🚀 Features

### Frontend (React)
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Authentication** - Login/Register with JWT tokens
- **Wallet Integration** - Connect and manage DAG wallets
- **Dashboard** - User stats, projects, and activity feed
- **Protected Routes** - Secure access to authenticated pages

### Backend (Node.js/Express)
- **RESTful API** - Complete authentication and user management
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Integration** - User data persistence
- **Wallet Authentication** - Challenge-response wallet verification
- **Redis Sessions** - Scalable session management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Session store
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **ethers.js** - Ethereum wallet integration

## 📁 Project Structure

```
DAGVerse/
├── Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utilities and context
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── README.md
├── dagverse-backend/        # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── app.js          # Main server file
│   ├── package.json
│   └── .env
├── package.json            # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or cloud instance)
- **Redis** (optional, for session storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DAGVerse
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend (.env in dagverse-backend/)**
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/dagverse
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   REDIS_URL=redis://localhost:6379
   ```

   **Frontend (.env in Frontend/)**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start Redis** (optional, for sessions)
   ```bash
   redis-server
   ```

6. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend on `http://localhost:8000`
   - Frontend on `http://localhost:5173`

### Individual Commands

- **Start only backend**: `npm run dev:backend`
- **Start only frontend**: `npm run dev:frontend`
- **Build frontend**: `npm run build`
- **Start production**: `npm start`

## 🔐 Authentication

### Traditional Login/Register
- Users can register with email/password
- Passwords are hashed with bcrypt
- JWT tokens are issued for authentication

### Wallet Authentication
- Users can connect their wallet
- Challenge-response verification
- Supports Ethereum-compatible wallets

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/wallet-challenge` - Get wallet challenge
- `POST /api/auth/wallet-verify` - Verify wallet signature

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Health Check
- `GET /api/health` - Server health status

## 🎨 Frontend Features

### Pages
- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - Authentication page
- **Dashboard** (`/dashboard`) - User dashboard (protected)
- **Wallet** (`/wallet`) - Wallet management (protected)

### Components
- **Navigation** - Header with user menu and wallet status
- **ProtectedRoute** - Route protection for authenticated users
- **AuthContext** - Global authentication state management

## 🔧 Development

### Adding New Features

1. **Backend API**
   - Add routes in `src/routes/`
   - Add controllers in `src/controllers/`
   - Add models in `src/models/` if needed

2. **Frontend**
   - Add pages in `src/pages/`
   - Add components in `src/components/`
   - Update API service in `src/services/api.js`

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default: 8000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `REDIS_URL` - Redis connection string

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server
3. Use PM2 or similar for process management

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_API_URL` to point to your production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of the DAGVerse hackathon project.

See MIT License [here](LICENSE)

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

**Happy coding with DAGVerse! 🚀**
