# AbroadEase - Study Abroad Guide Platform

AbroadEase is a comprehensive platform for international students to find study guides, university information, and housing options. The platform features SOP and VISA guides with advanced filtering, bookmarking functionality, and admin management.

## 🏗️ Project Structure

```
abroadease/
├── api/                    # Backend (Node.js + Express + MongoDB)
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
└── web/                   # Frontend (React + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── context/       # React context
    │   ├── constants/     # Static data
    │   └── api/           # API configuration
    ├── package.json       # Frontend dependencies
    └── vite.config.js     # Vite configuration
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://cloud.mongodb.com/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abroadease
   ```

2. **Install Backend Dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../web
   npm install
   ```

## 🔧 Configuration

### Backend Configuration

1. **Create Environment File**
   ```bash
   cd api
   touch .env
   ```

2. **Add Environment Variables**
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/abroadease
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/abroadease

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secure-jwt-secret-key-here

   # Server Configuration
   PORT=1617
   NODE_ENV=development

   # Default Admin User (automatically created on first run)
   ADMIN_EMAIL=admin@abroadease.com
   ADMIN_PASSWORD=admin123
   ```

### Frontend Configuration

The frontend is pre-configured to work with the backend. The API base URL is set in `web/src/api/axios.js`:

```javascript
// For local development
baseURL: 'http://localhost:1617/api'
```

## 📦 Package Dependencies

### Backend Dependencies

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",        // Password hashing
    "cookie-parser": "^1.4.7",   // Cookie parsing
    "cors": "^2.8.5",            // Cross-origin requests
    "dotenv": "^17.2.1",         // Environment variables
    "express": "^5.1.0",         // Web framework
    "jsonwebtoken": "^9.0.2",    // JWT authentication
    "mongoose": "^8.17.1"        // MongoDB ODM
  }
}
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",          // React library
    "react-dom": "^18.2.0",      // React DOM
    "react-router-dom": "^6.8.0", // Routing
    "axios": "^1.3.0"            // HTTP client
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",          // CSS framework
    "vite": "^4.4.5"                  // Build tool
  }
}
```

## 🏃‍♂️ Running the Application

### Method 1: Manual Start (Recommended for Development)

1. **Start the Backend Server**
   ```bash
   cd api
   npm start
   ```
   
   The backend will run on `http://localhost:1617`
   
   **First Run**: If this is your first time starting the server, you'll see the admin user creation message in the console.

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd web
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

### Method 2: Using Scripts (if available)

If you have concurrent scripts set up:
```bash
npm run dev  # Runs both frontend and backend
```

## 🗄️ Database Setup

### Local MongoDB

1. **Install MongoDB Community Edition**
   - Follow the [official installation guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

3. **Verify Connection**
   ```bash
   mongo
   # or
   mongosh
   ```

## 🔐 Authentication Setup

The application uses JWT (JSON Web Tokens) for authentication and **automatically creates a default admin user** on first startup.

### Default Admin User

When you start the backend server for the first time, it will automatically create an admin user with the credentials specified in your `.env` file:

```env
ADMIN_EMAIL=admin@abroadease.com
ADMIN_PASSWORD=admin123
```

**Console Output on First Run:**
```
MongoDB connected
Default admin user created successfully!
Email: admin@abroadease.com
Password: admin123
Please change the password after first login!
```

### Important Security Notes

1. **Change Default Credentials**: For production, update the admin credentials in your `.env` file before starting the server
2. **Change Password**: Log in with the default credentials and immediately change the password through the profile page
3. **Environment Variables**: Never commit `.env` files with production credentials to version control

### JWT Secret Generation

Generate a secure random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Manual Admin Creation (Alternative)

If you prefer to create admin users manually:
```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## 🎨 Styling Configuration

The project uses **Tailwind CSS** with custom configurations:

### Tailwind Setup
```bash
cd web
npx tailwindcss init -p
```

### Custom CSS Classes
The application uses custom CSS classes defined in `web/src/index.css`:
- `.btn` - Primary button styles
- `.btn-secondary` - Secondary button styles  
- `.input` - Form input styles
- `.card` - Card container styles

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts (Guides)
- `GET /api/posts` - Get all posts with filtering
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Create bookmark
- `DELETE /api/bookmarks/:id` - Remove bookmark

### User Management
- `GET /api/me` - Get current user
- `PUT /api/me` - Update user profile

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution:** Ensure MongoDB is running or check connection string

2. **CORS Errors**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   **Solution:** Ensure backend CORS is properly configured

3. **Module Not Found**
   ```
   Cannot resolve module 'xyz'
   ```
   **Solution:** Run `npm install` in the respective directory

4. **Port Already in Use**
   ```
   EADDRINUSE: address already in use :::1617
   ```
   **Solution:** 
   ```bash
   # Find and kill process using port
   lsof -ti:1617 | xargs kill -9
   ```

### Environment Variables Check

Verify your `.env` file in the `api` directory:
```bash
cd api
cat .env
```

### Package Installation Issues

If you encounter permission errors:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Variables**
   ```env
   MONGODB_URI=<production-mongodb-uri>
   JWT_SECRET=<secure-jwt-secret>
   PORT=1617
   NODE_ENV=production
   
   # Production Admin Credentials (CHANGE THESE!)
   ADMIN_EMAIL=your-admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-password
   ```

2. **Build Command**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd web
   npm run build
   ```

2. **Serve Static Files**
   - The `dist` folder contains the production build
   - Serve using Nginx, Apache, or any static file server

### Environment-Specific Configurations

Update API base URL for production in `web/src/api/axios.js`:
```javascript
baseURL: process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'
  : 'http://localhost:1617/api'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check this README for common solutions
2. Search existing issues in the repository
3. Create a new issue with:
   - Operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

---

**Happy coding! 🎉**
