# LNL Fitness - AI-Powered Meal Plan Platform

A complete fitness coaching platform with AI chatbot consultation, Stripe payments, affiliate tracking, and autonomous meal plan generation.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            LNL FITNESS PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Next.js    │     │   Firebase   │     │    Stripe    │                │
│  │   Frontend   │────▶│   Firestore  │     │   Payments   │                │
│  │   + API      │     │   + Auth     │     │              │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                    │                    │                         │
│         │                    │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │                      OpenAI API                           │              │
│  │            (GPT-4o-mini for chat, GPT-4o for plans)      │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## User Journey State Machine

```
                                    ┌─────────────────┐
                                    │                 │
                                    │  LANDING PAGE   │
                                    │                 │
                                    └────────┬────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                          ▼                  ▼                  ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │  Direct     │    │  Affiliate  │    │  Organic    │
                   │  Visit      │    │  /ref/CODE  │    │  Search     │
                   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
                          │                  │                  │
                          │           ┌──────┴──────┐           │
                          │           │ Set Cookie  │           │
                          │           │ (30 days)   │           │
                          │           └──────┬──────┘           │
                          │                  │                  │
                          └──────────────────┼──────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │   AI CHATBOT    │◀──────────────┐
                                    │   CONSULTATION  │               │
                                    │                 │               │
                                    └────────┬────────┘               │
                                             │                        │
                              ┌──────────────┴──────────────┐         │
                              │                             │         │
                              ▼                             ▼         │
                    ┌─────────────────┐           ┌─────────────────┐ │
                    │  Collects:      │           │  Session saved  │ │
                    │  - Name         │           │  to Firestore   │ │
                    │  - Goals        │           │  with extracted │ │
                    │  - Diet prefs   │           │  data           │ │
                    │  - Lifestyle    │           └─────────────────┘ │
                    └────────┬────────┘                               │
                             │                                        │
                             ▼                                        │
                    ┌─────────────────┐                               │
                    │                 │         ┌─────────────────┐   │
                    │  CHECKOUT PAGE  │────────▶│   Cancel/Back   │───┘
                    │  /checkout      │         └─────────────────┘
                    │                 │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │                 │
                    │ STRIPE CHECKOUT │
                    │ (Hosted)        │
                    │                 │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │                 │           │                 │
    │ PAYMENT SUCCESS │           │ PAYMENT FAILED  │
    │                 │           │                 │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             │                             └──────────▶ Back to Checkout
             ▼
    ┌─────────────────┐
    │  WEBHOOK FIRES  │
    │                 │
    │  - Create Order │
    │  - Track Aff.   │
    │  - Queue Plan   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │                 │
    │  AI GENERATES   │
    │  MEAL PLAN      │
    │  (GPT-4o)       │
    │                 │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │                 │
    │  SUCCESS PAGE   │
    │  Shows 7-day    │
    │  meal plan      │
    │                 │
    └─────────────────┘
```

## Firestore Data Model

```
firestore/
├── customers/
│   └── {customerId}
│       ├── name: string
│       ├── email: string
│       ├── phone: string?
│       ├── affiliateCode: string?
│       ├── chatSessionToken: string?
│       ├── hasPurchased: boolean
│       ├── createdAt: timestamp
│       └── purchasedAt: timestamp?
│
├── chatSessions/
│   └── {sessionToken}
│       ├── sessionToken: string
│       ├── customerId: string?
│       ├── messages: array
│       │   └── { role: string, content: string }
│       ├── extractedData: object
│       │   ├── name: string?
│       │   ├── primaryGoal: string?
│       │   ├── dietaryPreferences: string[]
│       │   ├── allergies: string[]
│       │   └── ...
│       ├── affiliateCode: string?
│       └── createdAt: timestamp
│
├── orders/
│   └── {orderId}
│       ├── customerId: string
│       ├── stripeSessionId: string
│       ├── stripePaymentIntentId: string
│       ├── amount: number (cents)
│       ├── status: "paid" | "refunded"
│       ├── affiliateCode: string?
│       ├── mealPlanId: string?
│       └── paidAt: timestamp
│
├── mealPlanTemplates/
│   └── {templateId}
│       ├── name: string
│       ├── customerType: string
│       ├── description: string
│       ├── calorieRange: { min, max }
│       ├── macroSplit: { protein, carbs, fat }
│       ├── mealsPerDay: number
│       ├── guidelines: string
│       ├── sampleMeals: string
│       └── isActive: boolean
│
├── mealPlans/
│   └── {planId}
│       ├── customerId: string
│       ├── orderId: string
│       ├── status: "generating" | "ready" | "failed"
│       ├── planContent: object (7-day plan JSON)
│       └── createdAt: timestamp
│
├── affiliates/
│   └── {affiliateId}
│       ├── name: string
│       ├── email: string
│       ├── code: string (unique)
│       ├── commissionRate: number (0.1 = 10%)
│       ├── status: "active" | "inactive"
│       ├── totalClicks: number
│       ├── totalConversions: number
│       ├── totalRevenue: number
│       └── pendingCommission: number
│
└── affiliateCommissions/
    └── {commissionId}
        ├── affiliateId: string
        ├── orderId: string
        ├── commissionAmount: number
        └── status: "pending" | "paid"
```

## API Routes

```
/api
├── /chat
│   ├── GET  - Restore existing session
│   └── POST - Send message, get AI response
│
├── /checkout
│   └── POST - Create Stripe checkout session
│
├── /webhooks
│   └── /stripe
│       └── POST - Handle Stripe events
│
├── /meal-plan
│   ├── /generate
│   │   └── POST - Generate meal plan (internal)
│   └── /status
│       └── GET  - Check meal plan status
│
├── /affiliate
│   └── /track
│       └── POST - Track affiliate click
│
└── /admin
    ├── /templates
    │   ├── GET  - List templates
    │   ├── POST - Create template
    │   └── /[id]
    │       ├── GET    - Get template
    │       ├── PUT    - Update template
    │       └── DELETE - Delete template
    │
    ├── /customers
    │   ├── GET - List customers
    │   └── /[id]
    │       └── GET - Get customer details
    │
    └── /affiliates
        ├── GET  - List affiliates
        └── POST - Create affiliate
```

## Project Structure

```
coach-jay-fitness/
├── app/
│   ├── (public)/
│   │   ├── checkout/
│   │   │   ├── page.tsx          # Checkout form
│   │   │   └── success/
│   │   │       └── page.tsx      # Success + meal plan display
│   │   └── ref/
│   │       └── [code]/
│   │           └── page.tsx      # Affiliate redirect
│   │
│   ├── admin/
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/page.tsx        # Admin login
│   │   ├── templates/            # Meal plan templates CRUD
│   │   ├── customers/            # Customer management
│   │   └── affiliates/           # Affiliate management
│   │
│   ├── api/                      # API routes (see above)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main landing page
│
├── components/
│   ├── ChatWidget.tsx
│   └── admin/
│       └── TemplateForm.tsx
│
├── lib/
│   ├── firebase.ts               # Client SDK
│   ├── firebase-admin.ts         # Admin SDK
│   └── stripe.ts                 # Stripe client
│
├── scripts/
│   └── create-admin.ts           # Create admin user
│
├── public/
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── package.json
```

---

## Setup & Transfer Guide

### Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Stripe account
- OpenAI API key

### Step 1: Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/lnl-fitness.git
cd lnl-fitness
npm install
```

### Step 2: Firebase Setup (Transfer to New Project)

1. **Create new Firebase project:**
   ```bash
   firebase login
   firebase projects:create your-project-name
   ```

2. **Enable Firestore:**
   ```bash
   firebase firestore:databases:create "(default)" --project your-project-name --location nam5
   ```

3. **Create web app and get config:**
   ```bash
   firebase apps:create web "Your App Name" --project your-project-name
   firebase apps:sdkconfig WEB YOUR_APP_ID
   ```

4. **Create service account:**
   ```bash
   gcloud iam service-accounts create firebase-adminsdk --project=your-project-name
   gcloud iam service-accounts keys create key.json --iam-account=firebase-adminsdk@your-project-name.iam.gserviceaccount.com
   ```

5. **Update `.firebaserc`** with your project name

6. **Deploy Firestore rules:**
   ```bash
   firebase deploy --only firestore
   ```

### Step 3: Enable Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Authentication > Sign-in method > Enable "Email/Password"
3. Run: `npm run create-admin`

### Step 4: Configure Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Developers > API keys
3. Create a product and copy the Price ID
4. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`

### Step 5: Environment Variables

Create `.env.local` with all keys (see `.env.local.example`)

### Step 6: Deploy to Vercel

```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

---

## Local Development

```bash
npm run dev
# App: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## Testing the Flow

1. Create a template at `/admin/templates/new`
2. Create an affiliate at `/admin/affiliates/new`
3. Visit `/ref/YOUR_CODE` to test affiliate tracking
4. Chat with the bot on homepage
5. Go to `/checkout` and use test card `4242 4242 4242 4242`
6. View generated meal plan on success page

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Payments**: Stripe Checkout
- **AI**: OpenAI GPT-4o / GPT-4o-mini
- **Icons**: Lucide React
- **Deployment**: Vercel
