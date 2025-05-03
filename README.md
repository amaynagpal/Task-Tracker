# Task Tracker Application

A full-stack project management and task tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication with JWT
- User profile management
- Project creation and management (maximum 4 projects per user)
- Task creation, reading, updating, and deletion
- Task status tracking (pending, in-progress, completed)
- Filter and search functionality for tasks
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for object modeling
- JWT for authentication
- bcrypt for password hashing
- Express Validator for request validation

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB database (local or Atlas)

### Environment Variables
Create a `.env` file in the root directory and add the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-tracker.git
cd task-tracker
```

2. Install server dependencies
```bash
npm install
```

3. Install client dependencies
```bash
cd client
npm install
cd ..
```

4. Run the application in development mode
```bash
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000).

## API Endpoints

### Authentication
- `POST /api/auth` - Login user
- `GET /api/auth` - Get authenticated user

### Users
- `POST /api/users` - Register user
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/changepassword` - Change user password

### Projects
- `GET /api/projects` - Get all projects for authenticated user
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a specific project
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/projects/:projectId/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Heroku Deployment
1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI
```bash
heroku login
```

3. Create a new Heroku app
```bash
heroku create your-app-name
```

4. Add MongoDB add-on or configure environment variables with your MongoDB URI
```bash
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

5. Push to Heroku
```bash
git push heroku main
```

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access (create a database user)
4. Set up network access (IP whitelist)
5. Connect to your cluster and get the connection string
6. Add the connection string to your .env file or Heroku config vars

## Folder Structure

```
task-tracker/
├── client/                           # Frontend React application
│   ├── public/                       # Static files
│   └── src/                          # React source files
│       ├── components/               # Reusable components
│       ├── contexts/                 # Context providers
│       ├── pages/                    # Page components
│       ├── services/                 # API services
│       └── utils/                    # Utility functions
├── server/                           # Backend Express application
│   ├── controllers/                  # Route controllers
│   ├── middleware/                   # Custom middleware
│   ├── models/                       # Mongoose models
│   ├── routes/                       # API routes
│   └── utils/                        # Utility functions
├── .env                              # Environment variables
├── .gitignore                        # Git ignore file
├── package.json                      # Root package.json
└── README.md                         # Project documentation
```

## Key Implementation Details

### Authentication Flow
1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Token is included in Authorization header for protected routes
5. Server middleware validates token for protected routes

### Project Limitation
- Users are limited to 4 active projects
- Frontend and backend both enforce this limitation
- Projects can be deleted to make room for new ones

### Task Status Management
- Tasks can be in one of three states: pending, in-progress, completed
- Status changes are tracked with timestamps
- Completion percentage is calculated based on completed tasks

## Bonus Features Implemented

- Social authentication options (Google, GitHub, Facebook) UI components
- Task priority levels (low, medium, high)
- Project categories (work, personal, education, etc.)
- Task filtering and sorting
- Progress tracking with visual indicators
- Project and task statistics
- Task completion date tracking

## Future Enhancements

- Email notifications for task deadlines
- Collaboration features (share projects with other users)
- File attachments for tasks
- Calendar view for tasks
- Mobile app version
- Dark/light theme toggle

## Scripts

### Root Directory
- `npm start` - Start the backend server
- `npm run server` - Start the backend server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev` - Start both backend and frontend servers concurrently

### Client Directory
- `npm start` - Start the React development server
- `npm run build` - Build the React application for production
- `npm test` - Run frontend tests

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "country": "United States"
}
```

#### Login User
```http
POST /api/auth
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
x-auth-token: <user_token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "dueDate": "2024-12-31",
  "priority": "high",
  "category": "work"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/projects/:projectId/tasks
x-auth-token: <user_token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-12-31"
}
```

## Testing

To run tests (when implemented):

```bash
# Backend tests
npm test

# Frontend tests
cd client && npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Your Name]

## Acknowledgments

- Thanks to all contributors who have helped with the project
- Special thanks to the MERN stack community for excellent documentation
- Inspired by modern project management tools