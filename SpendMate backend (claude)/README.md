# Expense Tracker Backend MVP

## Tech Stack
- **Node.js + Express** – REST API
- **MongoDB + Mongoose** – Database
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Gemini 1.5 Flash** – Smart suggestions (with rule-based fallback)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET

# 3. Start dev server
npm run dev

# 4. Start production
npm start
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth  `/api/auth`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | Get current user |
| POST | `/onboarding` | ✅ | Mark onboarding complete |

**Register / Login body:**
```json
{ "name": "Aryan", "email": "aryan@example.com", "password": "secret123" }
```

**Response:**
```json
{
  "token": "eyJ...",
  "user": { "id": "...", "name": "Aryan", "email": "...", "onboardingCompleted": false }
}
```

---

### Expenses  `/api/expenses`

| Method | Route | Description |
|---|---|---|
| POST | `/` | Create expense |
| GET | `/` | List expenses (with filters) |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

**Create body:**
```json
{
  "amount": 150,
  "category": "Food",
  "date": "2024-01-15T20:00:00Z",
  "description": "Dinner at Zomato"
}
```

**GET query params:**
- `category` – filter by category
- `startDate` / `endDate` – date range
- `page` / `limit` – pagination

---

### Friends  `/api/friends`

| Method | Route | Description |
|---|---|---|
| POST | `/request` | Send friend request |
| GET | `/requests` | Incoming pending requests |
| POST | `/accept` | Accept a request |
| GET | `/` | List all friends |
| GET | `/search?q=name` | Search users |

**Send request:**
```json
{ "receiverId": "<userId>" }
```

**Accept request:**
```json
{ "requestId": "<requestId>" }
```

---

### Groups  `/api/groups`

| Method | Route | Description |
|---|---|---|
| POST | `/` | Create group |
| GET | `/` | My groups |
| GET | `/:id` | Group details + expenses + balances |
| POST | `/:id/addExpense` | Add expense to group |

**Create group:**
```json
{ "name": "Goa Trip", "members": ["userId1", "userId2"] }
```

**Add group expense:**
```json
{
  "amount": 1200,
  "description": "Hotel",
  "category": "Travel",
  "splitBetween": ["userId1", "userId2", "userId3"]
}
```

**Get group response includes:**
```json
{
  "group": { ... },
  "expenses": [ ... ],
  "balances": {
    "net": { "userId1": 400, "userId2": -200 },
    "settlements": [
      { "from": { "name": "Bob" }, "to": { "name": "Alice" }, "amount": 200 }
    ]
  }
}
```

---

### Insights  `/api/insights`

| Method | Route | Query Params | Description |
|---|---|---|---|
| GET | `/monthly` | `month`, `year` | Monthly breakdown |
| GET | `/yearly` | `year` | Yearly breakdown |

**Monthly response:**
```json
{
  "total": 12000,
  "topCategory": "Food",
  "categories": { "Food": 6000, "Travel": 3000 },
  "daily": { "2024-01-15": 500 },
  "expenseCount": 42,
  "avgPerDay": 387
}
```

---

### Smart  `/api/smart`

| Method | Route | Description |
|---|---|---|
| GET | `/suggest` | Get next expense suggestion |
| POST | `/categorize` | Auto-categorize by description |

**Suggest response:**
```json
{
  "amount": 150,
  "category": "Food",
  "confidence": 0.7,
  "reason": "You usually order food around this time on weekdays",
  "source": "gemini"
}
```

**Categorize body:**
```json
{ "description": "Swiggy order biryani", "amount": 200 }
```

**Categorize response:**
```json
{ "category": "Food", "confidence": 0.95 }
```

---

### Categories  `/api/categories`

| Method | Route | Description |
|---|---|---|
| GET | `/` | List all categories |

---

## Project Structure

```
src/
├── index.js              # Entry point
├── middleware/
│   └── auth.js           # JWT middleware
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── FriendRequest.js
│   ├── Friendship.js
│   ├── Group.js
│   └── GroupExpense.js
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   ├── friendController.js
│   ├── groupController.js
│   ├── insightController.js
│   ├── smartController.js
│   └── categoryController.js
└── routes/
    ├── auth.js
    ├── expenses.js
    ├── friends.js
    ├── groups.js
    ├── insights.js
    ├── smart.js
    └── categories.js
```

---

## Smart Suggestion Logic

1. **Gemini 1.5 Flash** is called first — it analyzes the last 30 expenses with time context and suggests what to log next.
2. If Gemini fails (quota, network, etc.), **rule-based fallback** kicks in automatically — it detects spending patterns by category and time-of-day.

---

## Connecting to Frontend

Replace your frontend API base URL with:
```
http://localhost:5000/api
```

Store the JWT token from login/register response and send it as:
```
Authorization: Bearer <token>
```
