# ExpenseWise - Modern Finance Management SaaS

A cutting-edge expense tracking application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. ExpenseWise features a modern, sci-fi inspired design focused on personal finance and expenditure management.

## 🚀 Features

### Core Functionality
- **Full Expense Management**: Complete CRUD operations for tracking expenses
- **Advanced Analytics**: Multi-view analytics with flexible time ranges and visualizations
- **Credit Card Management**: Track billing cycles, due dates, and credit utilization
- **Smart Insights**: AI-powered spending pattern analysis and recommendations

### User Experience
- **Modern UI/UX**: Sleek, sci-fi inspired design with smooth animations and gradients
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Role-Based Dashboards**: Separate interfaces for Admin and User roles
- **Authentication System**: Beautiful login and signup pages with social auth options
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
│   ├── expenses/
│   │   └── page.tsx               # Expense Management
│   ├── analytics/
│   │   └── page.tsx               # Analytics & Insights
│   ├── settings/
│   │   └── page.tsx               # Settings & Preferences
│   ├── login/
│   │   └── page.tsx               # Login Page
│   ├── signup/
│   │   └── page.tsx               # Sign Up Page
│   ├── page.tsx                   # Landing Page
│   └── globals.css                # Global Styles & Theme
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── switch.tsx
│   │   └── ...
│   ├── Header.tsx                 # Unified Navigation Header
│   ├── Footer.tsx                 # Footer Component
│   └── Sidebar.tsx                # Dashboard Sidebar
└── lib/
    └── utils.ts                   # Utility functions
