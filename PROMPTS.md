# 📋 Assessora — Project Build Prompts

A complete log of all key prompts used to build the **Assessora** AI-powered assessment platform from scratch. Use these as a reference to rebuild or extend the project.

---

## 🏗️ 1. Project Foundation

### Initial Project Setup
```
Build a Next.js full-stack web application called "Assessora" — an AI-powered academic assessment tool. 
Use Next.js 14+ (App Router), MongoDB with Mongoose, NextAuth v5 for authentication, and Groq API for AI. 
The app should allow users to upload study material (PDF, TXT, Markdown, plain text), extract topics/units, 
configure a quiz (Bloom's Taxonomy levels, difficulty, number of questions), generate the quiz, take it 
with a timer, and view detailed results. Use Tailwind CSS (or Vanilla CSS) for styling.
```

### Database & Auth Setup
```
Set up MongoDB with Mongoose. Create models for:
- User (name, email, password)
- Assessment (title, subject, questions array, duration, status)
- Attempt (assessmentId, userId, answers, score, timeTaken, startedAt)

Set up NextAuth v5 with JWT strategy and Credentials provider (email + bcrypt password). 
Include register API route at /api/auth/register.
```

---

## 🎨 2. Landing Page & Public Pages

### Hero Section
```
Build a beautiful landing page hero section matching this design: two-column grid layout, 
left side has a badge "AI-Powered Academic Intelligence", a large heading 
"Turn Your Study Material into Smarter Assessments" with the last two words in green (#046B46), 
a short description paragraph, a "Create Your Assessment" CTA button (rounded, dark green), 
a "Watch Demo" button with a play icon, and file type badges (PDF, TXT, Markdown, Text). 
Right side has a hero illustration image. Match the spacing and font sizes from the reference image exactly.
```

### Features Page
```
Create a /features page with:
- A floating 3-column layout: left features, center product image, right features
- Feature cards with icons for: Smart Learning Paths, Bloom's Taxonomy, Adaptive Quizzes, 
  AI Insights, Expert Guidance, Progress Tracking
- A "Why Choose Assessora" section with 4 step cards (numbered 01-04)
- A video/quote section
- An adaptive learning green banner section
- A consistent footer with newsletter signup
```

### Pricing Page
```
Build a /pricing page with:
- Header: "Choose the plan that fits your learning goals"
- Monthly/Annual toggle switch
- Three pricing cards: Starter ($9/$7), Pro ($19/$15, highlighted in dark green), Enterprise (Custom)
- Each card has feature checklist items
- A CTA banner at the bottom
- Consistent navigation and footer
```

---

## 📁 3. File Upload & Analysis (Create Flow)

### Upload Page (Step 1)
```
Build the first step of the assessment creation flow at /dashboard/create. 
It should have a drag-and-drop file upload zone (supports PDF, TXT, MD files) 
and a text paste area. The upload box should be compact and well-proportioned. 
Show file type icons (PDF, TXT, Markdown, Text) below the upload zone. 
Use a clean two-column dashboard layout with proper spacing.
```

### Analyze Page (Step 2)
```
After file upload, show an analysis page at /dashboard/create/analyze. 
Call the Groq API to extract: title, subject, units (with name and description), 
and key concepts from the uploaded content. 
Display the results in a two-column layout: left shows "Extracted Units" as text chips/tags, 
right shows the "Topic Editor" for the assessment title. 
Show the unit descriptions as rich text below the tags. 
The AI should return a JSON with units array each containing name, topics[], and description.
```

### AI Analysis Prompt (lib/analyze.ts)
```
Write a Groq API call that sends the extracted document text and returns structured JSON:
{
  title: string,
  subject: string,
  units: [{ name: string, topics: string[], description: string }]
}
Use llama-3.3-70b-versatile model with json_object response format. 
The prompt should instruct the model to act as an academic content analyzer, 
identify all major units/chapters, list subtopics, and write a 2-3 sentence description 
for each unit explaining what it covers and why it matters.
```

---

## ⚙️ 4. Configure Page (Step 3)

