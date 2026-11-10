# Insurance Management System

A full-stack, demonstrable Insurance Management System built for college Software Engineering Lab evaluation.

---

## Quick Start Guide

### 1. Seed the Database
Run the seed script from the root directory to populate demo accounts, sample policies across 4 categories, an active customer purchase, and a pending claim:
```bash
npm run seed
```
*(Or inside `/server`: `npm run seed`)*

### 2. Start the Backend API Server
```bash
npm run server
```
Server runs on: **http://localhost:5000**

### 3. Start the Frontend Application
In a separate terminal:
```bash
npm run client
```
Frontend runs on: **http://localhost:5173**

---

## Demo Credentials

| Role | Email | Password | Name | What to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `customer@insure.com` | `customer123` | **Ankit** | Browse catalog, use coverage multiplier calculator, buy policies, file claims |
| **Admin** | `admin@insure.com` | `admin123` | System Admin | View stats, create/edit/deactivate policies, approve or reject claims with remarks |

---

## Key Enforced Business Rules

1. **Active Claims Only**: Claims can only be filed against active policies.
2. **Coverage Cap**: Claim amount cannot exceed the policy's remaining coverage (validated in both client modal and server controller).
3. **Automatic Coverage Deduction**: Approving a claim decrements the purchased policy's `remainingCoverage` automatically.
4. **Permanent Status**: Once a claim is approved or rejected by an admin, it cannot be reversed.
5. **Soft Deactivation**: Deactivating a policy hides it from the catalog without deleting data or impacting existing customer purchases.
6. **Role Isolation**: Admin accounts can only be seeded; self-service registration locks role to `customer`.

---

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, bcryptjs, cors, dotenv
- **Frontend**: React (Vite), React Router DOM v7, Tailwind CSS, Axios with central interceptors