```

## 🎨 Pages Overview

### Landing Page (`/`)
- Hero section with animated gradients and sci-fi effects
- Features showcase with 6 key features
- Call-to-action sections with conversion-focused design
- Responsive navigation with smooth scrolling

### Login Page (`/login`)
- Email/password authentication
- Social login options (Google, GitHub)
- Forgot password functionality
- Automatic redirect to dashboard on successful login
- Link to signup page

### Sign Up Page (`/signup`)
- Full registration form with validation
- Terms & conditions checkbox
- Social signup options
- Free 14-day trial promotion
- Password confirmation

### User Dashboard (`/dashboard`)
- **Financial Overview**: 4 key metric cards (Total Balance, Monthly Expenses, Average Daily, Budget Left)
- **Recent Expenses**: Latest transactions with categorization
- **Category Breakdown**: Visual spending distribution with progress bars
- **Spending Trends**: Placeholder for advanced chart visualizations
- **Real-time Updates**: Dynamic data display

### Admin Dashboard (`/dashboard/admin`)
- **System Statistics**: Total users, active users, transactions, system health
- **User Management**: Recent user registrations with details
- **Plan Distribution**: Subscription breakdown (Premium, Basic, Free)
- **System Activity**: Real-time event log with color-coded alerts
- **Analytics Preview**: User growth and retention metrics

### Expenses Page (`/expenses`)
- **Full CRUD Operations**: 
  - Add new expenses with detailed form
  - Edit existing expenses
  - Delete expenses with confirmation
- **Rich Input Fields**:
  - Date picker
  - Description and notes
  - Category selection (8 categories)
  - Payment method (Cash, Credit Card, Debit Card, UPI, Net Banking)
  - Amount with decimal support
- **Search & Filter**:
  - Real-time search across description and category
  - Filter by category
  - Export functionality
- **Statistics Dashboard**:
  - Total expenses calculation
  - Transaction count
  - Monthly and daily averages
- **Beautiful Data Table**:
  - Color-coded category badges
  - Formatted dates and amounts
  - Notes preview
  - Quick edit/delete actions

### Analytics Page (`/analytics`)
- **Flexible Time Ranges**:
  - Last 7 days, 30 days, 90 days
  - 6 months, 1 year
  - Custom date range selector
- **Multiple View Tabs**:
  - **Overview**: Spending distribution and top expenses
  - **Category**: Detailed breakdown with trend indicators
  - **Trends**: Spending patterns over time
  - **Comparison**: Period-over-period analysis
- **Key Insights Cards**:
  - Highest spending day
  - Average transaction amount
  - Most used payment method
  - Budget utilization percentage
- **Visual Analytics**:
  - Custom bar charts for income vs expenses
  - Category distribution with percentage bars
  - Trend arrows (up/down indicators)
  - Interactive data visualization
- **Top Expenses List**: Largest transactions with context

### Settings Page (`/settings`)
- **Credit Card Management** 💳:
  - Add/Edit/Delete credit cards
  - Track billing cycle dates (customizable day of month)
  - Monitor payment due dates with countdown
  - Credit limit and current balance tracking
  - **Smart Utilization Calculator**:
    - Color-coded warnings (Green < 50%, Yellow 50-70%, Red > 70%)
    - Visual progress bars
  - **Automatic Date Calculations**:
    - Next billing cycle date
    - Days until payment due
    - Urgent payment warnings (< 7 days)
  - Card issuer support (Visa, Mastercard, Amex, Discover)
  - Last 4 digits display with security
  
- **Profile Settings** 👤:
  - Personal information management
  - Email and name updates
  - Default currency selection (USD, EUR, GBP, INR)
  - Monthly budget configuration
  
- **Notification Preferences** 🔔:
  - Email notifications toggle
  - Budget alert settings
  - Bill payment reminders
  - Weekly summary reports
  - Monthly detailed reports
  - Granular control with switches
  
- **Security** 🔒:
  - Password change functionality
  - Two-factor authentication setup
  - Account security overview
  
- **Appearance** 🎨:
  - Theme mode selection (Light/Dark/System)
  - Accent color picker with 6 preset colors
  - Visual customization options

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

### Public Routes
- `/` - Landing page
- `/login` - Login page (redirects to `/dashboard` on success)
- `/signup` - Sign up page

### User Dashboard Routes
- `/dashboard` - User dashboard overview
- `/expenses` - Expense management (CRUD operations)
- `/analytics` - Analytics and insights
- `/settings` - User settings and preferences

### Admin Routes
- `/dashboard/admin` - Admin dashboard

## 🎨 Theme & Design

The application features a modern, sci-fi inspired theme with:
- **Primary Color**: Purple/Blue gradient (#6366F1 - #3B82F6)
- **Accent Color**: Cyan/Teal tones
- **Dark Mode**: Fully supported with custom color variables
- **Animations**: Smooth transitions and gradient animations
- **Glass Morphism**: Backdrop blur effects on cards
- **Color-Coded Categories**: Each expense category has unique colors
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

## 💎 Advanced Features

### Expense Management
- **Smart Categorization**: 8 pre-defined categories with custom colors
- **Payment Method Tracking**: Support for multiple payment types
- **Notes & Descriptions**: Detailed transaction information
- **Bulk Operations**: Select and manage multiple expenses
- **Search Functionality**: Real-time search across all fields
- **Export Capabilities**: Download expense reports

### Analytics Engine
- **Multi-Period Analysis**: Compare different time frames
- **Trend Detection**: Automatic identification of spending patterns
- **Category Insights**: Deep dive into spending by category
- **Visual Charts**: Custom-built visualizations
- **Performance Metrics**: Key performance indicators
- **Predictive Insights**: Spending forecasts (coming soon)

### Credit Card Intelligence
- **Cycle Tracking**: Automatic billing cycle calculations
- **Payment Reminders**: Smart due date notifications
- **Utilization Monitoring**: Real-time credit usage tracking
- **Multi-Card Support**: Manage multiple credit cards
- **Warning System**: Color-coded alerts for high utilization
- **Next Cycle Preview**: See upcoming billing periods

### User Experience Enhancements
- **Unified Header**: Single header component across all pages
- **Context-Aware Navigation**: Smart navigation based on current page
- **Responsive Tables**: Beautiful data tables that work on all devices
- **Modal Dialogs**: Clean, accessible modal forms
- **Form Validation**: Real-time input validation
- **Loading States**: Smooth loading indicators (ready for API integration)

## 📝 Customization

### Colors
Edit color variables in `app/globals.css` to customize the theme:
- `--primary`: Main brand color
- `--accent`: Secondary accent color
- `--background`: Background color
- `--foreground`: Text color

### Components
All UI components are located in `components/ui/` and can be customized using Tailwind classes.

## 📊 Current State

### ✅ Fully Implemented
- Complete UI/UX for all pages
- Full CRUD operations for expenses
- Credit card management system
- Analytics with multiple views
- Comprehensive settings page
- Responsive design across all breakpoints
- Dark mode support
- Component library integration
- Form validation
- Search and filter functionality

### 🔄 Mock Data (Ready for API Integration)
- All pages currently use local state management
- Data structures are API-ready
- Easy to connect to backend services
- State management can be upgraded to global store

### 🎯 Business Logic Implemented
- Credit card utilization calculations
- Date calculations for billing cycles
- Expense categorization
- Statistics and aggregations
- Trend analysis
- Time range filtering

## 🔮 Future Enhancements

### Planned Features
- [ ] Backend API integration
- [ ] Real authentication with JWT
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] Advanced chart library integration (Recharts/Chart.js)
- [ ] AI-powered expense categorization
- [ ] Receipt scanning with OCR
- [ ] Recurring expense management
- [ ] Budget alerts and notifications
- [ ] Multi-currency support with live exchange rates
- [ ] Export reports (PDF, CSV, Excel)
- [ ] Email report scheduling
- [ ] Mobile app version (React Native)
- [ ] Collaborative budgeting (family/team)
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Tax calculation assistance
- [ ] Financial goal setting
- [ ] Savings recommendations

### Technical Improvements
- [ ] State management (Zustand/Redux)
- [ ] API caching and optimization
- [ ] Progressive Web App (PWA)
- [ ] Offline mode support
- [ ] Real-time data synchronization
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration (Google Analytics)
- [ ] A/B testing framework
- [ ] Automated testing (Jest, Playwright)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎓 Learning Resources

This project demonstrates:
- Next.js 16 App Router best practices
- TypeScript type safety
- Tailwind CSS v4 styling patterns
- shadcn/ui component composition
- React hooks and state management
- Form handling and validation
- Responsive design techniques
- Accessible UI development

## 📝 License

This project is created for demonstration and educational purposes.

---

**ExpenseWise** - Master Your Finances with AI-Powered Insights 🚀

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
