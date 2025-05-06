# Daily Tools

Daily Tools is a web application that provides a collection of useful online tools to simplify everyday tasks. It features user accounts, saved tools, and a responsive design for both desktop and mobile users.

## Features

- **User Authentication**: Sign up, login, and account management
- **Tool Collection**: Various calculators, converters, and other useful tools
- **Saved Tools**: Save your favorite tools for quick access
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB account (using MongoDB Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/daily-tools.git
   cd daily-tools
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables (in production):
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development server:
   ```
   npm run setup
   ```
   This will seed the database with sample data and start the server.

### Default User Accounts

When running the setup script, the following user accounts are created:

1. **Demo User**
   - Email: demo@example.com
   - Password: password123

2. **Admin User**
   - Email: admin@dailytools.com
   - Password: admin123

## Project Structure

```
daily-tools/
├── server/                 # Backend files
│   ├── controllers/        # API controllers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── db.js               # Database connection
│   ├── seed.js             # Database seeding
│   └── server.js           # Main server file
├── pages/                  # Frontend pages
│   ├── user/               # User account pages
│   └── tools/              # Tool pages
├── nav/                    # Navigation components
│   ├── style.css           # Navigation styles
│   └── script.js           # Navigation scripts
└── package.json            # Project dependencies
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update user password
- `PUT /api/auth/preferences` - Update user preferences

### Tools

- `GET /api/tools` - Get all tools
- `GET /api/tools/category/:category` - Get tools by category
- `GET /api/tools/popular` - Get popular tools
- `GET /api/tools/new` - Get new tools
- `GET /api/tools/:id` - Get tool by ID
- `POST /api/tools/:id/usage` - Increment tool usage count

### Saved Tools (Requires Authentication)

- `GET /api/tools/user/saved` - Get user's saved tools
- `POST /api/tools/user/save/:toolId` - Save a tool
- `DELETE /api/tools/user/save/:toolId` - Remove a saved tool

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/daily-tools](https://github.com/yourusername/daily-tools) 