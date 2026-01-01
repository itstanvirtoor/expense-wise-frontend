# ExpenseWise API Specification

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [Dashboard APIs](#dashboard-apis)
4. [Expense APIs](#expense-apis)
5. [Analytics APIs](#analytics-apis)
6. [Settings APIs](#settings-apis)
7. [Credit Card APIs](#credit-card-apis)
8. [Common Response Structures](#common-response-structures)

---

## Authentication APIs

### 1. Sign Up / Create User
**Endpoint:** `POST /api/auth/signup`

**When Called:** When user submits the signup form on `/signup` page

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "user_123456",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "createdAt": "2026-01-01T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": "This email is already registered"
  }
}
```

---

### 2. Login / Authenticate User
**Endpoint:** `POST /api/auth/login`

**When Called:** When user submits the login form on `/login` page

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123456",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "profilePicture": "https://example.com/avatar.jpg",
      "settings": {
        "currency": "USD",
        "monthlyBudget": 3000,
        "notifications": {
          "email": true,
          "budgetAlerts": true,
          "billReminders": true
        }
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

**Action After Response:** 
- Store token in localStorage/sessionStorage
- Store user data in state management
- Redirect to `/dashboard` if role is "user"
- Redirect to `/dashboard/admin` if role is "admin"

---

### 3. Social Authentication (Google/GitHub)
**Endpoint:** `POST /api/auth/social`

**When Called:** When user clicks Google or GitHub login button

**Request Body:**
```json
{
  "provider": "google",
  "token": "google_auth_token_here"
}
```

**Expected Response:** Same as login response

---

### 4. Logout
**Endpoint:** `POST /api/auth/logout`

**When Called:** When user clicks logout button

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**When Called:** When access token expires (automatic)

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## User Management APIs

### 6. Get Current User Profile
**Endpoint:** `GET /api/user/profile`

**When Called:** On initial app load, when navigating to settings

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "profilePicture": "https://example.com/avatar.jpg",
    "settings": {
      "currency": "USD",
      "monthlyBudget": 3000,
      "theme": "dark",
      "notifications": {
        "emailNotifications": true,
        "budgetAlerts": true,
        "billReminders": true,
        "weeklyReport": false,
        "monthlyReport": true
      }
    },
    "createdAt": "2025-06-15T08:30:00Z",
    "lastLogin": "2026-01-01T10:00:00Z"
  }
}
```

---

### 7. Update User Profile
**Endpoint:** `PATCH /api/user/profile`

**When Called:** When user updates profile in settings

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "currency": "EUR",
  "monthlyBudget": 3500
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123456",
    "name": "John Updated Doe",
    "email": "john.doe@example.com",
    "settings": {
      "currency": "EUR",
      "monthlyBudget": 3500
    }
  }
}
```

---

### 8. Update Password
**Endpoint:** `POST /api/user/password`

**When Called:** When user changes password in settings

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 9. Update Notification Preferences
**Endpoint:** `PATCH /api/user/notifications`

**When Called:** When user toggles notification settings

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "emailNotifications": true,
  "budgetAlerts": true,
  "billReminders": true,
  "weeklyReport": false,
  "monthlyReport": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated",
  "data": {
    "notifications": {
      "emailNotifications": true,
      "budgetAlerts": true,
      "billReminders": true,
      "weeklyReport": false,
      "monthlyReport": true
    }
  }
}
```

---

## Dashboard APIs

### 10. Get User Dashboard Data
**Endpoint:** `GET /api/dashboard/user`

**When Called:** When user navigates to `/dashboard` page

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalBalance": 12450.00,
      "totalBalanceChange": 12.5,
      "totalBalanceChangeType": "increase",
      "thisMonthExpenses": 2350.00,
      "thisMonthChange": 8.2,
      "thisMonthChangeType": "increase",
      "averageDaily": 78.33,
      "budgetLeft": 1650.00,
      "budgetPercentage": 55
    },
    "recentExpenses": [
      {
        "id": "exp_001",
        "description": "Grocery Shopping",
        "amount": -125.50,
        "category": "Food & Dining",
        "date": "2026-01-01T14:30:00Z",
        "paymentMethod": "Credit Card"
      },
      {
        "id": "exp_002",
        "description": "Netflix Subscription",
        "amount": -15.99,
        "category": "Entertainment",
        "date": "2025-12-31T09:00:00Z",
        "paymentMethod": "Credit Card"
      }
    ],
    "categoryBreakdown": [
      {
        "category": "Food & Dining",
        "amount": 685.00,
        "percentage": 35,
        "color": "#6366F1"
      },
      {
        "category": "Transportation",
        "amount": 420.00,
        "percentage": 25,
        "color": "#3B82F6"
      },
      {
        "category": "Entertainment",
        "amount": 315.00,
        "percentage": 20,
        "color": "#8B5CF6"
      },
      {
        "category": "Utilities",
        "amount": 280.00,
        "percentage": 15,
        "color": "#EC4899"
      },
      {
        "category": "Others",
        "amount": 150.00,
        "percentage": 5,
        "color": "#10B981"
      }
    ],
    "monthlyTrends": [
      {
        "month": "2025-07",
        "expenses": 2100.00,
        "income": 3500.00
      },
      {
        "month": "2025-08",
        "expenses": 2350.00,
        "income": 3500.00
      },
      {
        "month": "2025-09",
        "expenses": 1950.00,
        "income": 3500.00
      },
      {
        "month": "2025-10",
        "expenses": 2280.00,
        "income": 3800.00
      },
      {
        "month": "2025-11",
        "expenses": 2450.00,
        "income": 3800.00
      },
      {
        "month": "2025-12",
        "expenses": 2650.00,
        "income": 4000.00
      }
    ]
  }
}
```

---

### 11. Get Admin Dashboard Data
**Endpoint:** `GET /api/dashboard/admin`

**When Called:** When admin navigates to `/dashboard/admin` page

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 2847,
      "totalUsersChange": 18.2,
      "activeUsers": 1892,
      "activeUsersPercentage": 66.5,
      "totalTransactions": 45231,
      "systemHealth": 99.9
    },
    "recentUsers": [
      {
        "id": "user_789",
        "name": "Sarah Johnson",
        "email": "sarah.j@example.com",
        "plan": "Premium",
        "registeredAt": "2026-01-01T08:00:00Z"
      }
    ],
    "planDistribution": [
      {
        "plan": "Premium",
        "count": 1245,
        "percentage": 44
      },
      {
        "plan": "Basic",
        "count": 892,
        "percentage": 31
      },
      {
        "plan": "Free",
        "count": 710,
        "percentage": 25
      }
    ],
    "systemActivity": [
      {
        "type": "success",
        "message": "Database backup completed successfully",
        "timestamp": "2026-01-01T09:55:00Z"
      },
      {
        "type": "info",
        "message": "New feature deployed: AI expense categorization",
        "timestamp": "2026-01-01T08:00:00Z"
      }
    ]
  }
}
```

