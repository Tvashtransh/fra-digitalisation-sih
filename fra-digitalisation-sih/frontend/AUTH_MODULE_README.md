# FRA Digital Platform - Authentication Module

## Overview
A comprehensive authentication module built with React, shadcn/ui, and modern web technologies for the Forest Rights Act Digital Platform.

## Features

### 🎯 **Role-Based Authentication**
- **Admin (MoTA)**: Ministry of Tribal Affairs administrators
- **State Admin**: State-level administrators
- **District/Block Officer**: Local government officers
- **Community User**: Forest community members
- **Researcher/NGO**: Research organizations and NGOs

### 🔐 **Authentication Modes**
- **Login**: Existing user authentication
- **Register**: New user registration with role-specific forms

### 📱 **Responsive Design**
- Mobile-first approach
- Split-screen layout on desktop
- Sidebar navigation for role selection
- Smooth animations and transitions

### ✅ **Form Validation**
- Real-time validation using Zod schemas
- Required field validation
- Email format validation
- Password strength requirements
- Custom error messages

### 💾 **Data Storage**
- Temporary localStorage storage for demo purposes
- Structured data storage by role and auth mode
- Timestamp tracking for demo data

## Technical Stack

- **React 18** - Modern React with hooks
- **shadcn/ui** - Beautiful, accessible UI components
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## Component Structure

```
AuthModule/
├── Split-screen layout
│   ├── Left: Branding section
│   └── Right: Authentication interface
│       ├── Header with Login/Register toggle
│       ├── Sidebar with role selection
│       └── Form area with dynamic forms
```

## Usage

### Accessing the Module
Navigate to `/auth` route to access the authentication module.

### Role Selection
1. Click on any role in the sidebar to select it
2. The active role is highlighted with blue styling
3. Form automatically updates based on selected role

### Authentication Flow
1. Choose between Login/Register using the toggle
2. Select your role from the sidebar
3. Fill in the required fields
4. Submit the form
5. Success/error messages are displayed

## Form Fields by Role

### Admin (MoTA)
- Email (required, valid email)
- Password (required, min 8 chars)
- Department ID (required)
- MFA Code (required, 6 digits)

### State Admin
- State ID (required)
- Email (required, valid email)
- Password (required, min 8 chars)
- Department (required)

### District/Block Officer
- District/Block ID (required)
- Email/Phone (required)
- Password (required, min 8 chars)
- Department (required)

### Community User
- Claim ID / Aadhaar / Mobile (required)
- Password/OTP (required)

### Researcher/NGO
- Organization ID (required)
- Email (required, valid email)
- Password (required, min 8 chars)
- State Admin Approval (required checkbox)

## Data Storage

Form submissions are stored in localStorage with the following structure:
```javascript
{
  "login_admin": [
    {
      "email": "admin@example.com",
      "password": "password123",
      "deptId": "DEPT001",
      "mfaCode": "123456",
      "timestamp": "2025-09-15T11:30:00.000Z"
    }
  ],
  "register_community": [
    {
      "identifier": "CLAIM123",
      "passwordOrOtp": "password123",
      "timestamp": "2025-09-15T11:30:00.000Z"
    }
  ]
}
```

## Integration

The authentication module is integrated into the main App.jsx with:
- Route: `/auth`
- Conditional rendering (no sidebar)
- Import: `import AuthModule from './components/AuthModule'`

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast support

## Future Enhancements
- Backend API integration
- JWT token management
- Password reset functionality
- Two-factor authentication
- Social login options
- Remember me functionality