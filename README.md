# MediCare Plus - Hospital Management System

MediCare Plus is a modern, responsive MERN stack web application enabling patients to book doctor appointments and manage their healthcare interactions, while allowing admins to manage doctors, patients, and appointments.

## Features

**Patient Role:**
- Secure registration and email OTP verification
- View featured doctors and browse all doctors by department
- View doctor details, experience, and available days
- Book appointments with duplicate slot prevention
- Dedicated patient dashboard to manage profile and view upcoming/past appointments

**Admin Role:**
- Comprehensive dashboard with statistics (total doctors, patients, appointments)
- Manage doctors (Add, Edit, Delete)
- View all registered patients
- Manage appointment requests (Approve, Cancel)

## Tech Stack

- **Frontend:** React 19 (Vite), React Router, Tailwind CSS (v4), React Hook Form, Yup, React Toastify, Lucide React
- **Backend:** Node.js, Express.js, Mongoose, JWT (JSON Web Tokens), bcryptjs, Nodemailer (Email OTP)
- **Database:** MongoDB

## Prerequisites

- Node.js installed on your machine
- MongoDB instance (local or Atlas)
- Gmail account with an App Password (for Nodemailer)

## Setup Instructions

### 1. Clone the repository

If you haven't already:
```bash
git clone <your-repo-url>
cd medicare-plus
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (you can copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medicare-plus
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
# OR
node server.js
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173` and will proxy API requests to the backend on `http://localhost:5000`.

## Notes on Testing

1. **Admin Account:** To create an admin account, register a normal user via the UI, then manually change their `role` field from `'patient'` to `'admin'` in the MongoDB database.
2. **OTP Emails:** Ensure you use a valid Gmail account and App Password for Nodemailer. The OTP is required to log in for the first time.
3. **Database Population:** As an admin, you can use API endpoints (e.g. Postman) to create doctors since the Admin UI for doctor creation was heavily simplified to API routes in the PRD scope to save time. 