---

## Expense APIs

### 12. Get All Expenses
**Endpoint:** `GET /api/expenses`

**When Called:** When user navigates to `/expenses` page

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?page=1&limit=50&category=Food&search=grocery&sortBy=date&sortOrder=desc
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "exp_001",
        "date": "2026-01-01",
        "description": "Grocery Shopping",
        "category": "Food & Dining",
        "amount": 125.50,
        "paymentMethod": "Credit Card",
        "notes": "Weekly groceries",
        "createdAt": "2026-01-01T14:30:00Z",
        "updatedAt": "2026-01-01T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 127,
      "totalPages": 3
    },
    "summary": {
      "totalExpenses": 2350.00,
      "count": 127,
      "thisMonth": 2350.00,
      "averageDaily": 78.33
    }
  }
}
```

---

### 13. Create Expense
**Endpoint:** `POST /api/expenses`

**When Called:** When user submits "Add Expense" form

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "date": "2026-01-01",
  "description": "Grocery Shopping",
  "category": "Food & Dining",
  "amount": 125.50,
  "paymentMethod": "Credit Card",
  "notes": "Weekly groceries"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "exp_001",
    "date": "2026-01-01",
    "description": "Grocery Shopping",
    "category": "Food & Dining",
    "amount": 125.50,
    "paymentMethod": "Credit Card",
    "notes": "Weekly groceries",
    "createdAt": "2026-01-01T14:30:00Z",
    "updatedAt": "2026-01-01T14:30:00Z"
  }
}
```

---

### 14. Update Expense
**Endpoint:** `PATCH /api/expenses/:id`

