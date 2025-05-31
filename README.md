---

# 🧵 Reddish – A Reddit-like Platform

---

## ⚙️ Features

### 👤 Users

* Browse all posts
* Search posts & communities
* Create, edit, and delete posts
* Vote & comment on posts
* Upload images
* View user profiles
* **Join & leave communities**
* **Toggle light/dark theme**

### 🌐 Communities

* Create & manage subreddits
* Community-specific feeds
* Report posts & comments

### 🧑‍🎨 UI & UX

* Fully responsive & mobile-friendly
* Clean, accessible UI using Tailwind CSS & Radix UI
* **Built-in theme switcher (dark/light mode)**

---

## 🚀 Tech Stack

* **Next.js 15** – App Router + Server Actions
* **Sanity CMS** – Headless content management
* **Clerk** – Authentication & user profiles
* **Tailwind CSS + Radix UI** – For styling and accessibility
* **Turbopack** – Blazing fast development experience
* **Vercel** - Deployment 
---

## 💻 Built With

* 🧩 Next.js 15
* 🧾 Sanity CMS
* 🔐 Clerk Authentication
* 🎨 Tailwind CSS + Radix UI
* 🌙 Theme Support
* ⚡ Turbopack

---

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/reddit-ai-clone
cd reddit-ai-clone

# 2. Install dependencies
pnpm install

# 3. Run the dev server
pnpm dev
```

---

## 🧪 Setup

Create a `.env.local` file in the root and fill in your credentials:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key
```

---

## 📚 What I Learned

Building this Reddit clone taught me:

* **Modern Next.js (15) with App Router** and server-side logic using **Server Actions**
* Integrating **Sanity CMS** to manage dynamic, rich content
* Handling **user authentication and profiles** with **Clerk**
* Creating a fully responsive, accessible UI using **Tailwind CSS and Radix UI**
* Using **theme switching logic** to support light and dark mode
* Structuring scalable project architecture for full-stack applications
* Implementing **community logic**, such as join/leave mechanics and personalized feeds
* Managing application state efficiently and securely
* Leveraging **OpenAI API** for potential AI-powered features (like content suggestions or moderation tools)

---
##  Url 
[Visit my Project](https://reddish-one.vercel.app/)

