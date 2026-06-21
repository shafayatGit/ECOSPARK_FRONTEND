# EcoSpark Hub 🌱

## Community Driven Sustainability Platform

EcoSpark Hub is a full-stack sustainability community platform where users can share, discuss, and promote environmental ideas. Members can submit ideas, vote, comment, and purchase premium content. Admins manage moderation, users, and platform quality.

---

# 🌐 Live Application

🚀 Live Website:

[ecospark-domain.vercel.app](https://ecospark-domain.vercel.app)

---

# 🔑 Demo Credentials

## Admin Account

Email:
ecosparkadmin@gmail.com

Password:
1234Admin@

Admin Features:

- Manage users
- Activate/deactivate accounts
- Review submitted ideas
- Approve/reject ideas
- Manage categories
- Monitor platform activity

Member Features:

- Create ideas
- Edit drafts
- Submit ideas
- Vote ideas
- Comment and reply
- Purchase premium ideas
- Manage profile

---

# 📌 Project Overview

EcoSpark Hub combines:

- Reddit → voting and community discussions
- Medium → content publishing workflow
- Stripe → premium content access

The platform allows members to submit sustainability solutions and helps high-quality ideas gain visibility.

---

# ✨ Features

## Authentication

- User registration
- Login system
- JWT authentication
- Role based authorization
- Secure password handling

## Idea Management

Users can:

- Create ideas
- Save drafts
- Submit ideas
- Edit rejected ideas
- View approved ideas

Idea workflow:

DRAFT
↓
PENDING
↓
UNDER_REVIEW
↓
APPROVED / REJECTED

---

## Voting System

Features:

- Upvote
- Downvote
- Change vote
- Remove vote
- One vote per user per idea

---

## Nested Comments

Reddit style comment system.

Supports:

- Replies
- Nested discussion
- Soft delete
- Thread preservation

Example:

Comment
├── Reply
│ └── Reply

---

## Premium Idea System

Users can unlock premium ideas through payment.

Payment Flow:

User starts payment

↓

Purchase created as PENDING

↓

Payment gateway

↓

Webhook verification

↓

Access granted

Payment is only confirmed after webhook verification.

---

# 🛠 Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- TanStack Query

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL

## ORM

- Prisma

## Authentication

- JWT

## Payment

- Stripe

## Image Storage

- Cloudinary

## Deployment

- Vercel
- Render / Railway

---

# 🏗 System Architecture

Client

↓

Next.js Application

↓

REST API

↓

Express Server

↓

Prisma ORM

↓

PostgreSQL Database

---

# 📂 Project Structure

EcoSpark-Hub

```
├── frontend
│
│── app
│── components
│── hooks
│── services
│── utils
│
├── backend
│
│── src
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── prisma
│   └── utils
│
└── README.md
```

---

# 🗄 Database Models

## Users

Fields:

```
id
name
email
password
role
status
createdAt
updatedAt
```

Roles:

```
ADMIN
MEMBER
```

---

## Categories

Example:

```
Energy
Waste
Environment
Technology
```

---

## Ideas

Fields:

```
id
title
problemStatement
proposedSolution
description
status
isPaid
price
authorId
categoryId
upvoteCount
downvoteCount
createdAt
```

---

## Votes

Fields:

```
id
userId
ideaId
type
createdAt
```

Rule:

One user can vote once per idea.

---

## Comments

Fields:

```
id
content
authorId
ideaId
parentId
isDeleted
```

---

## Purchases

Fields:

```
id
userId
ideaId
transactionId
paymentStatus
amountPaid
gateway
```

---

# 🔌 API Documentation

## Authentication

Register:

```
POST /api/auth/register
```

Login:

```
POST /api/auth/login
```

Current User:

```
GET /api/auth/me
```

---

# Ideas API

Get Ideas:

```
GET /api/ideas
```

Search:

```
GET /api/ideas?q=solar
```

Get Idea:

```
GET /api/ideas/:id
```

Create Idea:

```
POST /api/ideas
```

Update:

```
PUT /api/ideas/:id
```

Submit:

```
PATCH /api/ideas/:id/submit
```

---

# Voting API

Create vote:

```
POST /api/votes
```

Remove vote:

```
DELETE /api/votes/:id
```

---

# Comment API

Create comment:

```
POST /api/comments
```

Reply:

```
POST /api/comments/:id/reply
```

---

# Payment API

Create purchase:

```
POST /api/purchases
```

Stripe webhook:

```
POST /api/purchases/webhook
```

---

# Admin API

Get users:

```
GET /api/admin/users
```

Update user:

```
PATCH /api/admin/users/:id
```

Review ideas:

```
GET /api/admin/ideas
```

Approve:

```
PATCH /api/admin/ideas/:id/approve
```

Reject:

```
PATCH /api/admin/ideas/:id/reject
```

---

# ⚙️ Installation

Clone repository:

```bash
git clone your-repository-url
```

## Backend Setup

```bash
cd backend

npm install
```

Create .env:

```
PORT=5000

DATABASE_URL=

JWT_SECRET=

STRIPE_SECRET_KEY=

CLOUDINARY_URL=
```

Run:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Run:

```bash
npm run dev
```

---

# 🔐 Security

Implemented:

- JWT authentication
- Role based access
- Password hashing
- Input validation
- Secure APIs
- Stripe webhook verification
- SQL injection protection
- Soft delete system

---

# 📱 Responsive Design

Supported:

- Mobile
- Tablet
- Desktop

Layout:

```
Desktop → 3 columns

Tablet → 2 columns

Mobile → 1 column
```

---

# 🚀 Future Improvements

- AI idea recommendation
- Real time notifications
- Mobile application
- Analytics dashboard
- Sustainability scoring

---

# 👨‍💻 Author

Md. Shafayat Hossain Patowary

GitHub:

[https://github.com/shafayatGit](https://github.com/shafayatGit)

Portfolio:

[https://shafayat-dev.vercel.app](https://shafayat-dev.vercel.app)

---

⭐ EcoSpark Hub — Building a sustainable future through community ideas
