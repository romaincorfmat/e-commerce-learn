# E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js and Express.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This project is a complete e-commerce solution featuring a responsive frontend built with Next.js 15 and a robust backend API powered by Express.js. The application includes user authentication, product management, shopping cart functionality, and more.

## Features

- **User Authentication** - Secure login, registration, and JWT-based session management
- **Product Catalog** - Browse products with filtering and search capabilities
- **Shopping Cart** - Add, remove, and manage items in your shopping cart
- **Admin Dashboard** - Manage products, categories, and user accounts
- **Responsive Design** - Optimized for both desktop and mobile devices

## Tech Stack

### Frontend

- **Next.js 15** - React framework with server-side rendering
- **React 19** - UI component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hook Form** - Form validation
- **Zod** - Schema validation
- **Radix UI** - Accessible UI components

### Backend

- **Express.js** - Node.js web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
```

2. Install backend dependencies

```bash
cd server
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Create environment files
   - Create `.env` in the server directory with:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   - Create `.env.local` in the frontend directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

### Running the Application

1. Start the backend server

```bash
cd server
npm run dev
```

2. Start the frontend development server

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
e-commerce/
├── frontend/          # Next.js frontend application
│   ├── app/           # App router pages and layouts
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── lib/           # Utility functions
│   └── public/        # Static assets
│
└── server/            # Express.js backend API
    ├── controllers/   # Request handlers
    ├── database/      # Database connection and models
    ├── middlewares/   # Express middlewares
    ├── routes/        # API routes
    ├── services/      # Business logic
    └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
