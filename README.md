# elwaseet (الوسيط)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)

> A local services marketplace platform connecting customers with trusted service providers through secure escrow-based transactions.

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**elwaseet** (Arabic: الوسيط, meaning "the intermediary") is a full-stack web platform designed to bridge Lebanon's informal service economy with digital trust. The platform enables customers to post service requests and connect with local service providers (plumbers, electricians, tutors, cleaners, etc.) while protecting both parties through an escrow payment system.

### The Problem We're Solving

- **Lack of Trust**: In Lebanon's informal service economy, customers and providers struggle with trust issues
- **Payment Disputes**: No standardized way to handle payment conflicts
- **Discovery**: Difficult for customers to find reliable service providers
- **Accountability**: No rating system to hold both parties accountable

### Our Solution

elwaseet acts as a trusted intermediary by:
1. Holding payments in escrow until service completion
2. Providing a transparent rating and review system
3. Offering structured dispute resolution
4. Creating a searchable marketplace of verified providers

---

## ✨ Key Features

### For Customers
- 🔍 **Browse & Search** - Find service providers by category, rating, location, and price
- 📝 **Post Job Requests** - Describe your needs and receive competitive quotes
- 💰 **Escrow Protection** - Payment held safely until you confirm satisfactory completion
- ⭐ **Rate & Review** - Share your experience to help future customers
- 🛡️ **Dispute Resolution** - Admin-mediated conflict resolution with evidence submission

### For Service Providers
- 📢 **Job Notifications** - Get alerted when jobs match your skills and location
- 💼 **Professional Profile** - Showcase services, portfolio, rates, and availability
- 📅 **Availability Management** - Set your schedule and service areas
- 💵 **Guaranteed Payment** - Escrow ensures you get paid for completed work
- 🌟 **Build Reputation** - Earn ratings and verified badges to attract more customers

### For Administrators
- ⚖️ **Dispute Resolution Dashboard** - Review evidence and make fair decisions
- 👥 **User Moderation** - Verify providers and handle reported users
- 📊 **Platform Analytics** - Monitor jobs, disputes, and system health
- 🔒 **Security Controls** - Ban fraudulent accounts and suspicious activity

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Redux (TBD)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Security**: Spring Security + JWT Authentication
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA (Hibernate)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Hibernate Validator
- **Email**: SendGrid API (100 emails/day free tier)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Project Management**: Jira (Scrum)
- **Code Quality**: SonarLint
- **API Testing**: Postman
- **Database Client**: pgAdmin / DBeaver
- **CI/CD**: GitHub Actions (planned)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Customer   │  │   Provider   │  │    Admin     │       │
│  │   Dashboard  │  │   Dashboard  │  │   Dashboard  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                    React Application                        │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTPS / REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Spring Boot REST API                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │   │
│  │  │    Auth    │  │    Jobs    │  │   Escrow   │      │   │
│  │  │ Controller │  │ Controller │  │ Controller │      │   │
│  │  └────────────┘  └────────────┘  └────────────┘      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │   │
│  │  │   Users    │  │  Disputes  │  │  Reviews   │      │   │
│  │  │ Controller │  │ Controller │  │ Controller │      │   │
│  │  └────────────┘  └────────────┘  └────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Service Layer (Business Logic)        │   │
│  │  - Escrow Management  - Job Matching  - Notifications│   │
│  │  - Dispute Resolution - Rating System - Verification │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Repository Layer (Data Access - JPA)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                PostgreSQL Database                   │   │
│  │  Tables: users, jobs, escrow_transactions, reviews,  │   │
│  │          disputes, notifications, categories         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Core Data Flow: Escrow Payment

```
Customer                Platform                 Provider
   │                       │                         │
   │  1. Book Service      │                         │
   ├──────────────────────>│                         │
   │                       │  2. Notify Provider     │
   │                       ├────────────────────────>│
   │                       │                         │
   │  3. Pay to Escrow     │                         │
   ├──────────────────────>│                         │
   │     ($100 HELD)       │  4. Payment Secured     │
   │                       ├────────────────────────>│
   │                       │                         │
   │                       │  5. Complete Job        │
   │                       │<────────────────────────┤
   │                       │                         │
   │  6. Confirm Work      │                         │
   ├──────────────────────>│                         │
   │                       │  7. Release Payment     │
   │                       ├────────────────────────>│
   │                       │     ($100 RELEASED)     │
   │  8. Rate Provider     │                         │
   ├──────────────────────>│  9. Rate Customer       │
   │                       │<────────────────────────┤
```

---

## 🚀 Getting Started

### Prerequisites

- **Java JDK**: 17 or higher
- **Node.js**: 18+ and npm (You MUST install Node.js to work with React. No way around it for frontend development.)
- **PostgreSQL**: 15+
- **Git**: Latest version
- **IDE**: IntelliJ IDEA / VS Code / Antigravity

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (Maven will auto-download)
./mvnw clean install

# Configure database (edit application.properties)
# Set your PostgreSQL credentials

# Run database migrations (if using Flyway/Liquibase)
./mvnw flyway:migrate

