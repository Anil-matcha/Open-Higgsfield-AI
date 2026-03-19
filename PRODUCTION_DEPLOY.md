# Production Deployment Guide

## Overview

This application is a frontend SPA (Single Page Application) built with Vite, Tailwind CSS, and vanilla JavaScript. It interfaces with the muapi.ai API for AI image/video generation and uses Supabase for backend services.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend services)
- muapi.ai API key (for users)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous (public) key |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `VITE_ENABLE_ERROR_TRACKING` | Enable error reporting | `false` |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | - |

## Build for Production

```bash
npm install
npm run build
```

The build output will be in the `dist/` directory.

## Production Server Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback - all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP header (adjust for your needs)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.muapi.ai;" always;
}
```

### CORS Configuration

Update the CORS settings in `supabase/functions/*/index.ts` to use your production domain:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-production-domain.com",
  // ...
};
```

## Supabase Edge Functions

Deploy edge functions to Supabase:

```bash
supabase functions deploy muapi-proxy
supabase functions deploy process-upload
supabase functions deploy create-share
supabase functions deploy muapi-webhook
```

Set required secrets:

```bash
supabase secrets set MUAPI_API_KEY=your-muapi-api-key
supabase secrets set MUAPI_WEBHOOK_SECRET=your-webhook-secret
```

## Security Checklist

- [ ] Update CORS domains in all edge functions
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Set up proper authentication (currently uses API keys in localStorage)
- [ ] Configure rate limiting (in-memory implemented, Redis recommended for scale)
- [ ] Set up monitoring/alerting
- [ ] Enable HTTPS
- [ ] Review and restrict Content Security Policy

## Performance Optimizations

The application includes:

- Code splitting via Vite chunks
- Gzip/Brotli compression (server-side)
- Long-term caching with content hashes
- Lazy loading of route components
- Service worker for offline caching

For higher traffic:

1. Deploy to a CDN (Cloudflare, Vercel, Netlify)
2. Use Redis for rate limiting
3. Set up Redis for session storage
4. Enable Supabase connection pooling

## Monitoring

### Recommended Services

- **Error Tracking**: Sentry (sentry.io)
- **Analytics**: Plausible, Fathom, or self-hosted Umami
- **Uptime**: UptimeRobot, Pingdom
- **Logging**: Datadog, LogRocket

### Key Metrics to Monitor

- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- JavaScript Error Rate
- API Response Times
- Rate Limit Utilization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured on edge functions
2. **401 Unauthorized**: Check Supabase anonymous key and RLS policies
3. **Build Failures**: Ensure Node.js 18+ is installed
4. **White Screen on Load**: Check browser console for errors

### Debug Mode

Enable verbose logging in development:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

## Support

For issues or questions, please open an issue on the repository.
