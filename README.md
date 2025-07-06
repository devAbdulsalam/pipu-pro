# **Pipupro Backend**  
*A Customer Relations Management (CRM), Guest Management, and HR Solution*  

![Pipupro Logo](https://via.placeholder.com/150x50?text=Pipupro)  
**Built with:** Node.js, TypeScript, Express, MongoDB, Socket.IO  

---

## **📌 Table of Contents**  
1. [Project Overview](#-project-overview)  
2. [Prerequisites](#-prerequisites)  
3. [Setup & Installation](#-setup--installation)  
4. [Running the Project](#-running-the-project)  
5. [Project Structure](#-project-structure)  
6. [Environment Variables](#-environment-variables)  
7. [API Documentation](#-api-documentation)  
8. [Testing](#-testing)  
9. [Contributing](#-contributing)  
10. [Troubleshooting](#-troubleshooting)  
11. [License](#-license)  

---

## **🚀 Project Overview**  
Pipupro is a **CRM, Guest Management, and HR solution** with features like:  
✅ Live video meetings  
✅ Real-time chat  
✅ Employee management (attendance, payroll, tasks)  
✅ Role-based access control  
✅ Subscription-based feature access  

This repository contains the **backend** (API & real-time services) built with:  
- **Node.js** (Runtime)  
- **TypeScript** (Type-safe JavaScript)  
- **Express.js** (API framework)  
- **MongoDB** (Database)  
- **Socket.IO** (Real-time communication)  

---

## **📋 Prerequisites**  
Before running the project, ensure you have:  
- **Node.js** (v18+)  
- **npm** (v9+) or **Yarn** (v1.22+)  
- **MongoDB** (Running locally or a cloud URI)  
- **Git** (For version control)  

---

## **⚙️ Setup & Installation**  
### **1. Clone the Repository**  
```bash
git clone https://github.com/your-org/pipupro-backend.git
cd pipupro-backend
```

### **2. Install Dependencies**  
```bash
npm install
# or
yarn install
```

### **3. Set Up Environment Variables**  
Create a `.env` file in the root directory and add:  
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/pipupro

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server Port
PORT=5000

# Socket.IO Config (Optional)
SOCKET_PORT=8000
```

### **4. Start the Development Server**  
```bash
npm run dev
# or
yarn dev
```
The server will run at: `http://localhost:5000`  

---

## **🏗️ Project Structure**  
```
src/
├── controllers/    # API route handlers
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── services/       # Business logic
├── utils/          # Helper functions
├── middleware/     # Auth & validation
├── config/         # DB & server setup
├── sockets/        # Socket.IO logic
└── app.ts          # Express app entry
```

---

## **🔌 API Documentation**  
API endpoints are documented using **Swagger**.  
Access docs at: `http://localhost:5000/api-docs`  

Example API:  
```http
GET /api/users → Returns all users
POST /api/auth/login → User login
```

---

## **🧪 Testing**  
Run unit & integration tests:  
```bash
npm test
# or
yarn test
```

---

## **🤝 Contributing**  
We welcome contributions! Follow these steps:  

### **1. Fork the Repository**  
- Click **Fork** on GitHub.  
- Clone your fork:  
  ```bash
  git clone https://github.com/your-username/pipupro-backend.git
  ```

### **2. Create a Feature Branch**  
```bash
git checkout -b feature/your-feature-name
```

### **3. Commit & Push Changes**  
```bash
git add .
git commit -m "feat: add new login endpoint"
git push origin feature/your-feature-name
```

### **4. Open a Pull Request (PR)**  
- Go to the **original repo** on GitHub.  
- Click **New Pull Request**.  
- Describe your changes clearly.  

### **📌 Contribution Guidelines**  
✔ Follow **TypeScript** best practices.  
✔ Write **unit tests** for new features.  
✔ Document API changes in **Swagger**.  
✔ Keep commit messages **clear & concise**.  

---

## **⚠️ Troubleshooting**  
| Issue | Solution |
|-------|----------|
| `MongoDB connection failed` | Check `.env` `MONGO_URI` or start MongoDB locally. |
| `JWT errors` | Ensure `JWT_SECRET` is set in `.env`. |
| `Port already in use` | Change `PORT` in `.env` or kill the process. |

---

## **📜 License**  
This project is licensed under **MIT**.  

---

## **🙏 Credits**  
Built with ❤️ by the **Pipupro Team**.  

**Happy Coding!** 🚀

http://13.60.21.6:9000/api/v1/users
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.14.0/bin /home/ubuntu/.nvm/versions/node/v22.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
ssh -i /Users/macbookpro/Downloads/pipu-pro-api-keys.pem ubuntu@13.60.21.6
cd /home/ubuntu/app
https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc
/Users/macbookpro/Downloads/pipu-pro-api-keys.pem
https://www.youtube.com/watch?v=s4TWZqN7VZs
# upload to aws EC2 instance


<!-- meeting 
2 free,  

make more reseach on video confresing-->


<!-- 
 payroll, 
 leave request
 profiles
 -->