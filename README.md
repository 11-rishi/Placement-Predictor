# Placement Predictor

A MERN stack application for user authentication and placement prediction.

## Project Structure

This project is organized into client and server directories:

- **client**: React frontend application
- **server**: Node.js/Express backend API with MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/placement-predictor.git
cd placement-predictor
```

### 2. Install dependencies

To install dependencies for both client and server:

```bash
npm run install-all
```

Alternatively, you can install them separately:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-predictor
JWT_SECRET=your-super-secret-key
```

Adjust the `MONGODB_URI` to your MongoDB connection string if using MongoDB Atlas.

### 4. Start MongoDB

Make sure MongoDB is running locally if you're using a local MongoDB instance.

### 5. Run the application

To run both the client and server concurrently:

```bash
npm run dev
```

To run the server or client separately:

```bash
# Run the server only
npm run server

# Run the client only
npm run client
```

The server will run on `http://localhost:5000` and the client on `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login an existing user
- **GET /api/auth/profile**: Get user profile (requires authentication)

## Technologies Used

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt 