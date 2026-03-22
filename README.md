# CipherForge - Frontend

React + Vite UI For CipherForge. Modern Dark Mode Design.

## How It Works

You Pick Your Password Length And Character Types, Hit Generate, And Get A Secure Password. You Can Copy It Or View Recent History.

## Setup

1. Install Dependencies:

```bash
npm install
```

2. Run The Dev Server:

```bash
npm run dev
```

App Starts At `http://localhost:5173`.

## Features

- Password Length Slider (6-128)
- Character Type Toggles (Uppercase, Lowercase, Numbers, Special)
- Copy To Clipboard
- Password Strength Indicator
- Recent Password History
- Keyboard Shortcut: `Ctrl + G` To Generate

## Project Structure

```
Frontend/
├── index.html                — Entry HTML
├── vite.config.js            — Vite Config With API Proxy
├── package.json              — Dependencies
├── src/
│   ├── Main.jsx              — React Entry Point
│   ├── App.jsx               — Main App Component
│   ├── App.css               — Stylesheet
│   ├── Data/
│   │   └── StaticData.json   — All Static Text
│   └── Routes/
│       └── Api.jsx           — API Calls
└── .gitignore
```
