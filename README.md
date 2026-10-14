# JobPortal

A full-stack job and internship application platform built with the MERN stack. Candidates browse and apply for jobs, recruiters post jobs and manage applicants, and admins approve listings before they go public.

**Live demo:** https://job-portal-six-dusky-32.vercel.app/

> The backend runs on a free hosting plan. If the site has been idle, the first request can take around 50 seconds while the server wakes up. After that it is fast.

<!-- Add 3-4 screenshots here (Jobs page, Recruiter dashboard, Chat, Admin dashboard) -->

## Features

### Candidate
- Register and log in with email and password, or with **Google Sign-In**
- Browse approved jobs and search by title or location
- Upload a CV (PDF, DOC or DOCX, up to 5 MB) and apply with a cover note
- Track every application on a visual status stepper
- Chat with the recruiter once an application reaches the interview stage

### Recruiter
- Post, edit and delete job listings
- Dashboard with stats: total jobs, active jobs, applications and interviews
- View received applications, open candidates' CVs and move applications through the pipeline: `applied → shortlisted → interview → offered → hired / rejected`
- Chat with candidates once an application reaches interview, offered or hired

### Admin
- Review every job and approve or reject it. A job is visible to the public only after approval
- See all registered users

### Platform
- JWT authentication with role-based access control (candidate, recruiter, admin)
- Forgot and reset password through an emailed, time-limited link
- Google login that links to an existing account when the verified email matches
- Application deadlines: applying stays open through the deadline day, and an expired job disappears from the public list 24 hours later (it stays in the database, so old applications keep working)
- In-app chat between recruiter and candidate, with an **email notification** when the other person has been inactive (limited to one email per 10 minutes per conversation)
- Form validation on both the frontend and the backend
- Responsive layout with a mobile hamburger menu, and toast notifications for every action

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios, react-hot-toast, @react-oauth/google |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT, bcryptjs, Google Identity Services (google-auth-library) |
| File storage | Cloudinary (via multer) |
| Email | Brevo transactional email API |
| Hosting | Vercel (frontend), Render (backend) |

## How It Fits Together

```
React app (Vercel)  ──►  Express REST API (Render)  ──►  MongoDB Atlas
                              │
                              ├──►  Cloudinary   (CV files)
                              ├──►  Brevo        (emails)
                              └──►  Google       (verifies Sign-In tokens)
```

Every protected request carries a JWT in the `Authorization` header. `authMiddleware` verifies it, and `roleMiddleware` checks that the user's role may access the route. Ownership checks (for example, "a recruiter can only edit their own jobs") happen inside the controllers.

## Project Structure

```
client/
  src/
    pages/         Login, Register, Jobs, Dashboard, ApplyJob, MyApplications, AdminDashboard ...
    components/    Navbar, Chat, StatusStepper, FormField
    config/        backend URL
server/
  controllers/     auth, job, application, message logic
  models/          User, Job, Application, Message
  routes/          route definitions per feature
  middleware/      auth, roleMiddleware, upload
  db-configuration/  Cloudinary and email setup
  utils/           shared helpers (job deadline rules)
  index.js         entry point
```

## Getting Started (Local)

**Requirements:** Node.js 18+, a MongoDB Atlas database, and free Cloudinary, Brevo and Google Cloud accounts.

```powershell
git clone https://github.com/codewithtayyab90/Job-Portal.git
cd Job-Portal

# backend
cd server
npm install
npm run dev

# frontend (new terminal)
cd client
npm install
npm run dev
```

Create `server/.env` with these variables (use your own values, never commit this file):

```
PORT=8000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
EMAIL_FROM=
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
```

Set the backend URL in `client/src/config/api.js` and your Google client ID in `client/src/main.jsx`.

New accounts can be created as Candidate or Recruiter from the Register page. The admin role cannot be chosen at signup, so an admin account has to be set directly in the database. Jobs posted by recruiters appear publicly only after an admin approves them.

## API Overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/google`, `/forgot-password`, `/reset-password/:token` |
| Jobs | `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PATCH` and `DELETE /api/jobs/:id` |
| Recruiter jobs | `GET /api/jobs/my-jobs`, `GET /api/jobs/:id/applications` |
| Admin | `GET /api/jobs/admin/all-jobs`, `PATCH /api/jobs/:id/status`, `GET /api/user/all-users` |
| Applications | `POST /api/applications/:id/apply`, `GET /api/applications/myapplications`, `GET /api/applications/received`, `PATCH /api/applications/:id/status` |
| CV | `POST /api/user/upload-cv` |
| Chat | `GET` and `POST /api/messages/:applicationId` |

## Security and Validation

- Passwords are hashed with bcrypt, and secrets live in environment variables
- Input is validated on the server, so the frontend checks can be bypassed without effect
- Allowed roles at signup are whitelisted, and updates only accept specific fields (no mass assignment)
- Ownership checks on jobs and applications, and chat access limited to the two people involved
- Uploads are limited to PDF, DOC and DOCX files up to 5 MB
- Google ID tokens are verified on the server before a session is created

## Problems I Solved Along the Way

- **PDF CVs returned 401 from Cloudinary.** New accounts block public delivery of PDF and ZIP files by default. It was an account security setting, not a code bug.
- **Password reset emails hung in production.** Render's free tier blocks outbound SMTP ports, so Gmail through Nodemailer could never connect. I moved email sending to Brevo's HTTP API.
- **Google Sign-In failed with `origin_mismatch`.** The live URL had been added under redirect URIs instead of authorized JavaScript origins.
- **Refreshing a page returned 404 on Vercel.** React Router handles routes in the browser, so Vercel needed a rewrite rule that always serves `index.html`.
- **Frontend and backend disagreed about deadlines.** The button looked open while the server rejected the request. The rule now lives in one shared helper on the backend.
- **Leaked credentials.** I rotated every exposed key and added server-side checks for roles, ownership and allowed fields.
- **Deploy failed on Render with `Cannot find module`.** Windows ignores letter case in folder names but Linux does not. A `Utils` vs `utils` mismatch worked on my laptop and crashed on the server, so I renamed the folder in Git and made every `require` path match exactly.

## Known Limitations and Next Steps

- Chat messages load on page open or refresh, since there are no websockets yet
- Rate limiting for login and password reset is planned
- A candidate profile page (phone number, skills) is planned, so details are entered once instead of per application
- The free hosting plan causes a slow first request after idle time

## Author

**Muhammad Tayyab**, Lahore, Pakistan

- GitHub: [codewithtayyab90](https://github.com/codewithtayyab90)
- LinkedIn: [Muhammad Tayyab](https://www.linkedin.com/in/muhammad-tayyab-27276b3b1)
