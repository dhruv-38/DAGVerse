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
├── docker_pull_image.bat
├── docker_pull_images.sh
├── LICENSE
├── Makefile
├── mongodb-docker-setup  
│   ├── docker-compose.yml
|   └── .env
│   └── init-scripts
├── package.json            # Root package.json
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (running locally or cloud instance)
- **Redis** (optional, for session storage)
- **Docker**
- **Make** ([Mac](https://formulae.brew.sh/formula/make), [Windows](https://stackoverflow.com/questions/2532234/how-to-run-a-makefile-in-windows))

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
3. **Set up mongodb and other images**
   **MongoDB (.env in mongodb-docker-setup/)**
   ```env
   MONGO_USER=root
   MONGO_PASSWORD=StrongRootPass123
   MONGO_DB=dagverse
   ```
   **For Mac**
   ```bash
      chmod +x docker_pull_images.sh
      ./docker_pull_images.sh
   ```
   **For Windows**
   ```bash
      Double-click to run, or run in Command Prompt -- docker_pull_images.bat
   ```
   **MakeFile**
   ```bash
      make
   ```
4. Access Mongo Express Web UI

   Visit http://localhost:8082 in your browser.
   
   Username: admin
   Password: admin123
   
  | 🔒 You can change these credentials in the docker-compose.yml file under the mongo-express service.
   Access to your MongoDB via IP 127.0.0.1 and port 27017

6. **Set up environment variables**

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

7. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

8. **Start both frontend and backend**
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
- `GET /api/user/profile` - Get user profile
- `GET /api/health` - Server health status

## Status

- **Smart contract deployment:** In progress (BlockDAG testnet integration planned)
- **Live demo:** Coming soon
- **Demo video:** [https://youtu.be/RXWu7r9pr6s]
- **Deployed contract address:** [SessionLog.sol-0xeBE423bb8385cFF5fAD469464faB81a783ee244a] [PaymentEscrow.sol-0x969005435a2648e031Bf88F71d6DDA8D6a4E6DB3]

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

**Happy coding with DAGVerse! 🚀**
