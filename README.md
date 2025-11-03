# 💊 Pharmacy Information System

A **role-based full-stack web application** built with **Spring Boot** and **React.js** for managing pharmacy operations — including medicine inventory, supplier coordination, billing, and user authentication.

---

## 🚀 Features

### 👥 User Roles
#### 1. Admin
- Manage pharmacists and suppliers  
- View inventory and billing reports  

#### 2. Pharmacist
- Add and manage medicines  
- Issue medicines to patients  
- Handle billing and track stock levels  

#### 3. Supplier
- Receive low-stock notifications  
- Update medicine delivery and restocking  

---

## 🏗️ System Architecture
Frontend: React.js (Vite)
Backend: Spring Boot (Java)
Database: MySQL
Authentication: JWT (JSON Web Tokens)
Email Service: Spring Mail (SMTP - Gmail)

yaml
Copy code

---

## 📂 Project Modules

| Module | Description |
|--------|-------------|
| **User Management** | Role-based login and authentication |
| **Medicine Management** | Add, update, delete, and search medicines |
| **Inventory Monitoring** | Track medicine stock and auto-notify suppliers |
| **Billing System** | Generate and store patient billing records |
| **Supplier Management** | Handle orders and deliveries |
| **Email Notifications** | Forgot password & low stock alerts |
| **Reports** | View daily sales and inventory summaries |

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js (Vite)
- Axios (API communication)
- React Router
- CSS (No Tailwind)

### 🔧 Backend
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Spring Mail (SMTP)
- MySQL

---

## 🛠️ Setup Instructions

### 🔹 Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
Configure Database in application.properties

properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/pharmacydb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=pharmacyinfosystem@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
Run the backend

bash
Copy code
mvn spring-boot:run
or run PharmacyApplication.java in your IDE.

🔹 Frontend Setup
Navigate to frontend folder

bash
Copy code
cd frontend
Install dependencies

bash
Copy code
npm install
Start development server

bash
Copy code
npm run dev
Application runs at:
👉 http://localhost:5173

🔑 Authentication Flow
User logs in and receives a JWT token.

Token is stored in browser localStorage.

Protected routes require:
Authorization: Bearer <token> header.

Logout clears all tokens and sessions.

✉️ Forgot Password Flow
User enters their registered email.

System generates a reset token and sends a reset link via email.

Email includes:

java
Copy code
helper.setFrom("pharmacyinfosystem@gmail.com", "Pharmacy Information System");
User clicks the link → resets password → redirected to login page.

📦 Entity Overview
Entity	Description
User	Stores user credentials and role
Medicine	Stores medicine details, stock, and pricing
Supplier	Stores supplier information
Delivery	Tracks restocking and supplier deliveries
Billing	Stores billing and patient medicine records

🔔 Notification System
Low Stock Alert: Auto email sent to supplier when quantity < threshold.

Forgot Password: Sends secure reset link with expiry.

🧩 Future Enhancements
Add patient registration and prescription tracking

Generate downloadable PDF bills and reports

Real-time stock updates and analytics

SMS notification integration


🧠 License
This project is created for educational and academic use.