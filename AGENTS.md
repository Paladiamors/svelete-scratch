# AGENTS.md

This document serves as the primary developer documentation and guide for AI coding agents working on this project.

## Project Overview

This is a note-taking application built with **SvelteKit** and **TypeScript**. It allows users to register, log in, manage sessions, create notes, add tags to notes, and view their notes.

## Technology Stack

- **Framework**: SvelteKit (Svelte 5)
- **Language**: TypeScript
- **Database**: SQLite (`better-sqlite3`)
- **Authentication**: Custom session-based authentication using `bcryptjs` for password hashing and `uuid` for session/user IDs.
- **Testing**: Vitest (`vitest`)
- **Styling**: Standard CSS (within Svelte components)
- **Formatting & Linting**: ESLint and Prettier

## Project Structure

- `src/`
  - `lib/server/`: Contains backend logic, database initialization, and authentication.
    - `db.ts`: Database connection and schema definitions.
    - `auth.ts`: Authentication logic (sessions, login, etc.).
    - `notes.ts`: Logic for handling notes and tags.
  - `routes/`: SvelteKit routes.
    - `/`: Home page displaying the user's notes.
    - `/login/`: User login page.
    - `/register/`: User registration page.
    - `/logout/`: Endpoint for logging out.
    - `/notes/new/`: Page to create a new note.
    - `/notes/[id]/`: Page to view/edit a specific note.
  - `hooks.server.ts`: SvelteKit server hooks, primarily used for verifying the `session_id` cookie and populating `event.locals.user`.

## Database Schema

The SQLite database is initialized in `src/lib/server/db.ts` with the following tables:

- **`users`**: `id` (TEXT PRIMARY KEY), `username` (TEXT UNIQUE), `password_hash` (TEXT)
- **`sessions`**: `id` (TEXT PRIMARY KEY), `user_id` (TEXT FOREIGN KEY), `expires_at` (INTEGER)
- **`notes`**: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `user_id` (TEXT FOREIGN KEY), `title` (TEXT), `content` (TEXT), `created_at` (INTEGER)
- **`tags`**: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `name` (TEXT UNIQUE)
- **`note_tags`**: `note_id` (INTEGER), `tag_id` (INTEGER), mapping table between notes and tags.

## Important Instructions for AI Agents

1. **Keep this document up-to-date**: As you work on this project and make architectural changes, add new features, or alter the database schema, **you must update this `AGENTS.md` file** to reflect those changes.
2. **Proactive Updates**: If you notice that there is some information missing from this document while working on other tasks, you should proactively update this document to help future agents.
3. **Local Setup & Testing**: Use `npm run dev` to start the development server. For running checks and linting, use `npm run check` and `npm run lint`.
4. **SvelteKit Conventions**: Follow standard SvelteKit conventions. Server-only code should be kept in `.server.ts` files or under `src/lib/server/`. Client-side stores and generic logic should be placed appropriately in `src/lib/`.

Remember: The accuracy of this document is critical for your own success and the success of other AI coding agents working on this project.
