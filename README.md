# Site Support Chatbot

A modern chatbot interface for website support, built with React, TypeScript, and Tailwind CSS.

## Features

- Domain selection from a predefined list
- GPT model selection (GPT-4.1 Mini, GPT-4, GPT-3.5 Turbo)
- Real-time chat interface
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd site-support
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
  ├── components/     # React components
  ├── services/      # API services
  ├── types/         # TypeScript types
  ├── App.tsx        # Main App component
  └── main.tsx       # Entry point
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite
- OpenAI API
