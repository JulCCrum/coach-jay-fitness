# Coach Jay Fitness Website

AI-powered onboarding chatbot for Coach Jay's fitness coaching business.

## Quick Start

```bash
# Install dependencies
npm install

# Add your OpenAI API key
cp .env.local.example .env.local
# Edit .env.local and add your key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add `OPENAI_API_KEY` in Environment Variables
4. Deploy

## Customization

- **Photos**: Add Jay's photos to `/public` folder and update image references in `app/page.tsx`
- **Colors**: Edit `tailwind.config.js` to change brand colors
- **Chatbot personality**: Edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts`
- **Booking link**: Replace Calendly placeholder link in `app/page.tsx`

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- OpenAI GPT-4o-mini
- Vercel (hosting)
