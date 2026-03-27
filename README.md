# Rollout 🚀

> An AI-powered code generation platform. Describe what you want to build and watch it come to life — with a live in-browser preview, iterative chat refinement, and persistent project history.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/NextAuth-5-1a1a1a?style=for-the-badge&logo=next-auth&logoColor=white" alt="NextAuth">
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 🚀 Overview

Rollout is a modern AI-powered app builder that turns natural language prompts into fully functional React applications. Describe an idea — a to-do app, a budget tracker, a dashboard — and Rollout generates the code, renders a live preview in the browser, and lets you iterate through conversation. Projects are saved automatically so you can always pick up where you left off.

---

## ✅ Key Features

### ⚡ Prompt-to-Code Generation
- **Natural Language Input**: Describe your app in plain English and get working React code instantly
- **AI Code Engine**: Powered by Google Gemini 2.5 Flash or a locally-running Ollama model
- **Iterative Refinement**: Continue the conversation to modify, extend, or fix the generated app
- **Context-Aware Updates**: Subsequent prompts receive the current file tree and recent chat history so changes are incremental — only what needs to change is regenerated
- **Structured Output Parsing**: The AI returns a typed JSON file manifest; the server parses and validates it before sending to the client

### 🖥️ Live In-Browser Code Editor & Preview
- **Sandpack Integration**: Full CodeSandbox-powered in-browser bundler via `@codesandbox/sandpack-react`
- **Three-Panel Layout**: File explorer, Monaco-style code editor, and live rendered preview — all in the same view
- **Instant Hot Reload**: Changes reflect in the preview without leaving the page
- **Pre-loaded Dependencies**: Sandpack environment ships with `lucide-react`, `react-router-dom`, `firebase`, `@google/generative-ai`, `chart.js`, `react-chartjs-2`, and more
- **Tailwind CSS via CDN**: Tailwind is available in the preview out of the box

### 🤖 Dual AI Provider Support
- **Google Gemini 2.5 Flash**: Default cloud model via `@google/generative-ai` — optimised for both chat responses and code generation (up to 8 000 output tokens)
- **Ollama (Local)**: Run any compatible local model (default: `qwen2.5-coder:7b`) for fully offline, private code generation
- **Per-Session Model Switching**: Pick a model on the landing page; preference is persisted to `localStorage` and respected across the chat
- **Separate Prompt Strategies**: Chat and code-generation use distinct system prompts and generation configs tuned for their respective tasks

### 🔐 Google OAuth Authentication
- **NextAuth v5**: Latest beta with App Router support
- **Google Provider**: One-click sign-in with Google accounts
- **JWT Strategy**: Stateless session management — 30-day token lifetime
- **Auto User Provisioning**: New OAuth users are created in the database automatically on first sign-in
- **Custom Session Shape**: Sessions expose `id`, `messagecount`, and `uuid` for downstream use
- **Protected Routes**: Unauthenticated users are shown a sign-in dialog before any generation starts

### 💬 Chat Interface with Markdown Rendering
- **Split-Pane Layout**: Chat occupies the left quarter of the screen; the code editor and preview fill the right three-quarters
- **react-markdown**: Full GitHub Flavored Markdown rendered in AI responses
- **Streaming-aware UX**: Loading spinners and disabled inputs while the AI is responding
- **Message History**: Full conversation shown in a scrollable feed with role-differentiated styling
- **Sidebar Toggle**: Collapsible sidebar lists all past chats for quick navigation

### 🗂️ Persistent Project History
- **PostgreSQL Database**: Powered by Drizzle ORM with fully type-safe queries
- **Two-Table Schema**:
  - `users`: Authentication profiles with message quotas and UUIDs
  - `chats`: Conversations storing message arrays and generated file manifests as JSONB
- **Automatic Timestamps**: `created_at` and `updated_at` on all entities
- **Files Persisted as JSONB**: The entire generated file tree is stored alongside the chat so refreshing the page restores the exact state
- **User-Scoped Queries**: Each user only sees and loads their own chats
- **Database Migrations**: Version-controlled schema managed with Drizzle Kit

