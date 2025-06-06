# CondoPal

CondoPal is a hassle-free platform for condo landlords and property managers, simplifying rental management with automated rent collection, financial tracking, and tenant communication. Tenants can pay via digital methods, cash (manually recorded), or GCash with photo verification, while landlords get real-time insights into income and expenses. Maintenance requests can be submitted and tracked online, and built-in chat ensures smooth communication. Designed for individual condo owners, small property managers, and overseas Filipino workers (OFWs), CondoPal eliminates scattered processes with an all-in-one solution. It operates on a subscription model with optional add-ons like legal support—making condo rentals easier, more efficient, and more profitable.

## Features
- Dashboards, analytics and tables for payment, maintenance and expenses as well as charts on certain parts of application
- Authentication with Google Oauth 2.0 and Local Credentials (No confirmation email yet)
- Smart Rent Collection. Tenant Pay Via Paymongo, Gcash(photo Verification) and cash (landlord manual record)
- Auto-reminders (email) 1 week advance notice.
- Payment History and Receipt.
- Real-time financial insights with automated rent and maintenance tracking.
- Tenants submit repair requests online and track progress in real time because the maintenance worker will be the one to update it using a link we provided that also provide information about maintenance as well as group chat for tenant, landlord and assigned worker.
- Cost Responsibility over the maintenance. and also expenses that can have one billing month or recurring (Eg. Electricity bill)
- Seamless Communication with seen feature, notification audio, as well as media and file's upload and views. All real time using socket.io

## Tech Stack
This is the technology that i sed for building this application

**Frontend**
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)


## Installation

### Development

In the development environment you need to have two terminals open one for the frontend and one for the backend

**1st terminal**
```powershell
    npm run install
    cd frontend 
    npm run dev
```

**2nd terminal**
```powershell
    cd backend
    npm run start:dev
```

### Production
In here you would only need 1 terminal

**Build**
```powershell
    npm run build
```

**Start**
```powershell
    npm run start
```

## Environmental Variables
**Frontend**
- VITE_BACKEND_URL
- VITE_SOCKET_URL
- VITE_PAYMONGO_TEST_PUBLIC
- VITE_PAYMONGO_API_URL
- VITE_SOFTWARE_ENV

**Backend**
- DATABASE_URL
- JWT_SECRET
- PORT=5000
- CLIENT_BASE_URL
- SOFTWARE_ENV
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URL
- SENDGRID_API_KEY
- PAYMONGO_TEST_PUBLIC
- PAYMONGO_TEST_SECRET
- PAYMONGO_API_URL
- CLOUDINARY_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CRON_JOB_TOKEN