**When Called:** When user edits an expense

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "description": "Updated Grocery Shopping",
  "amount": 130.00,
  "notes": "Updated weekly groceries"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": "exp_001",
    "description": "Updated Grocery Shopping",
    "amount": 130.00,
    "notes": "Updated weekly groceries",
    "updatedAt": "2026-01-01T15:00:00Z"
  }
}
```

---

### 15. Delete Expense
**Endpoint:** `DELETE /api/expenses/:id`

**When Called:** When user deletes an expense

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

### 16. Bulk Delete Expenses
**Endpoint:** `POST /api/expenses/bulk-delete`

**When Called:** When user selects multiple expenses to delete

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "expenseIds": ["exp_001", "exp_002", "exp_003"]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "3 expenses deleted successfully",
  "data": {
    "deletedCount": 3
  }
}
```

---

### 17. Export Expenses
**Endpoint:** `GET /api/expenses/export`

**When Called:** When user clicks "Export" button

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?format=csv&startDate=2025-01-01&endDate=2025-12-31&category=all
```

**Expected Response:**
```
Content-Type: text/csv or application/pdf
Content-Disposition: attachment; filename="expenses_2025.csv"

(File download)
```

---

## Analytics APIs

### 18. Get Analytics Overview
**Endpoint:** `GET /api/analytics/overview`

**When Called:** When user navigates to `/analytics` page

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?timeRange=30days&startDate=2025-12-01&endDate=2026-01-01
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "insights": {
      "highestSpendingDay": "Friday",
      "highestSpendingDayChange": 25,
      "averageTransaction": 45.20,
      "averageTransactionChange": -5,
      "mostUsedPayment": "Credit Card",
      "mostUsedPaymentPercentage": 68,
      "budgetUtilization": 78,
      "budgetUtilizationChange": 12
    },
    "categoryBreakdown": [
      {
        "category": "Food & Dining",
        "amount": 685.00,
        "percentage": 35,
        "trend": "up",
        "trendValue": 12.5,
        "color": "#6366F1"
      }
    ],
    "topExpenses": [
      {
        "id": "exp_001",
        "description": "Grocery Shopping",
        "amount": 125.50,
        "date": "2026-01-01",
        "category": "Food & Dining"
      }
    ],
    "monthlyTrends": [
      {
        "month": "2025-07",
        "expenses": 2100.00,
        "income": 3500.00
      }
    ]
  }
}
```

---

### 19. Get Category Analytics
**Endpoint:** `GET /api/analytics/categories`

**When Called:** When user switches to "By Category" tab in analytics

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?timeRange=30days
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Food & Dining",
        "totalAmount": 685.00,
        "transactionCount": 23,
        "averageTransaction": 29.78,
        "percentage": 35,
        "trend": "up",
        "trendValue": 12.5,
        "topMerchants": [
          {
            "name": "Whole Foods",
            "amount": 245.00,
            "count": 5
          }
        ],
        "dayBreakdown": {
          "Monday": 85.00,
          "Tuesday": 120.00,
          "Wednesday": 95.00,
          "Thursday": 110.00,
          "Friday": 145.00,
          "Saturday": 75.00,
          "Sunday": 55.00
        }
      }
    ]
  }
}
```

---

### 20. Get Trend Analysis
**Endpoint:** `GET /api/analytics/trends`

**When Called:** When user switches to "Trends" tab

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?timeRange=6months&granularity=daily
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "daily": [
      {
        "date": "2025-12-01",
        "expenses": 78.50,
        "income": 116.67
      }
    ],
    "predictions": {
      "nextMonth": {
        "predictedExpenses": 2450.00,
        "confidence": 85.5
      }
    },
    "patterns": [
      {
        "type": "recurring",
        "description": "Netflix Subscription",
        "amount": 15.99,
        "frequency": "monthly",
        "nextDate": "2026-02-01"
      }
    ]
  }
}
```

---

### 21. Get Comparison Analytics
**Endpoint:** `GET /api/analytics/compare`

