# Buyer Handoff Guide

This guide walks you through everything needed to take ownership of the LNL Fitness platform and get it running under your own accounts. **No technical experience required** — every step is point-and-click in a web browser.

If you get stuck on any step, message the seller (Solomon) for help.

---

## What you're getting

1. **A copy of the website code** — you'll download it from GitHub to your own GitHub account.
2. **The Firebase project** (database + login system) — being transferred to you directly. You don't have to recreate it.
3. **This guide** — to set everything up under your own accounts.

## What you need to do (high level)

To get the website live under your control, you'll need to:

1. Accept the Firebase project transfer (one email click).
2. Create accounts at: GitHub, Vercel, Stripe, OpenAI.
3. Copy the code into your GitHub.
4. Connect Vercel to your GitHub copy.
5. Paste a list of "environment variables" (settings) into Vercel.
6. Click Deploy.

Plan for 1–2 hours total, mostly waiting for things to load.

---

## Part 1: Take ownership of the Firebase project

The seller will give you Owner access to the Firebase project called **lnl-fitness**. The project (database + login system + all customer data) will become yours.

### Step-by-step

1. Send the seller the **Google account email** you want to use to own the project. (Use Gmail or a Google Workspace email — the same one you'll use for everything in this guide.)
2. The seller will add you as an **Owner** on the project.
3. You'll get an email from Google saying you've been added to a project. Click the link, sign in with the Google account you provided, and you'll land in the Firebase Console at https://console.firebase.google.com.
4. You should see **lnl-fitness** in your project list. Click it to confirm you have access.

### Billing transfer (important)

The Firebase project is currently linked to the seller's Google Cloud billing account. To fully separate from the seller, you need to attach the project to **your own** billing account:

1. Go to https://console.cloud.google.com/billing
2. Sign in with your Google account.
3. Click **Create account** → enter your billing details (credit card).
4. Once created, go to https://console.cloud.google.com/billing/projects
5. Find **lnl-fitness** in the list → click the **⋮ menu** → **Change billing**.
6. Select your new billing account → **Set account**.

After this, the seller can be safely removed from the project (see below).

### Remove the seller's access

Once you've taken ownership and transferred billing:

1. In Firebase Console → **lnl-fitness** → ⚙️ **Project settings** → **Users and permissions**.
2. Find the seller's account in the list → **Remove** (the trash icon).

✅ Done. The database, auth system, and billing are now 100% yours.

---

## Part 2: Create the accounts you need

You need accounts at four places. Use the same email for all of them so things stay tidy.

### 2a. GitHub
- Go to https://github.com → Sign up.
- This is where you'll keep the website's code.

### 2b. Vercel
- Go to https://vercel.com → Sign up **with GitHub** (click "Continue with GitHub").
- This is what hosts the live website.

### 2c. Stripe
- Go to https://stripe.com → Sign up.
- Complete the business verification (they'll ask for your name, address, bank info).
- This is what processes customer payments.

### 2d. OpenAI
- Go to https://platform.openai.com → Sign up.
- Add a payment method (Settings → Billing). The AI chatbot needs this.
- A typical month costs $5–$30 depending on traffic.

---

## Part 3: Copy the code to your GitHub

The seller will add you as a collaborator on the original repo. To make a copy you fully own:

1. Go to https://github.com/JulCCrum/coach-jay-fitness
2. Click the **Fork** button (top right).
3. On the next page, choose your username as the owner. Click **Create fork**.
4. You now have your own copy at `https://github.com/YOUR_USERNAME/coach-jay-fitness`.

✅ Done.

---

## Part 4: Connect Vercel to your GitHub copy

1. Go to https://vercel.com/new
2. Find your `coach-jay-fitness` repo and click **Import**.
3. On the configuration page:
   - **Project Name**: leave as default
   - **Framework Preset**: should auto-detect "Next.js"
   - **Environment Variables**: skip for now (we'll add them in Part 6)
4. Click **Deploy**. The first build will fail — that's expected. We need to add the environment variables next.

---

## Part 5: Collect all your keys

This is the longest part. You're going to gather 15 values from four different websites and paste them into Vercel.

Open a blank text document (Notes, Word, etc.) to paste values into as you collect them. **Do not share this document with anyone** — these are private credentials.

### 5a. Firebase keys (9 values)

#### Client keys (6 values)

1. Go to https://console.firebase.google.com → click **lnl-fitness**.
2. Click the ⚙️ gear icon (top left) → **Project settings**.
3. Scroll down to **"Your apps"** → click your Web app (it has a `</>` icon).
4. Under **"SDK setup and configuration"**, click the **"Config"** option.
5. You'll see a code block like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy....",
     authDomain: "lnl-fitness.firebaseapp.com",
     projectId: "lnl-fitness",
     storageBucket: "lnl-fitness.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123..."
   };
   ```
6. Copy each value (the part **inside the quotes**) into your notes:

| Save as | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | the `apiKey` value |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | the `authDomain` value |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | the `projectId` value |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | the `storageBucket` value |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | the `messagingSenderId` value |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | the `appId` value |

#### Admin keys (3 values)

1. In the same Project settings page, click the **Service accounts** tab.
2. Click **Generate new private key** → confirm with **Generate key**.
3. A `.json` file will download to your computer. **Open it in any text editor** (TextEdit, Notepad, etc.).
4. The file looks like this (lots of fields — you only need 3):
   ```json
   {
     "type": "service_account",
     "project_id": "lnl-fitness",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxx@lnl-fitness.iam.gserviceaccount.com",
     ...
   }
   ```
5. Copy these 3 values into your notes:

| Save as | Where to find it |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | the `project_id` value |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | the `client_email` value |
| `FIREBASE_ADMIN_PRIVATE_KEY` | the **entire** `private_key` value, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` and all the `\n` symbols. Copy everything between the quotation marks. |

⚠️ For `FIREBASE_ADMIN_PRIVATE_KEY`: keep the `\n` characters as-is. Don't try to "fix" them or replace them with real newlines. The website code knows how to handle them.

🗑️ **Delete the `.json` file from your Downloads folder when you're done** — it's a sensitive credential.

### 5b. OpenAI key (1 value)

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key** → name it something like "lnl-fitness".
3. Copy the key (starts with `sk-...`). **You can only see it once** — copy it now.
4. Save in your notes as `OPENAI_API_KEY`.

### 5c. Stripe keys (4 values)

1. Go to https://dashboard.stripe.com → make sure the toggle in the top-left says **"Live mode"** (not Test mode).
2. Click **Developers** (top right) → **API keys**.

| Save as | How to get it |
|---|---|
| `STRIPE_SECRET_KEY` | "Secret key" row → click **Reveal live key** → copy (starts with `sk_live_`) |
| `STRIPE_PUBLISHABLE_KEY` | "Publishable key" row → copy (starts with `pk_live_`) |

3. **Create a product and price:**
   - In the Stripe sidebar, click **Product catalog** → **Add product**.
   - Name: "Personalized Meal Plan" (or whatever you want to call it).
   - Pricing: enter your price (e.g., $47.00). One-time payment.
   - Click **Add product**.
   - On the product page, find the **Price ID** (starts with `price_`) and copy it.

| Save as | Value |
|---|---|
| `STRIPE_PRICE_ID` | the Price ID you just copied |

4. **Set up the webhook** (lets Stripe tell your site when a payment succeeds):
   - In Stripe, go to **Developers → Webhooks** → **Add endpoint**.
   - Endpoint URL: `https://YOUR-VERCEL-URL/api/webhooks/stripe` (you'll get the Vercel URL after Part 6 — for now, paste a placeholder and update it later).
   - Events to send: search for and select `checkout.session.completed`.
   - Click **Add endpoint**.
   - On the endpoint page, click **Reveal** under "Signing secret" → copy it (starts with `whsec_`).

| Save as | Value |
|---|---|
| `STRIPE_WEBHOOK_SECRET` | the signing secret you just copied |

### 5d. Site URL (1 value)

After Part 4, Vercel showed you a URL like `https://coach-jay-fitness-yourname.vercel.app`. If you don't remember it:

1. Go to https://vercel.com/dashboard → click your project.
2. Copy the **Production** URL from the Domains section.

| Save as | Value |
|---|---|
| `NEXT_PUBLIC_URL` | your Vercel URL with `https://` and **no trailing slash** |

---

## Part 6: Add the keys to Vercel

You should now have 15 values saved in your notes. Time to paste them into Vercel.

1. Go to https://vercel.com/dashboard → click your `coach-jay-fitness` project.
2. Click **Settings** (top tab) → **Environment Variables** (left sidebar).
3. For each value in your notes, do this:
   - **Key**: paste the variable name (e.g. `OPENAI_API_KEY`).
   - **Value**: paste the value.
   - **Environments**: leave all 3 boxes (Production, Preview, Development) checked.
   - For sensitive ones (anything that starts with `sk_`, `whsec_`, the Firebase admin keys, the OpenAI key), toggle **Sensitive** on.
   - Click **Save**.

The full list of 15 keys to add:

```
OPENAI_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_URL
```

⚠️ Spelling and capitalization must be **exact**. The code looks for these exact names.

---

## Part 7: Deploy

1. In Vercel, click **Deployments** (top tab).
2. Click the **...** menu on the most recent deployment → **Redeploy**.
3. Uncheck "Use existing Build Cache" → click **Redeploy**.
4. Wait 1–2 minutes. The status should turn green ("Ready").
5. Click the deployment URL — your site is live!

If the build fails:
- Click the failed deployment → scroll to the red error message.
- 99% of the time the cause is a typo in an env var name or a missing key.
- Send the error to the seller for help.

---

## Part 8 (optional): Add a custom domain

If you want the site at `yourdomain.com` instead of `coach-jay-fitness-xyz.vercel.app`:

1. Buy a domain from Namecheap, Google Domains, GoDaddy, etc.
2. In Vercel: project → Settings → **Domains** → **Add** → type your domain.
3. Vercel will give you DNS records to add at your registrar. Follow the on-screen instructions.
4. Once the domain is live, **update `NEXT_PUBLIC_URL`** in Vercel env vars to your new domain, and **update the Stripe webhook URL** to use the new domain.

---

## Day-to-day operations

- **View customers / orders**: visit `https://YOUR-DOMAIN/admin` → log in with the admin account the seller created for you.
- **Edit meal plan templates**: `/admin/templates`.
- **Add affiliates**: `/admin/affiliates`.
- **Check Stripe payments**: https://dashboard.stripe.com
- **Check Firebase data**: https://console.firebase.google.com → lnl-fitness → Firestore Database

## Costs to expect

| Service | Cost |
|---|---|
| Vercel | Free (Hobby plan handles low–moderate traffic) |
| Firebase | Free tier likely sufficient at start; pay-as-you-grow |
| OpenAI | ~$5–30/month depending on chat volume |
| Stripe | 2.9% + $0.30 per transaction (no monthly fee) |
| Domain | ~$12/year |

## If something breaks

1. Check Vercel **Deployments** → click the latest → look for red errors.
2. Check Stripe **Webhooks** → your endpoint → recent deliveries (red = failure).
3. Contact the seller.
