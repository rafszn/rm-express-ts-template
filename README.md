# RM Studio Express TS template

This template provides a minimal setup to get a Modular Monolith Express ts project working by RM Studios.

This template has the following set up:

- Express + TypeScript (ESM-ready)
- Environment variables via dotenv
- Request logging (winston) + optional custom logger
- MongoDB (Mongoose) optional connection helper
- CORS + JSON/body parsing
- Centralized error handling
- Routes structure (versioned /api/v1)
- Dev workflow with hot reload
- Multer file upload
- Custom headers
- RateLimit Creation Method
- Request Guard
- Mail Sending - Provider-agnostic (Resend)
- Caching - Provider-agnostic (Memory/Redis)
- File Storage - Provider-agnostic (Cloudflare/Cloudinary)
- Authenticate Middleware - Extensible
- Custom Error Class - Extensible
- Helper Script for Module Creation
- Do remember to add .env.development to the .gitignore file after cloning.

After `npm i`,
run `npm run make:module 'module_name'` to create a Module

instance: 
`npm run make:module Post`