**When Called:** When user selects periods to compare

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?period1=thismonth&period2=lastmonth
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period1": {
      "label": "This Month",
      "startDate": "2026-01-01",
      "endDate": "2026-01-31",
      "totalExpenses": 2350.00,
      "categoryBreakdown": [...],
      "transactionCount": 45
    },
    "period2": {
      "label": "Last Month",
      "startDate": "2025-12-01",
      "endDate": "2025-12-31",
      "totalExpenses": 2170.00,
      "categoryBreakdown": [...],
      "transactionCount": 42
    },
    "comparison": {
      "expenseDifference": 180.00,
      "expensePercentageChange": 8.3,
      "transactionDifference": 3,
      "categoriesIncreased": ["Food & Dining", "Entertainment"],
      "categoriesDecreased": ["Transportation", "Utilities"]
    }
  }
}
```

---

## Settings APIs

### 22. Get User Settings
**Endpoint:** `GET /api/settings`

**When Called:** When user navigates to `/settings` page

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "currency": "USD",
      "monthlyBudget": 3000
    },
    "notifications": {
      "emailNotifications": true,
      "budgetAlerts": true,
      "billReminders": true,
      "weeklyReport": false,
      "monthlyReport": true
    },
    "security": {
      "twoFactorEnabled": false,
      "lastPasswordChange": "2025-06-15T10:00:00Z"
    },
    "appearance": {
      "theme": "dark",
      "accentColor": "#6366F1"
    }
  }
}
```

---

## Credit Card APIs

### 23. Get All Credit Cards
**Endpoint:** `GET /api/credit-cards`

**When Called:** When user navigates to Settings > Cards tab

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card_001",
        "name": "Chase Sapphire",
        "lastFourDigits": "4532",
        "issuer": "Visa",
        "billingCycle": 1,
        "dueDate": 25,
        "creditLimit": 10000.00,
        "currentBalance": 2350.00,
        "utilization": 23.5,
        "nextBillingDate": "2026-02-01",
        "nextDueDate": "2026-02-25",
        "daysUntilDue": 55,
        "createdAt": "2025-06-15T10:00:00Z",
        "updatedAt": "2026-01-01T10:00:00Z"
      },
      {
        "id": "card_002",
        "name": "Amex Gold",
        "lastFourDigits": "1008",
        "issuer": "American Express",
        "billingCycle": 15,
        "dueDate": 10,
        "creditLimit": 15000.00,
        "currentBalance": 4200.00,
        "utilization": 28.0,
        "nextBillingDate": "2026-01-15",
        "nextDueDate": "2026-02-10",
        "daysUntilDue": 40,
        "createdAt": "2025-07-20T12:00:00Z",
        "updatedAt": "2026-01-01T10:00:00Z"
      }
    ],
    "summary": {
      "totalCards": 2,
      "totalCreditLimit": 25000.00,
      "totalBalance": 6550.00,
      "averageUtilization": 26.2,
      "upcomingPayments": [
        {
          "cardId": "card_002",
          "cardName": "Amex Gold",
          "dueDate": "2026-01-10",
          "amount": 4200.00,
          "daysUntilDue": 9
        }
      ]
    }
  }
}
```

---

### 24. Create Credit Card
**Endpoint:** `POST /api/credit-cards`

**When Called:** When user adds a new credit card

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Chase Sapphire",
  "lastFourDigits": "4532",
  "issuer": "Visa",
  "billingCycle": 1,
  "dueDate": 25,
  "creditLimit": 10000.00,
  "currentBalance": 2350.00
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Credit card added successfully",
  "data": {
    "id": "card_001",
    "name": "Chase Sapphire",
    "lastFourDigits": "4532",
    "issuer": "Visa",
    "billingCycle": 1,
    "dueDate": 25,
    "creditLimit": 10000.00,
    "currentBalance": 2350.00,
    "utilization": 23.5,
    "nextBillingDate": "2026-02-01",
    "nextDueDate": "2026-02-25",
    "createdAt": "2026-01-01T10:00:00Z"
  }
}
```

---

### 25. Update Credit Card
**Endpoint:** `PATCH /api/credit-cards/:id`

**When Called:** When user edits a credit card

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Chase Sapphire Preferred",
  "creditLimit": 12000.00,
  "currentBalance": 2500.00
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Credit card updated successfully",
  "data": {
    "id": "card_001",
    "name": "Chase Sapphire Preferred",
    "creditLimit": 12000.00,
    "currentBalance": 2500.00,
    "utilization": 20.83,
    "updatedAt": "2026-01-01T11:00:00Z"
  }
}
```

---

### 26. Delete Credit Card
**Endpoint:** `DELETE /api/credit-cards/:id`

**When Called:** When user deletes a credit card

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Credit card deleted successfully"
}
```

---

### 27. Get Credit Card Payment History
**Endpoint:** `GET /api/credit-cards/:id/payments`

