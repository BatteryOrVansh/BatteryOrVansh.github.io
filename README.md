# Vansh Dixit - Portfolio Website

Personal portfolio website showcasing my projects, skills, and professional journey as a Full Stack Developer.

## 🚀 Live Site
- **Custom Domain**: [Your Domain Here]
- **GitHub Pages**: https://batteryorvansh.github.io

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites
- Node.js 18+ (or Bun)
- npm, pnpm, or bun package manager
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository
git clone https://github.com/BatteryOrVansh/BatteryOrVansh.github.io.git
cd BatteryOrVansh.github.io

### 2. Install Dependencies
npm install

### 3. Run Development Server
npm run dev

### 4. Build for Production
npm run build

## 📁 Project Structure
Portfolio/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── About.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Stats.tsx   # GitHub & LeetCode activity
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── .github/workflows/  # GitHub Actions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts

## 🚢 Deployment

### Automatic Deployment
Push to main branch triggers automatic deployment via GitHub Actions.

git add .
git commit -m "Your commit message"
git push origin main

## 📝 Available Scripts

- npm run dev - Start dev server (port 8080)
- npm run build - Build for production
- npm run preview - Preview production build
- npm run lint - Run ESLint

## 🔄 Updating Your Portfolio

### Update GitHub/LeetCode Stats
Edit src/components/Stats.tsx and update usernames.

### Update Contact Info
Edit src/components/Contact.tsx and src/components/Footer.tsx

### Add New Projects
Edit src/components/Projects.tsx

## 🐛 Troubleshooting

### Dependencies Issues
rm -rf node_modules package-lock.json
npm install

### Build Errors
npx tsc --noEmit
npm run lint

## 📦 Important Files NOT in Git

- node_modules/ - Dependencies (reinstall with npm install)
- dist/ - Build output (regenerate with npm run build)
- .env - Environment variables (use .env.example as template)

## 🎯 Recovery Process

If you lose local files:

1. Clone repository
2. Run npm install
3. Run npm run dev

Everything will work!

## 📞 Contact
- **Email**: officialvanshdixit@gmail.com
- **GitHub**: https://github.com/BatteryOrVansh
- **LinkedIn**: https://www.linkedin.com/in/vanshdixit/
- **LeetCode**: https://leetcode.com/u/vanshdixit/

