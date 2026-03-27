# Leanoza Plus Landing Page

A premium landing page for Leanoza Plus weight loss capsules with an integrated Admin Dashboard and Cloud synchronization.

## Features

- **Premium UI**: Modern, responsive design with glassmorphism and Tailwind CSS.
- **Admin Dashboard**: Real-time analytics, order management, and CMS content control.
- **Cloud Sync**: Uses Vercel KV (Redis) to sync site configurations and order statuses.
- **Lost Order Recovery**: Tracks abandoned checkouts in real-time.
- **Meta Pixel & CAPI**: Integrated Facebook Pixel and Conversions API for professional tracking.
- **WhatsApp Integration**: Redirects orders directly to WhatsApp with pre-filled messages.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Vercel KV (Upstash Redis)

## Setup and Deployment

### 1. Prerequisites
- A [Vercel](https://vercel.com) account.
- A Vercel KV database attached to your project.

### 2. Environment Variables
Create a `.env` file or set the following in Vercel:
```env
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
```

### 3. Deployment
Simply push to GitHub and connect your repository to Vercel. Vercel will automatically detect the `api` directory and deploy the serverless functions.

## Admin Access
- **URL**: `/login.html`
- **Default Credentials**:
  - **Email**: `example@gmail.com`
  - **Password**: `admin123`

> [!IMPORTANT]
> Change the default credentials in `login.html` before production deployment.

## License
MIT
