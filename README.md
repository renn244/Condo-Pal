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

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![ShadCn](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)
![Tanstack Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=fff)
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.15.1-FF6B81?logo=recharts&logoColor=white&style=flat-square)

**Backend**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Nest Js](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Node Js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![PassportJs](https://img.shields.io/badge/Passport.js-24a357?style=for-the-badge&logo=passport&logoColor=white)
![Google OAuth 2.0](https://img.shields.io/badge/Google_OAuth_2.0-4285F4?logo=google&logoColor=white&style=flat-square)
![PayMongo](https://img.shields.io/badge/PayMongo-00B14F?logo=data:image/svg+xml;base64,BASE64_SVG_DATA&logoColor=white&style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-010101??style=flat-square&logo=Socket.io&logoColor=white)

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