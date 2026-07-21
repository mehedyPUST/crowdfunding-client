# CrowdFund - Crowdfunding Platform

A full-stack crowdfunding platform where creators can launch campaigns and supporters can contribute credits to bring ideas to life.

## Live Site
🔗 [https://crowdfunding-client-phy.vercel.app](https://crowdfunding-client-phy.vercel.app)

## Admin Credentials
- **Email:** admin@crowdfund.com
- **Password:** admin123

## Features
- 🎨 Modern UI with Emerald & Purple gradient theme, fully responsive for mobile, tablet, and desktop
- 🔐 Secure authentication with email/password and Google Sign-In, JWT-based role authorization (Supporter, Creator, Admin)
- 🏠 Engaging homepage with animated hero slider, top funded campaigns, testimonials, platform stats, and category explorer
- 📊 Role-based dashboards with real-time stats (Creator: campaigns/raised, Supporter: contributions, Admin: platform overview)
- 🚀 Campaign creation with image upload (imgBB), story editor, funding goals, deadlines, and reward info
- 💰 Credit-based contribution system — supporters contribute credits to campaigns, creators review and approve
- 💳 Stripe payment integration for purchasing credit packages (100/$10, 300/$25, 800/$60, 1500/$110)
- 🔍 Public explore page with search and category filtering, campaign details view
- ✅ Admin panel for campaign approvals, user management, role changes, withdrawal processing
- 📤 Creator withdrawal system (20 credits = $1, min 200 credits) with multiple payment methods
- 🔔 Real-time notification system for contributions, approvals, rejections, and withdrawals
- 📄 Paginated contribution history with status tracking (pending/approved/rejected)
- 📱 Fully responsive dashboard with collapsible mobile sidebar
- 🌐 Deployed on Vercel (frontend + backend serverless)

## Tech Stack
- **Frontend:** Next.js 16, Tailwind CSS, Swiper.js, React Hook Form, Zod, React Hot Toast, Stripe.js
- **Backend:** Node.js, Express, MongoDB (native driver), JWT, bcryptjs
- **Auth:** JWT + Google OAuth 2.0
- **Payments:** Stripe
- **Image Upload:** imgBB API
- **Deployment:** Vercel (frontend + backend)

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas connection string
- Stripe account (test mode)
- imgBB API key
- Google Cloud OAuth client ID

### Client Setup
```bash
git clone https://github.com/mehedyPUST/crowdfunding-client.git
cd crowdfunding-client
npm install