# Start Spring Boot application
./mvnw spring-boot:run

# Backend runs on http://localhost:8080
```

**application.properties example:**
```properties
# Minimal working config
spring.datasource.url=jdbc:postgresql://localhost:5432/elwaseet_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=elwaseet_jwt_secret_key_change_in_production
jwt.expiration=86400000

# Skip SendGrid for MVP
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your backend URL
REACT_APP_API_URL=http://localhost:8080/api

# Start development server
npm start

# Frontend runs on http://localhost:3000
```

### Database Setup

```sql
-- Create database
CREATE DATABASE elwaseet_db;

-- Connect to database
\c elwaseet_db

-- Tables will be auto-created by Hibernate on first run
-- OR run migration scripts from /backend/src/main/resources/db/migration
```

### Verify Installation

1. Backend health check: `http://localhost:8080/actuator/health`
2. API documentation: `http://localhost:8080/swagger-ui.html`
3. Frontend: `http://localhost:3000`

---

## 📁 Project Structure

```
elwaseet/
├── backend/                          # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/elwaseet/
│   │   │   │   ├── config/          # Security, CORS, etc.
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities (models)
│   │   │   │   ├── repository/      # Data access layer
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── security/        # JWT, auth logic
│   │   │   │   ├── exception/       # Custom exceptions
│   │   │   │   └── util/            # Helper classes
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/    # SQL scripts
│   │   └── test/                    # Unit & integration tests
│   ├── pom.xml                      # Maven dependencies
│   └── README.md
│
├── frontend/                         # React application
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Buttons, inputs, cards
│   │   │   ├── customer/            # Customer-specific components
│   │   │   ├── provider/            # Provider-specific components
│   │   │   └── admin/               # Admin dashboard components
│   │   ├── pages/                   # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── ProviderDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/                # API calls
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   ├── escrowService.js
│   │   │   └── reviewService.js
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── utils/                   # Helper functions
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
├── docs/                            # Project documentation
│   ├── api/                         # API documentation
│   ├── architecture/                # System design docs
│   ├── user-stories/                # User scenarios
│   └── sprint-planning/             # Jira sprint docs
│
├── .gitignore
├── README.md                        # This file
└── LICENSE
```

---

## 🔄 Development Workflow

We follow **Git Flow** with **Scrum methodology** managed in Jira.

### Branch Naming Convention

```
main                           # Production-ready code
├── develop                    # Integration branch
    ├── feature/login-page     # New features
    ├── feature/escrow-system
    ├── bugfix/header-padding  # Bug fixes
    └── hotfix/security-patch  # Critical fixes
```
# Branch Naming Guide

New feature? → feature/what-you-build
Bug fix? → bugfix/what-you-fixed
Emergency? → hotfix/critical-issue

Always branch from: develop
Always merge to: develop (then later to main)
Never work directly on: main or develop


### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Commits**
   ```bash
   git add .
   git commit -m "Add login form UI"
   ```
   
   **Commit Message Format:**
   ```
   <type>: <description>
   
   Types: feat, fix, docs, style, refactor, test, chore
   
   Examples:
   - feat: Add escrow payment endpoint
   - fix: Fix API request validation
   - docs: Update API documentation
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open Pull Request (PR)**
   - Target branch: `develop`
   - Add description of changes
   - Add screenshots (if UI changes)
   - Link to Jira ticket: `Closes ELWA-123`
   - Request review from at least 1 team member

5. **Code Review**
   - Reviewer checks:
     - Code quality & naming conventions
     - Architecture adherence
     - No bugs introduced
     - Tests passing
     - Performance & security

6. **Merge Approval**
   - Use **Squash & Merge** to keep clean history
   - Delete feature branch after merge

### Daily Standup (10 minutes)

Every day, each team member answers:
1. ✅ **What did I do yesterday?**
2. 🎯 **What will I do today?**
3. 🚧 **Any blockers?**

**Format**: Update in Jira + quick team sync

### Sprint Cycle (1 week maximum)

```
Sprint Planning → Daily Standups → Development → Sprint Review → Retrospective
     ↓                                                                ↑
     └────────────────────────────────────────────────────────────────┘
