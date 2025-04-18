# OutfloAI Backend

This is the backend service for the OutfloAI campaign management system.

## Features

- Campaign CRUD operations
- LinkedIn personalized message generation using OpenAI
- MongoDB database integration
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

3. Start the development server:

```bash
npm run dev
```

4. Build and start production server:

```bash
npm run build
npm start
```

## API Endpoints

### Campaigns

- `GET /api/campaigns` - Get all active campaigns
- `GET /api/campaigns/:id` - Get a specific campaign
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Soft delete a campaign

### Message Generation

- `POST /api/personalized-message` - Generate a personalized LinkedIn message

## Development

The project uses TypeScript and follows a modular structure:

- `src/models` - Database models
- `src/controllers` - Request handlers
- `src/routes` - API routes
#   c a m p a i g n - b a c k e n d  
 