# Project Requirements - Sample Nav Business
**Project ID:** 521
**Project Type:** Next.js 16 (React 19) Application
**Language:** TypeScript
**Database:** MySQL

---

## 📋 Project Overview

This is a higher education lead generation website built with Next.js 16, React 19, and TypeScript. The application helps students discover educational programs and capture leads for an education consultancy business.

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js:** v16.1.6 (App Router)
- **React:** v19.2.3
- **React DOM:** v19.2.3
- **TypeScript:** v5.x
- **Node.js:** v20+ (required)

### Database
- **MySQL:** v5.7+ or v8.x
- **MySQL2 Driver:** v3.17.1 (Node.js MySQL client with prepared statements)

### UI & Styling
- **Tailwind CSS:** v4.x
- **PostCSS:** (via @tailwindcss/postcss v4.x)
- **Lucide React:** v0.564.0 (Icon library)
- **Class Variance Authority:** v0.7.1 (Variant-based component styling)
- **clsx:** v2.1.1 (Conditional className utility)
- **tailwind-merge:** v3.4.1 (Merge Tailwind classes)

### Forms & Validation
- **React Hook Form:** v7.71.1 (Form state management)
- **@hookform/resolvers:** v5.2.2 (Validation resolvers)
- **Zod:** v4.3.6 (Schema validation)

### Data Visualization
- **Recharts:** v3.7.0 (Chart library for admin dashboard)

### Date Utilities
- **date-fns:** v4.1.0 (Date manipulation)

---

## 📦 Production Dependencies

```json
{
  "@hookform/resolvers": "^5.2.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.564.0",
  "mysql2": "^3.17.1",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-hook-form": "^7.71.1",
  "recharts": "^3.7.0",
  "tailwind-merge": "^3.4.1",
  "zod": "^4.3.6"
}
```

---

## 🔧 Development Dependencies

```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

## 🌍 Environment Variables

The application requires the following environment variables:

### Application Configuration
```bash
# App Metadata
NEXT_PUBLIC_APP_NAME=Higher Education Lead Generation
NEXT_PUBLIC_APP_ENV=development  # development | production
NEXT_PUBLIC_APP_URL=https://ds521u300p80.drytis.ai
PORT=3000
```

### Database Configuration
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=u300p521_higher_education_lead_generation_website
DATABASE_USER=u300p521_user
DATABASE_PASSWORD=<your_password>
```

### Email Configuration
```bash
ADMIN_EMAIL=admin@sampletrial.com
```

---

## 🗄️ Database Schema

### Tables Required

#### 1. `programs`
Stores educational program information.

#### 2. `leads`
Captures student lead information from contact forms.

#### 3. `email_logs`
Logs all email notifications sent by the system.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v20 or higher
- MySQL v5.7+ or v8.x
- npm, yarn, or pnpm

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up the database:**
   ```sql
   CREATE DATABASE u300p521_higher_education_lead_generation_website;
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build the application for production
npm start        # Start production server
npm run lint     # Run ESLint for code linting
```

---

## 🏗️ Project Structure

```
app/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── admin/               # Admin dashboard
│   ├── apply/               # Application form
│   ├── contact/             # Contact page
│   ├── programs/            # Programs listing
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Home page
├── components/              # Reusable React components
│   ├── Footer.tsx           # Site footer
│   ├── Header.tsx           # Site navigation header
│   └── ui/                  # UI components (buttons, inputs, etc.)
├── lib/                     # Utility libraries
│   ├── db.ts                # Database connection & queries
│   └── email.ts             # Email notification functions
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── package.json             # Project dependencies
```

---

## 🔐 Security Features

- SQL Injection Prevention: Using MySQL2 prepared statements for all queries
- Input Validation: Zod schemas for form validation
- Type Safety: Full TypeScript coverage
- Environment Variables: Sensitive data stored in .env.local

---

## 📱 Browser Support

Modern browsers with ES2017+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚢 Deployment

The application is configured to run on:
- **Production URL:** https://ds521u300p80.drytis.ai
- **Port:** 3000 (behind reverse proxy)
- **Platform:** Node.js server with Caddy reverse proxy

---

## 📊 Key Features

1. **Lead Generation:** Contact forms for student inquiries
2. **Program Catalog:** Browse educational programs by category
3. **Admin Dashboard:** View and manage leads (protected route)
4. **Email Notifications:** Automatic email alerts for new leads
5. **Responsive Design:** Mobile-first UI with Tailwind CSS
6. **SEO Optimized:** Metadata, OpenGraph, and structured data

---

## 📝 Notes

- The application uses Next.js App Router (not Pages Router)
- All API routes are server-side with proper error handling
- Email service is currently in logging mode (integration needed for production)
- Admin routes require authentication implementation

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)

---

**Last Updated:** February 19, 2026
**Version:** 1.0.0
