# ExpenseWise - Modern Finance Management SaaS

A cutting-edge expense tracking application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. ExpenseWise features a modern, sci-fi inspired design focused on personal finance and expenditure management.

## 🚀 Features

- **Modern UI/UX**: Sleek, sci-fi inspired design with smooth animations and gradients
- **Responsive Design**: Fully responsive across all devices
- **Role-Based Dashboards**: Separate interfaces for Admin and User roles
- **Authentication Pages**: Beautiful login and signup pages with social auth options
- **Feature-Rich Landing**: Engaging landing page showcasing product capabilities
- **Component Library**: Built with shadcn/ui for consistent, accessible components

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React

## 📁 Project Structure

```
expense-wise-frontend/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin Dashboard
│   │   └── page.tsx               # User Dashboard
│   ├── login/
│   │   └── page.tsx               # Login Page
│   ├── signup/
│   │   └── page.tsx               # Sign Up Page
│   ├── page.tsx                   # Landing Page
│   └── globals.css                # Global Styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── Header.tsx                 # Navigation Header
│   ├── Footer.tsx                 # Footer Component
│   └── Sidebar.tsx                # Dashboard Sidebar
└── lib/
    └── utils.ts                   # Utility functions
```

## 🎨 Pages Overview

### Landing Page (`/`)
- Hero section with animated gradients
- Features showcase with 6 key features
- Call-to-action sections
- Responsive navigation

### Login Page (`/login`)
- Email/password authentication
- Social login options (Google, GitHub)
- Forgot password link
- Link to signup page

### Sign Up Page (`/signup`)
- Full registration form
- Terms & conditions checkbox
- Social signup options
- Free trial promotion

### User Dashboard (`/dashboard`)
- Financial overview with stats cards
- Recent expenses list
- Category breakdown visualization
- Spending trends placeholder

### Admin Dashboard (`/dashboard/admin`)
- System statistics
- User management overview
- Plan distribution
- System activity log

## 🚦 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎯 Available Routes

- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page
- `/dashboard` - User dashboard
- `/dashboard/admin` - Admin dashboard

## 🎨 Theme & Design

The application features a modern, sci-fi inspired theme with:
- **Primary Color**: Purple/Blue gradient (#6366F1 - #3B82F6)
- **Accent Color**: Cyan/Teal tones
- **Dark Mode**: Fully supported with custom color variables
- **Animations**: Smooth transitions and gradient animations
- **Glass Morphism**: Backdrop blur effects on cards

## 📝 Customization

### Colors
Edit color variables in `app/globals.css` to customize the theme:
- `--primary`: Main brand color
- `--accent`: Secondary accent color
- `--background`: Background color
- `--foreground`: Text color

### Components
All UI components are located in `components/ui/` and can be customized using Tailwind classes.

## 🔮 Future Enhancements

- [ ] Real expense tracking functionality
- [ ] Integration with backend API
- [ ] Chart visualizations (Chart.js or Recharts)
- [ ] Expense categorization with AI
- [ ] Budget management features
- [ ] Multi-currency support
- [ ] Export reports (PDF, CSV)
- [ ] Mobile app version

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**ExpenseWise** - Master Your Finances with AI-Powered Insights 🚀
