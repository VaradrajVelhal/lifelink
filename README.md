🩸 LifeLink — Blood Donation Coordination Platform

LifeLink is a full-stack web application designed to connect blood donors with hospitals in real-time, simplifying the process of requesting and fulfilling blood donations.

🚀 Features
🏥 Hospitals can create blood requests (group, units, urgency, city)
🧑‍🤝‍🧑 Donors can view and accept matching requests
🔄 Real-time request lifecycle:
Pending → Accepted → Completed
📊 Role-based dashboards for hospitals and donors
🔐 JWT-based authentication system
⚡ Fast SPA frontend with modern UI
🧱 Tech Stack
Backend
Django 6 + Django REST Framework
PostgreSQL
JWT Authentication (SimpleJWT)
Django Signals for profile auto-creation
Frontend
React (Vite)
Tailwind CSS
React Router DOM
Lucide Icons
🏗️ Architecture
React (SPA)
   │
   │ HTTP (JSON + JWT)
   ▼
Django REST API
   │
   ▼
PostgreSQL Database
Decoupled frontend + backend
RESTful API communication
Role-based access (donor / hospital)
👥 User Roles
🧑 Donor
View blood requests matching their blood group
Accept requests
Track completed donations
🏥 Hospital
Create blood requests
View all requests
Mark donations as completed
🔄 Core Workflow
Hospital creates a request
Donor sees matching requests
Donor accepts request
Hospital confirms completion
Donation is recorded
📁 Project Structure
backend/
  ├── users/
  ├── donors/
  ├── hospitals/
  ├── blood_requests/

frontend/
  ├── src/
      ├── pages/
      ├── components/
🔐 Authentication
Uses JWT (access + refresh tokens)
Custom token serializer includes:
username
role
admin flag

⚠️ Important Note:
Frontend currently does not properly attach JWT tokens to API requests (uses cookies instead), which may break authenticated endpoints.

⚙️ Setup Instructions
1. Clone the repository
git clone <your-repo-url>
cd lifelink
2. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # (or venv\Scripts\activate on Windows)

pip install -r requirements.txt
Create .env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=lifelink
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
Run server
python manage.py migrate
python manage.py runserver
3. Frontend Setup
cd frontend
npm install
npm run dev
🌐 API Endpoints (Core)
Endpoint	Method	Description
/api/users/register/	POST	Register user
/api/users/login/	POST	Login (JWT)
/api/requests/create/	POST	Create request
/api/requests/list/	GET	List requests
/api/requests/{id}/accept/	POST	Accept request
/api/requests/{id}/complete/	POST	Complete request
🧪 Future Improvements
✅ Proper JWT integration in frontend
📍 Location-based donor matching
🔔 Notification system (SMS / email)
📊 Analytics dashboard (charts already installed)
⚡ Real-time updates (WebSockets)
🧪 Add backend + frontend tests
🧠 Design Highlights
Signal-based automatic profile creation
Role-based filtering of requests
Clean separation of concerns (apps per domain)
Simple and scalable REST API
🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to improve.