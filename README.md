# Legal Case Management System

A full-stack web application for managing legal cases, clients, and court information. Built with React, Vite, Tailwind CSS, Ant Design, Node.js, Express, Prisma, and MySQL.

## Features

- **Dashboard**: Overview of cases, clients, and courts with statistics
- **Case Management**: Add, view, edit, and delete legal cases
- **Client Management**: Manage client information and track their cases
- **Court Management**: Add and manage court information
- **Rich Text Editing**: CKEditor integration for detailed case descriptions
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and Ant Design
- **Search & Filter**: Advanced search functionality across all entities

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Ant Design (antd)
- CKEditor 5
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- CORS, Helmet, Morgan middleware

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd legal-case-management
\`\`\`

### 2. Frontend Setup
\`\`\`bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
\`\`\`

### 3. Backend Setup
\`\`\`bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your database credentials
\`\`\`

### 4. Database Setup
\`\`\`bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE legal_cms;
exit

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed
\`\`\`

### 5. Start the application
\`\`\`bash
# Start backend server (from server directory)
npm run dev

# Start frontend (from root directory)
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Environment Variables

Create a `.env` file in the server directory:

\`\`\`env
DATABASE_URL="mysql://username:password@localhost:3306/legal_cms"
PORT=3001
NODE_ENV=development
\`\`\`

## API Endpoints

### Cases
- `GET /api/cases` - Get all cases
- `GET /api/cases/:id` - Get single case
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Courts
- `GET /api/courts` - Get all courts
- `GET /api/courts/:id` - Get single court
- `POST /api/courts` - Create new court
- `PUT /api/courts/:id` - Update court
- `DELETE /api/courts/:id` - Delete court

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

\`\`\`
legal-case-management/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema and migrations
│   └── server.js          # Express server
├── public/                # Static assets
└── package.json           # Frontend dependencies
\`\`\`

## Design System

The application uses a harmonized design system combining Tailwind CSS and Ant Design:

- **Colors**: Primary blue (#3b82f6) with gray accents
- **Typography**: System fonts with consistent sizing
- **Components**: Ant Design components styled with Tailwind utilities
- **Layout**: Responsive grid system with mobile-first approach
- **Spacing**: Consistent spacing scale using Tailwind classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# legal_cms
