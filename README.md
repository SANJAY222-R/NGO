# Food Bridge (NGO & Donor Platform)

Food Bridge is a comprehensive web application designed to connect surplus food donors (such as restaurants, event organizers, or individuals) with Non-Governmental Organizations (NGOs). By facilitating seamless communication and logistics, the platform aims to reduce food waste and efficiently redistribute meals to those in need.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) / React 19
- **Database**: PostgreSQL (Managed via [Sequelize](https://sequelize.org/) ORM)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Styling**: Tailwind CSS v4
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & Radix UI
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form, Zod

## 📖 Project Summary

The core objective of this application is to streamline the food donation process. The platform provides dedicated dashboards for different user roles (Donors, NGOs, and Admins) to ensure a smooth workflow from posting surplus food to its successful delivery and claim.

### Key Entities

1. **Users**: Segregated into three primary roles:
   - **Donors**: Can post surplus food details, including quantity, type, expiry time, and location.
   - **NGOs**: Can browse available food listings in their vicinity and place claims to pick them up.
   - **Admins**: Manage platform integrity, verify NGO credentials, and monitor overall activities.
2. **Food Posts**: Listings created by donors containing details about the available food. They track statuses like `AVAILABLE`, `RESERVED`, `PICKED_UP`, or `EXPIRED`.
3. **Claims**: Requests made by NGOs to secure a particular food post. A claim goes through a lifecycle of `PENDING`, `ACCEPTED`, and `COMPLETED`.

## ⚙️ How It Works (Application Flow)

### 1. Registration & Onboarding
- **Donors** and **NGOs** register on the platform.
- NGOs may undergo a verification process (tracking `verificationStatus`) to ensure authenticity before they can claim food.

### 2. Posting Food (Donor Workflow)
- A verified Donor logs in and accesses the Donor Dashboard.
- They create a new **Food Post** by providing necessary details:
  - Title & Description
  - Food Type & Quantity
  - Expiry Date & Time
  - Location Details (Latitude/Longitude and Address)
- The system marks this post as `AVAILABLE`.

### 3. Claiming Food (NGO Workflow)
- A verified NGO logs into the NGO Dashboard.
- They browse active, `AVAILABLE` food posts.
- The NGO initiates a **Claim** for a specific food post. The claim is initially marked as `PENDING`, and the food post is marked as `RESERVED` to prevent double-booking.

### 4. Fulfillment
- The Donor is notified of the pending claim and can **ACCEPT** it.
- The NGO coordinates with the Donor, picks up the food, and updates the claim status to `COMPLETED`.
- The corresponding food post is marked as `PICKED_UP`.

## 🛠️ Local Development Setup

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd NGO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/ngo_db
   AUTH_SECRET=your_nextauth_secret_key
   # Add other required environment variables (e.g., Maps API keys if applicable)
   ```

4. **Database Synchronization:**
   The project uses Sequelize. In development (`NODE_ENV !== 'production'`), models are automatically synchronized when the server starts.

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Folder Structure

- `src/app/`: Next.js App Router pages (Dashboards, Sign in, Sign up).
- `src/models/`: Sequelize Database Models (`User`, `FoodPost`, `Claim`) and database enums.
- `src/components/`: Reusable UI components (including shadcn/ui components).
- `src/lib/`: Utility functions and database connection setup (`sequelize.ts`).
- `src/actions/`: Next.js Server Actions for secure backend operations.
- `src/types/`: TypeScript interfaces and type definitions.

---
*Built to make a difference and reduce food waste.*
