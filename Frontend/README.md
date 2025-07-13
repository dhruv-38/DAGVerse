# DAGVerse Frontend

A modern React frontend for the DAGVerse decentralized development platform, built with Tailwind CSS and React Router.

## Features

- 🔐 **Authentication System** - Login/Register with persistent sessions
- 🏠 **Home Page** - Landing page with features and call-to-action
- 📊 **Dashboard** - User dashboard with stats, projects, and activity feed
- 💰 **Wallet Integration** - Connect and manage DAG wallet (simulated)
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🛡️ **Protected Routes** - Secure access to authenticated pages

## Tech Stack

- **React 19** - Latest React with hooks and modern patterns
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Local Storage** - Persistent authentication state

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   └── ProtectedRoute.jsx # Route protection component
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # User dashboard
│   └── Wallet.jsx      # Wallet management
├── utils/              # Utility functions and context
│   ├── auth.js         # Authentication utilities
│   └── AuthContext.jsx # React context for auth state
├── App.jsx             # Main app component with routing
└── main.jsx           # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd DAGVerse/Frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

- **Demo Mode**: Use any email and password to sign in
- The authentication is simulated for demo purposes
- User sessions persist across browser refreshes

### Navigation

- **Home** (`/`) - Landing page accessible to all users
- **Login** (`/login`) - Authentication page
- **Dashboard** (`/dashboard`) - Protected page for authenticated users
- **Wallet** (`/wallet`) - Protected page for wallet management

### Wallet Features

- **Connect Wallet** - Simulated wallet connection
- **View Balance** - Display DAG token balance
- **Transaction History** - View recent transactions
- **Wallet Actions** - Send, receive, and manage DAG tokens

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

- **Styling**: Modify Tailwind classes in components
- **Routing**: Add new routes in `App.jsx`
- **Authentication**: Extend `AuthContext.jsx` for real backend integration
- **Wallet**: Replace simulated wallet with real blockchain integration

## Design System

### Colors
- **Primary**: Blue gradient (`from-blue-600 to-purple-600`)
- **Background**: Dark gradient (`from-gray-900 via-blue-900 to-gray-900`)
- **Text**: White and gray variations
- **Accents**: Green (success), Red (error), Orange (warning)

### Components
- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Navigation**: Transparent with backdrop blur
- **Forms**: Dark theme with focus states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the DAGVerse hackathon project.

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.
