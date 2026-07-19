# 🛡️ CyberDefuse OS

**Live Demo:** [https://cyberdefuse-playground.vercel.app](https://cyberdefuse-playground.vercel.app)

An interactive, AI-powered cybersecurity simulator built to teach and test developers on identifying and patching critical system vulnerabilities. Complete with real-time attack animations, an AI mentor, and a fully functional code editor.

## ✨ Features

- **Interactive Attack Simulations**: Step-by-step visual animations of various attack vectors including S3 Bucket Exposure, SQL Injection, and Server-Side Request Forgery (SSRF).
- **AI-Powered Code Evaluation**: Integrated with the Gemini 1.5 AI model to read, analyze, and grade user-submitted code patches dynamically.
- **Built-in IDE**: A custom, responsive code editor supporting syntax highlighting for multiple languages (JSON, JavaScript).
- **Secure Authentication**: End-to-end authentication and session management powered by Clerk, ensuring only logged-in users can deploy patches.
- **Responsive Dashboard**: A sleek, dark-themed cyberpunk UI that fully scales to mobile devices for on-the-go learning.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Integration**: [Google Gemini (AI SDK)](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- **Editor**: [React Simple Code Editor](https://github.com/satya164/react-simple-code-editor) + [PrismJS](https://prismjs.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cyberdefuse-playground.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
