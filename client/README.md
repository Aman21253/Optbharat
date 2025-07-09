# MakeInBharat Frontend

A modern React application for discovering, supporting, and listing Indian brands. This project is part of the MakeInBharat initiative, aiming to promote Indian manufacturing and local businesses.

## Project Overview
MakeInBharat is a platform where users can:
- Discover Indian brands across various categories
- Suggest new brands
- Add new brand listings (with authentication)
- Bookmark favorite brands
- Review and rate brands
- Access admin features (for authorized users)

## Features
- Responsive, modern UI built with React and Vite
- Authentication and OTP-based login/signup
- Brand listing, suggestion, and review system
- Admin dashboard for brand approvals
- Bookmarking and user profile features
- RESTful API integration with the backend

## Tech Stack
- **Frontend:** React, Vite, CSS Modules
- **Icons:** React Icons
- **Routing:** React Router DOM
- **State Management:** React Hooks, Context API (if used)
- **API:** Fetch/REST

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm

### Installation
1. Navigate to the `client` directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Development Server
Start the frontend development server:
```sh
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Available Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## Folder Structure
```
client/
  ├── public/           # Static assets
  ├── src/
  │   ├── components/   # Reusable React components
  │   ├── assets/       # Images and icons
  │   ├── App.jsx       # Main app component
  │   ├── main.jsx      # Entry point
  │   └── ...
  ├── package.json      # Project metadata and scripts
  └── ...
```

## Contribution Guidelines
- Fork the repository and create a new branch for your feature or bugfix.
- Follow consistent code style and naming conventions.
- Write clear commit messages.
- Test your changes before submitting a pull request.
- For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the ISC License.

---
For backend setup and API documentation, see the `server` directory.
