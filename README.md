# DAGVerse: Decentralized Workflow Automation Platform

## Project Overview

**DAGVerse** is a decentralized platform that empowers users to design, execute, and share automated workflows using Directed Acyclic Graphs (DAGs). The platform leverages smart contracts (BlockDAG testnet integration in progress) and decentralized storage to provide transparent, trustless, and collaborative automation for developers, data scientists, and businesses.

## Purpose

DAGVerse addresses the limitations of centralized workflow automation tools by offering a decentralized alternative. Users can create, execute, and share workflows securely, with all logic and results verifiable and accessible via decentralized storage.

## Features

- **Decentralized Workflow Execution:** (In progress) Run workflows using smart contracts on the BlockDAG testnet.
- **User-Friendly Interface:** Intuitive frontend for workflow creation, execution, and monitoring.
- **Secure Authentication:** User registration and login with JWT-based authentication.
- **Workflow Management:** Create, edit, and manage workflows as DAGs.
- **Community Sharing:** (Planned) Discover and share reusable workflows with the community.
- **IPFS Integration:** (Planned) Store workflow definitions and results on IPFS for decentralized access.

## Tech Stack

### Frontend
- **React** (with hooks)
- **React Router v6**
- **Tailwind CSS**
- **Vite**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (for user and workflow data)
- **JWT** (for authentication)
- **bcrypt** (for password hashing)

## Project Structure

```
DAGVerse/
├── Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utilities and context
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── README.md
├── dagverse-backend/        # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── app.js           # Main server file
│   ├── package.json
│   └── .env
├── package.json             # Root package.json
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (running locally or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DAGVerse
   ```

2. **Install backend dependencies**
   ```bash
   cd dagverse-backend
   npm install
   npm start
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

4. **Set up environment variables**

   **Backend (.env in dagverse-backend/):**
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/dagverse
   JWT_SECRET=your-super-secret-jwt-key
   ```

   **Frontend (.env in Frontend/):**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Access the app**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

## Usage

- Register or log in to your account.
- Create, execute, and manage your workflows from the dashboard.
- (Planned) Deploy and execute workflows on the BlockDAG testnet.

## API Endpoints (Backend)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/health` - Server health status

## Status

- **Smart contract deployment:** In progress (BlockDAG testnet integration planned)
- **Live demo:** Coming soon
- **Demo video:** [To be added before submission]
- **Deployed contract address:** [To be added]

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

**Happy building with DAGVerse! 🚀**