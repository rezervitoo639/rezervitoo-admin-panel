# RezerVitoo Admin Panel

Admin dashboard for the [RezerVitoo](https://rezervitoo.com) accommodation booking platform. Built with React, TypeScript, and Vite — deployed on Netlify at [admin.rezervitoo.com](https://admin.rezervitoo.com).

## Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| UI           | React 18 + TypeScript         |
| Build        | Vite (SWC)                    |
| Routing      | React Router DOM v6           |
| Server State | TanStack React Query v5       |
| HTTP         | Axios (with JWT interceptors) |
| Real-time    | WebSockets (`useWebSocket`)   |
| Styles       | CSS Modules + CSS Variables   |
| i18n         | i18next (AR / EN / FR)        |

## Quick Start

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

| Script            | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Local dev server (Vite HMR)      |
| `npm run build`   | Production build                 |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | ESLint                           |

## Environment Variables

See [`.env.example`](.env.example) for all required variables with descriptions.

## Documentation

- [Architecture & project structure](documentations/ARCHITECTURE.md)
