# 🦷 Dental Clinic Management System

A comprehensive dental clinic management system built with **Next.js** (frontend) and **Django** (backend).

## ✨ Features

### 👥 User Roles
- **Patients** - Book appointments, view dental records, access interactive tooth chart
- **Staff/Dentists** - Manage patients, appointments, inventory, billing
- **Owner** - Full system access, analytics, staff management

### 🎯 Key Features
- ✅ **Interactive Tooth Chart** - Anatomical curved arch design with clickable teeth
- ✅ **Expandable Patient Records** - Click to view/edit full medical history
- ✅ **Appointment Management** - Full CRUD with status tracking
- ✅ **AI Chatbot** - Patient support assistant
- ✅ **Email Authentication** - Secure token-based login
- ✅ **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework
- **Database**: SQLite
- **Authentication**: Token-based auth

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- npm or pnpm

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/dental-clinic-system.git
cd dental-clinic-system
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
python manage.py runserver
# Runs on: http://127.0.0.1:8000/
```

### Start Frontend
```bash
cd frontend
npm run dev
# Runs on: http://localhost:3000/
```

## 👤 Default Login

```
Email: ezgalauran@gmail.com
Password: abcdefghijk
```

## Project Structure

```
dental/
├── frontend/           # Next.js React frontend application
│   ├── app/           # Next.js app directory with routes
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries and API client
│   ├── public/        # Static assets (images, etc.)
│   ├── styles/        # Global styles
│   └── ...           # Configuration files (package.json, tsconfig.json, etc.)
│
├── backend/           # Django REST API backend
│   ├── api/          # Main API application
│   ├── dental_clinic/ # Django project settings
│   ├── manage.py     # Django management script
│   └── requirements.txt # Python dependencies
│
└── docs/             # Project documentation
    ├── README.md            # General project information
    ├── DATABASE_SETUP.md    # Database setup instructions
    ├── INSTALLATION.md      # Installation guide
    └── USER_GUIDE.md        # User manual
```

## Quick Start

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Documentation

For detailed information, please refer to the documentation in the `docs/` folder:

- **[Installation Guide](docs/INSTALLATION.md)** - Step-by-step installation instructions
- **[Database Setup](docs/DATABASE_SETUP.md)** - Database configuration and setup
- **[User Guide](docs/USER_GUIDE.md)** - How to use the system
- **[Project Details](docs/README.md)** - Detailed project information

## Technology Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL (or your configured database)

## License

[Add your license information here]