### Configure UI
```
Build the quiz configuration page at /dashboard/create/configure. 
Show a two-column layout: left column shows the extracted units summary (read-only), 
right column has configuration controls:
- Number of questions slider (5-30)
- Difficulty selector (Easy / Mixed / Hard) as clickable button group
- Bloom's Taxonomy level checkboxes (Remember, Understand, Apply, Analyze, Evaluate, Create)
  with brand-consistent green shades instead of rainbow colors
- Duration selector (15/30/45/60 minutes)
- A "Generate Blueprint" CTA button
All inputs should be premium custom components, not default browser inputs.
```

---

## 📐 5. Blueprint Page (Step 4)

### Blueprint UI
```
Build the blueprint page at /dashboard/create/blueprint. 
It should show a processing state with animated steps (Preparing content → Building question plan → 
Validating blueprint → Ready). Once done, show the blueprint summary with:
- Assessment title (editable input)
- Summary metric cards: Total Questions, Duration, Difficulty, Topics Covered
- A list of planned questions grouped by Bloom's level
- A "Generate Assessment" button to call /api/assessment/generate
Use a clean two-column layout with a left content area and right sticky sidebar.
```

### Assessment Generation API
```
Create POST /api/assessment/generate. It should:
1. Read the blueprint + config from the request body
2. Call Groq API with a detailed prompt to generate MCQ questions
3. Each question must have: question, options (4), correctAnswer, explanation, topic, concept, bloomLevel, difficulty
4. Return valid JSON — enforce strict JSON output with max_tokens limits and clear formatting instructions
5. Save the generated Assessment to MongoDB with status "ready"
6. Return the assessment ID for redirect
Handle Groq json_validate_failed errors by retrying with simpler prompt constraints.
```

---

## 📝 6. Quiz/Assessment Page

### Quiz UI
```
Redesign the assessment taking page at /dashboard/assessment/[id]. 
Use a max-w-6xl two-column layout:
- Left column (main): Question card with bloom level + difficulty + topic badges, 
  large question text, 4 interactive multiple choice options (A/B/C/D labels, 
  green border + background when selected), Previous/Next navigation buttons
- Right column (sticky sidebar): Timer card (red + pulsing when < 60s), 
  Question Navigator grid (current = dark green, answered = light green with dot, unanswered = white), 
  Legend, Submit Assessment button
- Submit confirmation modal with answered/unanswered/time-remaining stats
All colors use the brand green palette (#0A3D2C, #Edf5f0, #c1e2d1).
```

---

## 📊 7. Results Page

### Results UI
```
Build the results page at /dashboard/assessment/[id]/results. 
Show:
- Score circle/gauge with percentage
- Pass/Fail status badge
- Stats row: correct answers, wrong answers, time taken, questions attempted
- Topic-wise performance breakdown (progress bars per topic)
- Bloom's Taxonomy level breakdown chart
- Individual question review: show each question, selected answer, correct answer, 
  explanation, and whether it was correct (green) or wrong (red)
- Download/Share buttons
```

---

## 🗂️ 8. Dashboard Pages

### Main Dashboard
```
Build the main dashboard at /dashboard. Show:
- Stats cards: Assessments Completed, Average Score, Total Study Time, Concepts Mastered
  (each with trend indicator vs last week)
- "Continue Learning" section with most recent incomplete assessment
- "Recent Assessments" table with title, score, date, bloom level badges
- "Areas Needing Attention" panel: topics with lowest scores
- "Recommended Practice" section
Use a clean sidebar layout with the Assessora logo, navigation links, and user avatar.
```

### My Assessments Page
```
Build /dashboard/assessment page showing all user assessments in a card grid. 
Each card shows: title, subject, question count, duration, score (if attempted), 
date created, status badge (Ready/Completed), and action buttons (Take Quiz / View Results).
```

### Settings Page
```
Build /dashboard/settings page showing:
- Full Name field (read-only, from session)
- Email Address field (read-only, from session)  
- Member Since info card
- Groq API Key info card (shows how to configure .env.local)
- Sign Out button (red, uses NextAuth signOut server action redirecting to /login)
```

---

## 🔐 9. Authentication Pages

