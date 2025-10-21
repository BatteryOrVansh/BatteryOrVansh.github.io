# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features real-time activity tracking from GitHub and LeetCode, showcasing projects, skills, and professional achievements.

## Live Demo

**GitHub Pages:** https://batteryorvansh.github.io

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (shadcn/ui)
- **Routing:** React Router v6
- **State Management:** TanStack Query
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner

## Prerequisites

- Node.js 18 or higher
- npm, pnpm, or bun package manager
- Git

## Getting Started

Clone the repository:
```bash
git clone https://github.com/BatteryOrVansh/BatteryOrVansh.github.io.git
cd BatteryOrVansh.github.io
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:8080

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
Portfolio/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (other UI components)
│   │   ├── About.tsx
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Hackathons.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Stats.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server on port 8080
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Configuration

### Updating Activity Stats

Edit `src/components/Stats.tsx` to update GitHub and LeetCode usernames:

```typescript
const githubUsername = "your-github-username";
const leetcodeUsername = "your-leetcode-username";
```

### Updating Contact Information

Edit these files to update contact details:
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`

### Adding Projects

Edit `src/components/Projects.tsx` to add or modify project entries.

## Deployment

This repository uses GitHub Actions for automatic deployment to GitHub Pages. Every push to the main branch triggers a build and deployment.

## Troubleshooting

### Dependency Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Check TypeScript errors:
```bash
npx tsc --noEmit
```

Run linter:
```bash
npm run lint
```

## Contact

- Email: officialvanshdixit@gmail.com
- GitHub: https://github.com/BatteryOrVansh
- LinkedIn: https://www.linkedin.com/in/vanshdixit/
- LeetCode: https://leetcode.com/u/vanshdixit/

## Acknowledgments

- UI components based on shadcn/ui
- GitHub stats powered by github-readme-stats
- LeetCode stats powered by leetcode-stats-api
