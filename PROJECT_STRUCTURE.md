# 📁 MedReserve Frontend - Project Structure

## 🏗️ Directory Structure

```
frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── dist/                       # Production build output
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/                 # Static assets (images, icons)
│   │   ├── images/
│   │   └── icons/
│   ├── components/             # Reusable components
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Layout/
│   │   │   ├── Layout.tsx
│   │   │   └── TopNavLayout.tsx
│   │   └── ErrorBoundary.tsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/                   # Static data
│   │   ├── departments.ts
│   │   └── testimonials.ts
│   ├── hooks/                  # Custom hooks
│   │   └── useAutoLogout.ts
│   ├── pages/                  # Page components
│   │   ├── AI/
│   │   │   ├── Chatbot.tsx
│   │   │   └── SymptomChecker.tsx
│   │   ├── Admin/
│   │   │   ├── AllDoctors.tsx
│   │   │   ├── AllUsers.tsx
│   │   │   ├── Credentials.tsx
│   │   │   └── SystemHealth.tsx
│   │   ├── Appointments/
│   │   │   ├── AppointmentDetail.tsx
│   │   │   ├── BookAppointment.tsx
│   │   │   └── MyAppointments.tsx
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── Doctor/
│   │   │   └── MyPatients.tsx
│   │   ├── Doctors/
│   │   │   ├── DoctorDetail.tsx
│   │   │   └── DoctorList.tsx
│   │   ├── Emergency/
│   │   │   └── EmergencyContacts.tsx
│   │   ├── Health/
│   │   │   ├── HealthTips.tsx
│   │   │   ├── MedicalReports.tsx
│   │   │   ├── Medicines.tsx
│   │   │   └── UploadReports.tsx
│   │   └── Profile/
│   │       └── Profile.tsx
│   ├── services/               # API services
│   │   └── api.ts
│   ├── theme/                  # Theme configuration
│   │   └── theme.ts
│   ├── App.css                 # Global styles
│   ├── App.tsx                 # Main app component
│   ├── index.css               # Base styles
│   ├── logo.svg                # React logo
│   ├── main.tsx                # App entry point
│   └── vite-env.d.ts           # Vite type definitions
├── .env                        # Development environment variables
├── .env.production             # Production environment variables
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project documentation
```

## 🔧 Key Files

### Configuration Files
- **`vite.config.ts`** - Vite build configuration with GitHub Pages support
- **`tsconfig.json`** - TypeScript compiler configuration
- **`package.json`** - Dependencies, scripts, and project metadata

### Environment Files
- **`.env`** - Development environment variables
- **`.env.production`** - Production environment variables (GitHub Pages)

### Entry Points
- **`index.html`** - HTML template with Vite script injection
- **`src/main.tsx`** - Application entry point
- **`src/App.tsx`** - Main application component with routing

### Core Components
- **`src/components/Layout/TopNavLayout.tsx`** - Main layout with navigation
- **`src/components/Auth/ProtectedRoute.tsx`** - Route protection
- **`src/contexts/AuthContext.tsx`** - Authentication state management
- **`src/services/api.ts`** - API client configuration

## 🚀 Build Process

1. **Development**: `npm run dev` - Starts Vite dev server
2. **Production Build**: `npm run build` - Creates optimized build in `dist/`
3. **Preview**: `npm run preview` - Serves production build locally
4. **Deploy**: `npm run deploy` - Deploys to GitHub Pages

## 📦 Dependencies

### Core
- React 19 + TypeScript
- Vite (build tool)
- React Router (routing)

### UI Framework
- Material-UI (components)
- Emotion (styling)

### Data Management
- React Query (server state)
- Axios (HTTP client)

### Forms & Validation
- React Hook Form
- Yup (validation)

### Charts & Visualization
- Recharts

## 🌐 Deployment

The project is configured for GitHub Pages deployment with:
- Automatic builds via GitHub Actions
- Proper base path configuration
- Production environment variables
- Static asset optimization

## 🔒 Security

- Environment variables for sensitive data
- Protected routes with authentication
- CORS configuration
- Input validation and sanitization
