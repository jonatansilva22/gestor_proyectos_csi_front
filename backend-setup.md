# Backend Setup Instructions

## Backend Repository
Repository: https://github.com/jonatansilva22/gestor_proyectos_csi_back

## Branches Setup

### 1. For User Login Functionality
```bash
git clone https://github.com/jonatansilva22/gestor_proyectos_csi_back.git
cd gestor_proyectos_csi_back
git checkout LogIn
```

### 2. For User Creation Functionality
```bash
# In the same repo directory, switch to user creation branch
git checkout RamaAlanBack
```

## Django Backend Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create `.env` file in the backend root:
```bash
# Database Configuration
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration (for frontend connection)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 6. Run Backend Server
```bash
python manage.py runserver
```

## API Endpoints

### Login Branch Endpoints (LogIn branch)
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `POST /api/token/refresh/` - Refresh JWT token

### User Creation Branch Endpoints (RamaAlanBack branch)
- `POST /api/create-user/` - Create new user
- `GET /api/users/` - List all users
- `GET /api/user/{id}/` - Get specific user
- `PATCH /api/user/{id}/update/` - Update user
- `DELETE /api/user/{id}/delete/` - Delete user

## Testing Backend Connection

### 1. Test Login Endpoint
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### 2. Test User Creation Endpoint
```bash
curl -X POST http://localhost:8000/api/create-user/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role_type": 1
  }'
```

## Frontend Configuration

The frontend is already configured to connect to:
- Login endpoints: `/api/login/`, `/api/logout/`, `/api/token/refresh/`
- User endpoints: `/api/create-user/`, `/api/users/`, `/api/user/{id}/`, etc.

Make sure the backend is running on `http://localhost:8000` or update the `VITE_API_URL` in the frontend `.env` file.