### Login Page
```
Build a split-screen login page at /login:
- Left panel: Logo, "Welcome Back" heading, email + password form with show/hide toggle, 
  "Forgot password?" link, Login button
- Right panel: Dark green (#0A3D2C) rounded panel with floating avatar constellation graphic, 
  "Live 1-on-1 Practice" badge, motivational text
Use NextAuth signIn('credentials') on submit. Redirect to /dashboard on success.
```

### Register Page
```
Build a register page at /register matching the login layout. 
Add a Full Name field above email/password. 
On submit, POST to /api/auth/register, then auto sign-in with credentials. 
Show validation errors inline.
```

---

## 🧠 10. Knowledge Map & Practice Pages

### Knowledge Map
```
Build /dashboard/knowledge-map. 
Show a visual bubble/node map of all concepts the user has encountered, 
colored by mastery level (red = weak, yellow = moderate, green = strong). 
Below the map, show a sortable list of all concepts with: 
concept name, topic, attempts, accuracy percentage, and mastery badge.
```

### Practice Page
```
Build /dashboard/practice for targeted practice mode. 
Show weak concepts from the user's history with a "Practice This" button. 
Allow the user to select concepts and generate a focused mini-quiz on those topics.
```

---

## 🎨 11. UI & Design System

### Global Styles
```
Create a comprehensive design system in globals.css with:
- CSS variables for brand colors (--color-primary: #0A3D2C, --color-accent: #046B46, etc.)
- Utility classes: .card, .btn-primary, .btn-secondary, .input, .label, .divider, 
  .page-header, .page-title, .page-subtitle, .badge
- Custom animations: animate-fade-in, animate-slide-up, animate-pulse-slow
- Google Font: "Inter" with proper font-weight variants
- Scrollbar styling, selection color
```

### Dashboard Layout
```
Create a dashboard layout with:
- Left sidebar (fixed, 240px): Logo, nav links with icons (Overview, My Assessments, 
  Create Assessment, Knowledge Map, Practice, Progress, Settings), 
  collapsible on mobile, user avatar + name at bottom
- Top bar: Search input (centered), notification bell, user avatar
- Main content area: full height scroll, proper padding
The sidebar should highlight the active route link.
```

---

## 🔧 12. Key API Routes

### API Summary
```
Build the following API routes:

POST /api/auth/register — register new user with bcrypt password hashing
GET  /api/assessment — list all assessments for logged-in user  
GET  /api/assessment/[id] — get single assessment (without correct answers)
POST /api/assessment/generate — generate assessment using Groq AI
POST /api/assessment/submit — submit answers, calculate score, save Attempt
GET  /api/assessment/[id]/results?attempt=[id] — get attempt results with correct answers
GET  /api/dashboard/stats — return aggregated stats for dashboard
GET  /api/knowledge-map — return concept mastery data
GET  /api/settings — export user data as JSON
PUT  /api/settings — update name or change password
```

---

## 🚀 13. Deployment

### Vercel Deployment
```
Deploy this Next.js app to Vercel. Set these environment variables in the Vercel dashboard:
- NEXTAUTH_URL = https://your-production-url.vercel.app
- NEXTAUTH_SECRET = (a long random 32+ char string, different from local)
- MONGODB_URI = your MongoDB Atlas connection string
- GROQ_API_KEY = your Groq API key
- GROQ_ASSISTANT_API_KEY = your second Groq API key (if using)

In next.config.ts, add remotePatterns for any external image domains used (e.g. images.unsplash.com).
Add serverExternalPackages: ['pdf-parse'] to handle PDF parsing on the server.
```

---

## 💡 Tips for Rebuilding

- Always store step data (analysis results, config) in `sessionStorage` between create steps
- Use `json_object` response format with Groq and add strict JSON formatting instructions to avoid parse errors
- Bloom's Taxonomy levels: `remember | understand | apply | analyze | evaluate | create`
- Keep quiz page constrained to `max-w-6xl` for readable line lengths
- Use server actions for sign-out (`'use server'` + `signOut({ redirectTo: '/login' })`)
- The `password` field on the User model is `optional` — always null-check before `bcrypt.compare`
