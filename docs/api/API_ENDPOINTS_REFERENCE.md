# elwaseet - Complete API Endpoints Reference

**Quick reference for all 75+ endpoints in the platform**

---

## 1. AUTHENTICATION & REGISTRATION (6 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| POST | `/auth/register` | Create new account | No | Anyone |
| POST | `/auth/verify-otp` | Verify email with OTP | No | Unverified users |
| POST | `/auth/resend-otp` | Resend OTP code | No | Unverified users |
| POST | `/auth/login` | Get JWT token | No | Verified users |
| GET | `/auth/me` | Get current user info | Yes | Authenticated |
| POST | `/auth/logout` | Logout (optional) | Yes | Authenticated |

---

## 2. USERS & PROFILES (11 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/users/{id}` | Get public profile | Optional | Anyone |
| PUT | `/users/me` | Update own profile | Yes | Self only |
| GET | `/users/me/balance` | Get wallet balance | Yes | Self only |
| GET | `/users/me/transactions` | Get transaction history | Yes | Self only |
| POST | `/users/me/services` | Add service offering | Yes | Provider only |
| PUT | `/users/me/services/{serviceId}` | Update service | Yes | Owner only |
| DELETE | `/users/me/services/{serviceId}` | Delete service | Yes | Owner only |
| POST | `/users/me/portfolio` | Upload portfolio photo | Yes | Provider only |
| DELETE | `/users/me/portfolio/{photoId}` | Delete portfolio photo | Yes | Owner only |
| POST | `/users/me/request-verification` | Request verified badge | Yes | Provider only |
| GET | `/users/{id}/reviews` | Get user's reviews | Optional | Anyone |

---

## 3. CATEGORIES (2 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/categories` | Get all categories | No | Anyone |
| GET | `/categories/{id}` | Get category details | No | Anyone |

---

## 4. JOBS (12 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/jobs` | List jobs (paginated, filtered) | Yes | Authenticated |
| GET | `/jobs/{id}` | Get job details | Optional | Anyone (OPEN), parties (others) |
| POST | `/jobs` | Create new job | Yes | Authenticated (becomes customer) |
| POST | `/jobs/{id}/photos` | Upload job photos (max 5) | Yes | Job owner |
| PUT | `/jobs/{id}` | Update job | Yes | Job owner (OPEN only) |
| DELETE | `/jobs/{id}` | Cancel job | Yes | Job owner (OPEN only) |
| GET | `/jobs/{id}/applications` | Get job applications | Yes | Job owner |
| POST | `/jobs/{id}/accept/{applicationId}` | Accept application | Yes | Job owner |
| PUT | `/jobs/{id}/start` | Mark job started | Yes | Accepted provider |
| PUT | `/jobs/{id}/complete` | Mark job completed | Yes | Accepted provider |
| POST | `/jobs/{id}/confirm` | Confirm & release payment | Yes | Job owner (customer) |
| POST | `/jobs/{id}/dispute` | Open dispute | Yes | Job owner (customer) |

---

## 5. APPLICATIONS (5 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| POST | `/jobs/{id}/apply` | Submit application | Yes | Provider only |
| POST | `/applications/{id}/photos` | Upload photos (max 3) | Yes | Application owner |
| GET | `/applications/{id}` | Get application details | Yes | Owner or job owner |
| PUT | `/applications/{id}/withdraw` | Withdraw application | Yes | Owner (PENDING only) |
| GET | `/applications/my-applications` | Get my applications | Yes | Provider only |

---

## 6. TRANSACTIONS (2 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/transactions/{id}` | Get transaction details | Yes | Parties or admin |
| GET | `/transactions` | List transactions (filtered) | Yes | Own or admin (all) |

---

## 7. REVIEWS (4 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| POST | `/reviews` | Leave review | Yes | Transaction party |
| GET | `/reviews/{id}` | Get review details | Optional | Anyone (public), parties (private) |
| PUT | `/reviews/{id}` | Edit review (48h window) | Yes | Review author |
| POST | `/reviews/{id}/report` | Report inappropriate review | Yes | Authenticated |

---

## 8. DISPUTES (5 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/disputes/{id}` | Get dispute details | Yes | Parties or admin |
| POST | `/disputes/{id}/evidence` | Submit evidence (max 5 photos) | Yes | Dispute party |
| POST | `/disputes/{id}/resolve` | Admin resolves dispute | Yes | Admin only |
| POST | `/disputes/{id}/appeal` | Appeal decision | Yes | Dispute party |
| GET | `/disputes` | List disputes | Yes | Own or admin (all) |

---

## 9. NOTIFICATIONS (3 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/notifications` | Get notifications | Yes | Self only |
| PUT | `/notifications/{id}/read` | Mark notification as read | Yes | Owner only |
| PUT | `/notifications/mark-all-read` | Mark all as read | Yes | Self only |

---

## 10. SEARCH & BROWSE (2 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/search/providers` | Search providers (filtered) | Optional | Anyone |
| GET | `/search/jobs` | Browse jobs (providers) | Yes | Provider only |

---

## 11. ADMIN (6 endpoints)

| Method | Endpoint | Purpose | Auth | Who |
|--------|----------|---------|------|-----|
| GET | `/admin/disputes` | Get all platform disputes | Yes | Admin only |
| GET | `/admin/users` | Get all users | Yes | Admin only |
| POST | `/admin/users/{id}/ban` | Ban user | Yes | Admin only |
| GET | `/admin/verification-requests` | Get pending verifications | Yes | Admin only |
| POST | `/admin/verification-requests/{userId}/approve` | Approve verification | Yes | Admin only |
| GET | `/admin/statistics` | Get platform statistics | Yes | Admin only |

---

## HTTP Status Codes Quick Reference

| Code | Name | When Used |
|------|------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful with no response body |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Business rule violation |
| 413 | Payload Too Large | File upload size exceeded |
| 423 | Locked | Account banned/suspended |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

---

## Business Rules Quick Reference

### Job States
```
OPEN → IN_PROGRESS → COMPLETED → CONFIRMED
  ↓
CANCELLED (only while OPEN)
```

### Transaction States
```
COMMITTED → IN_PROGRESS → COMPLETED → CONFIRMED
                                    ↓
                                 DISPUTED → RESOLVED
```

### File Upload Limits
- Job photos: 5 max
- Portfolio photos: 10 max
- Application photos: 3 max
- Dispute evidence: 5 max per party
- Max file size: 5MB each

### Review Rules
- Customer→Provider: **PUBLIC**
- Provider→Customer: **PRIVATE**
- Review deadline: 7 days after confirmation
- Edit deadline: 48 hours after posting

### Dispute Rules
- Must open within 7 days of completion
- Evidence deadline: 72 hours
- Appeal deadline: 7 days after resolution

---

**Total Endpoints: 58 (documented above)**

**Note:** Some compound endpoints (like filters, sorts) count as variations of base endpoints.

**Document Version:** 1.0  
**Last Updated:** December 4, 2025  
