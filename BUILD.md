# Build Instructions

## Stack
- **Framework**: Next.js 14.2.16 (Stable)
- **UI Library**: React 18.3.1 (Stable - No RCs)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Deployment (Vercel)
This project is configured to use the stable Next.js 14 stack to avoid peer dependency conflicts with React 19 RC.

### Environment Variables
Ensure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (For Admin functions)
- `GEMINI_API_KEY`

### Commands
- **Install**: `npm install` (No `--legacy-peer-deps` needed)
- **Dev**: `npm run dev`
- **Build**: `npm run build`
