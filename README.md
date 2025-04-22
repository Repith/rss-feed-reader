# RSS Reader

A modern RSS reader application built with Next.js, React, and MongoDB.

## Features

- **Feed Management**: Add, organize, and manage your RSS feeds
- **Article Reading**: Clean reading experience for your subscribed content
- **Favorites**: Save articles to read later
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- MongoDB (local or remote)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/rss-reader.git
cd rss-reader
```

2. Install dependencies
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Using Docker

The project includes Docker configuration for MongoDB:

```bash
docker-compose up -d
```

## Development

### Project Structure

- `app/`: Next.js App Router pages and API routes
- `src/components/`: Reusable React components
- `src/domain/`: Domain models and repository interfaces
- `src/application/`: Application services
- `src/infrastructure/`: Repository implementations
- `src/lib/`: Utility functions and shared code

### Available Scripts

- `npm run dev`: Start the development server with Turbopack
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

