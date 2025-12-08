# Pragatishil Next.js Project

The official production web app for pragatishil.org.np.

## Getting Started

1.  **Environment Setup**:
    Copy `.env.example` to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Fill in the values in `.env.local`:
    ```env
    # Public keys for client-side functionality
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    
    # Private keys for server-side functionality (NEVER shared with client)
    GEMINI_API_KEY=your_gemini_api_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

**Root Directory**: `pragatishil-nextjs`

**Environment Variables Required on Vercel**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Ensure you connect your Vercel project to the GitHub repository and set the Root Directory to `pragatishil-nextjs` in the project settings.

## Branding

See [branding.md](branding.md) for color tokens, fonts, and component usage guidelines.

This project integrates Google Gemini on the server-side to keep API keys secure.

### 1. Voter ID Analysis
**Endpoint**: `POST /api/ai/vision/voter-id`
**Content-Type**: `multipart/form-data`

**Request**:
- `image`: (File) The image of the Voter ID or Citizenship card.

**Response (JSON)**:
```json
{
  "full_name": "...",
  "date_of_birth": "...",
  "citizenship_number": "...",
  "voter_id_number": "...",
  "address_full": "...",
  "province": "...",
  "district": "...",
  "municipality": "...",
  "ward": "...",
  "raw_text": "..."
}
```

**Test with cURL**:
```bash
curl -X POST http://localhost:3000/api/ai/vision/voter-id \
  -F "image=@/path/to/your/image.jpg"
```

### 2. Chat
**Endpoint**: `POST /api/ai/chat`
**Content-Type**: `application/json`

**Request**:
```json
{
  "messages": [
    { "role": "user", "text": "Hello" }
  ],
  "locale": "en" 
}
```
* `locale`: Optional, defaults to "en". Use "ne" for Nepali.

**Response (JSON)**:
```json
{
  "reply": "Hello! How can I help you today?"
}
```

**Test with cURL**:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{ "messages": [{ "role": "user", "text": "Namaste" }], "locale": "ne" }'
```

### 3. Membership Backend
**Endpoint**: `POST /api/membership`
**Content-Type**: `application/json`

Before using this endpoint, you **MUST** create the following tables in Supabase. 
Please refer to `src/types.ts` for the exact column definitions and comments.
- `members`
- `departments`
- `member_departments`
- `member_documents`

**Request Payload**:
Full typed structure defined in `src/types.ts` (MembershipRequestPayload).
Minimal Example:
```json
{
  "personal": {
    "capacity": "party_member",
    "fullNameNe": "राम बहादुर",
    "dobOriginal": "2050-01-01",
    "dobCalendar": "BS"
  },
  "contact": {
    "phone": "9800000000",
    "email": "test@example.com"
  },
  "party": {
    "motivationTextNe": "सेवा गर्न चाहन्छु",
    "departmentIds": [],
    "confidentiality": "public_ok"
  },
  "documents": {
    "idDocument": {
       "docType": "citizenship",
       "imageUrl": "path/to/image"
    }
  }
}
```

**Response**:
```json
{ "id": "uuid-of-new-member" }
```