### 🎛️ Additional Features
- **Message Quota System**: Each user starts with 10 free messages; the count decrements per AI call and is visible on the Pricing page
- **Pricing Page**: Displays remaining message balance with a clear token-top-up UI
- **Dark / Light Theme**: `next-themes` with system preference detection; defaults to dark
- **Responsive Design**: Mobile-first layout with a collapsible sidebar via Radix UI Sheet primitives
- **Geist Font**: Vercel's Geist Sans and Geist Mono loaded via `next/font/google`
- **Suggestion Prompts**: Landing page ships with starter ideas (To-Do App, Budget Tracker, Quiz App, etc.) to lower the barrier to entry

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: End-to-end type safety
- **Tailwind CSS 4**: Utility-first styling
- **Sandpack**: In-browser code bundler and live preview
- **react-markdown**: Markdown rendering for chat messages
- **next-themes**: Dark/light mode management
- **Lucide React**: Icon library
- **Axios**: HTTP client for API calls

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth v5**: Authentication framework with Google OAuth
- **Drizzle ORM**: Type-safe PostgreSQL toolkit
- **PostgreSQL**: Relational database for users and chats

### AI Providers
- **@google/generative-ai**: Google Gemini 2.5 Flash (cloud)
- **Ollama**: Self-hosted local model inference (default: `qwen2.5-coder:7b`)

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Railway, Neon, Render)
- A Google Cloud project with OAuth credentials
- A Google AI Studio API key
- *(Optional)* Ollama running locally for local model support

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rollout.git
cd rollout
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment variables**

Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables) below).

4. **PostgreSQL Setup**

   Use any PostgreSQL provider (local, Railway, Neon, Render, etc.):

   - **Local**: Install PostgreSQL and create a database:
     ```sql
     CREATE DATABASE rollout;
     ```
   - **Hosted**: Create a project on [Neon](https://neon.tech), [Railway](https://railway.app), or [Render](https://render.com) and copy the connection string.

   Then run the Drizzle migrations to set up the schema:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Run development server**
```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env.local` file in your project root:

```env
# ─── Database ───────────────────────────────────────────────────────────────
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/rollout

# ─── NextAuth ───────────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
AUTH_SECRET=your-random-secret-key

# ─── Google OAuth ───────────────────────────────────────────────────────────
# https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ─── Google AI ──────────────────────────────────────────────────────────────
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key

# ─── Ollama (optional) ──────────────────────────────────────────────────────
# Defaults to http://localhost:11434 and qwen2.5-coder:7b if not set
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
```

### Environment Variables Checklist
- ✅ `DATABASE_URL` — PostgreSQL connection string
- ✅ `AUTH_SECRET` — Random secret for NextAuth (min 32 chars)
- ✅ `GOOGLE_CLIENT_ID` — Google OAuth client ID
- ✅ `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- ✅ `GEMINI_API_KEY` — Google AI API key
- ⬜ `OLLAMA_BASE_URL` — Ollama server URL *(optional, defaults to localhost:11434)*
- ⬜ `OLLAMA_MODEL` — Ollama model name *(optional, defaults to qwen2.5-coder:7b)*

## 🚀 Deployment

### Running Locally

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/rollout.git
   cd rollout
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with all required variables (see [Environment Variables](#-environment-variables)).

3. **Set up PostgreSQL**
   - Install PostgreSQL locally, then:
     ```sql
     CREATE DATABASE rollout;
     ```
   - Set `DATABASE_URL=postgresql://user:password@localhost:5432/rollout` in `.env.local`

4. **Run migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

6. **Or build and run in production mode**
   ```bash
   pnpm build
   pnpm start
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Useful Database Commands
```bash
pnpm db:generate   # Generate migration files from schema changes
pnpm db:migrate    # Apply pending migrations
pnpm db:push       # Push schema directly (dev only)
pnpm db:studio     # Open Drizzle Studio GUI
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