```

1. **Sprint Planning** - Select tasks from backlog
2. **Daily Work** - Code, commit, push, review
3. **Sprint Review** - Demo completed features
4. **Retrospective** - What went well/wrong, improve

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints (DRAFT - Subject to Change)

| Method | Endpoint         | Description       | Auth Required  |
|--------|------------------|-------------------|----------------|
| POST   | `/auth/register` | Register new user | ❌            |
| POST   | `/auth/login`    | Login user        | ❌            |
| POST   | `/auth/logout`   | Logout user       | ✅            |
| GET    | `/auth/me`       | Get current user  | ✅            |

### Job Endpoints

| Method | Endpoint                    | Description          | Auth Required |
|--------|-----------------------------|----------------------|---------------|
| GET    | `/jobs`                     | Get all jobs         | ✅           |
| GET    | `/jobs/{id}`                | Get job by ID        | ✅           |
| POST   | `/jobs`                     | Create new job       | ✅ Customer  |
| PUT    | `/jobs/{id}`                | Update job           | ✅ Customer  |
| DELETE | `/jobs/{id}`                | Delete job           | ✅ Customer  |
| GET    | `/jobs/category/{category}` | Get jobs by category | ✅           |
| POST   | `/jobs/{id}/apply`          | Apply to job         | ✅ Provider  |

### Escrow Endpoints

| Method | Endpoint          | Description       | Auth Required |
|--------|-------------------|-------------------|---------------|
| POST   | `/escrow/deposit` | Deposit to escrow | ✅ Customer  |
| POST   | `/escrow/release` | Release payment   | ✅ Customer  |
| POST   | `/escrow/refund`  | Refund payment    | ✅ Admin     |
| GET    | `/escrow/balance` | Get user balance  | ✅           |

### User Endpoints

| Method | Endpoint           | Description          | Auth Required|
|--------|--------------------|----------------------|--------------|
| GET    | `/users/{id}`      | Get user profile     | ✅          |
| PUT    | `/users/{id}`      | Update profile       | ✅          |
| GET    | `/users/providers` | Get all providers    | ✅          |
| POST   | `/users/verify`    | Request verification | ✅ Provider |

### Review Endpoints

| Method | Endpoint                 | Description          | Auth Required |
|--------|--------------------------|----------------------|---------------|
| POST   | `/reviews`               | Create review        | ✅           |
| GET    | `/reviews/provider/{id}` | Get provider reviews | ✅           |
| GET    | `/reviews/customer/{id}` | Get customer reviews | ✅           |

### Dispute Endpoints

| Method | Endpoint                 | Description      | Auth Required |
|--------|--------------------------|------------------|---------------|
| POST   | `/disputes`              | Open dispute     | ✅           |
| GET    | `/disputes`              | Get all disputes | ✅ Admin     |
| PUT    | `/disputes/{id}/resolve` | Resolve dispute  | ✅ Admin     |

**Full API documentation available at:** `http://localhost:8080/swagger-ui.html`

---

## 👥 Team

| Name          | Role                         | GitHub              |
|---------------|------------------------------|---------------------|
| Israa Sakr    | Team Leader & Full-Stack Dev | [@IsraaSakr]        |
| Nour Haffar   | Frontend Developer           | [@Nourhaffar]       |
| Mazen Naji    | Backend Developer            | [@Mazennaji]        |
| Jonathan      | Backend Developer            | [@JohnBZ24]         |
| Rubby         | Backend Developer            | [@Mariam-El-Jarkas] |
| Nizar         | Backend Developer            | [@Anynomous-A]      |
| Samah Chehade | Backend Developer            | [@Samah-Chehade]    |

**Note:** Specific role assignments (Backend, Frontend, Full-Stack) will be decided collaboratively during our first sprint planning meeting based on individual preferences and skills.

### Communication Channels
- **Project Management**: Jira
- **Code Reviews**: GitHub Pull Requests
- **Documentation**: This repo + Confluence (optional)
- **All task-related communication**: Jira comments (not WhatsApp)

---

## 🤝 Contributing

### For Team Members

1. **Never commit directly to `main` or `develop`**
2. **Always create a feature branch**
3. **Update Jira ticket status** when you start/complete work
4. **Write meaningful commit messages**
5. **Request code review before merging**
6. **Update documentation** if you change APIs
7. **Write tests** for new features (when possible)

### Code Style Guidelines

**Java (Backend):**
- Follow Google Java Style Guide
- Use meaningful variable names: `customerBalance` not `cb`
- Keep methods under 50 lines
- Add JavaDoc for public methods
- Use `@Service`, `@Repository`, `@Controller` annotations properly

**JavaScript/React (Frontend):**
- Use functional components with hooks
- Component names: PascalCase (`JobCard.jsx`)
- Functions: camelCase (`handleSubmit`)
- Use meaningful props: `isLoading` not `loading`
- Keep components under 200 lines
- Extract reusable logic into custom hooks

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Jira Ticket
Closes ELWA-XXX

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] API endpoints work
- [ ] UI looks correct

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No hardcoded credentials
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Acknowledgments

- Built as part of an internship project
- Inspired by platforms like TaskRabbit, ServiceMarket, Airtasker, Urban Company
- Special thanks to our mentors and advisors

---

## 📞 Contact

For questions or support, please contact the team leader:
- **Email**: israasakr.1204@gmail.com
- **Jira**: (https://israasakr.atlassian.net/jira/software/projects/EL/boards/1/backlog?jql=&atlOrigin=eyJpIjoiYjkzNjczOGY3MGQ2NGUyZDkxMjk0MzU3NWRiMjQ3ZGIiLCJwIjoiaiJ9)

---

**⭐ If you're a team member, make sure to:**
1. Clone this repository
2. Set up your local environment
3. Update your Jira tasks daily
4. Follow the Git workflow
5. Ask questions in Jira comments

Let's build something great! 🚀
