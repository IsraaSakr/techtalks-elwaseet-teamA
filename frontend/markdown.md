# Local Services Marketplace with Escrow — PRD (Full Version)

Product Requirements Document (PRD)
Version 2.0 — Fully Expanded & Reviewed

## 1. Project Overview

A web platform connecting customers with local service providers (plumbers, cleaners, tutors, technicians).
The system includes a simulated escrow mechanism where payments are held until customer confirmation.

Primary User Roles

* Customer
* Hybrid Provider (Customer + Provider)
* Admin

## 2. Goals & Non-Goals

🎯 Goals

* Enable job posting, applications, acceptance, and tracking.
* Simulated escrow lifecycle.
* Provider management system.
* Dispute resolution by admin.
* Ratings & reviews.
* Notifications & transaction history.
* Fully responsive UI.

🚫 Non-Goals

* Real online payment integration
* Mobile app
* Multi-language
* Social login
* Account type changes
* Calendar-based scheduling UI

## 3. Core Features

* Authentication + OTP verification
* Customer flow (Post job → Applications → Tracking)
* Provider flow (Browse jobs → Apply → Track applications)
* Escrow lifecycle (Open → In Progress → Completed → Confirmed)
* Dispute resolution flow
* Notifications system
* Role-based dashboards
* Provider profile management
* Ratings & reviews

## 4. Roles & Permissions Matrix

### 4.1 Role Definitions

| Role            | Description                                                                  |
| :-------------- | :--------------------------------------------------------------------------- |
| Customer        | Can post jobs, accept applications, confirm payment, leave reviews           |
| Hybrid Provider | Has all Customer + Provider capabilities                                     |
| Admin           | Has full system-level control including disputes, verifications, and user management |

### 4.2 Permissions Matrix

| Action / Page         | Customer | Hybrid Provider | Provider-Only | Admin |
| :-------------------- | :------- | :-------------- | :------------ | :---- |
| Post Job              | ✔        | ✔               | ❌            | ❌    |
| Browse Jobs           | ❌       | ✔               | ✔             | ❌    |
| Apply to Job          | ❌       | ✔               | ✔             | ❌    |
| Accept Application    | ✔        | ✔               | ❌            | ❌    |
| Mark Job Started      | ❌       | ✔               | ✔             | ❌    |
| Mark Job Completed    | ❌       | ✔               | ✔             | ❌    |
| Confirm Payment       | ✔        | ✔               | ❌            | ❌    |
| Open Dispute          | ✔        | ✔               | ✔             | ❌    |
| Resolve Dispute       | ❌       | ❌              | ❌            | ✔     |
| Access Admin Dashboard | ❌       | ❌              | ❌            | ✔     |
| View Profiles         | ✔        | ✔               | ✔             | ✔     |

### 4.3 Role Edge Cases

* Hybrid Provider cannot apply to jobs posted by themselves.
* Provider cannot confirm payment.
* Customer cannot mark job as completed.
* Disputed jobs freeze actions until admin resolves.

## 5. Routing & Navigation Structure

### 5.1 Public Routes

| Page          | URL           |
| :------------ | :------------ |
| Landing       | `/`           |
| Register      | `/register`   |
| Login         | `/login`      |
| Verify Email  | `/verify-email` |

### 5.2 Customer Routes

| Page              | URL                       |
| :---------------- | :------------------------ |
| Dashboard         | `/customer/dashboard`     |
| Post Job          | `/customer/post-job`      |
| Job Details       | `/customer/jobs/:jobId`   |
| Job Applications  | `/customer/jobs/:jobId/applications` |
| Browse Providers  | `/customer/browse-providers` |

### 5.3 Provider Routes

| Page              | URL                       |
| :---------------- | :------------------------ |
| Dashboard         | `/provider/dashboard`     |
| Browse Jobs       | `/provider/browse-jobs`   |
| Job Apply View    | `/provider/jobs/:jobId`   |
| My Applications   | `/provider/applications`  |
| Profile Management | `/provider/profile/edit`  |

### 5.4 Admin Routes

| Page            | URL                     |
| :-------------- | :---------------------- |
| Dashboard       | `/admin/dashboard`      |
| Disputes List   | `/admin/disputes`       |
| Dispute Details | `/admin/disputes/:disputeId` |

### 5.5 Shared Routes

| Page            | URL             |
| :-------------- | :-------------- |
| My Profile      | `/profile`      |
| Notifications   | `/notifications` |
| Transactions    | `/transactions` |
| Settings        | `/settings`     |

### 5.6 Redirect Rules

* Logged-in user cannot access `/login` or `/register`.
* Unauthenticated user is redirected to `/login`.
* User with wrong role is redirected to the correct dashboard.
* After login:
  * Customer → `/customer/dashboard`
  * Hybrid Provider → `/provider/dashboard`
  * Admin → `/admin/dashboard`

## 6. Page Requirements (Condensed + Enhanced)

(The main file contains the detailed specifications for each page)

6.x UX States: Loading, Errors, Empty States
Loading States

* Use skeleton loaders for:
  * lists (jobs, providers, applications)
  * dashboards
  * provider profiles
* Buttons disabled during form submission.
* Uploaders show progress indicator.

Error States

* Inline error messages under inputs.
* Banner messages for API errors.
* Retry buttons for:
  * failed fetch
  * failed upload
  * failed submit

Empty States Examples

| Page          | Empty Message                 |
| :------------ | :---------------------------- |
| Dashboard     | “You have no active jobs.”    |
| Browse Jobs   | “No jobs match your filters.” |
| Applications  | “No applications yet.”        |
| Providers     | “No providers found.”         |

## 7. User Flows

### 7.1 Escrow & Dispute State Rules

Job Status Definitions

