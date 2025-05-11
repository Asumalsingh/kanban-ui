## Kanban board
Live url: [https://kanban-ui-six.vercel.app/](https://kanban-ui-six.vercel.app/)

React-based frontend for the Kanban board application with real-time updates and drag-and-drop functionality.

## Features

- Modern React with TypeScript
- Drag-and-drop task management
- JWT authentication
- Context-based state management
- Responsive design
- Tailwind CSS styling

## State Management
The application uses React Context for state management:
- AuthContext for user authentication
- BoardContext for board data and operations

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