**When Called:** When viewing detailed card information

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cardId": "card_001",
    "payments": [
      {
        "id": "payment_001",
        "amount": 2150.00,
        "date": "2025-12-25",
        "status": "completed",
        "billingPeriod": "2025-12"
      }
    ]
  }
}
```

---

### 28. Link Expense to Credit Card
**Endpoint:** `POST /api/credit-cards/:id/link-expense`

**When Called:** When creating/editing expense with credit card payment method

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "expenseId": "exp_001",
  "amount": 125.50
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense linked to credit card",
  "data": {
    "cardId": "card_001",
    "expenseId": "exp_001",
    "newBalance": 2475.50,
    "newUtilization": 24.76
  }
}
```

---

## Common Response Structures

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": "Field-specific error message"
  },
  "code": "ERROR_CODE"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Additional APIs

### 29. Get Categories
**Endpoint:** `GET /api/categories`

**When Called:** When loading expense form, analytics filters

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "Food & Dining",
        "color": "#6366F1",
        "icon": "utensils"
      },
      {
        "id": "cat_002",
        "name": "Transportation",
        "color": "#3B82F6",
        "icon": "car"
      }
    ]
  }
}
```

---

### 30. Get Payment Methods
**Endpoint:** `GET /api/payment-methods`

**When Called:** When loading expense form

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking"
    ]
  }
}
```

---

### 31. Upload Receipt
**Endpoint:** `POST /api/expenses/upload-receipt`

**When Called:** Future feature - receipt scanning

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [receipt image]
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "receiptUrl": "https://storage.example.com/receipts/receipt_001.jpg",
    "extractedData": {
      "amount": 125.50,
      "merchant": "Whole Foods",
      "date": "2026-01-01",
      "suggestedCategory": "Food & Dining"
    }
  }
}
```

---

## API Implementation Priority

### Phase 1 (Essential - Must Have)
1. ✅ Authentication (Signup, Login, Logout)
2. ✅ User Profile (Get, Update)
3. ✅ Expenses (CRUD operations)
4. ✅ Dashboard Data (User)
5. ✅ Credit Cards (CRUD)

### Phase 2 (Important)
6. ✅ Analytics Overview
7. ✅ Settings (Notifications, Password)
8. ✅ Category Analytics
9. ✅ Export Expenses

### Phase 3 (Enhanced Features)
10. ✅ Admin Dashboard
11. ✅ Trend Analysis
12. ✅ Comparison Analytics
13. ✅ Credit Card Payment History
14. ✅ Bulk Operations

### Phase 4 (Future Enhancements)
15. Receipt Upload & OCR
16. Recurring Expense Detection
17. Budget Recommendations
18. AI Categorization

---

## Authentication Flow

1. **Initial Load:**
   - Check for token in localStorage
   - If token exists, call `GET /api/user/profile` to validate
   - If valid, redirect based on role
   - If invalid, clear token and show login

2. **After Login:**
   - Store token and user data
   - Redirect to appropriate dashboard
   - Start fetching dashboard data

3. **Token Refresh:**
   - Implement automatic token refresh
   - Refresh token 5 minutes before expiry
   - Use refresh token endpoint

4. **Protected Routes:**
   - All API calls must include `Authorization: Bearer {token}`
   - Handle 401 responses by redirecting to login

---

## Error Codes Reference

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Unauthorized access
- `USER_001`: User not found
- `USER_002`: Email already exists
- `EXP_001`: Expense not found
- `EXP_002`: Invalid expense data
- `CARD_001`: Credit card not found
- `CARD_002`: Invalid card data
- `SYSTEM_001`: Internal server error
- `SYSTEM_002`: Database connection error

---

## Rate Limiting

- Standard endpoints: 100 requests per minute
- Analytics endpoints: 50 requests per minute
- Export endpoints: 10 requests per minute
- Upload endpoints: 20 requests per minute

---

## Notes for Backend Implementation

1. **Security:**
   - Implement JWT token authentication
   - Hash passwords using bcrypt
   - Validate all input data
   - Implement CORS properly
   - Use HTTPS in production

2. **Database:**
   - User data should be isolated per user
   - Implement proper indexes for performance
   - Use transactions for financial operations
   - Regular backups

3. **Performance:**
   - Implement caching for frequently accessed data
   - Use pagination for large datasets
   - Optimize database queries
   - Consider CDN for static assets

4. **Monitoring:**
   - Log all API requests
   - Monitor error rates
   - Track API performance
   - Set up alerts for issues

---

This API specification provides a complete blueprint for backend development. All endpoints are designed to support the current frontend implementation and future enhancements.