`OPEN` → `IN_PROGRESS` → `COMPLETED` → `CONFIRMED`
                         ↘ `DISPUTED` ↗

Allowed Transitions

| From        | To          | Triggered By          |
| :---------- | :---------- | :-------------------- |
| `OPEN`      | `IN_PROGRESS` | Provider (“Mark as Started”) |
| `IN_PROGRESS` | `COMPLETED` | Provider              |
| `COMPLETED` | `CONFIRMED` | Customer              |
| `COMPLETED` | `DISPUTED`  | Customer              |
| `DISPUTED`  | `RESOLVED`  | Admin                 |

Auto-Confirm Rule

* If customer does not confirm within 48 hours, the system auto-confirms.

During `DISPUTED`

* Customer cannot confirm.
* Provider cannot update status.
* Payment is frozen.
* Only admin actions allowed.

## 8. API Contracts & Data Models

### 8.1 JSON Schemas (Core Models)

`User`

```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "customer | provider | hybrid | admin",
  "location": "string",
  "isVerified": true,
  "createdAt": "ISODate"
}
```

`Job`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "location": "string",
  "budgetMin": 50,
  "budgetMax": 120,
  "photos": ["url"],
  "status": "OPEN | IN_PROGRESS | COMPLETED | CONFIRMED | DISPUTED",
  "customerId": "string",
  "providerId": "string | null",
  "createdAt": "ISODate"
}
```

`JobApplication`

```json
{
  "id": "string",
  "jobId": "string",
  "providerId": "string",
  "quote": 100,
  "availability": "string",
  "message": "string",
  "status": "PENDING | ACCEPTED | REJECTED",
  "createdAt": "ISODate"
}
```

`Transaction (Escrow)`

```json
{
  "id": "string",
  "jobId": "string",
  "amount": 100,
  "status": "HELD | RELEASED | REFUNDED | SPLIT | DISPUTED",
  "createdAt": "ISODate"
}
```

`Dispute`

```json
{
  "id": "string",
  "jobId": "string",
  "customerStatement": "string",
  "providerStatement": "string",
  "customerPhotos": ["url"],
  "providerPhotos": ["url"],
  "status": "PENDING | RESOLVED",
  "decision": "RELEASE | REFUND | SPLIT | FIX",
  "adminNotes": "string"
}
```

`Notification`

```json
{
  "id": "string",
  "userId": "string",
  "type": "APPLICATION_ACCEPTED | NEW_JOB | PAYMENT_RELEASED | DISPUTE_OPENED",
  "message": "string",
  "isRead": false,
  "createdAt": "ISODate"
}
```

### 8.2 REST API Endpoints

Below is a select set for MVP.

Auth
`POST /auth/register`

Request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+9611234567",
  "password": "Aa123456!",
  "location": "Beirut",
  "role": "customer"
}
```

`POST /auth/login`

Response:

```json
{
  "token": "jwt",
  "user": { "id": "123", "role": "customer" }
}
```

`POST /auth/verify-otp`

Jobs
`POST /jobs`
(Create job)

`GET /jobs?status=OPEN`
(List for provider browsing)

`GET /jobs/my-jobs`
(Customer dashboard)

Applications
`POST /jobs/:jobId/apply`
`GET /jobs/:jobId/applications`
`POST /jobs/:jobId/accept/:providerId`

Escrow
`PUT /jobs/:jobId/start`
`PUT /jobs/:jobId/complete`
`PUT /jobs/:jobId/confirm`
`POST /jobs/:jobId/dispute`

Disputes
`GET /admin/disputes`
`POST /admin/disputes/:id/resolve`

Providers
`GET /providers`
`GET /providers/:id`
`PUT /users/me/profile`

Notifications
`GET /notifications`
`PUT /notifications/:id/read`

## 9. Performance & Data Fetching

Polling

* Notification polling every 30 seconds.
* Disabled on:
  * `/login`
  * `/register`
* Suspended when:
  * tab inactive
  * user offline

Pagination

* Default:
  * `page=1`
  * `limit=10`
* Used in:
  * Browse Jobs
  * Browse Providers
  * Applications
  * Reviews
  * Transaction History

Batching

* Fetch dashboard summary + list in one request if possible.

## 10. Validation & Security Constraints

Passwords

* Min 8 chars
* Must include:
  * 1 uppercase
  * 1 lowercase
  * 1 digit
  * 1 special char

Input Constraints

* Job title: max 100 chars
* Description: max 1000
* Provider message: max 500

Uploads

* Allowed: `.jpeg`, `.jpg`, `.png`, `.webp`
* Max size: 5MB
* Max count:
  * Job photos: 5
  * Provider portfolio: 10

Rate Limits

* OTP resend: cooldown 60 seconds
* Login attempts: show cooldown feedback

## 11. Success Metrics

* All flows functional and error-free.
* Disputes resolvable by admin.
* UI responsive on all devices.
* No console errors.
* Page load < 3 seconds.
* All protected routes locked by role.

### 10.3 Frontend Technology & Dependencies Requirements

This project must be developed entirely in English, including UI copy, labels, error messages, notifications, and documentation.

The frontend stack is explicitly defined as follows:

Required Frameworks & Libraries
Core Framework

* React 19+
* Vite 7+ as the build tool
* TypeScript is optional (JS is acceptable for MVP)

Styling

* Tailwind CSS 3.4+
* `tailwindcss-animate` for transitions & micro-interactions
* `tailwind-merge` for utility class merging
* `clsx` for conditional class composition

UI Component System

* `shadcn/ui` components (latest stable)
* `class-variance-authority` (CVA) for typed component variants
* `lucide-react` for icons (mandatory for all UI iconography)

React Utilities

* React Context API
* React Router v6
* Axios for API calls

Exact Required Dependencies
